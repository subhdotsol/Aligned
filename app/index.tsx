import { useRouter } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import React, { useRef, useState } from "react";
import {
    Alert,
    Animated,
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import auth, { FirebaseAuthTypes, onAuthStateChanged } from '@react-native-firebase/auth';
import { GoogleSignin, isErrorWithCode, statusCodes } from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
    webClientId: '761529171367-2eh2930aibssqdgde798vu7en29libp1.apps.googleusercontent.com',
    offlineAccess: true,
});

const { width, height } = Dimensions.get("window");

// Video source for background
const videoSource = require("@/assets/video/bg.mp4");

export default function LoginScreen() {
    const router = useRouter();
    const [user, setUser] = React.useState<FirebaseAuthTypes.User | null>();

    // check the current status of the application
    function onAuthStatusChanged(user: FirebaseAuthTypes.User | null) {
        setUser(user);
    }

    React.useEffect(() => {
        const subscriber = onAuthStateChanged(auth(), onAuthStatusChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    // Create video player with expo-video
    const player = useVideoPlayer(videoSource, (player) => {
        player.loop = true;
        player.muted = true;
        player.play();
    });
    const [showSignInOptions, setShowSignInOptions] = useState(false);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;

    const handleCreateAccount = () => {
        // Bypass for now - go directly to main app
        router.replace("/(tabs)");
    };

    const handleSignIn = () => {
        // Animate to sign in options
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setShowSignInOptions(true);
        });
    };

    const handleBack = () => {
        // Animate back to main view
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setShowSignInOptions(false);
        });
    };

    const handleGoogleSignIn = async () => {
        console.log("DEBUG: handleGoogleSignIn called");

        // If user is already logged in, skip sign-in
        if (user) {
            console.log("DEBUG: User Details", user);
            console.log("DEBUG: user already logged in, skipping sign-in");
            router.replace("/(tabs)");
            return;
        }

        console.log("DEBUG: user is null, proceeding with sign-in");

        try {
            // Check if your device supports Google Play
            console.log("DEBUG: Checking Play Services...");
            await GoogleSignin.hasPlayServices({
                showPlayServicesUpdateDialog: true,
            });
            console.log("DEBUG: Play Services OK");

            console.log("DEBUG: Starting GoogleSignin.signIn()...");
            const { type, data } = await GoogleSignin.signIn();
            console.log("DEBUG: signIn result - type:", type, "data:", JSON.stringify(data, null, 2));

            if (type === 'success') {
                console.log("DEBUG: Sign-in success, creating Firebase credential...");
                console.log("DEBUG: idToken exists:", !!data.idToken);

                // Create a Google credential with the token
                const googleCredential = auth.GoogleAuthProvider.credential(data.idToken);
                console.log("DEBUG: Credential created, signing into Firebase...");

                // Sign-in the user with the credential
                let value = await auth().signInWithCredential(googleCredential);
                console.log("DEBUG: Firebase sign-in successful!");

                if (value) {
                    console.log('DEBUG: additionalUserInfo:', JSON.stringify(value.additionalUserInfo, null, 2));
                    console.log('DEBUG: user:', JSON.stringify(value.user, null, 2));
                }

                router.replace("/(tabs)");
            } else if (type === 'cancelled') {
                console.log("DEBUG: User cancelled sign-in");
                return; // do nothing
            }

        } catch (error: any) {
            // Log the full error for debugging
            console.error("DEBUG: Full error object:", error);
            console.error("DEBUG: Error code:", error?.code);
            console.error("DEBUG: Error message:", error?.message);

            if (isErrorWithCode(error)) {
                switch (error.code) {
                    case statusCodes.SIGN_IN_CANCELLED:
                        Alert.alert("Sign In Cancelled", "User cancelled the login flow. Please try again.");
                        break;
                    case statusCodes.IN_PROGRESS:
                        Alert.alert("Please Wait", "Sign In already in progress.");
                        break;
                    case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                        Alert.alert("Play Services Error", "Play services not available or outdated. Please update.");
                        break;
                    default:
                        // Show the actual error code and message
                        Alert.alert(
                            "Sign In Error",
                            `Error code: ${error.code}\nMessage: ${error.message || 'Unknown error'}`
                        );
                }
            } else {
                // Show Firebase or other error details
                Alert.alert(
                    "Error",
                    `${error?.message || 'An unknown error occurred'}\n\nCode: ${error?.code || 'N/A'}`
                );
            }
        }
    };

    const handlePhoneSignIn = () => {
        // Bypass for now - go directly to main app
        router.replace("/(tabs)");
    };

    const mainButtonsTranslateY = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 100],
    });

    const signInOptionsTranslateY = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [100, 0],
    });

    return (
        <View style={styles.container}>
            {/* Video Background */}
            <VideoView
                player={player}
                style={styles.backgroundVideo}
                contentFit="cover"
                nativeControls={false}
            />

            {/* Dark overlay for better text visibility */}
            <View style={styles.overlay} />

            {/* Content */}
            <SafeAreaView style={styles.content}>
                {/* Logo Section - Centered */}
                <View style={styles.logoSection}>
                    <Text style={styles.appName}>Align</Text>
                    <Text style={styles.tagline}>Designed to find your match.</Text>
                </View>

                {/* Bottom Section */}
                <View style={styles.bottomSection}>
                    {/* Terms Text */}
                    <Text style={styles.termsText}>
                        By tapping 'Sign in' / 'Create account', you agree to our{" "}
                        <Text style={styles.linkText}>Terms of Service</Text>. Learn how we
                        process your data in our{" "}
                        <Text style={styles.linkText}>Privacy Policy</Text> and{" "}
                        <Text style={styles.linkText}>Cookies Policy</Text>.
                    </Text>

                    {/* Main Buttons - Initial View */}
                    {!showSignInOptions && (
                        <Animated.View
                            style={[
                                styles.buttonsContainer,
                                {
                                    opacity: fadeAnim,
                                    transform: [{ translateY: mainButtonsTranslateY }],
                                },
                            ]}
                        >
                            {/* Create Account Button */}
                            <TouchableOpacity
                                style={styles.createAccountButton}
                                onPress={handleCreateAccount}
                            >
                                <Text style={styles.createAccountText}>Create account</Text>
                            </TouchableOpacity>

                            {/* Sign In Button */}
                            <TouchableOpacity
                                style={styles.signInButton}
                                onPress={handleSignIn}
                            >
                                <Text style={styles.signInText}>Sign in</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    )}

                    {/* Sign In Options View */}
                    {showSignInOptions && (
                        <Animated.View
                            style={[
                                styles.buttonsContainer,
                                {
                                    opacity: slideAnim,
                                    transform: [{ translateY: signInOptionsTranslateY }],
                                },
                            ]}
                        >
                            {/* Last Sign In Hint */}
                            <Text style={styles.lastSignInText}>
                                You signed in last time with Google.
                            </Text>

                            {/* Sign in with Google Button */}
                            <TouchableOpacity
                                style={styles.googleButton}
                                onPress={handleGoogleSignIn}
                            >
                                <Image
                                    source={require("@/assets/icons/google.png")}
                                    style={styles.googleIcon}
                                />
                                <Text style={styles.googleButtonText}>Sign in with Google</Text>
                            </TouchableOpacity>

                            {/* Sign in with Phone Number Button */}
                            <TouchableOpacity
                                style={styles.phoneButton}
                                onPress={() => router.push("/auth/phone")}
                            >
                                <Text style={styles.phoneButtonText}>Sign in with Phone Number</Text>
                            </TouchableOpacity>

                            {/* Back Button */}
                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={handleBack}
                            >
                                <Text style={styles.backButtonText}>Back</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    )}
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    backgroundVideo: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width: width,
        height: height,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
    content: {
        flex: 1,
        justifyContent: "space-between",
    },
    logoSection: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 80,
    },
    appName: {
        fontSize: 56,
        fontWeight: "700",
        color: "#fff",
        fontFamily: "NunitoSans",
        letterSpacing: -1,
    },
    tagline: {
        fontSize: 18,
        color: "#fff",
        marginTop: 8,
        fontFamily: "NunitoSans",
        fontWeight: "500",
        opacity: 0.9,
    },
    bottomSection: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    termsText: {
        fontSize: 13,
        color: "#fff",
        textAlign: "center",
        lineHeight: 20,
        marginBottom: 24,
        fontFamily: "NunitoSans",
        opacity: 0.85,
    },
    linkText: {
        textDecorationLine: "underline",
        fontWeight: "600",
    },
    buttonsContainer: {
        // Empty container for animation
    },
    createAccountButton: {
        backgroundColor: "#8B5A9C",
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: "center",
        marginBottom: 16,
    },
    createAccountText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
        fontFamily: "NunitoSans",
    },
    signInButton: {
        paddingVertical: 16,
        alignItems: "center",
    },
    signInText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
        fontFamily: "NunitoSans",
    },
    // Sign In Options Styles
    lastSignInText: {
        fontSize: 13,
        color: "#fff",
        textAlign: "center",
        marginBottom: 16,
        fontFamily: "NunitoSans",
        opacity: 0.85,
    },
    googleButton: {
        backgroundColor: "#fff",
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: "center",
        marginBottom: 12,
        flexDirection: "row",
        justifyContent: "center",
    },
    googleIcon: {
        width: 20,
        height: 20,
        marginRight: 12,
    },
    googleButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000",
        fontFamily: "NunitoSans",
    },
    phoneButton: {
        backgroundColor: "#8B5A9C",
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: "center",
        marginBottom: 16,
    },
    phoneButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
        fontFamily: "NunitoSans",
    },
    backButton: {
        paddingVertical: 16,
        alignItems: "center",
    },
    backButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
        fontFamily: "NunitoSans",
    },
});
