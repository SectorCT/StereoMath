import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image
} from "react-native";

import {
  Camera as CameraType,
  CameraCapturedPicture,
} from "expo-camera";

import Button from "../components/Button";

import { StackNavigationProp } from "@react-navigation/stack";
import { NavStackParamList } from "../components/Navigation";
import Camera from "./Camera";

const { width, height } = Dimensions.get("screen");
let screenAspectRatio = height / width;

import recognizeTextFromImage from "../components/textRecognition";
import { useIsFocused } from "@react-navigation/native";

interface Props {
  navigation: StackNavigationProp<NavStackParamList, "GraphicScreen">;
  route: {};
}

export default function CameraPage({ navigation, route }: Props) {
  const cameraRef = useRef<CameraType>(null);
  const [flashState, setFlashState] = useState(false);
  const [capturedText, setCapturedText] = useState<string>("");
  const isFocused = useIsFocused();

  const [photo, setPhoto] = useState<CameraCapturedPicture | null>(null);

  useEffect(() => {
    setPhoto(null);
    setCapturedText("");
    setFlashState(false);
  }, [isFocused]);

  useEffect(() => {
    async function passToTextInput() {
      await setCapturedText(capturedText.replace(/[\t\n]/g, ""));
      navigation.navigate("TextInputPage", { problem: capturedText });
    }
    if (capturedText) {
      passToTextInput();
    }
  }, [capturedText]);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ base64: true });
      setPhoto(photo);
      const text = await recognizeTextFromImage(photo.base64);
      if (text) {
        setCapturedText(text);
      }else{
        setPhoto(null);
      }
    } else {
      console.error("Camera reference is not available.");
    }
  };

  const handleCapturePress = () => {
    takePicture();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>StereoMath</Text>
      {!photo ? <Camera
        cameraRef={cameraRef}
        flashState={flashState}
      /> :
      <View style={styles.preview}>
        <Image
          source={{ uri: photo.uri }}
          style={styles.preview}
        />
      </View>
    
      }
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
          onPress={() => setFlashState(!flashState)}
          icon={flashState ? "flash" : "flash-off"}
          color="white"
          stylesProp={{ paddingBottom: 40 }}
        />
      </View>
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
    zIndex: 10,
    position: "absolute",
    bottom: 0,
    width: "100%",
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
