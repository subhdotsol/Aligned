import { Profile, Prompt, profiles } from "@/data/profiles";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

// --- Reusing Card Components (Adapted for Full Screen) ---

function ImageCard({ image }: { image: any }) {
    return (
        <View style={styles.imageCard}>
            <Image source={image} style={styles.cardImage} resizeMode="cover" />
        </View>
    );
}

function PromptCard({ prompt }: { prompt: Prompt }) {
    return (
        <View style={styles.promptCard}>
            <Text style={styles.promptQuestion}>{prompt.question}</Text>
            <Text style={styles.promptAnswer}>{prompt.answer}</Text>
            <View style={styles.promptLikeIcon}>
                <Ionicons name="heart-outline" size={20} color="#666" />
            </View>
        </View>
    );
}

function InfoCard({ profile }: { profile: Profile }) {
    return (
        <View style={styles.infoCard}>
            {/* Basic Info Row */}
            <View style={styles.infoRow}>
                {profile.age && (
                    <View style={styles.infoChip}>
                        <Ionicons name="person-outline" size={16} color="#000" />
                        <Text style={styles.infoChipText}>{profile.age}</Text>
                    </View>
                )}
                {profile.gender && (
                    <View style={styles.infoChip}>
                        <Ionicons name="male-female-outline" size={16} color="#000" />
                        <Text style={styles.infoChipText}>{profile.gender}</Text>
                    </View>
                )}
                {profile.sexuality && (
                    <View style={styles.infoChip}>
                        <Ionicons name="heart-circle-outline" size={16} color="#000" />
                        <Text style={styles.infoChipText}>{profile.sexuality}</Text>
                    </View>
                )}
                {profile.height && (
                    <View style={styles.infoChip}>
                        <Ionicons name="resize-outline" size={16} color="#000" />
                        <Text style={styles.infoChipText}>{profile.height}</Text>
                    </View>
                )}
            </View>

            {/* Details List */}
            <View style={styles.detailsList}>
                {profile.job && (
                    <View style={styles.detailRow}>
                        <Ionicons name="briefcase-outline" size={20} color="#000" />
                        <Text style={styles.detailText}>{profile.job}</Text>
                    </View>
                )}
                {profile.location && (
                    <View style={styles.detailRow}>
                        <Ionicons name="location-outline" size={20} color="#000" />
                        <Text style={styles.detailText}>{profile.location}</Text>
                    </View>
                )}
                {profile.ethnicity && (
                    <View style={styles.detailRow}>
                        <Ionicons name="globe-outline" size={20} color="#000" />
                        <Text style={styles.detailText}>{profile.ethnicity}</Text>
                    </View>
                )}
                {profile.politics && (
                    <View style={styles.detailRow}>
                        <Ionicons name="flag-outline" size={20} color="#000" />
                        <Text style={styles.detailText}>{profile.politics}</Text>
                    </View>
                )}
                {profile.datingIntention && (
                    <View style={styles.detailRow}>
                        <Ionicons name="search-outline" size={20} color="#000" />
                        <View>
                            <Text style={styles.detailTitle}>Dating Intention</Text>
                            <Text style={styles.detailSubtext}>{profile.datingIntention}</Text>
                        </View>
                    </View>
                )}
                {profile.relationshipType && (
                    <View style={styles.detailRow}>
                        <Ionicons name="people-outline" size={20} color="#000" />
                        <View>
                            <Text style={styles.detailTitle}>{profile.relationshipType}</Text>
                            <Text style={styles.detailSubtext}>I am looking for a true person to connect with.</Text>
                        </View>
                    </View>
                )}
                {/* Simplified remaining details for readability */}
                {profile.drinks && (
                    <View style={styles.detailRow}>
                        <Ionicons name="wine-outline" size={20} color="#000" />
                        <Text style={styles.detailText}>Drinks: {profile.drinks}</Text>
                    </View>
                )}
                {profile.smokes && (
                    <View style={styles.detailRow}>
                        <Ionicons name="leaf-outline" size={20} color="#000" />
                        <Text style={styles.detailText}>Smokes: {profile.smokes}</Text>
                    </View>
                )}
            </View>
        </View>
    );
}

// --- Main Screen ---

export default function UserDetail() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const profile = profiles.find((p) => p.id === id);

    if (!profile) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={28} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Profile Not Found</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea} edges={["top"]}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={28} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{profile.name}</Text>
                    <View style={{ width: 28 }} />
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* First Image */}
                    <ImageCard image={profile.images[0]} />

                    {/* Name & Badge Row (Usually overlay in card, but nice to have distinct here) */}
                    <View style={styles.nameRow}>
                        <Text style={styles.nameText}>{profile.name}, {profile.age}</Text>
                        <Ionicons name="checkmark-circle" size={24} color="#8B5A9C" />
                    </View>

                    {/* First Prompt */}
                    {profile.prompts[0] && <PromptCard prompt={profile.prompts[0]} />}

                    {/* Info Card */}
                    <InfoCard profile={profile} />

                    {/* Second Image */}
                    {profile.images[1] && <ImageCard image={profile.images[1]} />}

                    {/* Second Prompt */}
                    {profile.prompts[1] && <PromptCard prompt={profile.prompts[1]} />}

                    {/* Third Image */}
                    {profile.images[2] && <ImageCard image={profile.images[2]} />}

                    {/* Third Prompt */}
                    {profile.prompts[2] && <PromptCard prompt={profile.prompts[2]} />}

                    <View style={{ height: 40 }} />
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
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0'
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "900",
        color: "#000",
        fontFamily: "NunitoSans",
    },
    backButton: {
        padding: 4,
    },
    scrollContent: {
        padding: 20,
    },
    imageCard: {
        marginBottom: 12,
        borderRadius: 12,
        overflow: "hidden",
    },
    cardImage: {
        width: "100%",
        height: width * 1.25, // Aspect ratio
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    nameText: {
        fontSize: 28,
        fontWeight: '800',
        fontFamily: 'NunitoSans',
        color: '#000',
    },
    promptCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#E5E5E5",
        position: "relative",
    },
    promptQuestion: {
        fontSize: 14,
        fontWeight: "700",
        color: "#000",
        marginBottom: 8,
        fontFamily: "NunitoSans",
    },
    promptAnswer: {
        fontSize: 24,
        fontWeight: "600",
        color: "#000",
        fontFamily: "NunitoSans",
        lineHeight: 32,
    },
    promptLikeIcon: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        padding: 8,
    },
    infoCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#E5E5E5",
    },
    infoRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    infoChip: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: "#F5F5F5",
        borderRadius: 20,
        gap: 6,
    },
    infoChipText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#000",
        fontFamily: "NunitoSans",
    },
    detailsList: {
        gap: 16,
    },
    detailRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
    },
    detailText: {
        fontSize: 15,
        fontWeight: "700", // Heavier
        color: "#000",
        fontFamily: "NunitoSans",
    },
    detailTitle: {
        fontSize: 15,
        fontWeight: "800", // Heavier
        color: "#000",
        fontFamily: "NunitoSans",
    },
    detailSubtext: {
        fontSize: 13,
        fontWeight: "600",
        color: "#111", // Darker
        marginTop: 2,
        fontFamily: "NunitoSans",
    },
});
