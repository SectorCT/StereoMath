import React, { useState } from 'react'
import { StyleSheet, Text,TextInput, View } from 'react-native';
import { Canvas } from '@react-three/fiber';

function MainModel() {
  return (
        <Canvas style = {styles.container} shadows >
            <ambientLight />
            <pointLight position={[10, 10, 10]} intensity = {2} />
            <mesh position={[0,0,0]}>
                <sphereGeometry />
                <meshStandardMaterial color="orange" />
            </mesh> 
        </Canvas>
  )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
    },
    header: {
        fontSize: 30,
    }
})

export default MainModel;
