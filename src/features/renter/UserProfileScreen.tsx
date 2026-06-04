import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../../config/firebase";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { deleteUser, signOut } from "firebase/auth";
import { colors } from "../../styles/globalStyles";

export default function UserProfileScreen({ navigation }: any) {
  const [prefs, setPrefs] = useState<any>(null);
  const user = auth.currentUser;

  useEffect(() => {
    const load = async () => {
      if (!user) return;

      try {
        const snap = await getDoc(doc(db, "users", user.uid));

        setPrefs(
          snap.exists() ? snap.data()?.renterPreferences ?? null : null
        );
      } catch (e) {
        console.log("Profile load error:", e);
      }
    };

    load();
  }, [user]);

  const logout = async () => {
    try {
      await signOut(auth);

      // 🔥 critical fix: reset navigation after logout
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (e) {
      console.log("Logout error:", e);
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      "Delete account",
      "This action is permanent. Do you really want to delete your account?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Continue", style: "destructive", onPress: secondConfirmDelete },
      ]
    );
  };

  const secondConfirmDelete = () => {
    Alert.alert(
      "Final confirmation",
      "This cannot be undone. Delete everything?",
      [
        { text: "No", style: "cancel" },
        { text: "Yes, delete", style: "destructive", onPress: deleteAccount },
      ]
    );
  };

  const deleteAccount = async () => {
    if (!user) return;

    try {
      await deleteDoc(doc(db, "users", user.uid));
      await deleteUser(user);

      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (e) {
      console.log("Delete error:", e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        <View style={styles.header}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={22} color="#fff" />
          </View>

          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>Account & preferences</Text>
        </View>

        <View style={styles.card}>
          {!prefs ? (
            <Text style={styles.empty}>No preferences set</Text>
          ) : (
            <>
              <Text style={styles.item}>Budget: ${prefs.budget}</Text>
              <Text style={styles.item}>Campus: {prefs.campus}</Text>
              <Text style={styles.item}>
                Lease: {prefs.leaseDuration} months
              </Text>
              <Text style={styles.item}>
                Housing: {prefs.housingType}
              </Text>
              <Text style={styles.item}>
                Furnished: {prefs.furnished ? "Yes" : "No"}
              </Text>
              <Text style={styles.item}>
                Distance: {prefs.maxDistanceKm} km
              </Text>
            </>
          )}
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("RenterPreferencesScreen")}
        >
          <Text style={styles.primaryText}>Edit Preferences</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={logout}>
          <Text style={styles.secondaryText}>Log out</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={confirmDelete}>
          <Text style={styles.deleteText}>Delete account</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },

  header: {
    alignItems: "center",
    marginBottom: 24,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.deepPurple,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  title: { fontSize: 22, fontWeight: "800" },

  subtitle: { fontSize: 13, color: "#6B7280" },

  card: {
    backgroundColor: "#F3F4F6",
    padding: 14,
    borderRadius: 14,
    marginBottom: 20,
  },

  item: { fontSize: 14, marginBottom: 6 },

  empty: { textAlign: "center", color: "#9CA3AF" },

  primaryButton: {
    backgroundColor: colors.deepPurple,
    padding: 16,
    borderRadius: 999,
    alignItems: "center",
    marginBottom: 10,
  },

  primaryText: { color: "#fff", fontWeight: "700" },

  secondaryButton: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 14,
    borderRadius: 999,
    alignItems: "center",
    marginBottom: 10,
  },

  secondaryText: { fontWeight: "700" },

  deleteButton: {
    padding: 14,
    alignItems: "center",
  },

  deleteText: { color: "red", fontWeight: "700" },
});