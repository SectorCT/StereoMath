import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import Camera from "./pages/CameraPage"
import GraphicScreen from "./pages/GraphicScreen"

export default function App() {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <GraphicScreen />
      </View>
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
