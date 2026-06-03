import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnboardingScreen from "../features/auth/OnboardingScreen";
import LoginScreen from "../features/auth/LoginScreen";
import SignupScreen from "../features/auth/SignupScreen";
import UserProfileScreen from "../features/renter/UserProfileScreen";
import RenterPreferencesScreen from "../features/renter/RenterPreferencesScreen";
import RenterTabs from "./RenterTabs";
import LandlordSetupScreen from "../features/landlord/LandlordSetupScreen";
import LandlordDashboard from "../features/landlord/LandlordDashboardScreen";
import MapScreen from "../features/renter/MapScreen";
import PropertyDetailsScreen from "../features/landlord/PropertyDetailsScreen";
import BookingScreen from "../features/renter/BookingScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

      {/* AUTH */}
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />

      {/* RENTER FLOW */}
      <Stack.Screen name="RenterPreferencesScreen" component={RenterPreferencesScreen} />
      <Stack.Screen name="RenterTabs" component={RenterTabs} />
      <Stack.Screen name="MapScreen" component={MapScreen} />
      <Stack.Screen name="BookingScreen" component={BookingScreen} />

      {/* LANDLORD */}
      <Stack.Screen name="LandlordSetupScreen" component={LandlordSetupScreen} />
      <Stack.Screen name="LandlordDashboard" component={LandlordDashboard} />
      <Stack.Screen name="PropertyDetailsScreen" component={PropertyDetailsScreen} />

    </Stack.Navigator>
  );
}