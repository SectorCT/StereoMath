import React, {
  useState,
  useEffect,
  useRef,
  RefObject,
  forwardRef,
} from "react";
import { StyleSheet, View, Dimensions, Platform } from "react-native";

import { useIsFocused } from "@react-navigation/native";

import { Camera, CameraType, FlashMode } from "expo-camera";

const { width, height } = Dimensions.get("screen");
let screenAspectRatio = height / width;

interface Props {
  flashState: boolean;
  cameraRef: RefObject<Camera>;
}

export default function CameraComponent({ flashState, cameraRef }: Props) {
  const [hasPermission, setHasPermission] = useState(false);
  const [cameraRatio, setCameraRatio] = useState("20:9"); // Default to 20:9
  const [cameraRatioNumber, setCameraRatioNumber] = useState(20 / 9); // Default to 20:9
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
      setCameraRatioNumber(ratioWidth / ratioHeight);
    }
  };
  useEffect(() => {
    if (isCameraReady && hasPermission) {
      prepareRatio();
    }
  }, [isCameraReady, hasPermission]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  return (
    <View style={styles.container}>
      {isFocused && hasPermission && (
        <Camera
          style={StyleSheet.compose(styles.camera, {
            width: width,
            height: width * cameraRatioNumber,
          })}
          type={CameraType.back}
          ratio={cameraRatio}
          ref={cameraRef}
          flashMode={flashState ? FlashMode.torch : FlashMode.off}
          zoom={0}
          onCameraReady={() => setIsCameraReady(true)}
        ></Camera>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width,
    height: width * screenAspectRatio,
    backgroundColor: "black",
  },
  header: {
    fontSize: 30,
    flexDirection: "row",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    color: "white",
    // backgroundColor: "00000000",
    position: "absolute",
    top: 40,
    width: Dimensions.get("window").width,
    zIndex: 80,
  },
  camera: {
    width: width,
    height: width * screenAspectRatio,
    flexDirection: "column-reverse",
  },
  buttonsContainer: {
    zIndex: 10,
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingHorizontal: 10,
  },
});
