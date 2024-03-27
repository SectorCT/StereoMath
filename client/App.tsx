import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

import { NavigationContainer } from '@react-navigation/native';

import NavStack from "./components/Navigation"


import { LogBox } from 'react-native';

LogBox.ignoreLogs(['_RNGestureHandlerModule.default.flushOperations']); 
console.error= ()=>{};
console.warn = ()=>{};

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
