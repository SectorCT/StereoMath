import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, PanResponder, View, Dimensions} from 'react-native';
import { Canvas, useThree, Euler as EulerType } from '@react-three/fiber';

import { Quaternion, Vector3, Euler, Color } from 'three';

import { figureData } from './Types';

type Vertex = {
	x: number,
	y: number,
	z: number,
}

function CameraController({ position, shapeCenter, centerCameraAroundShape }: 
	{ 
		position: [number, number, number], 
		shapeCenter: [number, number, number],
		centerCameraAroundShape: boolean
	}) {
	const { camera } = useThree();
	useEffect(() => {
		camera.position.set(
			position[0] + (centerCameraAroundShape ? shapeCenter[0] : 0),
			position[1] + (centerCameraAroundShape ? shapeCenter[1] : 0),
			position[2] + (centerCameraAroundShape ? shapeCenter[2] : 0)
		);
		if (centerCameraAroundShape) camera.lookAt(...shapeCenter);
		else camera.lookAt(0, 0, 0);
	}, [position, centerCameraAroundShape]); 

	return null; 
}

const ORBIT_RADIUS_MIN = 2;
const ORBIT_RADIUS_MAX = 20;


function MainModel({animateEdge, data, centerCameraAroundShape}: 
	{ 
		animateEdge: (edge: string) => void
		data: figureData
		centerCameraAroundShape: boolean
	}){
	const [selectedEdgeKey, setSelectedEdgeKey] = useState<string | null>(null);
	let orbitRadius = 10;
	let angleXOrbit = 45;
	let angleYOrbit = 45;
	const position = [0, 0, 5] as [number, number, number];
	const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 0, 5]);

	const lastPosition = useRef({ x: 0, y: 0 });
	const lastDistance = useRef(0);

	const [shapeCenter, setShapeCenter] = useState([0, 0, 0] as [number, number, number]);

	async function updateCameraPosition() {
		let newX = orbitRadius * Math.sin(angleXOrbit) * Math.cos(angleYOrbit);
		let newY = orbitRadius * Math.sin(angleYOrbit);
		let newZ = orbitRadius * Math.cos(angleXOrbit) * Math.cos(angleYOrbit);

		await setCameraPosition([newX, newY, newZ]);
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

				await updateCameraPosition();
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
				await updateCameraPosition();
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

	function calculateShapeCenter() {
		let xSum = 0;
		let ySum = 0;
		let zSum = 0;
		let vertexCount = 0;

		if (data.vertices) {
			Object.keys(data.vertices).forEach((vertexName) => {
				let vertex = data.vertices[vertexName];
				xSum += vertex[0];
				ySum += vertex[1];
				zSum += vertex[2];
				vertexCount++;
			});
		}

		setShapeCenter([xSum / vertexCount, ySum / vertexCount, zSum / vertexCount]);
	}

	useEffect(() => {
		calculateShapeCenter();
		updateCameraPosition();
	}, []);

	return (
		<View {...panResponder.panHandlers} style={{ height: Dimensions.get("screen").height, width: Dimensions.get("screen").width }}>
			<Canvas style={styles.container}>
				<SceneContent data={data} selectedEdgeKey={selectedEdgeKey} setSelectedEdgeKey={setSelectedEdgeKey} animateEdge={animateEdge}/>
				<CameraController position={cameraPosition} shapeCenter={shapeCenter} centerCameraAroundShape={centerCameraAroundShape}/>
			</Canvas>
		</View>
	);
}


  function SceneContent({ selectedEdgeKey, setSelectedEdgeKey, animateEdge, data }: 
	{ 
		data: figureData,
		selectedEdgeKey: string | null, 
		setSelectedEdgeKey: (key: string | null) => void, 
		animateEdge: (edge: string) => void
	}) {
	return (
		<>
			<ambientLight />
			<pointLight position={[10, 10, 10]} intensity={2} />
			<mesh position={[0, 0, 0]}>
				<planeGeometry args={[50, 50, 50, 50]} />
				<meshBasicMaterial color="#f9c74f" wireframe />
			</mesh>
			<mesh position={[0, 0, 0]} rotation={[1.5 * Math.PI, 0, 0] as EulerType}>
				<planeGeometry args={[50, 50, 50, 50]} />
				<meshBasicMaterial color="pink" wireframe />
			</mesh>
			<mesh position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0] as EulerType}>
				<planeGeometry args={[50, 50, 50, 50]} />
				<meshBasicMaterial color="#80ffdb" wireframe />
			</mesh>
			{data.vertices && (Object.keys(data.vertices) as Array<keyof typeof data.vertices>).map((vertexName, index) => {
				let vertex = data.vertices[vertexName];
				return <mesh key={vertexName}>{drawVertex({ x: vertex[0], y: vertex[1], z: vertex[2] })}</mesh>;
			})}

			{data.edges && data.edges.map((edge, index) => {
				let vertex1 = data.vertices[edge[0] as keyof typeof data.vertices];
				let vertex2 = data.vertices[edge[1] as keyof typeof data.vertices];

				if (vertex1 && vertex2) {
					return connectVertices(
						{ x: vertex1[0], y: vertex1[1], z: vertex1[2] },
						{ x: vertex2[0], y: vertex2[1], z: vertex2[2] },
						edge[0] + edge[1] + index.toString(),
						edge[0] + edge[1] + index.toString() + "HIT",
						edge[0] + edge[1],
						selectedEdgeKey,
						setSelectedEdgeKey,
						animateEdge
					);
				}
			})}

		</>
	);
}


function calculate3DDistance(vertex1: Vertex, vertex2: Vertex): number {
	let xDistance = vertex2.x - vertex1.x;
	let yDistance = vertex2.y - vertex1.y;
	let zDistance = vertex2.z - vertex1.z;

	return Math.sqrt(xDistance * xDistance + yDistance * yDistance + zDistance * zDistance);
}

function connectVertices(vertex1: Vertex, vertex2: Vertex, key: string, key2: string, nameOfEdge: string, selectedEdgeKey: string | null, setSelectedEdgeKey: (key: string | null) => void, animateEdge: (edge: string) => void){
	let distance = calculate3DDistance(vertex1, vertex2);

	let midX = (vertex1.x + vertex2.x) / 2;
	let midY = (vertex1.y + vertex2.y) / 2;
	let midZ = (vertex1.z + vertex2.z) / 2;

	let direction = new Vector3(vertex2.x - vertex1.x, vertex2.y - vertex1.y, vertex2.z - vertex1.z);
	direction.normalize();

	let quaternion = new Quaternion();
	quaternion.setFromUnitVectors(new Vector3(0, 1, 0), direction);

	const [colorEdge, setColorEdge] = useState("black");

	const transparentColor = new Color("green");
	transparentColor.lerp(new Color("red"), 0.3);

	const selectedColor = new Color("blue");

	return (
		<>
			<mesh position={[midX, midY, midZ]} quaternion={quaternion} key={key}>
				<cylinderGeometry args={[0.05, 0.05, distance, 32]} />
				<meshStandardMaterial color = {key == selectedEdgeKey ? selectedColor : colorEdge} />
			</mesh>
			<mesh position={[midX, midY, midZ]} quaternion={quaternion} key={key2} onClick={() => {setSelectedEdgeKey(key) ;animateEdge(nameOfEdge)}}>
				<cylinderGeometry args={[0.15, 0.15, distance, 32]} />
				<meshStandardMaterial  opacity={0} transparent={true} /> 
			</mesh>
		</>
	);
}

function drawVertex(vertex: Vertex) {
    return (
        <>
            <mesh position={[vertex.x, vertex.y, vertex.z]}>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshStandardMaterial color="black" />
            </mesh>
        </>
    );
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		backgroundColor: '#e9ecef',
	},
	header: {
		fontSize: 30,
	},
});

export default MainModel;