import React, { useState, useEffect, useRef, RefObject } from "react";
import { StyleSheet, View, Dimensions, Platform, SafeAreaView, Text } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { Camera, CameraView } from "expo-camera";

interface Props {
  flashState: boolean;
  cameraRef: RefObject<CameraView>;
}

export default function CameraComponent({ flashState, cameraRef }: Props) {
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {hasPermission && (
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            facing="back"
            autofocus="on"
            renderToHardwareTextureAndroid={true}
            enableTorch={flashState}
            ref={cameraRef}          
          />
        </View>
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
  cameraContainer: {
    width: "100%",
    height: "100%",
    position: 'absolute',
    top: 0,
    left: 0,
  },
  camera: {
    flex: 1,
  },
});
