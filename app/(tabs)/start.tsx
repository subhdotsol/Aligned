import { profiles } from "@/data/profiles";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = width * 0.9;
// Calculate height to fill most of the screen above navbar (approx 80-100px for nav)
// Header is approx 60px, top inset approx 50px.
// Reduce height to 65% to add spacing above navbar
const CARD_HEIGHT = height * 0.65;

export default function Start() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea} edges={["top"]}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.headerTitle}>Featured</Text>
                        <TouchableOpacity style={styles.infoButton}>
                            <Ionicons name="information-circle-outline" size={20} color="#666" />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.rosesButton}>
                        <Ionicons name="rose-outline" size={18} color="#8B5A9C" />
                        <Text style={styles.rosesText}>Roses (0)</Text>
                    </TouchableOpacity>
                </View>

                {/* Horizontally Scrollable Featured */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    snapToInterval={CARD_WIDTH + 12} // Card width + gap
                    decelerationRate="fast"
                    pagingEnabled={false}
                >
                    {profiles.map((profile, index) => (
                        <TouchableOpacity
                            key={profile.id}
                            style={styles.cardContainer}
                            activeOpacity={0.9}
                            onPress={() => router.push(`/user/${profile.id}`)}
                        >
                            {/* Profile Image */}
                            <View style={styles.imageContainer}>
                                <Image
                                    source={profile.images[0]}
                                    style={styles.profileImage}
                                    contentFit="cover"
                                />
                                {/* Name overlay on image */}
                                <View style={styles.nameOverlay}>
                                    <Text style={styles.profileName}>{profile.name}</Text>
                                    <View style={styles.verifiedBadge}>
                                        <Ionicons name="checkmark-circle" size={24} color="#8B5A9C" />
                                    </View>
                                </View>
                            </View>

                            {/* Prompt Card */}
                            <View style={styles.promptCard}>
                                <Text style={styles.promptQuestion}>
                                    {profile.prompts[0]?.question}
                                </Text>
                                <Text style={styles.promptAnswer} numberOfLines={3}>
                                    {profile.prompts[0]?.answer}
                                </Text>
                                {/* Rose Button */}
                                <TouchableOpacity style={styles.roseButton}>
                                    <Ionicons name="rose-outline" size={24} color="#666" />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: "#000",
        fontFamily: "NunitoSans",
    },
    infoButton: {
        padding: 4,
    },
    rosesButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F5F0F7",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
    },
    rosesText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#8B5A9C",
        fontFamily: "NunitoSans",
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        gap: 12,
        alignItems: 'center', // Center cards vertically if needed
    },
    cardContainer: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        // Remove individual shadows if they cause issues, but keeping for depth
    },
    imageContainer: {
        width: "100%",
        height: "70%", // Give image more space
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        overflow: "hidden",
        position: "relative",
    },
    profileImage: {
        width: "100%",
        height: "100%",
    },
    nameOverlay: {
        position: "absolute",
        top: 16,
        left: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    profileName: {
        fontSize: 32,
        fontWeight: "900", // Max bold
        color: "#fff",
        fontFamily: "NunitoSans",
        textShadowColor: "rgba(0, 0, 0, 0.75)", // Darker shadow
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 10, // Wider shadow
    },
    verifiedBadge: {
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 2,
    },
    promptCard: {
        backgroundColor: "#fff",
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        padding: 24,
        paddingBottom: 24,
        height: "30%", // Remaining height
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 6,
        position: "relative",
        justifyContent: 'center',
    },
    promptQuestion: {
        fontSize: 14,
        color: "#666",
        fontFamily: "NunitoSans",
        marginBottom: 8,
        fontWeight: '600'
    },
    promptAnswer: {
        fontSize: 24,
        fontWeight: "700",
        color: "#000",
        fontFamily: "Tinos-Bold",
        lineHeight: 32,
        paddingRight: 50,
    },
    roseButton: {
        position: "absolute",
        bottom: 24,
        right: 24,
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#F5F0F7",
        justifyContent: "center",
        alignItems: "center",
    },
});
