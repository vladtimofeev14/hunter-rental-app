import React from "react";
import { StyleSheet, Text, View } from "react-native";
import AppNavigationBar from "../components/AppNavigationBar";
import { colors, sizes } from "../styles/globalStyles";

type UserRole = "landlord" | "renter";

export default function SearchScreen({ navigation, route }: any) {
  const role: UserRole = route?.params?.role === "landlord" ? "landlord" : "renter";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search</Text>
      <Text style={styles.placeholder}>Search Screen Placeholder</Text>

      <AppNavigationBar
        activeTab="Search"
        navigation={navigation}
        role={role}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
    paddingTop: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: sizes.large,
    fontWeight: "700",
    marginBottom: 12,
  },
  placeholder: {
    color: colors.textSecondary,
  },
});
