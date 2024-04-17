import React from "react";
import { Text, Image, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StackNavigationProp } from "@react-navigation/stack";
import Button from "../components/Button";

export default function UnableToSolve({
  navigation,
}: {
  navigation: StackNavigationProp<any>;
}) {
  return (
    <LinearGradient
      colors={["#bde0fe", "#6685c4", "#445f96"]}
      style={styles.loading}
    >
      <Image
        style={styles.image}
        source={require("../assets/unableToSolve.png")}
      />
      <Text style={styles.waitingText}>Unable To Solve</Text>
      <Button
        color="white"
        textColor="black"
        text="Retry"
        onPress={() => navigation.goBack()}
        icon="keyboard-backspace"
        size={24}
        stylesProp={styles.retryBtn}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  loading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: Dimensions.get("screen").height,
    marginTop: 0,
    padding: 0,
    backgroundColor: "#bde0fe",
  },
  image: {
    height: 180,
    width: 200,
  },
  waitingText: {
    position: "relative",
    top: 50,
    fontSize: 30,
  },
  retryBtn: {
    color: "black",
    position: "relative",
    bottom: "-50%",
    backgroundColor: "#219ebc",
    borderRadius: 10,
  },
});
