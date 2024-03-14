import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Canvas } from '@react-three/fiber';

function MainModel() {
  return (
    <Canvas style={styles.container} >
      <SceneContent />
    </Canvas>
  );
}

function SceneContent() {
  return (
    <>
      <ambientLight />
      <pointLight position={[10, 10, 10]} intensity={2} />
      <mesh position={[0, 0, 0]} rotation={[(Math.PI / 4), 0, 0]}>
        <boxGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    fontSize: 30,
  },
});

export default MainModel;
