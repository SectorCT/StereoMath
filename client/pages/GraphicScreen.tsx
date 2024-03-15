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
	const fadeAnim = useRef(new Animated.Value(0)).current;

	const [centerCameraAroundShape, setCenterCameraAroundShape] = useState(false);

	function toggleCenterCameraAroundShape() {
		setCenterCameraAroundShape(!centerCameraAroundShape);
	}

	useEffect(() => {
		// const interval = setInterval(() => {
		//   setRotatedImageDeg((rotatedImageDeg) => rotatedImageDeg - 3);
		// }, 10); // Increment the counter every 1000 milliseconds (1 second)
	
		// return () => clearInterval(interval); // Clear the interval when the component unmounts
	  }, []); // Empty dependency array means this effect runs once on mount
	  const [edgesValues, setEdgesValues] = useState<{ [key: string]: number }>({});

	  useEffect(() => {
		  const calculateEdgeLengths = () => {
		  const lengths: { [key: string]: number } = {};
		  // Assuming you have a function to calculate the length of an edge based on its vertices
		  data?.edges.forEach(edge => {
			  const edgeKey = edge.join('');
			  // Assuming you have a function calculateEdgeLength that calculates the length of the edge
			  lengths[edgeKey] = calculateEdgeLength(edge);
		  });
		  setEdgesValues(lengths);
		  };
  
		  calculateEdgeLengths();
	  }, [data?.edges]);
  
	  const calculateEdgeLength = (edge: string[]) => {
		  let vertex1 = edge[0];
		  let vertex2 = edge[1];
		  let vertex1Coords = [0, 0, 0];
		  let vertex2Coords = [0, 0, 0];
		  for(const [key, value] of Object.entries(data?.vertices?? {})){
			  if(vertex1 == key){
				  vertex1Coords = value;
			  }
		  }
		  for(const [key, value] of Object.entries(data?.vertices?? {})){
			  if(vertex2 == key){
				  vertex2Coords = value;
			  }
		  }
		  return Math.sqrt(Math.pow(vertex1Coords[0] - vertex2Coords[0], 2) + Math.pow(vertex1Coords[1] - vertex2Coords[1], 2) + Math.pow(vertex1Coords[2] - vertex2Coords[2], 2));
	  };
  
	const animateEdge = (edge: string) => {
		console.log("Animating edge:", edge);
		setShownEdge(edge);

		console.log("Shown edge:", shownEdge, " with value:", edgesValues[shownEdge == null ? 0 : shownEdge]);
		console.log("Edges values:", edgesValues);
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
					<GraphicNavbar navigation={navigation} toggleCameraFocus={toggleCenterCameraAroundShape}/>
					<MainModel data={data} animateEdge={animateEdge} centerCameraAroundShape={centerCameraAroundShape}/>
					<BottomSheet  data = {data} edgesValues = {edgesValues}/>
					<Animated.View
						style={[
							styles.animationContainer,
							{
								opacity: fadeAnim,
							},
						]}
					>
						<Text style={styles.animationText}>{shownEdge} = {edgesValues[shownEdge == null ? 0 : shownEdge]} </Text>
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
		width: "auto",
		alignItems: "center",
		justifyContent: "center",
	},
	animationText: {
		color: "white",
		width: "auto",
		fontSize: 28,
	},
	loading:{
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		height: Dimensions.get("screen").height,
		marginTop: 0,
		padding: 0,
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
