import 'react-native-gesture-handler';

/*
Dependecies
npm install @react-navigation/native
npm install @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context
npx expo install expo-symbols
npx expo install @react-native-async-storage/async-storage
npx expo install react-native-gesture-handler

Map
npx expo install react-native-map-clustering
npx expo install react-native-maps
npx expo install expo-location
npm install react-native-svg
npm install react-native-svg-transformer

API
npm install axios

Firebase
npm install firebase

Run Expo App
npx expo start
*/

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar style="auto" />
        <AppNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
