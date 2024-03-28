import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Platform,
  TouchableOpacity,
} from "react-native";

import { useIsFocused } from '@react-navigation/native';

import {
  Camera,
  CameraType,
  FlashMode,
  CameraCapturedPicture,
} from "expo-camera";

import Button from "../components/Button";

import { StackNavigationProp } from "@react-navigation/stack";
import { NavStackParamList } from "../components/Navigation";

const { width, height } = Dimensions.get("screen");
let screenAspectRatio = height / width;

import recognizeTextFromImage from "../components/textRecognition";

interface Props {
  navigation: StackNavigationProp<NavStackParamList, "GraphicScreen">;
  route: {};
}

export default function CameraPage({ navigation, route }: Props) {
  const cameraRef = useRef<Camera>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [cameraRatio, setCameraRatio] = useState("20:9"); // Default to 20:9
  const [cameraRatioNumber, setCameraRatioNumber] = useState(20 / 9); // Default to 20:9
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [flashState, setFlashState] = useState(false);
  const [capturedText, setCapturedText] = useState<string>("");
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
      console.log("Supported ratios: ", ratios);
      console.log("Best Ratio: ", bestRatio);
      setCameraRatio(bestRatio);
      setCameraRatioNumber(ratioWidth / ratioHeight);
    }
  };

  function toggleFlash() {
    setFlashState(!flashState);
  }

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

  

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ base64: true });
      setCapturedText(await recognizeTextFromImage(photo.base64));
    } else {
      console.error("Camera reference is not available.");
    }
  };

  const handleCapturePress = () => {
    takePicture();
  };

  useEffect(() => {
    async function passToTextInput() {
      await setCapturedText(capturedText.replace(/[\t\n]/g, ""));
      navigation.navigate("TextInputPage", { problem: capturedText });
    }
    if (capturedText) {
      passToTextInput();
    }
  }, [capturedText]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>StereoMath</Text>
      {isFocused && <Camera
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
      >
        
        <View style={styles.buttonsContainer}>
          <Button
            text=""
            size={40}
            onPress={() => {
              navigation.navigate("TextInputPage", { problem: "" });
            }}
            icon="keyboard"
            color="white"
            stylesProp={{ paddingBottom: 40 }}
          />
          <Button
            text=""
            size={70}
            onPress={handleCapturePress}
            icon="circle"
            color="red"
            stylesProp={{ paddingBottom: 40 }}
          />
          <Button
            text=""
            size={40}
            onPress={toggleFlash}
            icon={flashState ? "flash" : "flash-off"}
            color="white"
            stylesProp={{ paddingBottom: 40 }}
          />
        </View>
      </Camera>
}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-end",
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
    zIndex: 100,
  },
  camera: {
    width: width,
    height: width * screenAspectRatio,
    flexDirection: "column-reverse",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  preview: {
    flex: 1,
    resizeMode: "cover",
  }
});
