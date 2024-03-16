import React, { useState, useRef, useEffect } from "react";
import { Text, View, StyleSheet, Animated, Easing } from "react-native";
import BottomSheet from "../BottomSheet";
import MainModel from "../MainModel";
import GraphicNavbar from "../GraphicNavbar";

import { StackNavigationProp } from "@react-navigation/stack";
import { NavStackParamList } from "../Navigation";

import { Suspense } from "react";
import { figureData } from "../Types";
import { requestSolution } from "../requests";


interface Props {
	navigation: StackNavigationProp<NavStackParamList, "GraphicScreen">;
	route: { params: { problem: string } };
}

function removeLastChar(inputString: string | null) {
	if (inputString != null) return inputString.substring(0, inputString.length - 1);
}

export default function GraphicScreen({ navigation, route }: Props) {
	// if (route.params === undefined) {
	//     return (
	//         <View style={styles.container}>
	//             <Text>Error: no problem provided</Text>
	//         </View>
	//     )
	// }
	// const problem = route.params.problem;

	const problem = "Дадена е првилна триъгълна пирамида ABCQ с основен ръб AB = 3 и околен ръб AQ = 4 и QH, като H е пресечната точка на диагоналите на основата. Намерете CH.";

	const [solutionReady, setSoultionReady] = useState(false);
	const [data, setData] = useState<figureData | null>(null);

	useEffect(() => {
		requestSolution(problem).then(({ status, data }) => {
			setSoultionReady(true);
			if (status != "success") {
				return;
			}
			setData(data);
		})
	} , []);

	

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
			{!solutionReady && (
				<View>
					<Text>Waiting...</Text>
				</View>
			)}
			{solutionReady && data == null && (
				<View>
					<Text>Unable To Solve</Text>
				</View>
			)}
			{solutionReady && data !== null && (
				<View style={styles.container}>
					<MainModel data={data} animateEdge={animateEdge} />
					<BottomSheet />
					<Animated.View
						style={[
							styles.animationContainer,
							{
								opacity: fadeAnim,
							},
						]}
					>
						<Text style={styles.animationText}>{removeLastChar(shownEdge)} </Text>
					</Animated.View>
				</View>
			)}
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
