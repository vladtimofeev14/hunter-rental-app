import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SymbolView } from "expo-symbols";
import { auth, db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { colors } from "../../styles/globalStyles";

export default function RenterProfileScreen({ navigation }: any) {
  const [prefs, setPrefs] = useState<any>(null);
  const user = auth.currentUser;

  useEffect(() => {
    const load = async () => {
      if (!user) return;

      const snap = await getDoc(doc(db, "users", user.uid));

      if (snap.exists()) {
        setPrefs(snap.data()?.renterPreferences || null);
      }
    };

    load();
  }, []);

  const logout = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Log out",
        style: "destructive",
        onPress: async () => {
          await auth.signOut();
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>‹</Text>
      </Pressable>

      <ScrollView contentContainerStyle={styles.content}>

        <View style={styles.header}>
          <View style={styles.avatar}>
            <SymbolView name="person" size={22} tintColor="#fff" />
          </View>

          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>Your renter settings</Text>
        </View>

        {/* PREF SUMMARY */}
        <View style={styles.card}>
          {!prefs ? (
            <Text style={styles.empty}>No preferences found</Text>
          ) : (
            <>
              <Text style={styles.item}>Budget: ${prefs.budget}</Text>
              <Text style={styles.item}>Campus: {prefs.campus}</Text>
              <Text style={styles.item}>Lease: {prefs.leaseDuration} months</Text>
              <Text style={styles.item}>Housing: {prefs.housingType}</Text>
              <Text style={styles.item}>
                Furnished: {prefs.furnished ? "Yes" : "No"}
              </Text>
            </>
          )}
        </View>

        {/* EDIT BUTTON */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("RenterPreferencesScreen")}
        >
          <Text style={styles.primaryText}>Edit Preferences</Text>
        </TouchableOpacity>

        {/* LOGOUT */}
        <TouchableOpacity style={styles.secondaryButton} onPress={logout}>
          <Text style={styles.secondaryText}>Log out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  backButton: {
    position: "absolute",
    top: 52,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },

  backButtonText: {
    fontSize: 32,
    lineHeight: 34,
    color: "#111827",
  },

  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },

  header: {
    alignItems: "center",
    marginBottom: 30,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.deepPurple,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
  },

  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },

  card: {
    backgroundColor: "#F3F4F6",
    padding: 16,
    borderRadius: 14,
    marginBottom: 20,
  },

  item: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 6,
  },

  empty: {
    fontSize: 13,
    color: "#9CA3AF",
    textAlign: "center",
  },

  primaryButton: {
    backgroundColor: colors.deepPurple,
    paddingVertical: 18,
    borderRadius: 999,
    alignItems: "center",
    marginBottom: 12,
  },

  primaryText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  secondaryButton: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: "center",
  },

  secondaryText: {
    color: "#111827",
    fontWeight: "700",
  },
});
