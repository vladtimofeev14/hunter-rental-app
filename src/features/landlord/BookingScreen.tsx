// This is a place holder. It just has a button to navigative to renter - BookingsListScreen
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookingScreen({ route, navigation }: any) {
  const listingId = route?.params?.listingId;

  return (
    <SafeAreaView style={styles.container}>          
      <View style={styles.card}>
        <Text style={styles.title}>Booking Screen</Text>

        <Text style={styles.meta}>Listing ID:</Text>
        <Text style={styles.id}>{listingId}</Text>

        <Text style={styles.note}>
          (Booking logic will be added later)
        </Text>

        {/* BUTTON */}
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate("BookingsListScreen")}
        >
          <Text style={styles.buttonText}>
            View My Bookings
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
  },

  meta: {
    marginTop: 12,
    color: "#6B7280",
  },

  id: {
    marginTop: 6,
    fontWeight: "600",
  },

  note: {
    marginTop: 20,
    fontSize: 12,
    color: "#9CA3AF",
  },

  button: {
    marginTop: 25,
    backgroundColor: "#111827",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
});