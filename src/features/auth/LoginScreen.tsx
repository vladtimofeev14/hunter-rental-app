import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { REMEMBER_ME_KEY } from "../../config/storageKeys";
import { colors, sizes } from "../../styles/globalStyles";

export default function LoginScreen({ navigation }: any) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        const cleanEmail = email.trim();

        if (!cleanEmail || !password) {
            setError("Enter email and password.");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const cred = await signInWithEmailAndPassword(
                auth,
                cleanEmail,
                password
            );

            const uid = cred.user.uid;

            // FETCH ROLE IN FIREBASE + NAVIGATING DEPENDING ON IT
            const userSnap = await getDoc(doc(db, "users", uid));

            const role = userSnap.exists() ? userSnap.data()?.role : null;

            if (rememberMe) {
                await AsyncStorage.setItem(REMEMBER_ME_KEY, "true");
            } else {
                await AsyncStorage.removeItem(REMEMBER_ME_KEY);
            }

            if (role === "renter") {
                navigation.reset({
                    index: 0,
                    routes: [{ name: "RenterDashboard" }],
                });
            } else if (role === "landlord") {
                navigation.reset({
                    index: 0,
                    routes: [{ name: "LandlordDashboard" }],
                });
            } else {
                setError("User role not found.");
            }

        } catch (e: any) {
            setError(e?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.card}>

                    <Image
                        source={require("../../../assets/logo-icon-blue.png")}
                        style={styles.logo}
                        resizeMode="contain"
                    />

                    <Text style={styles.title}>Welcome back</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <TouchableOpacity
                        style={styles.rememberRow}
                        onPress={() => setRememberMe(!rememberMe)}
                    >
                        <Ionicons
                            name={rememberMe ? "checkbox" : "square-outline"}
                            size={22}
                            color={rememberMe ? colors.primaryBlue : colors.textSecondary}
                        />
                        <Text style={styles.rememberText}>
                            Remember Me
                        </Text>
                    </TouchableOpacity>

                    {error && <Text style={styles.error}>{error}</Text>}

                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>
                            {loading ? "Signing in..." : "Login"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                        <Text style={styles.link}>
                            Don't have an account? Sign up
                        </Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.white },
    content: { flexGrow: 1, justifyContent: "center", padding: 20 },
    card: { width: "100%" },

    logo: {
        width: 80,
        height: 80,
        alignSelf: "center",
        marginBottom: 20,
    },

    title: {
        fontSize: sizes.large,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 30,
    },

    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
    },

    button: {
        backgroundColor: colors.primaryBlue,
        padding: 15,
        borderRadius: 30,
        alignItems: "center",
    },

    buttonText: { color: "white", fontWeight: "600" },

    rememberRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },

    rememberText: {
        marginLeft: 8,
        color: colors.black,
        fontWeight: "600",
    },

    error: { color: "red", marginBottom: 10 },

    link: {
        marginTop: 20,
        textAlign: "center",
        color: colors.primaryBlue,
    },
});
