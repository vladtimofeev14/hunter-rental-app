import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { colors } from "../../styles/globalStyles";

const screenWidth = Dimensions.get("window").width;

export default function PropertyDetailsScreen({ route, navigation }: any) {
  const listing = route?.params?.listing;
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [owner, setOwner] = useState<any>(null);
  const [ownerLoading, setOwnerLoading] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  const images = useMemo(
    () =>
      Array.isArray(listing?.images)
        ? listing.images.filter((image: string) => image?.trim())
        : [],
    [listing?.images]
  );

  useEffect(() => {
    const loadListingMeta = async () => {
      if (!listing) return;

      try {
        setOwnerLoading(true);
        setOwner(null);

        let landlordID =
          listing.landlordID ||
          listing.landlordId ||
          listing.ownerID ||
          listing.ownerId ||
          listing.userID ||
          listing.userId;

        if (!landlordID && listing.id) {
          const listingSnap = await getDoc(doc(db, "listings", listing.id));
          const listingData = listingSnap.exists() ? listingSnap.data() : null;
          landlordID =
            listingData?.landlordID ||
            listingData?.landlordId ||
            listingData?.ownerID ||
            listingData?.ownerId ||
            listingData?.userID ||
            listingData?.userId ||
            null;
        }

        if (landlordID) {
          const ownerSnap = await getDoc(doc(db, "users", landlordID));
          if (ownerSnap.exists()) setOwner(ownerSnap.data());
        }
      } finally {
        setOwnerLoading(false);
      }

      const user = auth.currentUser;

      if (user && listing.id) {
        const userSnap = await getDoc(doc(db, "users", user.uid));
        const favoritesID = userSnap.exists()
          ? userSnap.data()?.favoritesID || []
          : [];

        setFavorite(favoritesID.includes(listing.id));
      }
    };

    loadListingMeta();
  }, [listing]);

  if (!listing) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Missing listing data</Text>
      </SafeAreaView>
    );
  }

  const ownerFullName = [owner?.firstName, owner?.lastName]
    .filter(Boolean)
    .join(" ");
  const ownerName =
    ownerFullName ||
    owner?.name ||
    owner?.email ||
    (ownerLoading ? "Loading owner..." : "Owner unavailable");

  const details = [
    { label: "Address", value: listing.address },
    { label: "City", value: listing.city },
    { label: "Property Type", value: listing.propertyType },
    { label: "Lease Length", value: listing.leaseLength },
    { label: "Size", value: listing.sizeSqft ? `${listing.sizeSqft} sqft` : "" },
    { label: "Bedrooms", value: listing.bedrooms },
    { label: "Bathrooms", value: listing.bathrooms },
    { label: "Floor", value: listing.floor },
    { label: "Status", value: listing.status },
  ].filter((detail) => detail.value !== undefined && detail.value !== "");

  const handleFavorite = async () => {
    const user = auth.currentUser;

    if (!user || !listing.id) return;

    if (favorite) {
      Alert.alert("Remove from Favorites?", "", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            await updateDoc(doc(db, "users", user.uid), {
              favoritesID: arrayRemove(listing.id),
            });

            setFavorite(false);
          },
        },
      ]);
      return;
    }

    await updateDoc(doc(db, "users", user.uid), {
      favoritesID: arrayUnion(listing.id),
    });

    setFavorite(true);
  };

  const handleBookViewing = async () => {
    const user = auth.currentUser;

    if (!user || !listing.id) return;

    try {
      setBookingLoading(true);

      let bookingListing = listing;

      let bookingLandlordID =
        bookingListing.landlordID ||
        bookingListing.landlordId ||
        bookingListing.ownerID ||
        bookingListing.ownerId ||
        bookingListing.userID ||
        bookingListing.userId;

      if (!bookingLandlordID) {
        const listingSnap = await getDoc(doc(db, "listings", listing.id));

        if (listingSnap.exists()) {
          bookingListing = {
            id: listingSnap.id,
            ...listingSnap.data(),
          };

          bookingLandlordID =
            bookingListing.landlordID ||
            bookingListing.landlordId ||
            bookingListing.ownerID ||
            bookingListing.ownerId ||
            bookingListing.userID ||
            bookingListing.userId;
        }
      }

      if (!bookingLandlordID) {
        Alert.alert("Booking unavailable", "Listing owner was not found.");
        return;
      }

      await addDoc(collection(db, "bookings"), {
        landlordID: bookingLandlordID,
        renterID: user.uid,
        listingD: listing.id,
        listingTitle: bookingListing.name || "Property",
        listingImage: bookingListing.images?.[0] || "",
        status: "pending",
        createdAt: serverTimestamp(),
      });

      navigation.navigate("BookingsListScreen");
    } catch (e: any) {
      Alert.alert("Booking failed", e?.message || "Could not create booking.");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>‹</Text>
      </Pressable>

      <Pressable style={styles.favoriteButton} onPress={handleFavorite}>
        <Ionicons
          name={favorite ? "heart" : "heart-outline"}
          size={22}
          color={favorite ? colors.primaryBlue : "#111827"}
        />
      </Pressable>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.carousel}>
          {images.length > 0 ? (
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(event) => {
                const nextIndex = Math.round(
                  event.nativeEvent.contentOffset.x / screenWidth
                );
                setActiveImageIndex(nextIndex);
              }}
            >
              {images.map((image: string, index: number) => (
                <Image
                  key={`${image}-${index}`}
                  source={{ uri: image }}
                  style={styles.image}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image-outline" size={34} color="#9CA3AF" />
            </View>
          )}

          {images.length > 1 && (
            <View style={styles.dots}>
              {images.map((image: string, index: number) => (
                <View
                  key={`${image}-dot-${index}`}
                  style={[
                    styles.dot,
                    index === activeImageIndex && styles.dotActive,
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{listing.name}</Text>
          <Text style={styles.location}>{listing.city}</Text>

          <Text style={styles.price}>
            ${listing.price?.amount}/{listing.price?.period}
          </Text>

          <Text style={styles.summary}>
            {listing.bedrooms} bed · {listing.bathrooms} bath
          </Text>

          <View style={styles.ownerCard}>
            <View style={styles.ownerAvatar}>
              <Ionicons name="person" size={20} color="#fff" />
            </View>

            <View>
              <Text style={styles.ownerLabel}>Owner</Text>
              <Text style={styles.ownerName}>{ownerName}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Details</Text>

          <View style={styles.formCard}>
            {details.map((detail) => (
              <View key={detail.label} style={styles.formRow}>
                <Text style={styles.formLabel}>{detail.label}</Text>
                <Text style={styles.formValue}>{detail.value}</Text>
              </View>
            ))}

            {listing.description && (
              <View style={styles.descriptionRow}>
                <Text style={styles.formLabel}>Description</Text>
                <Text style={styles.description}>{listing.description}</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.button, bookingLoading && styles.buttonDisabled]}
          onPress={handleBookViewing}
          disabled={bookingLoading}
        >
          <Text style={styles.buttonText}>
            {bookingLoading ? "Booking..." : "Book Viewing"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },

  content: {
    paddingBottom: 118,
  },

  backButton: {
    position: "absolute",
    top: 52,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },

  backButtonText: {
    fontSize: 32,
    lineHeight: 34,
    color: "#111827",
  },

  favoriteButton: {
    position: "absolute",
    top: 52,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },

  carousel: {
    width: "100%",
    height: 300,
    backgroundColor: "#E5E7EB",
  },

  image: {
    width: screenWidth,
    height: 300,
  },

  imagePlaceholder: {
    width: "100%",
    height: 300,
    alignItems: "center",
    justifyContent: "center",
  },

  dots: {
    position: "absolute",
    bottom: 14,
    alignSelf: "center",
    flexDirection: "row",
    gap: 6,
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.55)",
  },

  dotActive: {
    width: 18,
    backgroundColor: "#FFFFFF",
  },

  detailsContainer: {
    padding: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
  },

  location: {
    fontSize: 15,
    color: "#6B7280",
    marginTop: 4,
  },

  price: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    marginTop: 12,
  },

  summary: {
    fontSize: 15,
    color: "#6B7280",
    marginTop: 6,
  },

  ownerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    marginTop: 18,
  },

  ownerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.deepPurple,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  ownerLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
  },

  ownerName: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "800",
    marginTop: 2,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#111827",
    marginTop: 22,
    marginBottom: 10,
  },

  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    overflow: "hidden",
  },

  formRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    gap: 12,
  },

  formLabel: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "700",
  },

  formValue: {
    flex: 1,
    textAlign: "right",
    fontSize: 14,
    color: "#111827",
    fontWeight: "700",
  },

  descriptionRow: {
    paddingHorizontal: 14,
    paddingVertical: 13,
  },

  description: {
    fontSize: 14,
    lineHeight: 20,
    color: "#374151",
    marginTop: 8,
  },

  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 28,
  },

  button: {
    backgroundColor: "#111827",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
});
