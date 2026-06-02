import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "../styles/globalStyles";

import RenterDashboardScreen from "../features/renter/RenterDashboardScreen";
import SearchScreen from "../features/renter/SearchScreen";
import MapScreen from "../features/renter/MapScreen";
import SavedListingsScreen from "../features/renter/SavedListingsScreen";
import NotificationsScreen from "../features/renter/NotificationsScreen";

const Tab = createBottomTabNavigator();

export default function RenterTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,

        tabBarActiveTintColor: colors.primaryBlue,
        tabBarInactiveTintColor: colors.textSecondary,

        tabBarStyle: {
          height: 75 + insets.bottom,
          backgroundColor: "#FFFFFF",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          borderTopWidth: 0,
          paddingTop: 10,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 12,
          shadowColor: colors.black,
          shadowOpacity: 0.08,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: -3 },
          elevation: 10,
        },

        tabBarIcon: ({ color }) => {
          let iconName: any;

          switch (route.name) {
            case "Home":
              iconName = "home-outline";
              break;
            case "Search":
              iconName = "search-outline";
              break;
            case "Map":
              iconName = "map-outline";
              break;
            case "Saved":
              iconName = "heart-outline";
              break;
            case "Notifications":
              iconName = "notifications-outline";
              break;
            default:
              iconName = "ellipse-outline";
          }

          return <Ionicons name={iconName} size={21} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={RenterDashboardScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Saved" component={SavedListingsScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
    </Tab.Navigator>
  );
}