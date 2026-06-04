import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// AUTH
import OnboardingScreen from "../features/auth/OnboardingScreen";
import LoginScreen from "../features/auth/LoginScreen";
import SignupScreen from "../features/auth/SignupScreen";

// RENTER
import UserProfileScreen from "../features/renter/UserProfileScreen";
import RenterPreferencesScreen from "../features/renter/RenterPreferencesScreen";
import RenterTabs from "./RenterTabs";
import MapScreen from "../features/renter/MapScreen";
import SavedListingsScreen from "../features/renter/SavedListingsScreen";
import ApplicationsScreen from "../features/renter/ApplicationsScreen";
import NotificationsScreen from "../features/renter/NotificationsScreen";
import BookingsListScreen from "../features/renter/BookingsListScreen"; 

// LANDLORD
import LandlordSetupScreen from "../features/landlord/LandlordSetupScreen";
import LandlordDashboardScreen from "../features/landlord/LandlordDashboardScreen";
import PropertyDetailsScreen from "../features/landlord/PropertyDetailsScreen";
import BookingScreen from "../features/landlord/BookingScreen";

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
      <Stack.Screen name="SavedListingsScreen" component={SavedListingsScreen} />
      <Stack.Screen name="ApplicationsScreen" component={ApplicationsScreen} />
      <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />

      {/* LANDLORD & BOOKINGS */}
      <Stack.Screen name="LandlordSetupScreen" component={LandlordSetupScreen} />
      <Stack.Screen name="LandlordDashboardScreen" component={LandlordDashboardScreen} />
      <Stack.Screen name="PropertyDetailsScreen" component={PropertyDetailsScreen} />
      <Stack.Screen name="BookingsListScreen" component={BookingsListScreen} />
      <Stack.Screen name="BookingScreen" component={BookingScreen} />

    </Stack.Navigator>
  );
}