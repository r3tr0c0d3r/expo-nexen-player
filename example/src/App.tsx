import * as React from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import Font, { useFonts } from 'expo-font';
import {
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';
import Player from './Player';

export default function App() {
  

  return (
    <SafeAreaProvider style={styles.container}>
      <View style={styles.topBar}/>
      <Player />
      <View style={styles.bottomBar}/>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  player: {
    width: '100%',
    height: 260,
    // marginVertical: 5,
  },
  topBar: {
    width: '100%',
    height: 50,
    backgroundColor: '#fafafa',
  },
  bottomBar: {
    width: '100%',
    height: 50,
    backgroundColor: '#fafafa',
  },
  buttonContainer: {
    padding: 10,
    // backgroundColor: 'pink',
    zIndex: 1,
  },
});
