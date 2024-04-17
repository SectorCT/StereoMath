import React, { useEffect, useState } from "react";
import { View, PanResponder, StyleSheet, Dimensions } from "react-native";

const topOffset = 150;
const initialWidth = 100;
const initialHeight = 100;

export default function ResizableCenteredView({
  setCropDimensions,
} : {
  setCropDimensions: ({
    width,
    height,
    top,
    left,
  }: {
    width: number;
    height: number;
    top: number;
    left: number;
  }) => void;
}) {
  const maxWidth = 300;
  const maxHeight = 400;

  const [dimensions, setDimensions] = useState({
    width: initialWidth,
    height: initialHeight,
    top: Dimensions.get("window").height / 2 - initialHeight / 2 - topOffset,
    left: Dimensions.get("window").width / 2 - initialWidth / 2,
  });

  useEffect(() => {
    setCropDimensions({
      width: dimensions.width,
      height: dimensions.height,
      top: topLeftCorner().y,
      left: topLeftCorner().x,
    });
  }, [dimensions]);


  let [recordedX0, setRecordedX0] = useState(0);
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gestureState) => {
      let xMultiplayer = 1;
      // console.log("gestureState", gestureState.x0)
      // console.log("recorded x0", recordedX0)
      if (gestureState.x0 != 0) {
        setRecordedX0(gestureState.x0);
      };

      if (recordedX0 < Dimensions.get("screen").width/2) xMultiplayer = -xMultiplayer

      const newWidth = Math.min(
        maxWidth,
        Math.max(initialWidth, dimensions.width + (xMultiplayer * gestureState.dx))
      );
      const newHeight = Math.min(
        maxHeight,
        Math.max(initialHeight, dimensions.height + gestureState.dy)
      );

      setDimensions({
        width: newWidth,
        height: newHeight,
        top: topLeftCorner().y,
        left: topLeftCorner().x,
      });
    },
  });

  function topLeftCorner() {
    return {
      x: Dimensions.get("window").width / 2 - dimensions.width / 2,
      y: Dimensions.get("window").height / 2 - dimensions.height / 2 - topOffset,
    }
  }

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.resizableBox,
          {
            width: dimensions.width,
            height: dimensions.height,
            marginLeft: -dimensions.width / 2,
            marginTop: -dimensions.height / 2,
          },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={[styles.corner, styles.topLeftCorner]} />
        <View style={[styles.corner, styles.topRightCorner]} />
        <View style={[styles.corner, styles.bottomLeftCorner]} />
        <View style={[styles.corner, styles.bottomRightCorner]} />
      </View>
    </View>
  );
}

const cornerSize = 30;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    zIndex: 999,
    top: Dimensions.get("window").height / 2 - topOffset,
    left: Dimensions.get("window").width / 2,
  },
  resizableBox: {
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: cornerSize,
    height: cornerSize,
    borderColor: "white",
    borderWidth: 3,
  },
  topLeftCorner: {
    left: 0,
    top: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  topRightCorner: {
    right: 0,
    top: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  bottomLeftCorner: {
    left: 0,
    bottom: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  bottomRightCorner: {
    right: 0,
    bottom: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
});
