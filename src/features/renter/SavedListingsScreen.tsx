import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  Alert,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Swipeable } from "react-native-gesture-handler";
import { auth, db } from "../../config/firebase";
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
import { useFocusEffect } from "@react-navigation/native";
import ListingCard from "./components/ListingCard";
import { colors } from "../../styles/globalStyles";

export default function SavedListingsScreen({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const user = auth.currentUser;

  const load = useCallback(async () => {
    if (!user) return;

    setLoading(true);

    try {
      const userSnap = await getDoc(doc(db, "users", user.uid));
      const favs = userSnap.exists() ? userSnap.data()?.favoritesID ?? [] : [];

      setFavorites(favs);

      if (favs.length === 0) {
        setListings([]);
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
    } catch (e) {
      console.log("Saved error:", e);
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const removeOne = async (id: string) => {
    if (!user) return;

    const updated = favorites.filter((f) => f !== id);

    await updateDoc(doc(db, "users", user.uid), {
      favoritesID: updated,
    });

    setFavorites(updated);
    setListings((prev) => prev.filter((l) => l.id !== id));
  };

  const confirmRemove = (id: string) => {
    Alert.alert("Remove", "Remove this listing?", [
      { text: "Cancel" },
      { text: "Remove", style: "destructive", onPress: () => removeOne(id) },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color={colors.deepPurple} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F6F7FB" }}>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 22, fontWeight: "800" }}>
          Saved Properties
        </Text>
        <Text>{favorites.length} saved</Text>
      </View>

      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Swipeable
            renderRightActions={() => (
              <Pressable
                onPress={() => confirmRemove(item.id)}
                style={{
                  backgroundColor: "red",
                  justifyContent: "center",
                  padding: 20,
                }}
              >
                <Text style={{ color: "white" }}>Delete</Text>
              </Pressable>
            )}
          >
            <ListingCard item={item} navigation={navigation} />
          </Swipeable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },

  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
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

  empty: {
    marginTop: 40,
    alignItems: "center",
  },

  emptyText: {
    color: "#6B7280",
  },
});