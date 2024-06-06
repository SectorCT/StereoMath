import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import BottomSheet from "../../components/BottomSheet";
import MainModel from "./MainModel";
import GraphicNavbar from "./GraphicNavbar";
import { Image } from "react-native";

import { StackNavigationProp } from "@react-navigation/stack";
import { NavStackParamList } from "../../components/Navigation";
import { LinearGradient } from "expo-linear-gradient";

import { Suspense } from "react";
import { figureData } from "../../Types";
import { requestSolution } from "../../utils/requests";
import { findProblemInHistory } from "../../utils/history";

import LoadingScreen from "../../components/LoadingScreen";
import UnableToSolve from "../../components/UnableToSolve";

interface Props {
  navigation: StackNavigationProp<NavStackParamList, "GraphicScreen">;
  route: { params: { problem: string; data?: figureData } };
}

export default function GraphicScreen({ navigation, route }: Props) {
  if (route.params === undefined) {
    return (
      <View style={styles.container}>
        <Text>Error: no problem provided</Text>
      </View>
    );
  }
  const problem = route.params.problem;
  const { data: paramData } = route.params;

  useEffect(() => {
    const devMode = process.env.EXPO_PUBLIC_DEVMODE == "true";

    if (paramData) {
      setData(paramData);
      setSoultionReady(true);
      return;
    }

    if (devMode) {
      setData({
        vertices: {
          // "A": [0, 0, 0],
          // "B": [3, 0, 0],
          // "C": [1.5, 0, 2.598],
          // "Q": [1.5, 4, 0.866],
          // "H": [1.5, 0, 0.866]
          // flipped on the z
          A: [0, 0, 0],
          B: [3, 0, 0],
          C: [1.5, 2.598, 0],
          Q: [1.5, 0.866, 4],
          H: [1.5, 0.866, 0],
        },
        edges: [
          ["A", "B"],
          ["B", "C"],
          ["C", "A"],
          ["A", "Q"],
          ["B", "Q"],
          ["C", "Q"],
          ["A", "H"],
          ["B", "H"],
          ["C", "H"],
        ],
        solution: [
          "step 1",
          "step 2",
          "step 3",
          "step 4",
          "step 5",
          "step 1",
          "step 2",
          "step 3",
          "step 4",
          "step 5",
          "step 1",
          "step 2",
          "step 3",
          "step 4",
          "step 5",
          "step 1",
          "step 2",
          "step 3",
          "step 4",
          "step 5",
        ],
      });
      setSoultionReady(true);
      return;
    }

    async function checkSolution() {
      console.log("problem", problem);
      const solution = await findProblemInHistory(problem);
      if (solution) {
        setData(solution);
        setSoultionReady(true);
        console.log("found in history");
      } else {
        requestSolution(problem).then(({ status, data }) => {
          setSoultionReady(true);
          if (status != "success") {
            return;
          }
          setData(data);
        });
      }
    }
    checkSolution();
  }, []);

  const [solutionReady, setSoultionReady] = useState(false);
  const [data, setData] = useState<figureData | null>(null);
  const [rotatedImageDeg, setRotatedImageDeg] = useState(0);

  const [shownEdge, setShownEdge] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [centerCameraAroundShape, setCenterCameraAroundShape] = useState(true);

  function toggleCenterCameraAroundShape() {
    setCenterCameraAroundShape(!centerCameraAroundShape);
  }

  const [edgesValues, setEdgesValues] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const calculateEdgeLengths = () => {
      const lengths: { [key: string]: number } = {};
      data?.edges.forEach((edge) => {
        const edgeKey = edge.join("");
        lengths[edgeKey] = calculateEdgeLength(edge);
      });
      setEdgesValues(lengths);
    };

    calculateEdgeLengths();
  }, [data?.edges]);

  const animateEdge = (edge: string) => {
    setShownEdge(edge);
    fadeAnim.setValue(1);
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  const calculateEdgeLength = (edge: string[]) => {
    let vertex1 = edge[0];
    let vertex2 = edge[1];
    let vertex1Coords = [0, 0, 0];
    let vertex2Coords = [0, 0, 0];
    for (const [key, value] of Object.entries(data?.vertices ?? {})) {
      if (vertex1 == key) {
        vertex1Coords = value;
      }
    }
    for (const [key, value] of Object.entries(data?.vertices ?? {})) {
      if (vertex2 == key) {
        vertex2Coords = value;
      }
    }
    return Math.sqrt(
      Math.pow(vertex1Coords[0] - vertex2Coords[0], 2) +
        Math.pow(vertex1Coords[1] - vertex2Coords[1], 2) +
        Math.pow(vertex1Coords[2] - vertex2Coords[2], 2)
    );
  };

  return (
    <Suspense fallback={<Text>Loading...</Text>}>
      {!solutionReady && <LoadingScreen navigation={navigation} />}
      {solutionReady && data == null && <UnableToSolve navigation={navigation}/>}
      {solutionReady && data !== null && (
        <View style={styles.container}>
          <GraphicNavbar
            navigation={navigation}
            toggleCameraFocus={toggleCenterCameraAroundShape}
          />

          <MainModel
            problem={problem}
            data={data}
            animateEdge={animateEdge}
            centerCameraAroundShape={centerCameraAroundShape}
          />
          <BottomSheet data={data} edgesValues={edgesValues} />
          <Animated.View
            style={[
              styles.animationContainer,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <Text style={styles.animationText}>
              {shownEdge} ={" "}
              {Math.round(
                (edgesValues[shownEdge == null ? 0 : shownEdge] +
                  Number.EPSILON) *
                  100
              ) / 100}{" "}
            </Text>
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
    backgroundColor: "#43a1e9",
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
});
