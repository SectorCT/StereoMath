import React, { useState, useEffect, useRef, RefObject } from "react";
import { StyleSheet, View, Dimensions, Platform, SafeAreaView, Text } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { Camera, CameraType, FlashMode } from "expo-camera";

const window = Dimensions.get("window");
const screenAspectRatio = window.height / window.width;
interface Props {
  flashState: boolean;
  cameraRef: RefObject<Camera>;
}

export default function CameraComponent({ flashState, cameraRef }: Props) {
  const [hasPermission, setHasPermission] = useState(false);
  const [cameraRatio, setCameraRatio] = useState("20:9");
  const [cameraRatioNumber, setCameraRatioNumber] = useState(20 / 9);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const isFocused = useIsFocused();

  const prepareRatio = async () => {
    let desiredRatio = "20:9";
    if (Platform.OS === "android" && cameraRef.current) {
      const ratios = await cameraRef.current.getSupportedRatiosAsync();
      let bestRatio = desiredRatio;
      let minDiff = Number.MAX_VALUE;
      for (const ratio of ratios) {
        const parts = ratio.split(":");
        const ratioWidth = parseInt(parts[0], 10);
        const ratioHeight = parseInt(parts[1], 10);
        const aspectRatio = ratioWidth / ratioHeight;
        const diff = Math.abs(aspectRatio - screenAspectRatio);
        if (diff < minDiff) {
          minDiff = diff;
          bestRatio = ratio;
        }
      }
      const parts = bestRatio.split(":");
      const ratioWidth = parseInt(parts[0], 10);
      const ratioHeight = parseInt(parts[1], 10);
      setCameraRatio(bestRatio);
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  useEffect(() => {
    if (isCameraReady && hasPermission) {
      prepareRatio();
    }
  }, [isCameraReady, hasPermission]);

  return (
    <SafeAreaView style={styles.container}>
      {isFocused && hasPermission && (
        <Camera
          style={styles.camera}
          type={CameraType.back}
          ratio={cameraRatio}
          ref={cameraRef}
          flashMode={flashState ? FlashMode.torch : FlashMode.off}
          onCameraReady={() => setIsCameraReady(true)}
        />
      )}
      {!hasPermission && 
      <View style={styles.container}>
        <Text>No access to camera</Text>
      </View>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "white",
  },
  camera: {
    width: "100%",
    height: "100%"
  },
});