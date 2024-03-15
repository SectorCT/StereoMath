import React, { useState } from 'react'
import { StyleSheet, Text,TextInput, View } from 'react-native';

import { StackNavigationProp } from "@react-navigation/stack";
import { NavStackParamList } from "../Navigation";

interface Props {
  navigation: StackNavigationProp<NavStackParamList, "GraphicScreen">;
  route: { };
}
function TextInputPage({navigation, route} : Props) {
    const [inputValue, onChangeValue] = useState('');
  return (
    <>
    <View style={styles.main}>
        <Text style={styles.header}>Photo Stereo</Text> 
        <TextInput value={inputValue} placeholder='Type your hardest stereometric math problem here...'
         onChangeText={onChangeValue}/>
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
    }
});

export default TextInputPage;