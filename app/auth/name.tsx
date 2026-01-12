import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NameScreen() {
    const router = useRouter();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const handleNext = () => {
        // Complete auth flow, go to tabs
        router.replace("/(tabs)");
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoidingView}
            >
                {/* No back button on this final step usually if it's "onboarding", but lets keep it consistent */}
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#000" />
                </TouchableOpacity>

                <View style={styles.content}>
                    <Text style={styles.headerTitle}>NO BACKGROUND CHECKS ARE CONDUCTED</Text>


                    {/* Title */}
                    <Text style={styles.title}>What's your name?</Text>

                    {/* Inputs */}
                    <View style={styles.inputGroup}>
                        <TextInput
                            style={styles.input}
                            placeholder="First name (required)"
                            placeholderTextColor="#ccc"
                            value={firstName}
                            onChangeText={setFirstName}
                        />
                        <View style={styles.underline} />
                    </View>

                    <View style={styles.inputGroup}>
                        <TextInput
                            style={styles.input}
                            placeholder="Last name"
                            placeholderTextColor="#ccc"
                            value={lastName}
                            onChangeText={setLastName}
                        />
                        <View style={styles.underline} />
                    </View>


                    <Text style={styles.helperText}>
                        Last name is optional, and only shared with matches. <Text style={styles.linkText}>Why?</Text>
                    </Text>

                    <View style={styles.visibilityRow}>
                        <Ionicons name="eye-outline" size={20} color="#000" />
                        <Text style={styles.visibilityText}>Always visible on profile</Text>
                    </View>
                </View>

                {/* FAB */}
                <View style={styles.fabContainer}>
                    <TouchableOpacity
                        style={[styles.fab, !firstName && styles.fabDisabled]}
                        onPress={handleNext}
                        disabled={!firstName}
                    >
                        <Ionicons name="chevron-forward" size={28} color={!firstName ? "#999" : "#fff"} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    backButton: {
        padding: 16,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 10,
    },
    headerTitle: {
        fontSize: 10,
        fontWeight: "700",
        color: "#999",
        textAlign: "center",
        marginBottom: 40,
        letterSpacing: 0.5,
    },
    title: {
        fontSize: 32,
        fontWeight: "900",
        fontFamily: "NunitoSans",
        color: "#000",
        marginBottom: 40,
        lineHeight: 40,
    },
    inputGroup: {
        marginBottom: 32,
    },
    input: {
        fontSize: 24,
        fontWeight: "600", // Semi-bold for input text
        fontFamily: "NunitoSans",
        color: "#000",
        paddingVertical: 8,
    },
    underline: {
        height: 1,
        backgroundColor: "#000",
    },
    helperText: {
        fontSize: 13,
        color: "#444",
        fontFamily: "NunitoSans",
        lineHeight: 18,
        marginTop: -16,
        marginBottom: 32,
    },
    linkText: {
        color: "#8B5A9C",
        fontWeight: "700",
    },
    visibilityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    visibilityText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#000",
        fontFamily: "NunitoSans",
    },
    fabContainer: {
        padding: 24,
        alignItems: "flex-end",
    },
    fab: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "#000",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    fabDisabled: {
        backgroundColor: "#f0f0f0",
        shadowOpacity: 0,
        elevation: 0,
    },
});
