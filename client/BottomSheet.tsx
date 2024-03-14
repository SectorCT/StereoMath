import React, { useRef } from 'react';
import { View, Animated, PanResponder, StyleSheet, Dimensions } from 'react-native';

const screenHeight = Dimensions.get('window').height;
const sheetMaxHeight = screenHeight - 200;
const sheetMinHeight = 100;

const MAX_Y = sheetMinHeight - sheetMaxHeight;
const MID_Y = MAX_Y / 2;
const MIN_Y = 0;

const THRESHOLD = 60;

const BottomSheet = () => {
  const lastRef = useRef<number>(0);
  const sheetRef = useRef<Animated.Value>(new Animated.Value(0)).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      if (sheetRef instanceof Animated.Value) {
        sheetRef.setOffset(lastRef.current);
      }
    },
    onPanResponderMove: (_, gesture) => {
      if (sheetRef instanceof Animated.Value) {
        sheetRef.setValue(gesture.dy);
      }
    },
    onPanResponderRelease: (_, gesture) => {
      if (sheetRef instanceof Animated.Value) {
        sheetRef.flattenOffset();

        if (gesture.dy > 0) {
          // dragging down
          if (gesture.dy <= THRESHOLD) {
            lastRef.current === MAX_Y ? autoSpring(MAX_Y) : autoSpring(MID_Y);
          } else if (lastRef.current === MAX_Y) {
            autoSpring(MIN_Y);
          } else {
            autoSpring(MIN_Y);
          }
        } else {
          // dragging up
          if (gesture.dy >= -THRESHOLD) {
            lastRef.current === MIN_Y ? autoSpring(MIN_Y) : autoSpring(MIN_Y);
          } else {
            lastRef.current === MIN_Y ? autoSpring(MAX_Y) : autoSpring(MAX_Y);
          }
        }
      }
    },
    
  });

  const autoSpring = (value: number) => {
    lastRef.current = value;
    Animated.spring(sheetRef, {
      toValue: lastRef.current,
      useNativeDriver: false,
    }).start();
  };

  const animatedStyles = {
    height: sheetRef.interpolate({
      inputRange: [MAX_Y, MIN_Y],
      outputRange: [sheetMaxHeight, sheetMinHeight],
      extrapolate: 'clamp',
    }),
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.sheetContainer, animatedStyles]}>
        <View style={styles.dragbarContainer} {...panResponder.panHandlers}>
          <View style={styles.dragBar} />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF0000',
    width: '100%',
    alignItems: 'center', // Center content horizontally
    justifyContent: 'flex-end', // Align content to the bottom of the container
  },
  sheetContainer: {
    backgroundColor: '#219ebc',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 20,
    shadowColor: '#52006A',
    alignItems: 'center', // Center content horizontally
  },
  dragbarContainer: {
    width: '100%',
    height: '50%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'flex-start',
    paddingTop: 20,
    alignItems: 'center',
    elevation: 2,
  },
  dragBar: {
    width: '50%',
    height: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
});


export default BottomSheet;
