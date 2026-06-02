import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { signOut } from "firebase/auth";
import AppNavigationBar from "../../components/AppNavigationBar";
import { auth } from "../../config/firebase";
import { REMEMBER_ME_KEY } from "../../config/storageKeys";
import { colors, sizes } from "../../styles/globalStyles";

export default function LandlordProfileScreen({ navigation }: any) {
  const handleLogout = () => {
    Alert.alert(
      "Are you sure you want to log out?",
      "",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Log out",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem(REMEMBER_ME_KEY);
            await signOut(auth);
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={28} color={colors.primaryBlue} />
      </TouchableOpacity>

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
  logoutButton: {
    position: "absolute",
    top: 56,
    right: 20,
    padding: 8,
  },
});
