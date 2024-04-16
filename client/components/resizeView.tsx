
import React, { useEffect, useState } from "react";
import { View, PanResponder, StyleSheet, Dimensions } from "react-native";

const topOffset = 150;
const initialWidth = 100;
const initialHeight = 100;

export default function ResizableCenteredView({
  setCropDimensions,
}: {
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

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gestureState) => {
      const newWidth = Math.min(
        maxWidth,
        Math.max(initialWidth, dimensions.width + gestureState.dx)
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

  function topLeftCorner(){
    return {
      x: Dimensions.get("window").width / 2 - dimensions.width / 2,
      y: Dimensions.get("window").height / 2 - dimensions.height / 2 - topOffset,
    }
  }

  return (
    <>
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
      />
      
    </View>
    </>
  );
}

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
    backgroundColor: "rgba(125, 225, 245, 0.5)",
    borderColor: "lightblue",
    borderWidth: 1,
  },
});
