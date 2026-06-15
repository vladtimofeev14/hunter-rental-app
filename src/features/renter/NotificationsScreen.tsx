import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Swipeable } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";
import { auth, db } from "../../config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { colors } from "../../styles/globalStyles";
import { formatDateTime, toDate } from "../chat/chatHelpers";

export default function NotificationsScreen({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);

  const user = auth.currentUser;

  const load = useCallback(async () => {
    if (!user) return;

    setLoading(true);

    try {
      const q = query(
        collection(db, "bookings"),
        where("renterID", "==", user.uid)
      );

      const snap = await getDocs(q);

      const data = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a: any, b: any) => {
          const aTime =
            toDate(a.updatedAt)?.getTime() ||
            toDate(a.createdAt)?.getTime() ||
            toDate(a.scheduledAt)?.getTime() ||
            0;

          const bTime =
            toDate(b.updatedAt)?.getTime() ||
            toDate(b.createdAt)?.getTime() ||
            toDate(b.scheduledAt)?.getTime() ||
            0;

          return bTime - aTime;
        });

      setNotifications(data);
    } catch (e) {
      console.log("Notifications error:", e);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const dismiss = (id: string) => {
    setDismissed((prev) => [...prev, id]);
  };

  const visible = notifications.filter(
    (n) => !dismissed.includes(n.id)
  );

  const getMessage = (status: string) => {
    switch (status) {
      case "pending":
        return "Viewing request submitted";
      case "accepted":
        return "Viewing accepted";
      case "rejected":
        return "Viewing rejected";
      case "completed":
        return "Viewing completed";
      default:
        return "Booking update";
    }
  };

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

      {visible.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No notifications</Text>
        </View>
      ) : (
        <FlatList
          data={visible}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 120 }}
          renderItem={({ item }) => (
            <Swipeable
              renderRightActions={() => (
                <Pressable
                  onPress={() => dismiss(item.id)}
                  style={styles.deleteAction}
                >
                  <Text style={styles.deleteText}>Dismiss</Text>
                </Pressable>
              )}
            >
              <Pressable
                onPress={() =>
                  navigation.navigate("BookingDetailsScreen", {
                    bookingId: item.id,
                  })
                }
                style={styles.card}
              >
                <View style={styles.row}>
                  <Text style={styles.name}>
                    {item.listingTitle || item.listingName || "Property"}
                  </Text>

                  <Text style={styles.status}>
                    {item.status}
                  </Text>
                </View>

                <Text style={styles.message}>
                  {getMessage(item.status)}
                </Text>

                <Text style={styles.meta}>
                  {item.listingAddress || "Address unavailable"}
                </Text>

                <Text style={styles.time}>
                  {formatDateTime(item.scheduledAt)}
                </Text>
              </Pressable>
            </Swipeable>
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

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  name: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.black,
  },

  status: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primaryBlue,
    textTransform: "capitalize",
  },

  message: {
    marginTop: 6,
    fontSize: 13,
    color: "#4B5563",
  },

  meta: {
    marginTop: 6,
    fontSize: 12,
    color: colors.textSecondary,
  },

  time: {
    marginTop: 6,
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

  deleteAction: {
    backgroundColor: "red",
    justifyContent: "center",
    padding: 20,
    borderRadius: 14,
    marginBottom: 10,
  },

  deleteText: {
    color: "white",
    fontWeight: "700",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});