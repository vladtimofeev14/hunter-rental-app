import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Swipeable } from "react-native-gesture-handler";
import {
  auth,
  db,
} from "../../config/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  documentId,
} from "firebase/firestore";
import ListingCard from "./components/ListingCard";
import { colors } from "../../styles/globalStyles";

export default function SavedListingsScreen({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Hook to calculate spacing for the phone's bottom home indicator
  const insets = useSafeAreaInsets();

  const load = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) return;

    setLoading(true);

    const userSnap = await getDoc(doc(db, "users", user.uid));

    const favs: string[] =
      userSnap.exists() ? userSnap.data()?.favoritesID || [] : [];

    setFavorites(favs);

    if (favs.length === 0) {
      setListings([]);
      setLoading(false);
      return;
    }

    const chunks: string[][] = [];
    for (let i = 0; i < favs.length; i += 10) {
      chunks.push(favs.slice(i, i + 10));
    }

    const results: any[] = [];

    for (const chunk of chunks) {
      const q = query(
        collection(db, "listings"),
        where(documentId(), "in", chunk)
      );

      const snap = await getDocs(q);

      snap.forEach((d) => {
        results.push({ id: d.id, ...d.data() });
      });
    }

    setListings(results);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const removeOne = async (id: string) => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);

    const updated = favorites.filter((f) => f !== id);

    await updateDoc(userRef, {
      favoritesID: updated,
    });

    setFavorites(updated);
    setListings((prev) => prev.filter((l) => l.id !== id));
  };

  const clearAll = async () => {
    const user = auth.currentUser;
    if (!user) return;

    await updateDoc(doc(db, "users", user.uid), {
      favoritesID: [],
    });

    setFavorites([]);
    setListings([]);
  };

  // Delete confirmation
  const confirmRemove = (id: string) => {
    Alert.alert("Remove Property", "Are you sure you want to remove this property from your saved list?", [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: () => removeOne(id) },
    ]);
  };

  const confirmClearAll = () => {
    Alert.alert("Clear All Saved", "Are you sure you want to remove all saved properties? This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear All", style: "destructive", onPress: () => clearAll() },
    ]);
  };

  // Swipe delete action
  const renderRightActions = (id: string) => {
    return (
      <Pressable
        onPress={() => confirmRemove(id)}
        style={styles.deleteAction}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </Pressable>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={colors.deepPurple} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Saved Properties</Text>
          <Text style={styles.subtitle}>
            {favorites.length} saved listings
          </Text>
        </View>
      </View>

      {/* LIST */}
      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Swipeable renderRightActions={() => renderRightActions(item.id)}>
            <ListingCard item={item} navigation={navigation} />
          </Swipeable>
        )}
        contentContainerStyle={{ paddingBottom: 160 }}
      />

      {/* BOTTOM ACTION */}
      {favorites.length > 0 && (
        <View
          style={[
            styles.bottomBar,
            { paddingBottom: Math.max(insets.bottom, 20) + 14 }
          ]}
        >
          <Pressable onPress={confirmClearAll} style={styles.clearBtn}>
            <Text style={styles.clearText}>Clear all</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },

  header: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 6,
  },

  title: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.black,
  },

  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },

  deleteAction: {
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 24,
    marginVertical: 8,
    marginRight: 14,
    borderRadius: 14,
  },

  deleteText: {
    color: "white",
    fontWeight: "800",
    fontSize: 14,
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingHorizontal: 14,
    paddingTop: 14,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },

  clearBtn: {
    backgroundColor: colors.deepPurple,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  clearText: {
    color: "white",
    fontWeight: "800",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});