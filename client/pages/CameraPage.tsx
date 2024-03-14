import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Dimensions, Platform } from 'react-native';
import { Camera, CameraType } from 'expo-camera';

const { width, height } = Dimensions.get("screen");
let screenAspectRatio = height / width;

export default function App() {
    const cameraRef = useRef<Camera>(null);
    const [hasPermission, setHasPermission] = useState(false);
    const [cameraRatio, setCameraRatio] = useState('16:9'); // Default to 16:9
    const [cameraRatioNumber, setCameraRatioNumber] = useState(16/9); // Default to 16:9

    const prepareRatio = async () => {
        let desiredRatio = "16:9";
        console.log(Platform.OS === 'android', cameraRef.current);
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
                console.log(diff)
                if (diff < minDiff) {
                    minDiff = diff;
                    bestRatio = ratio;
                }
            }
            console.log(ratios);
            console.log(bestRatio);

            const parts = bestRatio.split(':');
            const ratioWidth = parseInt(parts[0], 10);
            const ratioHeight = parseInt(parts[1], 10);
            setCameraRatio(bestRatio);
            setCameraRatioNumber(ratioWidth / ratioHeight);
        }
    };

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');

        })();
        setTimeout(() => prepareRatio(), 10);
        
    }, []);

    if (hasPermission === null) {
        return <Text>Preeban si</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <Camera style={StyleSheet.compose(styles.camera, {width: width, height: width * cameraRatioNumber})} type={CameraType.back} ratio={cameraRatio} ref={cameraRef}>

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
    },
});
