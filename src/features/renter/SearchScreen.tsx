import React, { useEffect, useState, useMemo } from "react";
import { View, TextInput, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import ListingCard from "./components/ListingCard";
import FilterBar from "./components/FilterBar";
import { Filters } from "./components/types";

const getDistanceKm = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

export default function SearchScreen({ navigation }: any) {
  const [listings, setListings] = useState<any[]>([]);
  const [prefs, setPrefs] = useState<any>(null);
  const [query, setQuery] = useState("");

  const [filters, setFilters] = useState<Filters>({
    bedrooms: null,
    furnished: null,
    sortBy: "match",
  });

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "listings"));
      setListings(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    load();
  }, []);

  useEffect(() => {
    const loadPrefs = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        setPrefs(snap.data()?.renterPreferences || null);
      }
    };
    loadPrefs();
  }, []);

  const ranked = useMemo(() => {
    if (!listings.length) return [];

    let results = listings.map((l) => {
      let score = 0;

      const price = l.price?.amount ?? Infinity;

      const distance =
        prefs?.userLat && prefs?.userLng && l.lat && l.lng
          ? getDistanceKm(
            prefs.userLat,
            prefs.userLng,
            l.lat,
            l.lng
          )
          : null;

      if (prefs?.budget && price <= prefs.budget) score += 40;

      if (distance !== null) {
        score += Math.max(0, 30 - distance * 2);
      }

      if (prefs?.bedrooms && l.bedrooms === prefs.bedrooms) {
        score += 10;
      }

      if (prefs?.furnished !== undefined && l.furnished === prefs.furnished) {
        score += 10;
      }

      if (query.trim()) {
        const q = query.toLowerCase();
        if (
          (l.city || "").toLowerCase().includes(q) ||
          (l.address || "").toLowerCase().includes(q)
        ) {
          score += 10;
        }
      }

      return { ...l, score, distance, price };
    });

    if (filters.bedrooms !== null) {
      results = results.filter((l) => l.bedrooms === filters.bedrooms);
    }

    if (filters.furnished !== null) {
      results = results.filter((l) => l.furnished === filters.furnished);
    }

    if (filters.sortBy === "price") {
      results.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === "distance") {
      results.sort((a, b) => (a.distance ?? 999) - (b.distance ?? 999));
    } else {
      results.sort((a, b) => b.score - a.score);
    }

    return results;
  }, [listings, prefs, query, filters]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search city, address..."
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
        />
      </View>

      <FilterBar filters={filters} setFilters={setFilters} />

      <FlatList
        data={ranked}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListingCard item={item} navigation={navigation} />
        )}
        contentContainerStyle={{ paddingBottom: 120 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F7FB" },
  searchBox: {
    margin: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    justifyContent: "center",
  },
  searchInput: { fontSize: 14 },
});