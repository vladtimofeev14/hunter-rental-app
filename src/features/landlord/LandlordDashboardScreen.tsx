import React, { useCallback, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";
import { SymbolView } from "expo-symbols";
import { auth, db } from "../../config/firebase";
import { colors } from "../../styles/globalStyles";

export default function LandlordDashboardScreen({ navigation }: any) {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const loadListings = async () => {
        const user = auth.currentUser;

        if (!user) {
          setListings([]);
          setLoading(false);
          setError("Landlord user not found.");
          return;
        }

        try {
          setLoading(true);
          setError(null);

          const listingsQuery = query(
            collection(db, "listings"),
            where("landlordID", "==", user.uid)
          );
          const snap = await getDocs(listingsQuery);

          setListings(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        } catch (e: any) {
          setError(e?.message || "Failed to load listings.");
        } finally {
          setLoading(false);
        }
      };

      loadListings();
    }, [])
  );

  const renderListing = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleBlock}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.cardMeta} numberOfLines={1}>
            {item.city} · {item.propertyType}
          </Text>
        </View>

        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <Text style={styles.cardMeta}>
        {item.bedrooms} bed · {item.bathrooms} bath · {item.sizeSqft} sqft
      </Text>

      <Text style={styles.price}>
        ${item.price?.amount}/{item.price?.period}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Landlord Home</Text>
          <Text style={styles.subtitle}>Your listings</Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("LandlordProfileScreen")}
          style={styles.settingsBtn}
        >
          <SymbolView name="gearshape" size={22} tintColor="#111827" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContent}>
          <Text style={styles.emptyText}>Loading listings...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContent}>
          <Text style={styles.error}>{error}</Text>
        </View>
      ) : listings.length === 0 ? (
        <View style={styles.centerContent}>
          <Text style={styles.emptyText}>No listings yet.</Text>
        </View>
      ) : (
        <FlatList
          data={listings}
          keyExtractor={(item) => item.id}
          renderItem={renderListing}
          contentContainerStyle={styles.listContent}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddListingScreen")}
      >
        <Text style={styles.addButtonText}>Add Listing</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
  },

  headerText: {
    flex: 1,
  },

  settingsBtn: {
    padding: 6,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
  },

  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },

  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 150,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },

  cardTitleBlock: {
    flex: 1,
    paddingRight: 12,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
  },

  cardMeta: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 3,
  },

  statusBadge: {
    backgroundColor: "#E5EBFB",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  statusText: {
    color: colors.primaryBlue,
    fontSize: 12,
    fontWeight: "700",
  },

  price: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
  },

  emptyText: {
    color: "#6B7280",
    fontSize: 15,
    fontWeight: "600",
  },

  error: {
    color: "#DC2626",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },

  addButton: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 96,
    backgroundColor: colors.deepPurple,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },

  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
});
