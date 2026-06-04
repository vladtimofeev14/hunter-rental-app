import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { collection, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { colors } from "../../styles/globalStyles";

const bookingStatuses = ["pending", "accepted", "rejected", "completed"];

export default function BookingScreen() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      setLoading(false);
      return;
    }

    const bookingsQuery = query(
      collection(db, "bookings"),
      where("landlordID", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      bookingsQuery,
      (snap) => {
        const nextBookings = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a: any, b: any) => {
            const aTime = a.createdAt?.seconds || 0;
            const bTime = b.createdAt?.seconds || 0;
            return bTime - aTime;
          });

        setBookings(nextBookings);

        setSelectedBooking((current: any) =>
          current
            ? nextBookings.find((booking) => booking.id === current.id) || current
            : current
        );

        setLoading(false);
      },
      (e) => {
        console.log("Landlord bookings error:", e);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const updateBookingStatus = async (nextStatus: string) => {
    if (!selectedBooking?.id) return;

    try {
      setUpdating(true);

      await updateDoc(doc(db, "bookings", selectedBooking.id), {
        status: nextStatus,
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={colors.primaryBlue} />
      </SafeAreaView>
    );
  }

  if (selectedBooking) {
    return (
      <SafeAreaView style={styles.container}>
        <Pressable
          style={styles.backButton}
          onPress={() => setSelectedBooking(null)}
        >
          <Text style={styles.backButtonText}>‹</Text>
        </Pressable>

        <View style={styles.detailCard}>
          {selectedBooking.listingImage ? (
            <Image
              source={{ uri: selectedBooking.listingImage }}
              style={styles.detailImage}
            />
          ) : null}

          <Text style={styles.detailTitle}>{selectedBooking.listingTitle}</Text>
          <Text style={styles.detailSub}>Renter ID: {selectedBooking.renterID}</Text>
          <Text style={styles.detailSub}>Listing ID: {selectedBooking.listingD}</Text>

          <View style={styles.currentStatus}>
            <Text style={styles.currentStatusText}>
              Current status: {selectedBooking.status}
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Update status</Text>

          <View style={styles.statusGrid}>
            {bookingStatuses.map((status) => (
              <Pressable
                key={status}
                style={[
                  styles.statusButton,
                  selectedBooking.status === status && styles.statusButtonActive,
                ]}
                onPress={() => updateBookingStatus(status)}
                disabled={updating}
              >
                <Text
                  style={[
                    styles.statusButtonText,
                    selectedBooking.status === status &&
                      styles.statusButtonTextActive,
                  ]}
                >
                  {status}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Bookings</Text>

      {bookings.length === 0 ? (
        <View style={styles.card}>
          <Text style={styles.empty}>No bookings yet</Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() => setSelectedBooking(item)}
            >
              {item.listingImage ? (
                <Image source={{ uri: item.listingImage }} style={styles.image} />
              ) : null}

              <View style={styles.cardHeader}>
                <Text style={styles.name}>{item.listingTitle}</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>

              <Text style={styles.sub}>Tap to review and update status</Text>
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
    paddingHorizontal: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.black,
    marginTop: 10,
    marginBottom: 10,
  },

  listContent: {
    paddingBottom: 120,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },

  image: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  name: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: colors.black,
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
    textTransform: "capitalize",
  },

  sub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 6,
  },

  empty: {
    color: colors.textSecondary,
    textAlign: "center",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F6F7FB",
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 12,
  },

  backButtonText: {
    fontSize: 32,
    lineHeight: 34,
    color: "#111827",
  },

  detailCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
  },

  detailImage: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    marginBottom: 14,
  },

  detailTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.black,
  },

  detailSub: {
    color: colors.textSecondary,
    marginTop: 6,
  },

  currentStatus: {
    marginTop: 16,
    backgroundColor: "#E5EBFB",
    borderRadius: 12,
    padding: 12,
  },

  currentStatusText: {
    color: colors.primaryBlue,
    fontWeight: "800",
    textTransform: "capitalize",
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.black,
    marginTop: 18,
    marginBottom: 10,
  },

  statusGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  statusButton: {
    flexGrow: 1,
    minWidth: "45%",
    backgroundColor: "#F3F4F6",
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },

  statusButtonActive: {
    backgroundColor: "#E5EBFB",
    borderColor: colors.primaryBlue,
  },

  statusButtonText: {
    color: "#6B7280",
    fontWeight: "700",
    textTransform: "capitalize",
  },

  statusButtonTextActive: {
    color: colors.primaryBlue,
  },
});
