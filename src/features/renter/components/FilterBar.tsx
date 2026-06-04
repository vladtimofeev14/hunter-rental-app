import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Filters } from "../components/types";
import { colors } from "../../../styles/globalStyles";

export default function FilterBar({
    filters,
    setFilters,
}: {
    filters: Filters;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}) {
    return (
        <View style={styles.container}>
            <Pressable
                onPress={() =>
                    setFilters((p) => ({
                        ...p,
                        sortBy: p.sortBy === "price" ? "default" : "price",
                    }))
                }
                style={[styles.chip, filters.sortBy === "price" && styles.active]}
            >
                <Text style={styles.text}>Price</Text>
            </Pressable>

            {[1, 2, 3].map((b) => (
                <Pressable
                    key={b}
                    onPress={() =>
                        setFilters((p) => ({
                            ...p,
                            bedrooms: p.bedrooms === b ? null : b,
                        }))
                    }
                    style={[
                        styles.chip,
                        filters.bedrooms === b && styles.active,
                    ]}
                >
                    <Text style={styles.text}>{b}BR</Text>
                </Pressable>
            ))}

            <Pressable
                onPress={() =>
                    setFilters((p) => ({
                        ...p,
                        furnished: p.furnished === true ? null : true,
                    }))
                }
                style={[
                    styles.chip,
                    filters.furnished === true && styles.active,
                ]}
            >
                <Text style={styles.text}>Furnished</Text>
            </Pressable>

            <Pressable
                onPress={() =>
                    setFilters({
                        bedrooms: null,
                        furnished: null,
                        sortBy: "default",
                    })
                }
                style={styles.reset}
            >
                <Text style={styles.text}>Reset</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: 12,
        gap: 8,
        marginBottom: 8,
    },
    chip: {
        backgroundColor: "#E5E7EB",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    active: {
        backgroundColor: colors.lightBlueAccent,
        borderWidth: 1,
        borderColor: colors.primaryBlue,
    },
    text: {
        color: colors.black,
        fontSize: 12,
    },
    reset: {
        backgroundColor: "#F3F4F6",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
});