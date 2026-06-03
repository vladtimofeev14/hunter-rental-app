import React, { useState } from "react";
import {
    Alert,
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Pressable,
} from "react-native";
import { SymbolView } from "expo-symbols";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../config/firebase";
import { colors } from "../../../styles/globalStyles";

export default function ListingCard({
    item,
    navigation,
    isFavorite = false,
    onFavoriteChange,
}: any) {
    const [favorite, setFavorite] = useState(isFavorite);

    const enrichedItem = {
        ...item,
        latitude: item.lat ?? item.latitude ?? 43.66 + Math.random() * 0.01,
        longitude: item.lng ?? item.longitude ?? -79.38 + Math.random() * 0.01,
    };

    const handleFavorite = async () => {
        const user = auth.currentUser;

        if (!user || !item?.id) return;

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
                            favoritesID: arrayRemove(item.id),
                        });

                        setFavorite(false);
                        onFavoriteChange?.(false);
                    },
                },
            ]);
            return;
        }

        await updateDoc(doc(db, "users", user.uid), {
            favoritesID: arrayUnion(item.id),
        });

        setFavorite(true);
        onFavoriteChange?.(true);
    };

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() =>
                navigation.navigate("PropertyDetailsScreen", {
                    listing: enrichedItem,
                })
            }
        >
            <Image source={{ uri: item.images?.[0] }} style={styles.image} />

            <Pressable
                style={styles.favoriteButton}
                onPress={(event) => {
                    event.stopPropagation();
                    handleFavorite();
                }}
            >
                <SymbolView
                    name={favorite ? "heart.fill" : "heart"}
                    size={22}
                    tintColor={favorite ? colors.primaryBlue : "#111827"}
                />
            </Pressable>

            <View style={styles.row}>
                {/* LEFT */}
                <View style={styles.left}>
                    <Text style={styles.title} numberOfLines={1}>
                        {item.name}
                    </Text>

                    <Text style={styles.sub}>
                        {item.city} · {item.propertyType}
                    </Text>

                    <Text style={styles.meta}>
                        {item.bedrooms} bed · {item.bathrooms} bath
                    </Text>
                </View>

                {/* RIGHT */}
                <View style={styles.right}>
                    <Text style={styles.price}>
                        ${item.price.amount}
                    </Text>

                    <Text style={styles.period}>
                        /{item.price.period}
                    </Text>
                </View>
            </View>

            <Text style={styles.address} numberOfLines={1}>
                {item.address}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 12,
        marginVertical: 8,
        backgroundColor: "#fff",
        borderRadius: 14,
        overflow: "hidden",
    },

    image: {
        width: "100%",
        height: 140,
    },

    favoriteButton: {
        position: "absolute",
        top: 10,
        right: 10,
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
    },

    left: {
        flex: 1,
        paddingRight: 10,
    },

    right: {
        alignItems: "flex-end",
        justifyContent: "center",
    },

    title: {
        fontSize: 14,
        fontWeight: "700",
    },

    sub: {
        fontSize: 12,
        color: "#6B7280",
        marginTop: 2,
    },

    meta: {
        fontSize: 12,
        color: "#9CA3AF",
        marginTop: 2,
    },

    price: {
        fontSize: 16,
        fontWeight: "700",
    },

    period: {
        fontSize: 11,
        color: "#6B7280",
    },

    address: {
        fontSize: 11,
        color: "#9CA3AF",
        paddingHorizontal: 10,
        paddingBottom: 10,
    },
});
