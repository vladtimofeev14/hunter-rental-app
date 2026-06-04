import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../../config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { colors } from "../../styles/globalStyles";

export default function BookingsListScreen() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const q = query(
          collection(db, "bookings"),
          where("userId", "==", user.uid)
        );

        const snap = await getDocs(q);

        setBookings(
          snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        );
      } catch (e) {
        console.log("Bookings error:", e);
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
      <Text style={styles.title}>Upcoming viewings</Text>

      {bookings.length === 0 ? (
        <View style={styles.card}>
          <Text style={styles.empty}>No bookings yet</Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 120 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.image} />
              ) : null}

              <Text style={styles.name}>{item.title}</Text>

              <Text style={styles.sub}>
                {item.date} • {item.time}
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
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },

  image: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },

  name: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.black,
  },

  sub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },

  empty: {
    color: colors.textSecondary,
    textAlign: "center",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});