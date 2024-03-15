import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import BottomSheet from "./BottomSheet";
import MainModel from "./MainModel";
import { Suspense } from "react";

export default function GraphicScreen() {
	const [shownEdge, setShownEdge] = useState<string | null>(null);

	const animateEdge = (edge: string) => {
		console.log("Animating edge:", edge);
		// Implement your animation logic here
		// This function will be called when you want to animate the shown edge
	};

	return (
		<Suspense fallback={<Text>Loading...</Text>}>
			<View style={styles.container}>
				<MainModel setShownEdge={setShownEdge} animateEdge = {animateEdge} />
				<BottomSheet />
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
});
