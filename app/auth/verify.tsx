import { useAuth } from "@/lib/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
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
import { phoneConfirmation, submittedPhoneNumber } from "./phone";

export default function VerificationScreen() {
    const router = useRouter();
    const { verify } = useAuth();
    const params = useLocalSearchParams<{ verificationId: string; phone: string }>();
    const [code, setCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    console.log('[VERIFY] Screen mounted');
    console.log('[VERIFY] phoneConfirmation exists:', !!phoneConfirmation);
    console.log('[VERIFY] submittedPhoneNumber:', submittedPhoneNumber);

    const verifyOtp = async (otpCode: string) => {
        console.log('[VERIFY] verifyOtp called with code:', otpCode);

        if (!phoneConfirmation) {
            console.log('[VERIFY] ERROR: No phoneConfirmation object!');
            Alert.alert("Error", "No verification session found. Please go back and try again.");
            return;
        }

        console.log('[VERIFY] phoneConfirmation.verificationId:', phoneConfirmation.verificationId);
        console.log('[VERIFY] Starting verification...');

        setIsLoading(true);
        try {
            console.log('[VERIFY] Calling phoneConfirmation.confirm()...');
            const userCredential = await phoneConfirmation.confirm(otpCode);

            console.log('[VERIFY] SUCCESS: OTP verified!');
            console.log('[VERIFY] User UID:', userCredential?.user?.uid);
            console.log('[VERIFY] User phone:', userCredential?.user?.phoneNumber);
            console.log('[VERIFY] Navigating to interstitial...');

            // OTP verified successfully - navigate to next screen
            router.push("/auth/interstitial");
        } catch (error: any) {
            console.log('[VERIFY] ERROR verifying OTP:');
            console.log('[VERIFY] Error code:', error.code);
            console.log('[VERIFY] Error message:', error.message);
            console.log('[VERIFY] Full error:', JSON.stringify(error, null, 2));
            Alert.alert(
                "Verification Failed",
                error.message || "Invalid code. Please try again."
            );
        } finally {
            console.log('[VERIFY] verifyOtp completed, setting loading to false');
            setIsLoading(false);
        }
    };

    const handleTextChange = (text: string) => {
        console.log('[VERIFY] Code input changed:', text, 'length:', text.length);
        setCode(text);
        if (text.length === 6) {
            console.log('[VERIFY] 6 digits entered, auto-verifying...');
            // Verify OTP when 6 digits entered
            verifyOtp(text);
        }
    };

    const handleNext = () => {
        console.log('[VERIFY] Next button pressed, code:', code);
        if (code.length === 6) {
            verifyOtp(code);
        }
    };

    const handleEdit = () => {
        console.log('[VERIFY] Edit pressed, going back');
        router.back();
    };

    // Format phone number for display (mask middle digits)
    const displayPhone = submittedPhoneNumber
        ? submittedPhoneNumber.replace(/(\+91)(\d{2})(\d{4})(\d{4})/, "$1 $2****$4")
        : "+91 ••••••••••";

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
                        <Ionicons name="shield-checkmark-outline" size={32} color="#000" />
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>Enter your verification{"\n"}code</Text>

                    <View style={styles.subtitleRow}>
                        <Text style={styles.subtitle}>Sent to {displayPhone} • </Text>
                        <TouchableOpacity onPress={handleEdit}>
                            <Text style={styles.editLink}>Edit</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Code Input */}
                    <View style={styles.codeContainer}>
                        <View style={styles.blocksContainer}>
                            {[0, 1, 2, 3, 4, 5].map((index) => (
                                <View key={index} style={[styles.codeBlock, code[index] ? styles.codeBlockFilled : null]}>
                                    <Text style={styles.codeText}>{code[index] || ""}</Text>
                                    <View style={styles.blockLine} />
                                </View>
                            ))}
                        </View>

                        <TextInput
                            style={styles.hiddenInput}
                            keyboardType="number-pad"
                            maxLength={6}
                            autoFocus
                            value={code}
                            onChangeText={handleTextChange}
                            caretHidden
                            editable={!isLoading}
                        />
                    </View>

                    {isLoading && (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="small" color="#8B5A9C" />
                            <Text style={styles.loadingText}>Verifying...</Text>
                        </View>
                    )}
                </View>

                {/* Footer nav */}
                <View style={styles.footer}>
                    <TouchableOpacity disabled={isLoading}>
                        <Text style={styles.resendText}>Didn't get a code?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.fab, (code.length < 6 || isLoading) && styles.fabDisabled]}
                        onPress={handleNext}
                        disabled={code.length < 6 || isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#999" />
                        ) : (
                            <Ionicons name="chevron-forward" size={28} color={code.length < 6 ? "#999" : "#fff"} />
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
        marginBottom: 16,
        lineHeight: 40,
    },
    subtitleRow: {
        flexDirection: 'row',
        marginBottom: 48,
    },
    subtitle: {
        fontSize: 15,
        color: "#666",
        fontFamily: "NunitoSans",
    },
    editLink: {
        fontSize: 15,
        color: "#8B5A9C",
        fontWeight: '700',
        fontFamily: "NunitoSans",
    },
    codeContainer: {
        position: 'relative',
        height: 60,
        justifyContent: 'center',
    },
    blocksContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    codeBlock: {
        width: 40,
        alignItems: 'center',
    },
    codeBlockFilled: {},
    codeText: {
        fontSize: 24,
        fontWeight: '700',
        fontFamily: "NunitoSans",
        color: '#000',
        marginBottom: 8,
    },
    blockLine: {
        width: '100%',
        height: 2,
        backgroundColor: '#000',
    },
    hiddenInput: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 24,
        gap: 8,
    },
    loadingText: {
        fontSize: 14,
        color: '#666',
        fontFamily: "NunitoSans",
    },
    footer: {
        padding: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    resendText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#4B0082',
        fontFamily: "NunitoSans",
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
