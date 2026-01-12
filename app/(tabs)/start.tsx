import { profiles } from "@/data/profiles";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
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

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = CARD_WIDTH * 1.55;

// Get first 5 profiles for standouts
const standoutProfiles = profiles.slice(0, 5);

export default function Start() {
    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea} edges={["top"]}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.headerTitle}>Standouts</Text>
                        <TouchableOpacity style={styles.infoButton}>
                            <Ionicons name="information-circle-outline" size={20} color="#666" />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.rosesButton}>
                        <Ionicons name="rose-outline" size={18} color="#8B5A9C" />
                        <Text style={styles.rosesText}>Roses (0)</Text>
                    </TouchableOpacity>
                </View>

                {/* Horizontally Scrollable Standouts */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    snapToInterval={CARD_WIDTH + 12}
                    decelerationRate="fast"
                >
                    {standoutProfiles.map((profile, index) => (
                        <View key={profile.id} style={styles.cardContainer}>
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
                                        <Ionicons name="checkmark-circle" size={20} color="#8B5A9C" />
                                    </View>
                                </View>
                            </View>

                            {/* Prompt Card */}
                            <View style={styles.promptCard}>
                                <Text style={styles.promptQuestion}>
                                    {profile.prompts[0]?.question}
                                </Text>
                                <Text style={styles.promptAnswer}>
                                    {profile.prompts[0]?.answer}
                                </Text>
                                {/* Rose Button */}
                                <TouchableOpacity style={styles.roseButton}>
                                    <Ionicons name="rose-outline" size={20} color="#666" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}

                    {/* Upgrade Card */}
                    <View style={styles.cardContainer}>
                        <View style={styles.upgradeCard}>
                            <Ionicons name="refresh" size={48} color="#8B5A9C" />
                            <Text style={styles.upgradeTitle}>Upgrade to refresh</Text>
                            <Text style={styles.upgradeSubtitle}>
                                Get new standouts and more features
                            </Text>
                            <TouchableOpacity style={styles.upgradeButton}>
                                <Text style={styles.upgradeButtonText}>See Plans</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
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
    },
    cardContainer: {
        width: CARD_WIDTH,
    },
    imageContainer: {
        width: "100%",
        height: CARD_HEIGHT * 0.65,
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
        fontSize: 24,
        fontWeight: "600",
        color: "#fff",
        fontFamily: "NunitoSans",
        textShadowColor: "rgba(0, 0, 0, 0.5)",
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    verifiedBadge: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 2,
    },
    promptCard: {
        backgroundColor: "#fff",
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        padding: 20,
        paddingBottom: 24,
        minHeight: CARD_HEIGHT * 0.35,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        position: "relative",
    },
    promptQuestion: {
        fontSize: 13,
        color: "#666",
        fontFamily: "NunitoSans",
        marginBottom: 6,
    },
    promptAnswer: {
        fontSize: 20,
        fontWeight: "700",
        color: "#000",
        fontFamily: "Tinos-Bold",
        lineHeight: 28,
        paddingRight: 50,
    },
    roseButton: {
        position: "absolute",
        bottom: 12,
        right: 12,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#F5F0F7",
        justifyContent: "center",
        alignItems: "center",
    },
    upgradeCard: {
        width: "100%",
        height: CARD_HEIGHT,
        backgroundColor: "#F8F8F8",
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    upgradeTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: "#000",
        fontFamily: "Tinos-Bold",
        marginTop: 16,
        textAlign: "center",
    },
    upgradeSubtitle: {
        fontSize: 14,
        color: "#666",
        fontFamily: "NunitoSans",
        marginTop: 8,
        textAlign: "center",
    },
    upgradeButton: {
        marginTop: 24,
        backgroundColor: "#8B5A9C",
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 25,
    },
    upgradeButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
        fontFamily: "NunitoSans",
    },
});
