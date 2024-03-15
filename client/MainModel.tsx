import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, PanResponder, View, Dimensions } from 'react-native';
import { Canvas, Euler, Vector3, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

// vertex type
type Vertex = {
  x: number,
  y: number,
  z: number,
}

// Create a component for handling the camera
function CameraController({ position }: { position: [number, number, number] }) {
  const { camera } = useThree();
  console.log("camera", camera);
  useEffect(() => {
    camera.position.set(...position);
    camera.lookAt(0, 0, 0);
  }, [position]); // Update when position changes

  return null; // This component does not render anything itself
}

function MainModel() {
  const position = [0, 0, 5] as [number, number, number];
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 0, 5]);

  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,  // Ensure it responds to single finger
    onPanResponderMove: async (event, gestureState) => {
      // Adjust sensitivity if needed
      const sensitivity = 0.001;

      // Calculate new position
      const newX = position[0] - gestureState.dx * sensitivity;
      const newY = position[1] + gestureState.dy * sensitivity;

      position[0] = newX;
      position[1] = 5;
      position[2] = newY;
      console.log("position", position);
      await setCameraPosition([...position]);
    }
  })).current;

  useEffect(() => {
    console.log("cameraPosition", cameraPosition);
  }, [cameraPosition]);

  return (
    <View {...panResponder.panHandlers} style={{ height: Dimensions.get("screen").height, width: Dimensions.get("screen").width }}>
      <Canvas style={styles.container}>
        <SceneContent />
        <CameraController position={cameraPosition} />
      </Canvas>
    </View>
  );
}

function SceneContent() {
  return (
    <>
      <ambientLight />
      <pointLight position={[10, 10, 10]} intensity={2} />
      <mesh position={[0,0,0]}>
        <boxGeometry />
        <meshBasicMaterial color="black" />
      </mesh>
      {/* {drawVertex({ x: 0, y: 0, z: 0 })}
      {drawVertex({ x: 1, y: 1, z: 1 })}
      {connectVertices({ x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 })} */}

    </>
  );
}

function calculate3DDistance(vertex1: Vertex, vertex2: Vertex): number {
  let xDistance = vertex2.x - vertex1.x;
  let yDistance = vertex2.y - vertex1.y;
  let zDistance = vertex2.z - vertex1.z;

  return Math.sqrt(xDistance * xDistance + yDistance * yDistance + zDistance * zDistance);
}

function connectVertices(vertex1: Vertex, vertex2: Vertex) {
  let lineLength = calculate3DDistance(vertex1, vertex2);
  let linePosition = [(vertex1.x + vertex2.x) / 2, (vertex1.y + vertex2.y) / 2, (vertex1.z + vertex2.z) / 2] as Vector3;

  let deltaX = vertex2.x - vertex1.x;
  let deltaY = vertex2.y - vertex1.y;
  let deltaZ = vertex2.z - vertex1.z;

  // Adjusting the rotation calculations
  let yaw = Math.atan2(deltaX, deltaZ);  // Rotate around Y-axis
  let pitch = Math.atan2(Math.sqrt(deltaX * deltaX + deltaZ * deltaZ), deltaY); // Rotate around X-axis

  // Since we don't use roll, it's set to 0
  let lineRotation = [-pitch, -yaw, 0] as Euler; // Rotation in radians

  return (
    <mesh position={linePosition} rotation={lineRotation}>
      <boxGeometry args={[lineLength, 0.05, 0.05]} />
      <meshBasicMaterial color="black" />
    </mesh>
  );
}

function drawVertex(vertex: Vertex) {
  return (
    <mesh position={[vertex.x, vertex.y, vertex.z]}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial color="black" />
    </mesh>
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