import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import { colors } from "../../styles/globalStyles";
import { Ionicons } from "@expo/vector-icons";

type Listing = {
  id: string;
  name: string;
  city: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  price: { amount: number; period: string };
  propertyType: string;
  furnished?: boolean;
  images: string[];
};

export default function SearchScreen({ navigation }: any) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [query, setQuery] = useState("");
  const [maxBudget, setMaxBudget] = useState(3000);
  const [bedrooms, setBedrooms] = useState<number | null>(null);
  const [furnished, setFurnished] = useState<boolean | null>(null);
  const [sortBy, setSortBy] = useState<"price" | "default">("default");

  // 🔥 fetch listings once
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const snap = await getDocs(collection(db, "listings"));
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Listing[];

        setListings(data);
      } catch (e) {
        console.log("Error loading listings:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // 🔍 filtering logic (production-safe)
  const filtered = useMemo(() => {
    let results = [...listings];

    // text search
    if (query.trim()) {
      const q = query.toLowerCase();
      results = results.filter(
        (l) =>
          l.name?.toLowerCase().includes(q) ||
          l.city?.toLowerCase().includes(q) ||
          l.address?.toLowerCase().includes(q)
      );
    }

    // budget filter
    results = results.filter(
      (l) => (l.price?.amount || 0) <= maxBudget
    );

    // bedrooms filter
    if (bedrooms !== null) {
      results = results.filter((l) => l.bedrooms === bedrooms);
    }

    // furnished filter
    if (furnished !== null) {
      results = results.filter((l) => l.furnished === furnished);
    }

    // sorting
    if (sortBy === "price") {
      results.sort((a, b) => a.price.amount - b.price.amount);
    }

    return results;
  }, [listings, query, maxBudget, bedrooms, furnished, sortBy]);

  const renderItem = ({ item }: { item: Listing }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("PropertyDetails", { listingId: item.id })
      }
    >
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.subtitle}>
        {item.city} · ${item.price.amount}/{item.price.period}
      </Text>

      <Text style={styles.meta}>
        {item.bedrooms} bed · {item.bathrooms} bath · {item.propertyType}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* SEARCH BAR */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={18} color="#888" />
        <TextInput
          placeholder="Search city, address, listing..."
          value={query}
          onChangeText={setQuery}
          style={styles.input}
        />
      </View>

      {/* FILTER ROW */}
      <View style={styles.filters}>
        <TouchableOpacity
          onPress={() => setSortBy("price")}
          style={styles.filterBtn}
        >
          <Text>Price</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setBedrooms(1)}
          style={styles.filterBtn}
        >
          <Text>1BR</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setBedrooms(2)}
          style={styles.filterBtn}
        >
          <Text>2BR</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setFurnished(true)}
          style={styles.filterBtn}
        >
          <Text>Furnished</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setBedrooms(null);
            setFurnished(null);
            setSortBy("default");
            setQuery("");
          }}
          style={styles.resetBtn}
        >
          <Text style={{ color: "#fff" }}>Reset</Text>
        </TouchableOpacity>
      </View>

      {/* RESULTS */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 120 }}
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.empty}>No listings found</Text>
          ) : (
            <Text style={styles.empty}>Loading...</Text>
          )
        }
      />
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 14,
    height: 45,
  },

  input: {
    marginLeft: 8,
    flex: 1,
  },

  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 8,
  },

  filterBtn: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },

  resetBtn: {
    backgroundColor: colors.deepPurple,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 10,
    padding: 14,
    borderRadius: 14,
  },

  title: {
    fontSize: 14,
    fontWeight: "700",
  },

  subtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },

  meta: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 4,
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#6B7280",
  },
});