import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import CameraPage from "./pages/CameraPage"

import ResizableCenteredView from "./resizableView"

export default function App() {
  return (
    <View style={styles.container}>
      <CameraPage/>
    </View>
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
