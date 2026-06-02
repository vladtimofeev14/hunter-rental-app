import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../styles/globalStyles";

type UserRole = "landlord" | "renter";
type ActiveTab = "Search" | "Dashboard" | "Profile";
type IconName = keyof typeof Ionicons.glyphMap;

interface NavigationItem {
  label: ActiveTab;
  routeName: string;
  icon: IconName;
}

interface AppNavigationBarProps {
  activeTab: ActiveTab;
  navigation: any;
  role: UserRole;
}

const landlordItems: NavigationItem[] = [
  { label: "Search", routeName: "SearchScreen", icon: "search" },
  { label: "Dashboard", routeName: "LandlordDashboard", icon: "home" },
  { label: "Profile", routeName: "LandlordProfileScreen", icon: "person" },
];

const renterItems: NavigationItem[] = [
  { label: "Search", routeName: "SearchScreen", icon: "search" },
  { label: "Dashboard", routeName: "RenterDashboard", icon: "home" },
  { label: "Profile", routeName: "RenterProfileScreen", icon: "person" },
];

export default function AppNavigationBar({
  activeTab,
  navigation,
  role,
}: AppNavigationBarProps) {
  const items = role === "landlord" ? landlordItems : renterItems;

  return (
    <View style={styles.container}>
      {items.map((item) => {
        const isActive = activeTab === item.label;

        return (
          <TouchableOpacity
            key={item.routeName}
            style={styles.item}
            onPress={() => {
              if (item.routeName === "SearchScreen") {
                navigation.navigate(item.routeName, { role });
                return;
              }

              navigation.navigate(item.routeName);
            }}
          >
            <Ionicons
              name={item.icon}
              size={24}
              color={isActive ? colors.primaryBlue : colors.textSecondary}
            />
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: colors.white,
    paddingTop: 10,
    paddingBottom: 24,
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
  activeLabel: {
    color: colors.primaryBlue,
  },
});
