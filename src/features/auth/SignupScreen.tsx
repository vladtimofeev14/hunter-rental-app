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
} from "react-native";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import { auth, db } from "../../config/firebase";
import { colors, sizes } from "../../styles/globalStyles";

export default function SignupScreen({ navigation }: any) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState<"renter" | "landlord" | null>(null);

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const validatePassword = (pwd: string) => {
        return pwd.length >= 6;
    };

    const handleSignup = async () => {
        const cleanFirstName = firstName.trim();
        const cleanLastName = lastName.trim();
        const cleanEmail = email.trim();

        if (
            !cleanFirstName ||
            !cleanLastName ||
            !cleanEmail ||
            !password ||
            !confirmPassword ||
            !role
        ) {
            setError("Fill all fields and select account type.");
            return;
        }

        if (!validatePassword(password)) {
            setError("Password must be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const userCredential =
                await createUserWithEmailAndPassword(
                    auth,
                    cleanEmail,
                    password
                );

            const uid = userCredential.user.uid;

            await setDoc(doc(db, "users", uid), {
                firstName: cleanFirstName,
                lastName: cleanLastName,
                email: cleanEmail,
                role,
                schoolAddress: "",
                profileImageURL: "",
                favoritesID: [],
                rentingID: [],
                propertiesID: [],
                createdAt: new Date().toISOString(),
            });

            // SEND TO LOGIN ONLY
            navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
            });

        } catch (e: any) {
            setError(e?.message || "Signup failed");
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

                    <Text style={styles.title}>
                        Create Account
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="First Name"
                        value={firstName}
                        onChangeText={setFirstName}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Last Name"
                        value={lastName}
                        onChangeText={setLastName}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                    />

                    <View style={styles.roleContainer}>

                        <TouchableOpacity
                            style={[
                                styles.roleButton,
                                role === "renter" &&
                                styles.roleSelected,
                            ]}
                            onPress={() => setRole("renter")}
                        >
                            <Text
                                style={{
                                    color:
                                        role === "renter"
                                            ? "white"
                                            : "black",
                                }}
                            >
                                Renter
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.roleButton,
                                role === "landlord" &&
                                styles.roleSelected,
                            ]}
                            onPress={() =>
                                setRole("landlord")
                            }
                        >
                            <Text
                                style={{
                                    color:
                                        role === "landlord"
                                            ? "white"
                                            : "black",
                                }}
                            >
                                Landlord
                            </Text>
                        </TouchableOpacity>

                    </View>

                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                    />

                    {error && (
                        <Text style={styles.error}>
                            {error}
                        </Text>
                    )}

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleSignup}
                    >
                        <Text style={styles.buttonText}>
                            {loading
                                ? "Creating..."
                                : "Sign Up"}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.loginContainer}>
                        <TouchableOpacity
                            onPress={() =>
                                navigation.goBack()
                            }
                        >
                            <Text style={styles.link}>
                                Already have an account?
                                Login
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.disclaimer}>
                        By signing up, I agree to
                        Hunter Terms & Conditions and
                        Privacy Policy.
                    </Text>

                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },

    content: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 20,
    },

    card: {
        width: "100%",
    },

    title: {
        fontSize: sizes.large,
        fontWeight: "700",
        marginBottom: 20,
        textAlign: "center",
    },

    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },

    roleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 15,
    },

    roleButton: {
        flex: 1,
        padding: 12,
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        alignItems: "center",
    },

    roleSelected: {
        backgroundColor:
            colors.primaryBlue,
        borderColor:
            colors.primaryBlue,
    },

    link: {
        color: colors.primaryBlue,
        fontSize: 12,
    },

    disclaimer: {
        fontSize: 12,
        marginTop: 15,
        textAlign: "center",
        color: "#666",
    },

    button: {
        backgroundColor:
            colors.primaryBlue,
        padding: 15,
        borderRadius: 30,
        alignItems: "center",
        marginTop: 10,
    },

    buttonText: {
        color: "white",
        fontWeight: "600",
    },

    error: {
        color: "red",
        marginTop: 10,
    },

    loginContainer: {
        alignItems: "center",
        marginTop: 15,
    },
});
