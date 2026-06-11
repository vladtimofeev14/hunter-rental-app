import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    FlatList,
    ScrollView,
} from "react-native";
import Slider from "@react-native-community/slider";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { colors, buttons } from "../../styles/globalStyles";

import { CAMPUSES } from "./data/campuses";

const LEASE_OPTIONS = ["4", "8", "12"];
const HOUSING_OPTIONS = ["Shared", "Private"];
const PROPERTY_TYPES = ["Condo", "House", "Studio"];
const LIFESTYLES = [
    "Quiet",
    "Social",
    "Studious",
    "Night Owl",
    "Clean",
    "Budget-focused",
];

export default function RenterPreferencesScreen({ navigation }: any) {
    const insets = useSafeAreaInsets();
    const user = auth.currentUser;

    const [loading, setLoading] = useState(true);

    const [budget, setBudget] = useState(1200);
    const [campusId, setCampusId] = useState<string | null>(null);

    const [lease, setLease] = useState("8");
    const [housing, setHousing] = useState("Shared");
    const [propertyType, setPropertyType] = useState<string | null>(null);

    const [lifestyle, setLifestyle] = useState<string[]>([]);
    const [maxDistanceKm, setMaxDistanceKm] = useState(10);

    const [campusModal, setCampusModal] = useState(false);

    const selectedCampus = CAMPUSES.find((c) => c.id === campusId);

    useEffect(() => {
        const loadPrefs = async () => {
            if (!user) return;

            const snap = await getDoc(doc(db, "users", user.uid));
            const prefs = snap.exists() ? snap.data()?.renterPreferences : null;

            if (prefs) {
                setBudget(prefs.budget ?? 1200);
                setCampusId(prefs.campusId ?? null);
                setLease(prefs.leaseLength ? prefs.leaseLength.replace(" Month", "") : "8");
                setHousing(prefs.housingType ?? "Shared");
                setPropertyType(prefs.propertyType ?? null);
                setLifestyle(prefs.lifestylePreferences ?? []);
                setMaxDistanceKm(prefs.maxDistanceKm ?? 10);
            }

            setLoading(false);
        };

        loadPrefs();
    }, []);

    const toggleLifestyle = (item: string) => {
        setLifestyle((prev) =>
            prev.includes(item)
                ? prev.filter((x) => x !== item)
                : [...prev, item]
        );
    };

    const handleSave = async () => {
        if (!user) return;

        const payload = {
            budget,
            campusId,
            campusName: selectedCampus?.name ?? null,
            campusLat: selectedCampus?.lat ?? null,
            campusLng: selectedCampus?.lng ?? null,
            leaseLength: lease ? `${lease} Month` : null,
            housingType: housing,
            propertyType,
            lifestylePreferences: lifestyle,
            maxDistanceKm,
            updatedAt: new Date().toISOString(),
        };

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
    };

    if (loading) {
        return (
            <View style={styles.loading}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={[
                    styles.content,
                    {
                        paddingTop: insets.top + 16,
                        paddingBottom: insets.bottom + 120,
                    },
                ]}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>Preferences</Text>

                {/* BUDGET */}
                <Text style={styles.label}>Budget</Text>
                <Text style={styles.valueText}>${budget}</Text>
                <Slider
                    minimumValue={500}
                    maximumValue={3000}
                    step={50}
                    value={budget}
                    onValueChange={setBudget}
                />

                {/* CAMPUS */}
                <Text style={styles.label}>Campus</Text>
                <TouchableOpacity
                    style={styles.selector}
                    onPress={() => setCampusModal(true)}
                >
                    <Text style={styles.selectorText}>
                        {selectedCampus ? selectedCampus.name : "Select campus"}
                    </Text>
                </TouchableOpacity>

                {/* DISTANCE */}
                <Text style={styles.label}>Max Distance</Text>
                <Text style={styles.valueText}>{maxDistanceKm} km</Text>
                <Slider
                    minimumValue={1}
                    maximumValue={30}
                    step={1}
                    value={maxDistanceKm}
                    onValueChange={setMaxDistanceKm}
                />

                {/* LEASE */}
                <Text style={styles.label}>Lease</Text>
                <View style={styles.row}>
                    {LEASE_OPTIONS.map((o) => (
                        <TouchableOpacity
                            key={o}
                            onPress={() => setLease(o)}
                            style={[
                                styles.toggle,
                                lease === o && styles.toggleActive,
                            ]}
                        >
                            <Text>{o} mo</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* HOUSING */}
                <Text style={styles.label}>Housing</Text>
                <View style={styles.row}>
                    {HOUSING_OPTIONS.map((o) => (
                        <TouchableOpacity
                            key={o}
                            onPress={() => setHousing(o)}
                            style={[
                                styles.toggle,
                                housing === o && styles.toggleActive,
                            ]}
                        >
                            <Text>{o}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* PROPERTY TYPE */}
                <Text style={styles.label}>Property Type</Text>
                <View style={styles.row}>
                    {PROPERTY_TYPES.map((type) => (
                        <TouchableOpacity
                            key={type}
                            onPress={() =>
                                setPropertyType(propertyType === type ? null : type)
                            }
                            style={[
                                styles.toggle,
                                propertyType === type && styles.toggleActive,
                            ]}
                        >
                            <Text>{type}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* LIFESTYLE */}
                <Text style={styles.label}>Lifestyle</Text>
                <View style={styles.chips}>
                    {LIFESTYLES.map((l) => (
                        <TouchableOpacity
                            key={l}
                            onPress={() => toggleLifestyle(l)}
                            style={[
                                styles.chip,
                                lifestyle.includes(l) && styles.chipActive,
                            ]}
                        >
                            <Text>{l}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* SAVE BUTTON */}
                <TouchableOpacity style={buttons.primary} onPress={handleSave}>
                    <Text style={buttons.primaryText}>Save Preferences</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* CAMPUS MODAL */}
            <Modal visible={campusModal} animationType="slide">
                <SafeAreaView style={styles.modal}>
                    <FlatList
                        data={CAMPUSES}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.campusItem,
                                    campusId === item.id && styles.campusActive,
                                ]}
                                onPress={() => {
                                    setCampusId(item.id);
                                    setCampusModal(false);
                                }}
                            >
                                <Text style={styles.campusText}>
                                    {item.name} - {item.city}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />

                    <TouchableOpacity
                        onPress={() => setCampusModal(false)}
                        style={buttons.primary}
                    >
                        <Text style={buttons.primaryText}>Close</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },

    content: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingBottom: 40,
    },

    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    title: {
        fontSize: 28,
        fontWeight: "800",
        color: "#111827",
        marginBottom: 18,
    },

    label: {
        fontSize: 13,
        fontWeight: "600",
        color: colors.textSecondary,
        marginTop: 18,
        marginBottom: 6,
    },

    valueText: {
        fontSize: 16,
        fontWeight: "700",
        color: colors.primaryBlue,
        marginBottom: 6,
    },

    selector: {
        backgroundColor: colors.lightBlueAccent,
        padding: 14,
        borderRadius: 14,
        marginBottom: 10,
    },

    selectorText: {
        fontSize: 14,
        color: "#111827",
        fontWeight: "500",
    },

    row: {
        flexDirection: "row",
        gap: 10,
        marginTop: 6,
    },

    toggle: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 14,
        backgroundColor: colors.lightBlueAccent,
        alignItems: "center",
    },

    toggleActive: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.primaryBlue,
    },

    chips: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginTop: 6,
        marginBottom: 24,
    },

    chip: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: colors.lightBlueAccent,
    },

    chipActive: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.primaryBlue,
    },

    campusItem: {
        padding: 14,
        marginHorizontal: 16,
        marginTop: 10,
        borderRadius: 12,
        backgroundColor: colors.lightBlueAccent,
    },

    campusActive: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.primaryBlue,
    },

    campusText: {
        fontSize: 13,
        fontWeight: "500",
        color: "#111827",
    },

    modal: {
        flex: 1,
        backgroundColor: colors.white,
    },
});