import * as React from 'react';
import { StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import Font, { useFonts } from 'expo-font';
import {
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SingleScreen from './SingleScreen';
import FlatlistScreen from './FlatlistScreen';
import { IconFlatList, IconScrollView, IconSingle } from '../assets/icons';
import ScrollViewScreen from './ScrollViewScreen';

export default function App() {
  const Tab = createBottomTabNavigator();

  return (
    <SafeAreaProvider style={styles.container}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              if (route.name === 'Single') {
                return <IconSingle size={size} color={color} />;
              } else if (route.name === 'ScrollView') {
                return <IconScrollView size={size} color={color} />;
              } else {
                return <IconFlatList size={size} color={color} />;
              }
            },
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'gray',
          })}
        >
          <Tab.Screen name="Single" component={SingleScreen} />
          <Tab.Screen name="ScrollView" component={ScrollViewScreen} />
          <Tab.Screen
            name="FlatList"
            component={FlatlistScreen}
            options={{ headerShown: false }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#414141',
  },
  player: {
    width: '100%',
    height: 260,
  },
  topBar: {
    width: '100%',
    height: 50,
    backgroundColor: '#212121',
  },
  bottomBar: {
    width: '100%',
    height: 50,
    backgroundColor: '#212121',
  },
  buttonContainer: {
    padding: 10,
    zIndex: 1,
  },
});
