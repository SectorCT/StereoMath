import React, { useState, useEffect, useRef, RefObject } from "react";
import { StyleSheet, View, Dimensions, Platform, SafeAreaView, Text } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { Camera, CameraType, CameraView, FlashMode } from "expo-camera";

const window = Dimensions.get("window");
const screenAspectRatio = window.height / window.width;
interface Props {
  flashState: boolean;
  cameraRef: RefObject<CameraView>;
}

export default function CameraComponent({ flashState, cameraRef }: Props) {
  const [hasPermission, setHasPermission] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {isFocused && hasPermission && (
        <CameraView
          style={styles.camera}
          facing="back"
          autofocus="on"
          renderToHardwareTextureAndroid={true}
          enableTorch={flashState}
          ref={cameraRef}          
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