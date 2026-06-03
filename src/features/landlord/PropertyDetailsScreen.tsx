// PropertyDetailsPlaceholder.tsx
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PropertyDetailsScreen({ route, navigation }: any) {
  const listing = route?.params?.listing;

  if (!listing) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Missing listing data</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{listing.name}</Text>
        <Text style={styles.meta}>{listing.city}</Text>
        <Text style={styles.price}>
          ${listing.price?.amount}/{listing.price?.period}
        </Text>

        <Text style={styles.meta}>
          {listing.bedrooms} bed · {listing.bathrooms} bath
        </Text>

        {/* BOOK BUTTON */}
        <Pressable
          style={styles.button}
          onPress={() =>
            navigation.navigate("BookingScreen", {
              listingId: listing.id,
            })
          }
        >
          <Text style={styles.buttonText}>Book Viewing</Text>
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
    marginTop: 6,
    color: "#6B7280",
  },

  price: {
    marginTop: 10,
    fontWeight: "600",
  },

  button: {
    marginTop: 20,
    backgroundColor: "#111827",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});