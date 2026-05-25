import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import OnboardingScreen from "../features/auth/OnboardingScreen";
import LoginScreen from "../features/auth/LoginScreen";
import SignupScreen from "../features/auth/SignupScreen";
import UserProfileScreen from "../features/auth/UserProfileScreen";
import RenterPreferencesScreen from "../features/renter/RenterPreferencesScreen";
import RenterDashboard from "../features/renter/RenterDashboardScreen";
import LandlordSetupScreen from "../features/landlord/LandlordSetupScreen";
import LandlordDashboard from "../features/landlord/LandlordDashboardScreen"

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      <Stack.Screen name="RenterPreferencesScreen" component={RenterPreferencesScreen} />
      <Stack.Screen name="LandlordSetupScreen" component={LandlordSetupScreen} />
      <Stack.Screen name="RenterDashboard" component={RenterDashboard} />
      <Stack.Screen name="LandlordDashboard" component={LandlordDashboard} />
    </Stack.Navigator>
  );
}