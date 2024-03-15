import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { StackNavigationProp } from "@react-navigation/stack";
import { NavStackParamList } from "../Navigation";

interface Props {
  navigation: StackNavigationProp<NavStackParamList, "GraphicScreen">;
  route: {};
}

function TextInputPage({ navigation, route }: Props) {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    console.log("TextInputPage: inputValue:", inputValue);
  }, [inputValue]);

  return (
    <>
      <View style={styles.main}>
        <Text style={styles.header}>Photo Stereo</Text>
        <TextInput 
          style={styles.input} 
          value={inputValue} 
          placeholder='Type your hardest stereometric math problem here...'
          onChangeText={(text) => {
            setInputValue(text);
          }} 
          multiline
          textAlignVertical='top'
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  main: {
    position: "relative",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 20,
  },
  input: {
    fontSize: 20,
    width: 300,
    height: 200,
    borderColor: 'gray',
    borderWidth: 1,
    textAlignVertical: 'top', // Adjust the text to start from the top
  }
});

export default TextInputPage;
