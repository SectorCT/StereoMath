import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, TextInput, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StackNavigationProp } from "@react-navigation/stack";
import { NavStackParamList } from "../components/Navigation";

import Button from "../components/Button";

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
        colors={["#43a1e9", "#43a1e9", "#4393e9"]}
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
          <Text style={styles.header}>Customize your stereometric problem</Text>

          <TextInput
            style={styles.input}
            value={inputValue ? inputValue : ""}
            placeholder="Type your hardest stereometric math problem here..."
            placeholderTextColor="#4d4f4f"
            onChangeText={(text) => {
              setInputValue(text);
            }}
            multiline
            textAlignVertical="top"
          />
          <View style={styles.solve}>
            <Button
              textColor="black"
              color="black"
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
  backgroundContainer: {
    flex: 1,
    backgroundColor: "#E1FCFF",
  },
  main: {
    position: "relative",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 30,
    color: "black",
    width: 250,
    fontWeight: "800",
    fontFamily: "sans-serif-light",
    textAlign: "left",
    position: "absolute",
    top: 100,
    left: "10%",
    alignSelf: "flex-start",
  },
  input: {
    fontSize: 20,
    width: "auto",
    height: 300,
    borderColor: "#868787",
    backgroundColor: "white",
    borderWidth: 2,
    padding: 15,
    borderRadius: 15,
    textAlignVertical: "top",
    marginHorizontal: "10%"
  },
  solve: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    borderWidth: 1,
    borderColor: "#000000",
    backgroundColor: "white",
    borderRadius: 50,
    color: "black",
    alignSelf: "flex-end",
    top: 20,
    left: -50,
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
