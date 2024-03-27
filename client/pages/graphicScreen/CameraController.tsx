import { useRef, useState, useEffect, ReactNode } from 'react';
import { PanResponder, View, StyleSheet, Dimensions } from 'react-native';
import { Camera, Canvas, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';

const ORBIT_RADIUS_MIN = 2;
const ORBIT_RADIUS_MAX = 20;

function CameraControl({ position, shapeCenter, centerCameraAroundShape, updateCameraRef, updateCameraPosition }: 
	{ 
		position: Vector3, 
		shapeCenter: Vector3,
		centerCameraAroundShape: boolean,
        updateCameraRef: (camera: Camera) => void,
        updateCameraPosition: (cameraPosition: Vector3, cameraRotation: Vector3) => void
	}) {
	const { camera } = useThree();
    
    updateCameraRef(camera);

	useEffect(() => {
		camera.position.set(
			position.x + (centerCameraAroundShape ? shapeCenter.x : 0),
			position.y + (centerCameraAroundShape ? shapeCenter.y : 0),
			position.z + (centerCameraAroundShape ? shapeCenter.z : 0)
		);
		if (centerCameraAroundShape) camera.lookAt(shapeCenter.x, shapeCenter.y, shapeCenter.z);
		else camera.lookAt(0, 0, 0);

        updateCameraPosition(camera.position, new Vector3(camera.rotation.x, camera.rotation.y, camera.rotation.z));

        camera.updateProjectionMatrix();
        updateCameraRef(camera);
        
	}, [position, centerCameraAroundShape]); 

	return null; 
}

interface CameraControllerProps {
    shapeCenter: Vector3;
    centerCameraAroundShape: boolean;
    children?: ReactNode;
    updateCameraRef: (camera: Camera) => void;
    updateCameraPosition: (cameraPosition: Vector3, cameraRotation: Vector3) => void;
};

export default function CameraController({ 
    shapeCenter, 
    centerCameraAroundShape, 
    children, 
    updateCameraRef,
    updateCameraPosition
}: CameraControllerProps)
{
    const lastPosition = useRef({ x: 0, y: 0 });
	const lastDistance = useRef(0);

    let orbitRadius = 10;
	let angleXOrbit = 45;
	let angleYOrbit = 45;

    const [cameraPosition, setCameraPosition] = useState<Vector3>(new Vector3(0, 0, 0));

    async function updateCameraOrbitPosition() {
        let newX = orbitRadius * Math.sin(angleXOrbit) * Math.cos(angleYOrbit);
        let newY = orbitRadius * Math.sin(angleYOrbit);
        let newZ = orbitRadius * Math.cos(angleXOrbit) * Math.cos(angleYOrbit);
    
        await setCameraPosition(new Vector3(newX, newY, newZ));
    }
    
    
    const panResponder = useRef(PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: async (event, gestureState) => {
            if (gestureState.numberActiveTouches === 1) {
                const sensitivity = 0.01;
                const dx = gestureState.moveX - lastPosition.current.x;
                const dy = gestureState.moveY - lastPosition.current.y;
    
                if (lastPosition.current.x === 0 && lastPosition.current.y === 0) {
                    lastPosition.current = { x: gestureState.moveX, y: gestureState.moveY };
                    return;
                }
    
                angleXOrbit += -dx * sensitivity;
                angleYOrbit += dy * sensitivity;
    
                lastPosition.current = { x: gestureState.moveX, y: gestureState.moveY };
    
                angleYOrbit = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, angleYOrbit));
    
                await updateCameraOrbitPosition();
            } else if (gestureState.numberActiveTouches === 2) {
                if (lastDistance.current === 0) {
                    lastDistance.current = Math.hypot(
                        event.nativeEvent.touches[0].pageX - event.nativeEvent.touches[1].pageX,
                        event.nativeEvent.touches[0].pageY - event.nativeEvent.touches[1].pageY
                    );
                    return;
                }
    
                const distance = Math.hypot(
                    event.nativeEvent.touches[0].pageX - event.nativeEvent.touches[1].pageX,
                    event.nativeEvent.touches[0].pageY - event.nativeEvent.touches[1].pageY
                );
    
                
                const delta = distance/lastDistance.current;
                orbitRadius *= (2-delta);
                orbitRadius = Math.max(ORBIT_RADIUS_MIN, Math.min(ORBIT_RADIUS_MAX, orbitRadius));
    
                lastDistance.current = distance;
                await updateCameraOrbitPosition();
            }
        },
        onPanResponderRelease: () => {
            lastPosition.current = { x: 0, y: 0 };
            lastDistance.current = 0;
        },
        onPanResponderTerminate: () => {
            lastPosition.current = { x: 0, y: 0 };
            lastDistance.current = 0;
        },
    })).current;

    useEffect(() => {
		updateCameraOrbitPosition();
	}, []);

    return (
        <View {...panResponder.panHandlers} style={{ height: Dimensions.get("screen").height, width: Dimensions.get("screen").width }}>
			<Canvas style={styles.canvas}>
				{children}
				<CameraControl 
                    position={cameraPosition} 
                    shapeCenter={shapeCenter} 
                    centerCameraAroundShape={centerCameraAroundShape}
                    updateCameraRef={updateCameraRef}
                    updateCameraPosition={updateCameraPosition}
                />
			</Canvas>
		</View>
    );

}

const styles = StyleSheet.create({
	canvas: {
		width: '100%',
		backgroundColor: '#e9ecef',
	},
	header: {
		fontSize: 30,
	},
});