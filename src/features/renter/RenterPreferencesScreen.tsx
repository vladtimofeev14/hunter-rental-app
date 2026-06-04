import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
} from "react-native";
import Slider from "@react-native-community/slider";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { colors } from "../../styles/globalStyles";

const LEASE_OPTIONS = ["4", "8", "12"];
const HOUSING_OPTIONS = ["Shared", "Private"];
const LIFESTYLES = ["Quiet", "Social", "Studious", "Night Owl", "Clean", "Budget-focused"];

export default function RenterPreferencesScreen({ navigation }: any) {
    const insets = useSafeAreaInsets();
    const user = auth.currentUser;

    const [loading, setLoading] = useState(true);

    const [budget, setBudget] = useState(1200);
    const [campus, setCampus] = useState("");
    const [lease, setLease] = useState("8");
    const [housing, setHousing] = useState("Shared");
    const [furnished, setFurnished] = useState(true);
    const [lifestyle, setLifestyle] = useState<string[]>([]);
    const [maxDistanceKm, setMaxDistanceKm] = useState(10);

    // 🔥 LOAD EXISTING DATA (THIS FIXES YOUR RESET BUG)
    useEffect(() => {
        const loadPrefs = async () => {
            if (!user) return;

            try {
                const snap = await getDoc(doc(db, "users", user.uid));

                const prefs = snap.exists() ? snap.data()?.renterPreferences : null;

                if (prefs) {
                    setBudget(prefs.budget ?? 1200);
                    setCampus(prefs.campus ?? "");
                    setLease(prefs.leaseDuration ?? "8");
                    setHousing(prefs.housingType ?? "Shared");
                    setFurnished(prefs.furnished ?? true);
                    setLifestyle(prefs.lifestylePreferences ?? []);
                    setMaxDistanceKm(prefs.maxDistanceKm ?? 10);
                }
            } catch (e) {
                console.log("Prefs load error:", e);
            } finally {
                setLoading(false);
            }
        };

        loadPrefs();
    }, []);

    const toggleLifestyle = (item: string) => {
        setLifestyle((prev) =>
            prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
        );
    };

    const handleSave = async () => {
        if (!user) return;

        const payload = {
            budget,
            campus,
            leaseDuration: lease,
            housingType: housing,
            furnished,
            lifestylePreferences: lifestyle,
            maxDistanceKm,
            updatedAt: new Date().toISOString(),
        };

        try {
            await setDoc(
                doc(db, "users", user.uid),
                {
                    renterPreferences: payload,
                    hasCompletedPreferences: true,
                },
                { merge: true }
            );

            navigation.reset({
                index: 0,
                routes: [{ name: "RenterTabs" }],
            });
        } catch (error) {
            console.log("Firestore save error:", error);
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Preferences</Text>
                    <Text style={styles.subtitle}>Define your ideal living setup.</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Monthly Budget</Text>
                        <Text style={styles.valueText}>${budget}</Text>
                        <Slider
                            minimumValue={500}
                            maximumValue={3000}
                            step={50}
                            value={budget}
                            onValueChange={setBudget}
                            minimumTrackTintColor={colors.primaryBlue}
                            maximumTrackTintColor="#E5E7EB"
                            thumbTintColor={colors.primaryBlue}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Preferred Campus</Text>
                        <TextInput
                            value={campus}
                            onChangeText={setCampus}
                            placeholder="e.g. George Brown College"
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Max Distance (km)</Text>
                        <Text style={styles.valueText}>{maxDistanceKm} km</Text>
                        <Slider
                            minimumValue={1}
                            maximumValue={30}
                            step={1}
                            value={maxDistanceKm}
                            onValueChange={setMaxDistanceKm}
                            minimumTrackTintColor={colors.primaryBlue}
                            maximumTrackTintColor="#E5E7EB"
                            thumbTintColor={colors.primaryBlue}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Lease Length</Text>
                        <View style={styles.row}>
                            {LEASE_OPTIONS.map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    style={[styles.toggle, lease === option && styles.toggleActive]}
                                    onPress={() => setLease(option)}
                                >
                                    <Text style={[styles.toggleText, lease === option && styles.toggleTextActive]}>
                                        {option} mo
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Housing Type</Text>
                        <View style={styles.row}>
                            {HOUSING_OPTIONS.map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    style={[styles.toggle, housing === option && styles.toggleActive]}
                                    onPress={() => setHousing(option)}
                                >
                                    <Text style={[styles.toggleText, housing === option && styles.toggleTextActive]}>
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Lifestyle</Text>
                        <View style={styles.chips}>
                            {LIFESTYLES.map((item) => (
                                <TouchableOpacity
                                    key={item}
                                    style={[styles.chip, lifestyle.includes(item) && styles.chipActive]}
                                    onPress={() => toggleLifestyle(item)}
                                >
                                    <Text style={styles.chipText}>{item}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.button} onPress={handleSave}>
                    <Text style={styles.buttonText}>Save Preferences</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFFFFF" },
    content: { paddingHorizontal: 24, paddingBottom: 24 },
    header: { marginBottom: 28, alignItems: "center" },
    title: { fontSize: 28, fontWeight: "800", color: "#111827" },
    subtitle: { fontSize: 13, color: "#6B7280", textAlign: "center" },

    form: { gap: 20 },

    inputGroup: { gap: 10 },

    label: { fontSize: 13, fontWeight: "600", color: "#374151" },

    valueText: { fontSize: 16, fontWeight: "700", color: colors.primaryBlue },

    input: {
        backgroundColor: "#F3F4F6",
        padding: 14,
        borderRadius: 14,
    },

    row: { flexDirection: "row", gap: 10 },

    toggle: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: "#F3F4F6",
        alignItems: "center",
    },

    toggleActive: {
        backgroundColor: "#E5EBFB",
        borderWidth: 1,
        borderColor: colors.primaryBlue,
    },

    toggleText: { fontSize: 13, color: "#6B7280" },

    toggleTextActive: { color: colors.primaryBlue, fontWeight: "700" },

    chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },

    chip: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: "#F3F4F6",
    },

    chipActive: {
        backgroundColor: "#E5EBFB",
        borderColor: colors.primaryBlue,
        borderWidth: 1,
    },

    chipText: { fontSize: 12, color: "#4B5563" },

    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: "#F3F4F6",
        backgroundColor: "#fff",
    },

    button: {
        backgroundColor: colors.deepPurple,
        paddingVertical: 16,
        borderRadius: 999,
        alignItems: "center",
    },

    buttonText: {
        color: "white",
        fontSize: 15,
        fontWeight: "700",
    },
});