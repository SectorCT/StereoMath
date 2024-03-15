import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

import { NavigationContainer } from '@react-navigation/native';

import NavStack from "./Navigation"


console.warn = () => {};
console.error = () => {};

// Use ErrorBoundary in your App component
export default function App() {
  return (
      <NavigationContainer>
        <NavStack />
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
