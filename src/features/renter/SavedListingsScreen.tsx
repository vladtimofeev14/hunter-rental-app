import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../../config/firebase";
import ListingCard from "./components/ListingCard";

export default function SaveListingscreen({ navigation }: any) {
  const [savedListings, setSavedListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const loadSavedListings = async () => {
        const user = auth.currentUser;

        if (!user) {
          setSavedListings([]);
          setLoading(false);
          return;
        }

        setLoading(true);

        const userSnap = await getDoc(doc(db, "users", user.uid));
        const favoritesID = userSnap.exists()
          ? userSnap.data()?.favoritesID || []
          : [];

        const listingSnaps = await Promise.all(
          favoritesID.map((id: string) => getDoc(doc(db, "listings", id)))
        );

        setSavedListings(
          listingSnaps
            .filter((listingSnap) => listingSnap.exists())
            .map((listingSnap) => ({
              id: listingSnap.id,
              ...listingSnap.data(),
            }))
        );

        setLoading(false);
      };

      loadSavedListings();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Saved Listings</Text>

      {loading ? (
        <View style={styles.centerContent}>
          <Text style={styles.text}>Loading saved listings...</Text>
        </View>
      ) : savedListings.length === 0 ? (
        <View style={styles.centerContent}>
          <Text style={styles.text}>No saved listings yet.</Text>
        </View>
      ) : (
        <FlatList
          data={savedListings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ListingCard
              item={item}
              navigation={navigation}
              isFavorite
              onFavoriteChange={(nextFavorite: boolean) => {
                if (!nextFavorite) {
                  setSavedListings((currentListings) =>
                    currentListings.filter((listing) => listing.id !== item.id)
                  );
                }
              }}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  listContent: {
    paddingBottom: 120,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
});
