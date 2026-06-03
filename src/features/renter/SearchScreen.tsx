import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import ListingCard from "./components/ListingCard";

export default function SearchScreen({ navigation }: any) {
  const [listings, setListings] = useState<any[]>([]);
  const [query, setQuery] = useState("");

  const [filters, setFilters] = useState({
    bedrooms: null as number | null,
    furnished: null as boolean | null,
    sortBy: "default" as "default" | "price",
  });

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "listings"));
      setListings(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    let results = listings.filter((l) => !l.status || l.status === "Active");

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      results = results.filter((l) =>
        [l.name, l.city, l.address]
          .filter(Boolean)
          .some((f) => f.toLowerCase().includes(q))
      );
    }

    if (filters.bedrooms !== null) {
      results = results.filter((l) => l.bedrooms === filters.bedrooms);
    }

    if (filters.furnished !== null) {
      results = results.filter((l) => l.furnished === filters.furnished);
    }

    if (filters.sortBy === "price") {
      results.sort((a, b) => a.price.amount - b.price.amount);
    }

    return results;
  }, [listings, query, filters]);

  const Chip = ({ active, onPress, children }: any) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        active && styles.chipActive,
        pressed && styles.chipPressed,
      ]}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>
        {children}
      </Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* SEARCH */}
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search city, address..."
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
        />
      </View>

      {/* FILTERS */}
      <View style={styles.filterBar}>
        <Chip
          active={filters.sortBy === "price"}
          onPress={() =>
            setFilters((p) => ({
              ...p,
              sortBy: p.sortBy === "price" ? "default" : "price",
            }))
          }
        >
          Price
        </Chip>

        <Chip
          active={filters.bedrooms === 1}
          onPress={() =>
            setFilters((p) => ({
              ...p,
              bedrooms: p.bedrooms === 1 ? null : 1,
            }))
          }
        >
          1BR
        </Chip>

        <Chip
          active={filters.bedrooms === 2}
          onPress={() =>
            setFilters((p) => ({
              ...p,
              bedrooms: p.bedrooms === 2 ? null : 2,
            }))
          }
        >
          2BR
        </Chip>

        <Chip
          active={filters.furnished === true}
          onPress={() =>
            setFilters((p) => ({
              ...p,
              furnished: p.furnished === true ? null : true,
            }))
          }
        >
          Furnished
        </Chip>

        <Pressable
          onPress={() => {
            setQuery("");
            setFilters({
              bedrooms: null,
              furnished: null,
              sortBy: "default",
            });
          }}
          style={({ pressed }) => [
            styles.chip,
            styles.resetChip,
            pressed && styles.chipPressed,
          ]}
        >
          <Text style={styles.chipText}>Reset</Text>
        </Pressable>
      </View>

      {/* MAP BUTTON */}
      <Pressable
        onPress={() =>
          navigation.navigate("MapScreen", {
            listings: filtered,
          })
        }
      >
        <Text>Open Map</Text>
      </Pressable>

      {/* LIST */}
      <FlatList
        data={filtered}
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
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },

  searchBox: {
    margin: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    justifyContent: "center",
  },

  searchInput: {
    fontSize: 14,
  },

  filterBar: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },

  chip: {
    backgroundColor: "#E5E7EB",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },

  chipPressed: {
    opacity: 0.7,
  },

  chipText: {
    fontSize: 12,
    color: "#111",
  },

  chipActive: {
    backgroundColor: "#111827",
  },

  chipTextActive: {
    color: "#fff",
  },

  resetChip: {
    backgroundColor: "#F3F4F6",
  },
});
