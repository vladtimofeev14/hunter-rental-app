import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import OnboardingScreen from "../features/auth/OnboardingScreen";
import LoginScreen from "../features/auth/LoginScreen";
import SignupScreen from "../features/auth/SignupScreen";
import UserProfileScreen from "../features/auth/UserProfileScreen";
import RenterDashboard from "../features/renter/RenterDashboardScreen";
import LandlordDashboard from "../features/landlord/LandlordDashboardScreen"
import LandlordAddListingScreen from "../features/landlord/LandlordAddListingScreen";
import LandlordProfileScreen from "../features/landlord/LandlordProfileScreen";
import RenterProfileScreen from "../features/renter/RenterProfileScreen";
import SearchScreen from "../features/SearchScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      <Stack.Screen name="RenterDashboard" component={RenterDashboard} />
      <Stack.Screen name="LandlordDashboard" component={LandlordDashboard} />
      <Stack.Screen name="LandlordAddListingScreen" component={LandlordAddListingScreen} />
      <Stack.Screen name="LandlordProfileScreen" component={LandlordProfileScreen} />
      <Stack.Screen name="RenterProfileScreen" component={RenterProfileScreen} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
    </Stack.Navigator>
  );
}
