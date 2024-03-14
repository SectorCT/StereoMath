import React, { useState } from 'react'
import { StyleSheet, Text,TextInput, View } from 'react-native';

function MainModel() {
  return (
    <View style = {styles.container}>
        <Text style={styles.header}>Photo Stereo</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ff0000',
        alignItems: 'center',
        justifyContent: 'center',
        width: "100%",
    },
    header: {
        fontSize: 30,
    }
})

export default MainModel;