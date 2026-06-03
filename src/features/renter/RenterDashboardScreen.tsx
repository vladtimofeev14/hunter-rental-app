import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { colors } from "../../styles/globalStyles";
import { Ionicons } from "@expo/vector-icons";

export default function RenterDashboardScreen({ navigation }: any) {
  const [profile, setProfile] = useState<any>(null);

  const user = auth.currentUser;

  const displayName =
    profile?.name ||
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "User";

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      const snap = await getDoc(doc(db, "renterPreferences", user.uid));
      if (snap.exists()) setProfile(snap.data());
    };

    loadProfile();
  }, []);

  const mockData = {
    recommendations: [
      { id: "1", title: "Studio near GBC", price: 1400, distance: 1.2 },
      { id: "2", title: "Shared apartment downtown", price: 950, distance: 3.5 },
    ],
    bookings: [
      { id: "b1", title: "King St Viewing", date: "Tomorrow 3:00 PM" },
    ],
    applications: [
      { id: "a1", title: "Queen St Loft", status: "Pending" },
    ],
  };

  const metrics = [
    {
      label: "Matches",
      value: mockData.recommendations.length,
      icon: "search-outline",
      screen: "Search",
    },
    {
      label: "Bookings",
      value: mockData.bookings.length,
      icon: "calendar-outline",
      screen: "Map",
    },
    {
      label: "Applications",
      value: mockData.applications.length,
      icon: "document-text-outline",
      screen: "ApplicationsScreen",
    },
    {
      label: "Saved",
      value: 3,
      icon: "heart-outline",
      screen: "Saved",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HEADER */}
        <View style={styles.headerRow}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={18} color="#fff" />
          </View>

          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>Hi, {displayName}</Text>
            <Text style={styles.subGreeting}>
              Your housing activity in one place
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("UserProfile")}
            style={styles.settingsBtn}
          >
            <Ionicons name="settings-outline" size={22} color="#111827" />
          </TouchableOpacity>
        </View>

        {/* METRICS GRID */}
        <View style={styles.metricsGrid}>
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

        {/* RECOMMENDATIONS */}
        <Text style={styles.sectionTitle}>Recommended for you</Text>

        {mockData.recommendations.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSub}>
              ${item.price} · {item.distance} km
            </Text>
          </View>
        ))}

        {/* BOOKINGS */}
        <Text style={styles.sectionTitle}>Upcoming viewings</Text>

        {mockData.bookings.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSub}>{item.date}</Text>
          </View>
        ))}

        {/* APPLICATIONS */}
        <Text style={styles.sectionTitle}>Applications</Text>

        {mockData.applications.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => navigation.navigate("ApplicationsScreen")}
          >
            <Text style={styles.cardTitle}>{item.title}</Text>

            <View style={styles.pendingRow}>
              <Ionicons name="time-outline" size={14} color="#F59E0B" />
              <Text style={styles.pending}>{item.status}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },

  scrollContent: {
    paddingBottom: 20,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 10,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.deepPurple,
    alignItems: "center",
    justifyContent: "center",
  },

  greetingContainer: {
    flex: 1,
    marginLeft: 10,
  },

  greeting: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },

  subGreeting: {
    fontSize: 12,
    color: "#6B7280",
  },

  settingsBtn: {
    padding: 6,
  },

  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    marginTop: 10,
    gap: 10,
  },

  metricCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  metricValue: {
    fontSize: 20,
    fontWeight: "800",
    marginTop: 6,
  },

  metricLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },

  sectionTitle: {
    marginTop: 18,
    marginBottom: 10,
    paddingHorizontal: 20,
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },

  card: {
    marginHorizontal: 20,
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },

  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
  },

  cardSub: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },

  pendingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },

  pending: {
    fontSize: 12,
    color: "#F59E0B",
    fontWeight: "600",
  },
});