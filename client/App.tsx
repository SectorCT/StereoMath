import { StyleSheet, StatusBar, View } from 'react-native';
import React, { useState, useEffect} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    <StatusBar translucent backgroundColor="transparent" />
    <SafeAreaView edges={['right', 'bottom', 'left']} style={styles.container}>
      {isPublished ? <AppPublished appPublishedUrl={appPublishedUrl} /> :
      <>
        <NavigationContainer>
          <NavStack />
        </NavigationContainer>
      </>}
    </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
