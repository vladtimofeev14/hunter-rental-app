import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker, Region, Callout } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

export default function MapScreen({ navigation }: any) {
  const [listings, setListings] = useState<any[]>([]);

  useEffect(() => {
    const loadListings = async () => {
      try {
        const snap = await getDocs(collection(db, "listings"));

        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setListings(data);
      } catch (error) {
        console.log("Map load error:", error);
      }
    };

    loadListings();
  }, []);

  const validListings = useMemo(() => {
    return listings.filter(
      (l: any) =>
        typeof l.lat === "number" &&
        typeof l.lng === "number" &&
        !isNaN(l.lat) &&
        !isNaN(l.lng)
    );
  }, [listings]);

  const defaultRegion: Region = {
    latitude: 43.6532,
    longitude: -79.3832,
    latitudeDelta: 0.08,
    longitudeDelta: 0.08,
  };

  const initialRegion =
    validListings.length > 0
      ? {
        latitude: validListings[0].lat,
        longitude: validListings[0].lng,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      }
      : defaultRegion;

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
      <MapView style={styles.map} initialRegion={initialRegion}>
        {validListings.map((item: any) => (
          <Marker
            key={item.id}
            coordinate={{ latitude: item.lat, longitude: item.lng }}
            onPress={() =>
              navigation.navigate("PropertyDetailsScreen", { listing: item })
            }
          >
            <Callout tooltip>
              <View style={styles.priceMarker}>
                <Text style={styles.priceText}>
                  ${item.price?.amount}
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <View style={styles.debug}>
        <Text style={styles.text}>
          Properties: {validListings.length}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    width: Dimensions.get("window").width,
    height: "100%",
  },

  priceMarker: {
    backgroundColor: "#0D74E7",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#fff",
  },

  priceText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },

  debug: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "#111827",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  text: {
    color: "#fff",
    fontSize: 12,
  },
});