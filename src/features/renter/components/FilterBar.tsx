import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Filters, SortBy } from "../utils/types";
import { colors } from "../../../styles/globalStyles";

const PROPERTY_TYPES = ["Condo", "House", "Studio"];
const LEASE_LENGTHS = ["1 Month", "4 Month", "8 Month", "12 Month"];

export default function FilterBar({
  filters,
  setFilters,
}: {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}) {
  const sortMode: SortBy = filters.sortBy ?? "relevance";

  return (
    <View style={styles.container}>

      {/* SORT */}
      <Pressable
        onPress={() =>
          setFilters((p) => ({
            ...p,
            sortBy: p.sortBy === "price" ? "relevance" : "price",
          }))
        }
        style={[styles.chip, sortMode === "price" && styles.active]}
      >
        <Text style={styles.text}>Price</Text>
      </Pressable>

      <Pressable
        onPress={() =>
          setFilters((p) => ({
            ...p,
            sortBy: p.sortBy === "distance" ? "relevance" : "distance",
          }))
        }
        style={[styles.chip, sortMode === "distance" && styles.active]}
      >
        <Text style={styles.text}>Distance</Text>
      </Pressable>

      {/* BEDROOMS */}
      {[1, 2, 3].map((b) => (
        <Pressable
          key={b}
          onPress={() =>
            setFilters((p) => ({
              ...p,
              bedrooms: p.bedrooms === b ? null : b,
            }))
          }
          style={[styles.chip, filters.bedrooms === b && styles.active]}
        >
          <Text style={styles.text}>{b}BR</Text>
        </Pressable>
      ))}

      {/* PROPERTY TYPE */}
      {PROPERTY_TYPES.map((type) => (
        <Pressable
          key={type}
          onPress={() =>
            setFilters((p) => ({
              ...p,
              propertyType: p.propertyType === type ? null : type,
            }))
          }
          style={[styles.chip, filters.propertyType === type && styles.active]}
        >
          <Text style={styles.text}>{type}</Text>
        </Pressable>
      ))}

      {/* LEASE LENGTH */}
      {LEASE_LENGTHS.map((len) => (
        <Pressable
          key={len}
          onPress={() =>
            setFilters((p) => ({
              ...p,
              leaseLength: p.leaseLength === len ? null : len,
            }))
          }
          style={[styles.chip, filters.leaseLength === len && styles.active]}
        >
          <Text style={styles.text}>{len}</Text>
        </Pressable>
      ))}

      {/* RESET */}
      <Pressable
        onPress={() =>
          setFilters({
            bedrooms: null,
            furnished: null,
            propertyType: null,
            leaseLength: null,
            sortBy: "relevance",
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
    backgroundColor: "#A5B4FC",
    borderColor: colors.deepPurple,
    borderWidth: 1,
  },

  text: {
    fontSize: 12,
    color: "#111827",
  },

  reset: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
});