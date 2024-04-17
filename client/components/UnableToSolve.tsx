import React from "react";
import { Text, Image, StyleSheet, Dimensions, View} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StackNavigationProp } from "@react-navigation/stack";
import Button from "../components/Button";

export default function UnableToSolve({ navigation} : { navigation: StackNavigationProp<any>}) {
    return (
        <View style={styles.loading}>
          <Text style={styles.waitingText}>Unable To Solve</Text>

          <Image
            style={styles.image}
            source={require("../assets/unabletosolve.png")}
          />
          <Button
            color="white"
            text="Retry"
            onPress={() => navigation.goBack()}
            icon="keyboard-backspace"
            size={24}
            stylesProp={styles.retryBtn}
          />
        </View>
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
        backgroundColor: "#E1FCFF",
      },
      image: {
        height: 200,
        width: 200,
      },
      waitingText: {
        position: "relative",
        fontSize: 30,
        maxWidth: 115,
        textAlign: "left",
        alignSelf: "flex-start",
        left: "15%",
        top: "-15%",
        fontWeight: "600",
      },
      retryBtn: {
        color: "black",
        position: "relative",
        bottom: "-30%",
        backgroundColor: "black",
        borderRadius: 10,
      },
});