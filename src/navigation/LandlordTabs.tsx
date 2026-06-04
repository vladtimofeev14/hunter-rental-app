import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../styles/globalStyles";
import LandlordDashboardScreen from "../features/landlord/LandlordDashboardScreen";
import BookingScreen from "../features/landlord/BookingScreen";

const Tab = createBottomTabNavigator();

export default function LandlordTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,

        tabBarActiveTintColor: colors.primaryBlue,
        tabBarInactiveTintColor: colors.textSecondary,

        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 65 + insets.bottom,
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

            case "BookingScreen":
              iconName = "calendar-outline";
              break;

            default:
              iconName = "ellipse-outline";
          }

          return <Ionicons name={iconName} size={21} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={LandlordDashboardScreen} />
      <Tab.Screen name="BookingScreen" component={BookingScreen} />
    </Tab.Navigator>
  );
}
