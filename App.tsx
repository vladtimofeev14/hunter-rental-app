/*
Dependecies
npm install @react-navigation/native
npm install @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context
npx expo install @expo/vector-icons
npx expo install @react-native-async-storage/async-storage

API
npm install axios

Firebase
npm install firebase

Run Expo App
npx expo start
*/

import React from "react";
// @ts-ignore: suppress missing module type declarations in this environment
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <AppNavigator />
    </NavigationContainer>
  );
}
