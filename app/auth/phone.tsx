import { useAuth } from "@/lib/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

// Store confirmation globally so verify screen can access it
export let phoneConfirmation: FirebaseAuthTypes.ConfirmationResult | null = null;
export let submittedPhoneNumber: string = "";

export default function PhoneInputScreen() {
    const router = useRouter();
    const { login } = useAuth();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const sendOtp = async () => {
        console.log('[PHONE] sendOtp called');
        console.log('[PHONE] Raw phone number:', phoneNumber);

        if (!phoneNumber) {
            console.log('[PHONE] ERROR: Phone number is empty');
            Alert.alert("Error", "Phone number is required");
            return;
        }

        // Format phone number with country code
        const formattedNumber = phoneNumber.startsWith("+91")
            ? phoneNumber
            : `+91${phoneNumber}`;

        console.log('[PHONE] Formatted number:', formattedNumber);
        console.log('[PHONE] Starting OTP request...');

        setIsLoading(true);
        try {
            console.log('[PHONE] Calling auth().signInWithPhoneNumber()...');
            const confirmation = await auth().signInWithPhoneNumber(formattedNumber);

            console.log('[PHONE] SUCCESS: OTP sent!');
            console.log('[PHONE] Confirmation object received:', !!confirmation);
            console.log('[PHONE] Verification ID:', confirmation.verificationId);

            // Store for verify screen to use
            phoneConfirmation = confirmation;
            submittedPhoneNumber = formattedNumber;

            console.log('[PHONE] Navigating to verify screen...');
            // Navigate to verify screen
            router.push("/auth/verify");
        } catch (error: any) {
            console.log('[PHONE] ERROR sending OTP:');
            console.log('[PHONE] Error code:', error.code);
            console.log('[PHONE] Error message:', error.message);
            console.log('[PHONE] Full error:', JSON.stringify(error, null, 2));
            Alert.alert(
                "Error",
                error.message || "Failed to send OTP. Please try again."
            );
        } finally {
            console.log('[PHONE] sendOtp completed, setting loading to false');
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoidingView}
            >
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#000" />
                </TouchableOpacity>

                <View style={styles.content}>
                    {/* Header Icon */}
                    <View style={styles.iconContainer}>
                        <Ionicons name="call-outline" size={32} color="#000" />
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>What's your phone{"\n"}number?</Text>

                    {/* Input Row */}
                    <View style={styles.inputRow}>
                        {/* Country Code (Static for now) */}
                        <View style={styles.countryCodeContainer}>
                            <Text style={styles.flag}>🇮🇳</Text>
                            <Text style={styles.countryCodeText}>+91</Text>
                            <Ionicons name="chevron-down" size={16} color="#000" />
                        </View>

                        {/* Divider */}
                        <View style={styles.divider} />

                        {/* Phone Input */}
                        <TextInput
                            style={styles.input}
                            placeholder=""
                            keyboardType="phone-pad"
                            autoFocus
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            selectionColor="#8B5A9C"
                            editable={!isLoading}
                        />
                    </View>
                    <View style={styles.underline} />

                    {/* Footer Text */}
                    <Text style={styles.footerText}>

                        We will send you a text with a verification code. Message and data rates may apply.
                    </Text>
                </View>

                {/* Floating Action Button */}
                <View style={styles.fabContainer}>
                    <TouchableOpacity
                        style={[styles.fab, (!phoneNumber || isLoading) && styles.fabDisabled]}

                        onPress={sendOtp}

                        disabled={!phoneNumber || isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#999" />
                        ) : (
                            <Ionicons name="chevron-forward" size={28} color={!phoneNumber ? "#999" : "#fff"} />
                        )}
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
        paddingTop: 40,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: "#000",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: "900",
        fontFamily: "NunitoSans",
        color: "#000",
        marginBottom: 40,
        lineHeight: 40,
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    countryCodeContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginRight: 16,
    },
    flag: {
        fontSize: 24,
    },
    countryCodeText: {
        fontSize: 20,
        fontWeight: "700",
        fontFamily: "NunitoSans",
        color: "#000",
    },
    divider: {
        width: 1,
        height: 24,
        backgroundColor: "#ccc",
        marginRight: 16,
    },
    input: {
        flex: 1,
        fontSize: 20,
        fontWeight: "600",
        fontFamily: "NunitoSans",
        color: "#000",
        padding: 0,
    },
    underline: {
        height: 1,
        backgroundColor: "#000",
        marginBottom: 16,
    },
    footerText: {
        fontSize: 14,
        color: "#888",
        fontFamily: "NunitoSans",
        lineHeight: 20,
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
