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

import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { colors } from "../../styles/globalStyles";

export default function LoginScreen({ navigation }: any) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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

            const userSnap = await getDoc(doc(db, "users", uid));
            const role = userSnap.exists() ? userSnap.data()?.role : null;

            if (role === "renter") {
                navigation.reset({
                    index: 0,
                    routes: [{ name: "RenterPreferencesScreen" }],
                });
            } else if (role === "landlord") {
                navigation.reset({
                    index: 0,
                    routes: [{ name: "LandlordSetupScreen" }],
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
                        placeholderTextColor="#A0A0A0"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        placeholderTextColor="#A0A0A0"
                    />

                    {error && <Text style={styles.error}>{error}</Text>}

                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>
                            {loading ? "Signing in..." : "Login"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate("Signup")}
                        style={styles.signupContainer}
                    >
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
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },

    content: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 20,
    },

    card: {
        width: "100%",
    },

    logo: {
        width: 90,
        height: 90,
        alignSelf: "center",
        marginBottom: 18,
    },

    title: {
        fontSize: 30,
        fontWeight: "800",
        textAlign: "center",
        marginBottom: 28,
        color: "#111827",
        letterSpacing: -0.5,
    },

    input: {
        backgroundColor: "#F3F4F6",
        paddingVertical: 16,
        paddingHorizontal: 18,
        borderRadius: 14,
        marginBottom: 12,
        fontSize: 16,
        color: "#111827",
        textAlignVertical: "center",
        includeFontPadding: false,
    },

    button: {
        backgroundColor: colors.deepPurple,
        paddingVertical: 18,
        borderRadius: 999,
        alignItems: "center",
        marginTop: 10,
    },

    buttonText: {
        color: "white",
        fontWeight: "700",
        fontSize: 16,
    },

    error: {
        color: "#DC2626",
        marginBottom: 10,
        marginTop: 4,
    },

    signupContainer: {
        marginTop: 18,
        alignItems: "center",
    },

    link: {
        color: colors.primaryBlue,
        fontSize: 13,
        fontWeight: "600",
    },
});