import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { colors, sizes } from "../../styles/globalStyles";
import AppNavigationBar from "../../components/AppNavigationBar";

interface Listing {
  id: string;
  name: string;
  address: string;
  status: "Active" | "Rented" | "Inactive";
  price: {
    amount: number;
    period: "per day" | "per month";
  };
}

export default function LandlordDashboardScreen({ navigation }: any) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      setListings([]);
      setLoading(false);
      setError("User is not signed in.");
      return;
    }

    const listingsQuery = query(
      collection(db, "listings"),
      where("landlordID", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      listingsQuery,
      (snapshot) => {
        const nextListings = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();

          return {
            id: docSnap.id,
            name: data.name,
            address: data.address,
            status: data.status,
            price: data.price,
          } as Listing;
        });

        setListings(nextListings);
        setError(null);
        setLoading(false);
      },
      (e) => {
        setError(e.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Listings</Text>

      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator color={colors.primaryBlue} />
        </View>
      ) : (
        <FlatList
          data={listings}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No listings yet.</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.listingName}>{item.name}</Text>
                <Text style={styles.status}>{item.status}</Text>
              </View>
              <Text style={styles.price}>
                ${item.price?.amount} {item.price?.period}
              </Text>
              <Text style={styles.address}>{item.address}</Text>
            </View>
          )}
        />
      )}

      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("LandlordAddListingScreen")}
      >
        <Text style={styles.buttonText}>Add Listing</Text>
      </TouchableOpacity>

      <AppNavigationBar
        activeTab="Dashboard"
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
  },
  title: {
    fontSize: sizes.large,
    fontWeight: "700",
    marginBottom: 20,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingBottom: 170,
  },
  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    backgroundColor: colors.white,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  listingName: {
    flex: 1,
    fontSize: sizes.medium,
    fontWeight: "700",
  },
  status: {
    color: colors.primaryBlue,
    fontWeight: "600",
  },
  price: {
    fontSize: sizes.medium,
    fontWeight: "600",
    marginBottom: 6,
  },
  address: {
    color: colors.textSecondary,
  },
  emptyText: {
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 40,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  button: {
    backgroundColor: colors.primaryBlue,
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 104,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});
