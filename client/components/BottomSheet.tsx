import React, { useRef } from 'react';
import { Text, View, Animated, PanResponder, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { figureData } from '../Types';

const screenHeight = Dimensions.get('window').height;
const sheetMaxHeight = screenHeight - 200;
const sheetMinHeight = 100;

const MAX_Y = sheetMinHeight - sheetMaxHeight;
const MID_Y = MAX_Y / 2;
const MIN_Y = 0;

const THRESHOLD = 60;

const BottomSheet = ({data, edgesValues} : {data : figureData,edgesValues: { [key: string]: number } }) => {
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
          if (gesture.dy <= THRESHOLD) {
            lastRef.current === MAX_Y ? autoSpring(MAX_Y) : autoSpring(MID_Y);
          } else if (lastRef.current === MAX_Y) {
            autoSpring(MIN_Y);
          } else {
            autoSpring(MIN_Y);
          }
        } else {
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
      <Animated.View style={[styles.sheetContainer, animatedStyles]} >
        <View style={styles.dragbarContainer} {...panResponder.panHandlers} pointerEvents='box-only'>
          <View style={styles.dragBar}>
          </View>
        </View>
        <View style={styles.contentView}>
        <ScrollView contentContainerStyle = {styles.scrollView}> 
          <Text style={styles.header}>Solution</Text>
          <View style={styles.solutionContainer}>
            {data.solution.map((name, index) => (
                <View style={styles.solutionRow} key={index}>      
                  <View style={styles.solutionIndex} >
                    <Text style={styles.solutionIndexText}>{index + 1}</Text>
                  </View>
                  <View style={styles.solutionContent} >
                    <Text style={styles.solutionContentText}>{name}</Text>
                  </View>
                </View>
              ))}
          </View>
          <Text style= {styles.header}>VALUES</Text>
          <ScrollView horizontal = {true} contentContainerStyle = {styles.valueContainer}>
            {data.edges?.map((item, index) => (
              <View style={styles.valueBox} key={index}>
                <View style={styles.valueIndex}>
                  <Text style={styles.solutionIndexText}>{item[0] + item[1]}</Text>
                </View>
                <View style={styles.valueContent}>
                  <Text style={styles.valueContentText}>{Math.round((edgesValues[item.join('')] + Number.EPSILON) * 100) / 100}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
          <View style = {{marginBottom: 50}}/>
        </ScrollView> 
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
    flex: 1,
    backgroundColor: '#FF0000',
    width: '100%',
    alignItems: 'center', 
    justifyContent: 'flex-end', 
    display: 'flex',
    flexDirection: 'column',
  },
  contentView: {
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'transparent', 
  },
  scrollView: {
    alignItems: 'center',
    justifyContent: 'center',

  },
  sheetContainer: {
    backgroundColor: '#219ebc',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 20,
    alignItems: 'center', 
  },
  dragbarContainer: {
    width: '100%',
    height: '50%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'flex-start',
    paddingTop: 20,
    alignItems: 'center',
    position: 'absolute',
    elevation: 2,
    shadowColor: "transparent",
    zIndex: 2,
  },
  dragBar: {
    width: '50%',
    height: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  header: {
    color: "white",
    position: "relative",
    top: 40,
    fontSize: 30,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  solutionContainer: {
    display: 'flex',
    position: 'relative',
    top: 60,
    marginBottom: 30,
  },
  solutionRow: {
    display: 'flex',
    flexDirection: "row",
    backgroundColor: "pink",  
    marginBottom: 10,
    borderRadius: 15,
    width: "90%",
  },
  solutionContent:{
    color: 'white',
    alignItems: 'center',
    flex:6, 
    backgroundColor: 'pink',
    padding: 10,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
  },
  solutionContentText: {

  },
  solutionIndex:{
    color: "black",
    backgroundColor: 'white',
    padding: 10,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 15,
    borderTopLeftRadius: 15
  },
  solutionIndexText: {
    fontSize: 25
  },
  valueContainer: {
    flexDirection: "row",
    marginBottom: 0,
    minWidth: "100%",
    marginTop: 50,
    marginLeft: 20,
    marginRight: 20,
  },
  valueBox: {
    display: 'flex',
    flexDirection: "row",
    backgroundColor: "darkseagreen",  
    marginBottom: 10,
    borderRadius: 15,
    width: 140,
    height: 80,
    marginRight: 15,
  },
  valueIndex: {
    color: "black",
    backgroundColor: 'white',
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 15,
    borderTopLeftRadius: 15,
  },
  valueContent: {
    color: 'white',
    alignItems: 'center',
    flex:1, 
    backgroundColor: 'greenyellow',
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    justifyContent: "center",
  },
  valueContentText: {
    fontSize: 25
  }

});


export default BottomSheet;
