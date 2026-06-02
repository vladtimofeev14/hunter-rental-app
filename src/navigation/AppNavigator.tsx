import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

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
import { auth, db } from "../config/firebase";
import { REMEMBER_ME_KEY } from "../config/storageKeys";
import { colors } from "../styles/globalStyles";

const Stack = createNativeStackNavigator();
type UserRole = "landlord" | "renter";
type InitialRouteName = "Onboarding" | "SearchScreen";

export default function AppNavigator() {
  const [checkingRememberedUser, setCheckingRememberedUser] = useState(true);
  const [initialRouteName, setInitialRouteName] =
    useState<InitialRouteName>("Onboarding");
  const [initialSearchRole, setInitialSearchRole] =
    useState<UserRole>("renter");

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        const rememberMe = await AsyncStorage.getItem(REMEMBER_ME_KEY);

        if (rememberMe === "true" && user) {
          const userSnap = await getDoc(doc(db, "users", user.uid));
          const role = userSnap.exists() ? userSnap.data()?.role : null;

          if (role === "renter" || role === "landlord") {
            if (!isMounted) {
              return;
            }

            setInitialSearchRole(role);
            setInitialRouteName("SearchScreen");
          }
        }
      } catch {
        if (isMounted) {
          setInitialRouteName("Onboarding");
        }
      } finally {
        if (isMounted) {
          setCheckingRememberedUser(false);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  if (checkingRememberedUser) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primaryBlue} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      <Stack.Screen name="RenterDashboard" component={RenterDashboard} />
      <Stack.Screen name="LandlordDashboard" component={LandlordDashboard} />
      <Stack.Screen name="LandlordAddListingScreen" component={LandlordAddListingScreen} />
      <Stack.Screen name="LandlordProfileScreen" component={LandlordProfileScreen} />
      <Stack.Screen name="RenterProfileScreen" component={RenterProfileScreen} />
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        initialParams={{ role: initialSearchRole }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
});
