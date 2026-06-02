// PropertyDetailsPlaceholder.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PropertyDetailsPlaceholder() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Property Details</Text>
        <Text style={styles.subtitle}>
          This screen is not connected yet.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F6F7FB",
  },
  box: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 12,
    color: "#6B7280",
  },
});