import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  auth,
  db
} from "../../config/firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../styles/globalStyles";

export default function RenterDashboardScreen({ navigation }: any) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [savedCount, setSavedCount] = useState(0);
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [bookings, setBookings] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const user = auth.currentUser;

  const displayName =
    profile?.name ||
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "User";

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        const profileSnap = await getDoc(doc(db, "renterPreferences", user.uid));

        let prefs: any = null;
        if (profileSnap.exists()) {
          prefs = profileSnap.data();
          setProfile(prefs);
        }

        const userSnap = await getDoc(doc(db, "users", user.uid));

        const saved =
          userSnap.exists() ? userSnap.data()?.favoritesID || [] : [];

        setSavedCount(saved.length);

        const appSnap = await getDocs(
          query(collection(db, "applications"), where("userId", "==", user.uid))
        );
        setApplicationsCount(appSnap.size);

        const bookingSnap = await getDocs(
          query(collection(db, "bookings"), where("userId", "==", user.uid))
        );
        setBookings(bookingSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        const listingsSnap = await getDocs(collection(db, "listings"));

        let listings = listingsSnap.docs.map(d => ({
          id: d.id,
          ...d.data()
        }));

        if (prefs?.budget) {
          listings = listings.filter((l: any) => l.price?.amount <= prefs.budget);
        }

        if (prefs?.bedrooms) {
          listings = listings.filter((l: any) => l.bedrooms === prefs.bedrooms);
        }

        if (prefs?.city) {
          listings = listings.filter(
            (l: any) =>
              l.city?.toLowerCase() === prefs.city.toLowerCase()
          );
        }

        setRecommendations(listings.slice(0, 5));

      } catch (e) {
        console.log("Dashboard error:", e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primaryBlue} />
      </View>
    );
  }

  const metrics = [
    {
      label: "Matches",
      value: recommendations.length,
      icon: "search-outline",
      screen: "Search",
    },
    {
      label: "Applications",
      value: applicationsCount,
      icon: "document-text-outline",
      screen: "ApplicationsScreen",
    },
    {
      label: "Bookings",
      value: bookings.length,
      icon: "calendar-outline",
      screen: "BookingsListScreen",
    },
    {
      label: "Saved",
      value: savedCount,
      icon: "heart-outline",
      screen: "SavedListingsScreen",
    },
  ];

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={18} color="#fff" />
          </View>

          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.greeting}>Hi, {displayName}</Text>
            <Text style={styles.sub}>Find your next home smarter</Text>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate("UserProfile")}>
            <Ionicons name="options-outline" size={22} color="#111827" />
          </TouchableOpacity>
        </View>

        {/* METRICS */}
        <View style={styles.metrics}>
          {metrics.map((m, i) => (
            <TouchableOpacity
              key={i}
              style={styles.metricCard}
              onPress={() => navigation.navigate(m.screen)}
            >
              <Ionicons name={m.icon as any} size={22} color={colors.primaryBlue} />
              <Text style={styles.metricValue}>{m.value}</Text>
              <Text style={styles.metricLabel}>{m.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* RECOMMENDED */}
        <Text style={styles.sectionTitle}>Recommended for you</Text>

        {recommendations.length > 0 ? (
          recommendations.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.propertyCard}
              onPress={() =>
                navigation.navigate("PropertyDetailsScreen", { listing: item })
              }
            >
              {item.images?.[0] ? (
                <Image source={{ uri: item.images[0] }} style={styles.image} />
              ) : (
                <View style={styles.imagePlaceholder} />
              )}

              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.name || "Property"}</Text>
                <Text style={styles.cardSub}>
                  ${item.price?.amount ?? "—"} · {item.city ?? "Unknown"}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardSub}>No matches found.</Text>
          </View>
        )}

        {/* UPCOMING */}
        <Text style={styles.sectionTitle}>Upcoming viewing</Text>

        {bookings.length > 0 ? (
          <View style={styles.cardHighlight}>
            <Text style={styles.cardTitle}>{bookings[0].title}</Text>
            <Text style={styles.cardSub}>{bookings[0].date}</Text>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardSub}>No upcoming bookings</Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F7FB" },

  content: { paddingBottom: 20 },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 18,
  },

  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.deepPurple,
    alignItems: "center",
    justifyContent: "center",
  },

  greeting: { fontSize: 18, fontWeight: "800", color: "#111827" },

  sub: { fontSize: 12, color: "#6B7280" },

  metrics: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    marginTop: 15,
    gap: 10,
  },

  metricCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
  },

  metricValue: { fontSize: 18, fontWeight: "800", marginTop: 6 },

  metricLabel: { fontSize: 12, color: "#6B7280" },

  sectionTitle: {
    marginTop: 18,
    marginBottom: 10,
    paddingHorizontal: 20,
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },

  propertyCard: {
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 14,
    marginBottom: 10,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: 120,
  },

  imagePlaceholder: {
    width: "100%",
    height: 120,
    backgroundColor: "#E5E7EB",
  },

  cardContent: {
    padding: 12,
  },

  cardTitle: { fontSize: 14, fontWeight: "700" },

  cardSub: { fontSize: 12, color: "#6B7280", marginTop: 4 },

  card: {
    marginHorizontal: 20,
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },

  cardHighlight: {
    marginHorizontal: 20,
    backgroundColor: "#EEF2FF",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },
});