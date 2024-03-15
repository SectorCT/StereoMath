import React, { useState, useRef } from "react";
import { Text, View, StyleSheet, Animated, Easing } from "react-native";
import BottomSheet from "./BottomSheet";
import MainModel from "./MainModel";
import { Suspense } from "react";

function removeLastChar(inputString: string | null) {
    if (inputString != null) return inputString.substring(0, inputString.length - 1);
}

export default function GraphicScreen() {
	const [shownEdge, setShownEdge] = useState<string | null>(null);
	const fadeAnim = useRef(new Animated.Value(0)).current; // Define the useRef hook here

	const animateEdge = (edge: string) => {
		console.log("Animating edge:", edge);
        setShownEdge(edge);
        console.log("Shown edge:", shownEdge);
		// Configure the animation
        fadeAnim.setValue(1); // Reset the animated value to 1
		Animated.timing(fadeAnim, {
			toValue: 0, // Fade out to completely transparent
			duration: 1000, // Animation duration in milliseconds
			easing: Easing.linear, // Easing function
			useNativeDriver: true, // Use native driver for performance
		}).start(); // Start the animation
	};

	return (
		<Suspense fallback={<Text>Loading...</Text>}>
			<View style={styles.container}>
				<MainModel animateEdge={animateEdge} />
				<BottomSheet />
				<Animated.View
					style={[
						styles.animationContainer,
						{
							opacity: fadeAnim, // Bind opacity to animated value
						},
					]}
				>
					<Text style={styles.animationText}>{removeLastChar(shownEdge)} </Text>
				</Animated.View>
			</View>
		</Suspense>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
		width: "100%",
	},
	animationContainer: {
		position: "absolute",
		top: "20%",
		backgroundColor: "#219ebc",
		padding: 10,
		borderRadius: 5,
        width: "15%",
        aspectRatio: 1,
        alignItems: "center",
        justifyContent: "center",
	},
	animationText: {
		color: "white",
        fontSize: 28,
	},
});
