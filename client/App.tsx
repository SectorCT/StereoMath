import { StyleSheet, StatusBar } from 'react-native';
import React, { useState, useEffect } from 'react';

import { NavigationContainer } from '@react-navigation/native';

import NavStack from "./components/Navigation";

import { LogBox } from 'react-native';

import AppPublished from './pages/AppPublished';

LogBox.ignoreLogs(['_RNGestureHandlerModule.default.flushOperations']);
console.error = () => { };
console.warn = () => { };

export default function App() {

  const [isPublished, setIsPublished] = useState(false);
  const [appPublishedUrl, setAppPublishedUrl] = useState('');

  useEffect(() => {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;
    fetch(`${API_URL}/isAppPublished`).then(res => res.json()).then(data => {
      setIsPublished(data.published);
      setAppPublishedUrl(data.URL);
      // setIsPublished(true);
    }).catch(err => {
      console.log("isAppPublished", err);
    });
  }, []);

  return (
    <>
      {isPublished ? <AppPublished appPublishedUrl={appPublishedUrl} /> :
      <>
        <StatusBar translucent backgroundColor="transparent" />
        <NavigationContainer>
          <NavStack />
        </NavigationContainer>
      </>}
    </>
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
