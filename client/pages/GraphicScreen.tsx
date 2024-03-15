import React, { useState, useRef, useEffect } from "react";
import { Text, View, StyleSheet, Animated, Easing, Dimensions } from "react-native";
import BottomSheet from "../BottomSheet";
import MainModel from "../MainModel";
import GraphicNavbar from "../GraphicNavbar";
import { Image } from "react-native";

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
	if (route.params === undefined) {
	    return (
	        <View style={styles.container}>
	            <Text>Error: no problem provided</Text>
	        </View>
	    )
	}
	const problem = route.params.problem;

	useEffect(() => {
        requestSolution(problem).then(({ status, data }) => {
            setSoultionReady(true);
            if (status != "success") {
                return;
            }
            setData(data);
        })
    } , []);

    

	const [solutionReady, setSoultionReady] = useState(false);
	const [data, setData] = useState<figureData | null>(null);
	const [rotatedImageDeg, setRotatedImageDeg] = useState(0);

	const [shownEdge, setShownEdge] = useState<string | null>(null);
	const fadeAnim = useRef(new Animated.Value(0)).current; // Define the useRef hook here

	useEffect(() => {
		const interval = setInterval(() => {
		  setRotatedImageDeg((rotatedImageDeg) => rotatedImageDeg - 3);
		}, 10); // Increment the counter every 1000 milliseconds (1 second)
	
		return () => clearInterval(interval); // Clear the interval when the component unmounts
	  }, []); // Empty dependency array means this effect runs once on mount

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
				<View style={styles.loading}>
					<Image
        				source={require('../assets/loading.png')}
        				style={StyleSheet.compose(styles.image, {transform: [{ rotate: `${rotatedImageDeg}deg` }]})}
      				/>
					<Text style={styles.waitingText} >Drawing...</Text>
				</View>
			)}
			{solutionReady && data == null && (
				<View style={styles.loading}>
					<Image style={styles.image} source={require('../assets/unableToSolve.png')}/>
					<Text style={styles.waitingText}>Unable To Solve</Text>
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
	loading:{
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		height: Dimensions.get("window").height,
		backgroundColor: "#bde0fe"
	},
	image:{
		height: 180,
    	width: 200,
	},
	waitingText:{
		position: "relative",
		top: 50,
		fontSize: 30,
	}
});
