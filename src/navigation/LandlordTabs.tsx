import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SymbolView, type SFSymbol } from "expo-symbols";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../styles/globalStyles";
import LandlordDashboardScreen from "../features/landlord/LandlordDashboardScreen";

const Tab = createBottomTabNavigator();

const tabIcons: Record<string, { active: SFSymbol; inactive: SFSymbol }> = {
  Home: { active: "house.fill", inactive: "house" },
};

export default function LandlordTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
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
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
        tabBarIcon: ({ color, focused }) => {
          const iconName = focused
            ? tabIcons[route.name]?.active
            : tabIcons[route.name]?.inactive;

          return (
            <SymbolView
              name={iconName || "circle"}
              size={22}
              tintColor={color}
              resizeMode="scaleAspectFit"
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={LandlordDashboardScreen} />
    </Tab.Navigator>
  );
}
