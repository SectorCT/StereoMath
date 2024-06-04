import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View, ImageBackground } from "react-native";
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
      <ImageBackground
        source={require('../assets/input-background.png')} style={styles.background}>
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
          <View style={styles.buttons}><Button
              textColor="black"
              text="Back"
              onPress={() => navigation.goBack()}
              icon="keyboard-backspace"
              size={24}
              color="black"
              stylesProp={styles.backBtn}
            />
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
              stylesProp={styles.solve}
            /></View>
            
        </View>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  background:{
    flex: 1,
  },
  main: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "80%",
    alignSelf: "center",
  },
  header: {
    fontSize: 19,
    color: "white",
    fontWeight: "800",
    fontFamily: "Inter",
    textAlign: "center",
    textAlignVertical: "center",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#43a1e9",
    marginBottom: "10%",
    paddingHorizontal: 30,
    paddingVertical: 5,
  },
  input: {
    fontSize: 18,
    borderColor: "#868787",
    backgroundColor: "rgba(255, 255, 255, 0.90)",
    borderWidth: 1,
    fontWeight: "bold",
    borderRadius: 15,
    textAlignVertical: "top",
    padding: 13,
    height: "60%",
    marginBottom: "5%",
  },
  buttons:{
    width: "100%",
    display: "flex",  
    flexDirection: "row",
    justifyContent: "space-between",
  },
  solve: {
    borderWidth: 1,
    borderColor: "#000000",
    backgroundColor: "white",
    borderRadius: 50,
    alignItems: "center",
    
  },
  backBtn: {
    backgroundColor: "#ffffff",
    borderRadius: 50,
    borderColor: "#000000",
    borderWidth: 1,
    flexDirection: "row-reverse",
    paddingHorizontal: 10,
    alignItems: "center",
  },
});

export default TextInputPage;
