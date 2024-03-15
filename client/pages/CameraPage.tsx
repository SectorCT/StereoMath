import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Dimensions, Platform, TouchableOpacity } from 'react-native';
import { Camera, CameraType, FlashMode } from 'expo-camera';
import Button from '../Button';
import ResizableCenteredView from '../resizableView';

const { width, height } = Dimensions.get("screen");
let screenAspectRatio = height / width;

export default function App() {
    const cameraRef = useRef<Camera>(null);
    const [hasPermission, setHasPermission] = useState(false);
    const [cameraRatio, setCameraRatio] = useState('16:9'); // Default to 16:9
    const [cameraRatioNumber, setCameraRatioNumber] = useState(16/9); // Default to 16:9
    const [isCameraReady, setIsCameraReady] = useState(false);

    const [flashState, setFlashState] = useState(false);
    
    const prepareRatio = async () => {
        let desiredRatio = "16:9";
        if (Platform.OS === 'android' && cameraRef.current) {
            const ratios = await cameraRef.current.getSupportedRatiosAsync();
            // ...additional code to find the best ratio...
            let bestRatio = desiredRatio;
            
            let minDiff = Number.MAX_VALUE;
            for (const ratio of ratios) {
                const parts = ratio.split(':');
                const ratioWidth = parseInt(parts[0], 10);
                const ratioHeight = parseInt(parts[1], 10);
                const aspectRatio = ratioWidth / ratioHeight;


                const diff = Math.abs(aspectRatio - screenAspectRatio);
                if (diff < minDiff) {
                    minDiff = diff;
                    bestRatio = ratio;
                }
            }

            const parts = bestRatio.split(':');
            const ratioWidth = parseInt(parts[0], 10);
            const ratioHeight = parseInt(parts[1], 10);
            setCameraRatio(bestRatio);
            setCameraRatioNumber(ratioWidth / ratioHeight);
        }
    };

    function toggleFlash(){
        setFlashState(!flashState);
    }

    useEffect(() => {
        if(isCameraReady){
            prepareRatio();
        }
    }, [isCameraReady]);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');

        })();
        
    }, []);

    if (hasPermission === null) {
        return <Text>Preeban si</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <Camera 
                style={StyleSheet.compose(styles.camera, {width: width, height: width * cameraRatioNumber})} 
                type={CameraType.back} 
                ratio={cameraRatio} 
                ref={cameraRef}
                flashMode={flashState ? FlashMode.torch : FlashMode.off}
                zoom={0}
                onCameraReady={() => setIsCameraReady(true)}
            >
                <ResizableCenteredView/>
                <View style={styles.buttonsContainer}>
                    <Button title='' size={40} onPress={()=>{}} icon="keyboard" color='white' stylesProp={{paddingBottom: 40}}/>
                    <Button title='' size={70} onPress={()=>{}} icon="circle" color='red' stylesProp={{paddingBottom: 40}}/>
                    <Button title='' size={40} onPress={() => {toggleFlash()}} icon={flashState ? "flash" : "flash-off"} color='white' stylesProp={{paddingBottom: 40}}/>
                </View>
            </Camera>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: width,
        height: width * screenAspectRatio,
    },
    camera: {
        width: width,
        height: width * screenAspectRatio,
        flexDirection: "column-reverse"
    },
    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        paddingHorizontal: 10
    }
});
