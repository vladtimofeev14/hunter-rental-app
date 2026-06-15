import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UserGuideScreen({ navigation }: any) {
    const goToSearch = () => {
        navigation.navigate("RenterTabs", {
            screen: "Search",
        });
    };

    const goToMap = () => {
        navigation.navigate("RenterTabs", {
            screen: "Map",
        });
    };

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* HEADER */}
                <View style={styles.headerCard}>
                    <Text style={styles.title}>Welcome to Hunter</Text>
                    <Text style={styles.subtitle}>
                        Find student housing near your campus in a simple and structured way.
                    </Text>
                </View>

                {/* HOW IT WORKS */}
                <Text style={styles.sectionTitle}>How it works</Text>

                <View style={styles.card}>
                    <Text style={styles.stepTitle}>1. Create your profile</Text>
                    <Text style={styles.text}>
                        Set your budget, campus, lease length, and preferences.
                    </Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.stepTitle}>2. Search & filter</Text>
                    <Text style={styles.text}>
                        Use filters like price, distance, furnished status, and property type.
                    </Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.stepTitle}>3. Book viewings</Text>
                    <Text style={styles.text}>
                        Contact landlords and schedule visits directly in the app.
                    </Text>
                </View>

                {/* REQUIREMENTS */}
                <Text style={styles.sectionTitle}>Before you start</Text>

                <View style={styles.highlightCard}>
                    <Text style={styles.textBold}>
                        Prepare these documents:
                    </Text>

                    <Text style={styles.bullet}>• Proof of enrollment</Text>
                    <Text style={styles.bullet}>• Monthly budget</Text>
                    <Text style={styles.bullet}>• Move-in date</Text>
                    <Text style={styles.bullet}>• Lease duration</Text>
                    <Text style={styles.bullet}>• Optional references</Text>
                </View>

                {/* TIPS */}
                <Text style={styles.sectionTitle}>Tips</Text>

                <View style={styles.card}>
                    <Text style={styles.bullet}>• Set your campus first</Text>
                    <Text style={styles.bullet}>• Use filters instead of scrolling</Text>
                    <Text style={styles.bullet}>• Prioritize distance + lease length</Text>
                    <Text style={styles.bullet}>• Save listings you like</Text>
                </View>

                {/* CTA BUTTONS */}
                <Pressable style={styles.primaryButton} onPress={goToSearch}>
                    <Text style={styles.primaryText}>Start Searching</Text>
                </Pressable>

                <Pressable style={styles.secondaryButton} onPress={goToMap}>
                    <Text style={styles.secondaryText}>Go to Map</Text>
                </Pressable>

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
        padding: 16,
        paddingBottom: 120,
    },

    headerCard: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 14,
        marginBottom: 20,
    },

    title: {
        fontSize: 20,
        fontWeight: "800",
        color: "#111827",
    },

    subtitle: {
        marginTop: 6,
        fontSize: 13,
        color: "#6B7280",
    },

    sectionTitle: {
        fontSize: 14,
        fontWeight: "700",
        marginBottom: 10,
        marginTop: 10,
        color: "#111827",
    },

    card: {
        backgroundColor: "#fff",
        padding: 14,
        borderRadius: 12,
        marginBottom: 10,
    },

    highlightCard: {
        backgroundColor: "#EEF2FF",
        padding: 14,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#C7D2FE",
    },

    stepTitle: {
        fontSize: 14,
        fontWeight: "700",
        marginBottom: 4,
        color: "#111827",
    },

    text: {
        fontSize: 13,
        color: "#4B5563",
    },

    textBold: {
        fontSize: 13,
        fontWeight: "700",
        marginBottom: 8,
        color: "#111827",
    },

    bullet: {
        fontSize: 13,
        color: "#374151",
        marginTop: 4,
    },

    primaryButton: {
        marginTop: 20,
        backgroundColor: "#3333CC",
        padding: 14,
        borderRadius: 30,
        alignItems: "center",
    },

    primaryText: {
        color: "#fff",
        fontWeight: "700",
    },

    secondaryButton: {
        marginTop: 10,
        backgroundColor: "#E5E7EB",
        padding: 14,
        borderRadius: 30,
        alignItems: "center",
    },

    secondaryText: {
        color: "#111827",
        fontWeight: "600",
    },
});