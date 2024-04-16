import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, Dimensions, Image } from "react-native";

import { Camera as CameraType, CameraCapturedPicture } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

import Button from "../components/Button";

import { StackNavigationProp } from "@react-navigation/stack";
import { NavStackParamList } from "../components/Navigation";
import Camera from "../components/Camera";

const { width, height } = Dimensions.get("screen");
let screenAspectRatio = height / width;

import recognizeTextFromImage from "../utils/textRecognition";
import { useIsFocused } from "@react-navigation/native";
import { clearHistory } from "../utils/history";
import ResizableCenteredView from "../components/resizeView";

import * as ImageManipulator from "expo-image-manipulator";

import { MaterialCommunityIcons } from "@expo/vector-icons";

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

  const [cropDimensions, setCropDimensions] = useState({
    width: 100,
    height: 100,
    top: Dimensions.get("window").height / 2 - 100 / 2 - 150,
    left: Dimensions.get("window").width / 2 - 100 / 2,
  });

  useEffect(() => {
    setPhoto(null);
    setCapturedText("");
    setFlashState(false);
    // clearHistory();
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
      try {
        const photo = await cameraRef.current.takePictureAsync();

        setPhoto(photo);

        const croppedImage = await ImageManipulator.manipulateAsync(
          photo.uri,
          [
            {
              crop: {
                originX: (cropDimensions.left / Dimensions.get("window").width) * (photo.width) ,
                originY: (cropDimensions.top / Dimensions.get("window").height) * (photo.height),
                width: (cropDimensions.width / Dimensions.get("window").width) * (photo.width),
                height: (cropDimensions.height / Dimensions.get("window").height) * (photo.height),
              },
            },
          ],
          {
            compress: 1,
            format: ImageManipulator.SaveFormat.JPEG,
            base64: true,
          }
        );

        const text = await recognizeTextFromImage(croppedImage.base64);
        if (text) {
          setCapturedText(text);
        } else {
          console.error("Text recognition failed.");
          setPhoto(null);
        }
      } catch (error) {
        console.error("Error while taking picture:", error);
        setPhoto(null);
      }
    } else {
      console.error("Camera reference is not available.");
    }
  };

  const getImageFromGallery = async () => {
    if (cameraRef.current) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        base64: true,
        allowsMultipleSelection: false,
      });
      setPhoto(photo);
      if (result && result.assets && result.assets.length > 0) {
        const text = await recognizeTextFromImage(result.assets[0]);
        if (text) {
          setCapturedText(text);
        } else {
          setPhoto(null);
        }
      } else {
        console.error("No image selected.");
      }
    } else {
      console.error("Camera reference is not available.");
    }
  };

  const handleCapturePress = () => {
    takePicture();
  };

  const handleGalleryPress = () => {
    getImageFromGallery();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>StereoMath</Text>
      {!photo ? (
        <View>
          <Camera cameraRef={cameraRef} flashState={flashState} />
          <ResizableCenteredView setCropDimensions={setCropDimensions} />
        </View>
      ) : (
        <View style={styles.preview}>
          <Image source={{ uri: photo.uri }} style={styles.preview} />
        </View>
      )}
      <View style={styles.buttonsContainer}>
        <View style={styles.bigNavbar}>
          <Button
            size={40}
            onPress={() =>
              navigation.navigate("TextInputPage", { problem: "" })
            }
            icon="keyboard"
            color="white"
          />
          <Button
            size={80}
            onPress={handleCapturePress}
            icon="circle"
            color="#db2339"
          />
          <Button
            size={40}
            onPress={() => {}}
            icon="circle"
            color="transparent"
            stylesProp={{ opacity: 0 }}
          />
        </View>
        <View style={styles.smallNavbar}>
          <Button
            icon="image-multiple-outline"
            size={25}
            onPress={handleGalleryPress}
            color="white"
          />
          <Button
            icon={flashState ? "flash" : "flash-off"}
            size={25}
            onPress={() => setFlashState(!flashState)}
            color="white"
          />
          <Button
            icon="history"
            size={25}
            onPress={() => navigation.navigate("History")}
            color="white"
          />
        </View>
      </View>
      <MaterialCommunityIcons name="circle" size={24} color="black" style={{
      position: "absolute",
      top: cropDimensions.top,
      left: cropDimensions.left,
      zIndex: 999,
    }}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width,
    justifyContent: "center",
    height: height,
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
    flexDirection: "column",
    justifyContent: "center",
    gap: 25,
    alignItems: "center",
    paddingBottom: 30,
  },
  preview: {
    flex: 1,
    resizeMode: "cover",
  },
  smallNavbar: {
    zIndex: 10,
    width: width,
    flexDirection: "row",
    justifyContent: "center",
    gap: 50,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  bigNavbar: {
    zIndex: 10,
    width: width,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingHorizontal: 10,
  },
});
