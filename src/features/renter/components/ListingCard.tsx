import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

export default function ListingCard({ item, navigation }: any) {
    const enrichedItem = {
        ...item,
        latitude: 43.66 + Math.random() * 0.01,
        longitude: -79.38 + Math.random() * 0.01,
    };

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() =>
                navigation.navigate("PropertyDetailsScreen", {
                    listing: item,
                })
            }
        >
            <Image source={{ uri: item.images?.[0] }} style={styles.image} />

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