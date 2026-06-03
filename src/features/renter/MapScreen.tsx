/*
TODO 
- Replace mock latitude/longitude with Firestore stored coordinates
- Ensure landlord creates listing with geolocation
- Optional: clustering for large datasets
*/

import React, { useMemo } from "react";
import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MapScreen({ route, navigation }: any) {
  const listings = route?.params?.listings || [];

  // fallback region (Toronto default)
  const defaultRegion = {
    latitude: 43.6532,
    longitude: -79.3832,
    latitudeDelta: 0.08,
    longitudeDelta: 0.08,
  };

  // center map based on first listing if available
  const initialRegion = useMemo(() => {
    if (listings.length > 0 && listings[0]?.latitude && listings[0]?.longitude) {
      return {
        latitude: listings[0].latitude,
        longitude: listings[0].longitude,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      };
    }
    return defaultRegion;
  }, [listings]);

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
      >
        {/* LISTINGS MARKERS */}
        {listings.map((item: any) => {
          if (!item.latitude || !item.longitude) return null;

          return (
            <Marker
              key={item.id}
              coordinate={{
                latitude: item.latitude,
                longitude: item.longitude,
              }}
              title={item.name}
              description={`${item.city} · $${item.price?.amount}`}
              onPress={() =>
                navigation.navigate("PropertyDetailsScreen", {
                  listing: item,
                })
              }
            />
          );
        })}
      </MapView>

      {/* INFO PANEL (optional preview layer) */}
      <View style={styles.bottomHint}>
        <Text style={styles.hintText}>
          Tap a marker to view details
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

  bottomHint: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "#111827",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },

  hintText: {
    color: "#fff",
    fontSize: 12,
  },
});