import React from "react";
import { StyleSheet, Text, View } from "react-native";
import AppNavigationBar from "../../components/AppNavigationBar";
import { colors, sizes } from "../../styles/globalStyles";

export default function LandlordProfileScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      <Text style={styles.placeholder}>Landlord Profile Screen Placeholder</Text>

      <AppNavigationBar
        activeTab="Profile"
        navigation={navigation}
        role="landlord"
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
