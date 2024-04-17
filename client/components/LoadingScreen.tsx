import React from "react";
import { Text, Image, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StackNavigationProp } from "@react-navigation/stack";
import CubeLoading from "../components/CubeLoading";

export default function LoadingScreen({ navigation } : { navigation: StackNavigationProp<any>}) {
    return (
        <LinearGradient
        colors={["#bde0fe", "#6685c4", "#445f96"]}
        style={styles.loading}
      >
        <CubeLoading size={200}/>
        <Text style={styles.waitingText}>Drawing...</Text>
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
});