import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StackNavigationProp } from "@react-navigation/stack";
import { NavStackParamList } from "../Navigation";
import HamburgerMenu from "../HamburgerMenu";

import Button from "../Button";

interface Props {
  navigation: StackNavigationProp<NavStackParamList, "TextInputPage">;
  route: { params: { problem: string | null | undefined } };
}

function TextInputPage({ navigation, route }: Props) {
  const problem = route.params.problem;
  const [inputValue, setInputValue] = useState(problem);

  return (
    <>
      <LinearGradient
        colors={["#bde0fe", "#6685c4", "#445f96"]}
        style={{ flex: 1 }}
      >
        <Button
          text=""
          onPress={() => navigation.goBack()}
          icon="keyboard-backspace"
          size={24}
          color="black"
          stylesProp={styles.backBtn}
        />
        <View style={styles.main}>
          <Text style={styles.header}>Photo Stereo</Text>

          <TextInput
            style={styles.input}
            value={inputValue ? inputValue : ""}
            placeholder="Type your hardest stereometric math problem here..."
            placeholderTextColor="lightgray"
            onChangeText={(text) => {
              setInputValue(text);
            }}
            multiline
            textAlignVertical="top"
          />
          <View style={styles.solve}>
            <Button
              color="lightgray"
              icon="arrow-right-thin"
              size={24}
              text="Solve"
              onPress={() => {
                navigation.navigate("GraphicScreen", {
                  problem: inputValue ? inputValue : "",
                });
              }}
            />
          </View>
        </View>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  main: {
    position: "relative",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 60,
    color: "white",
    fontWeight: "bold",
    fontFamily: "sans-serif-light",
    textAlign: "center",
    position: "relative",
    top: -40,
    textTransform: "uppercase",
  },
  input: {
    fontSize: 20,
    width: 300,
    height: 200,
    borderColor: "white",
    color: "lightgray",
    borderWidth: 1,
    padding: 15,
    borderRadius: 15,
    textAlignVertical: "top", // Adjust the text to start from the top
  },
  solve: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    top: 20,
  },
  solveText: {
    fontSize: 20,
  },
  backBtn: {
    backgroundColor: "#ffffff",
    borderRadius: 50,
    position: "relative",
    top: 50,
    left: 20,
    maxWidth: 50,
    maxHeight: 50,
  },
});

export default TextInputPage;
