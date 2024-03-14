import React, { useState } from 'react'
import { StyleSheet, Text,TextInput, View } from 'react-native';
import { Canvas } from '@react-three/fiber';

function MainModel() {
  return (
    <View style = {styles.container}>
        <Canvas>
            <mesh>
                <sphereGeometry />
                <meshStandardMaterial color="orange" />
                <ambientLight />
            </mesh> 
        </Canvas>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        width: "100%",
    },
    header: {
        fontSize: 30,
    }
})

export default MainModel;