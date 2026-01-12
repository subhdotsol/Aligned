import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function InterstitialScreen() {
    const router = useRouter();

    useEffect(() => {
        // Auto-advance after 3 seconds
        const timer = setTimeout(() => {
            router.push("/auth/name");
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity
                style={styles.content}
                activeOpacity={1}
                onPress={() => router.push("/auth/name")}
            >
                <View style={styles.textContainer}>
                    <Text style={styles.title}>You're one of a kind.</Text>
                    <Text style={styles.title}>Your profile should</Text>
                    <Text style={styles.title}>be, too.</Text>
                </View>

                {/* Illustration Placeholder - Little creature eyes from screenshot */}
                <View style={styles.illustration}>
                    <View style={styles.blob}>
                        <View style={styles.eyesRow}>
                            <View style={styles.eye}>
                                <View style={styles.pupil} />
                            </View>
                            <View style={styles.eye}>
                                <View style={styles.pupil} />
                            </View>
                        </View>
                        <View style={styles.line} />
                    </View>
                </View>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 32,
    },
    textContainer: {
        marginBottom: 60,
    },
    title: {
        fontSize: 32,
        fontWeight: "900",
        fontFamily: "Tinos-Bold", // Use Serif for this brand moment
        color: "#000",
        textAlign: "left", // Hinge style left aligned usually, but centered in container
        lineHeight: 40,
    },
    illustration: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    blob: {
        width: 200,
        height: 180,
        backgroundColor: '#F5F0F7', // Light purple bg
        borderRadius: 100, // Blob shape
        justifyContent: 'flex-end',
        paddingBottom: 20,
        alignItems: 'center',
    },
    eyesRow: {
        flexDirection: 'row',
        gap: 4,
        marginBottom: 2,
    },
    eye: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pupil: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#000',
    },
    line: {
        width: 120,
        height: 2,
        backgroundColor: '#000',
        marginTop: 0,
    }
});
