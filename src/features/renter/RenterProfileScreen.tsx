import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../../config/firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { deleteUser, signOut } from "firebase/auth";
import { colors, buttons } from "../../styles/globalStyles";
import { CAMPUSES } from "./data/campuses";

const InfoRow = ({ label, value }: { label: string; value: any }) => (
  <View style={styles.infoRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

export default function RenterProfileScreen({ navigation }: any) {
  const [prefs, setPrefs] = useState<any>(null);
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [editingName, setEditingName] = useState(false);

  const user = auth.currentUser;

  const campusLabel =
    CAMPUSES.find((c) => c.id === prefs?.campusId)?.name ?? "Not selected";

  useEffect(() => {
    const load = async () => {
      if (!user) return;

      const snap = await getDoc(doc(db, "users", user.uid));

      if (snap.exists()) {
        const data = snap.data();
        setPrefs(data?.renterPreferences || null);
        setName(data?.name || "User");
        setAvatarUrl(data?.avatarUrl || null);
      }
    };

    load();
  }, [user]);

  const updateUserField = async (field: string, value: any) => {
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid), { [field]: value });
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setAvatarUrl(uri);
      updateUserField("avatarUrl", uri);
    }
  };

  const saveName = async () => {
    setEditingName(false);
    await updateUserField("name", name);
  };

  const logout = async () => {
    await signOut(auth);
    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
  };

  const deleteAccount = async () => {
    if (!user) return;

    await deleteDoc(doc(db, "users", user.uid));
    await deleteUser(user);

    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={pickImage}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatarImg} />
            ) : (
              <View style={styles.avatar}>
                <Ionicons name="person" size={22} color="#fff" />
              </View>
            )}
          </TouchableOpacity>

          {editingName ? (
            <View style={styles.nameRow}>
              <TextInput value={name} onChangeText={setName} style={styles.input} />
              <TouchableOpacity onPress={saveName}>
                <Text style={styles.save}>Save</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => setEditingName(true)}>
              <Text style={styles.title}>{name}</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.subtitle}>Tap avatar or name to edit</Text>
        </View>

        {/* PREFERENCES */}
        <View style={styles.card}>
          {!prefs ? (
            <Text style={styles.empty}>No preferences set</Text>
          ) : (
            <>
              <InfoRow label="Budget" value={`$${prefs.budget ?? "Not set"}`} />
              <InfoRow label="Campus" value={campusLabel} />
              <InfoRow label="Property Type" value={prefs.propertyType ?? "Any"} />
              <InfoRow label="Lease Length" value={prefs.leaseLength ?? "Any"} />
              <InfoRow label="Housing Type" value={prefs.housingType ?? "Any"} />
              <InfoRow label="Max Distance" value={`${prefs.maxDistanceKm ?? 0} km`} />
              <InfoRow
                label="Lifestyle"
                value={
                  prefs.lifestylePreferences?.length
                    ? prefs.lifestylePreferences.join(", ")
                    : "None selected"
                }
              />
            </>
          )}
        </View>

        {/* ACTIONS */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={buttons.primary}
            onPress={() => navigation.navigate("RenterPreferencesScreen")}
          >
            <Text style={buttons.primaryText}>Edit Preferences</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[buttons.secondary, styles.actionSpacing]}
            onPress={() => navigation.navigate("UserGuideScreen")}
          >
            <Text style={buttons.secondaryText}>User Guide</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[buttons.secondary, styles.actionSpacing]}
            onPress={logout}
          >
            <Text style={buttons.secondaryText}>Log out</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={deleteAccount}
          >
            <Text style={styles.deleteText}>Delete account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },

  content: {
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

  avatarImg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: "800"
  },

  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    minWidth: 120,
    textAlign: "center",
  },

  save: {
    color: colors.deepPurple,
    fontWeight: "700",
  },

  card: {
    backgroundColor: "#F3F4F6",
    padding: 14,
    borderRadius: 14,
    marginBottom: 20,
  },

  infoRow: {
    marginBottom: 12,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },

  value: {
    fontSize: 14,
    color: "#4B5563",
  },

  empty: {
    textAlign: "center",
    color: "#9CA3AF"
  },

  actions: {
    marginTop: 10,
  },

  actionSpacing: {
    marginTop: 12,
  },

  deleteButton: {
    padding: 14,
    alignItems: "center",
  },

  deleteText: {
    color: "red",
    fontWeight: "700",
  },
});