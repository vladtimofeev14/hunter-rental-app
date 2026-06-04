import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../../config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { colors } from "../../styles/globalStyles";

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "notifications"),
          where("userId", "==", user.uid)
        );

        const snap = await getDocs(q);

        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        setNotifications(data);
      } catch (e) {
        console.log("Notifications load error:", e);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={colors.primaryBlue} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Notifications</Text>

      {notifications.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            No notifications yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 120 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>
                {item.title}
              </Text>

              <Text style={styles.message}>
                {item.message}
              </Text>

              <Text style={styles.type}>
                {item.type || "info"}
              </Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
    paddingHorizontal: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    marginTop: 10,
    marginBottom: 10,
    color: colors.black,
  },

  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },

  name: {
    fontSize: 14,
    fontWeight: "700",
  },

  message: {
    marginTop: 6,
    fontSize: 12,
    color: "#6B7280",
  },

  type: {
    marginTop: 8,
    fontSize: 11,
    color: "#9CA3AF",
  },

  emptyCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
  },

  emptyText: {
    textAlign: "center",
    color: "#6B7280",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});