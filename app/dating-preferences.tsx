import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DatingPreferences() {
    const router = useRouter();

    const PreferenceItem = ({
        title,
        value,
        isLocked,
        isDealbreaker,
    }: {
        title: string;
        value: string;
        isLocked?: boolean;
        isDealbreaker?: boolean;
    }) => (
        <View style={styles.itemContainer}>
            <View style={styles.itemContent}>
                <View style={styles.itemHeader}>
                    <Text style={styles.itemTitle}>{title}</Text>
                    {isDealbreaker && (
                        <Text style={styles.dealbreakerText}>Dealbreaker</Text>
                    )}
                </View>
                <Text style={[styles.itemValue, isLocked && styles.lockedText]}>
                    {value}
                </Text>
            </View>
            {isLocked && (
                <Ionicons name="lock-closed-outline" size={20} color="#D24E4E" />
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea} edges={["top"]}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={28} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Dating Preferences</Text>
                    <View style={{ width: 28 }} />
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>

                    {/* Member Preferences */}
                    <Text style={styles.sectionTitle}>Member Preferences</Text>
                    <Text style={styles.sectionSubtitle}>Complete your profile to unlock</Text>

                    <PreferenceItem
                        title="I'm interested in"
                        value="Women"
                    />
                    <View style={styles.divider} />

                    <PreferenceItem
                        title="My neighborhood"
                        value="Rahul Nagar"
                    />
                    <View style={styles.divider} />

                    <PreferenceItem
                        title="Maximum distance"
                        value="Open to all"
                        isLocked
                    />
                    <View style={styles.divider} />

                    <PreferenceItem
                        title="Age range"
                        value="Open to all"
                        isLocked
                        isDealbreaker
                    />
                    <View style={styles.divider} />

                    <PreferenceItem
                        title="Ethnicity"
                        value="Open to all"
                        isLocked
                    />
                    <View style={styles.divider} />

                    <PreferenceItem
                        title="Religion"
                        value="Open to all"
                        isLocked
                    />
                    <View style={styles.divider} />

                    <PreferenceItem
                        title="Relationship Type"
                        value="Open to all"
                        isLocked
                    />
                    <View style={styles.divider} />


                    {/* Subscriber Preferences */}
                    <Text style={[styles.sectionTitle, { marginTop: 32 }]}>Subscriber Preferences</Text>

                    {/* Upgrade Banner */}
                    <View style={styles.upgradeBanner}>
                        <TouchableOpacity style={styles.upgradeButton}>
                            <Text style={styles.upgradeButtonText}>Upgrade</Text>
                        </TouchableOpacity>
                        <Text style={styles.upgradeText}>Fine tune your preferences with a subscription.</Text>
                    </View>

                    <PreferenceItem
                        title="Height"
                        value="Open to all"
                        isLocked
                    />
                    <View style={styles.divider} />

                    <PreferenceItem
                        title="Dating Intentions"
                        value="Open to all"
                        isLocked
                    />
                    <View style={styles.divider} />

                    <PreferenceItem
                        title="Children"
                        value="Open to all"
                        isLocked
                    />
                    <View style={styles.divider} />

                    <PreferenceItem
                        title="Family Plans"
                        value="Open to all"
                        isLocked
                    />
                    <View style={styles.divider} />

                    <PreferenceItem
                        title="Drugs"
                        value="Open to all"
                        isLocked
                    />
                    <View style={styles.divider} />

                    <PreferenceItem
                        title="Smoking"
                        value="Open to all"
                        isLocked
                    />
                    <View style={styles.divider} />

                    <PreferenceItem
                        title="Marijuana"
                        value="Open to all"
                        isLocked
                    />
                    <View style={styles.divider} />

                    <PreferenceItem
                        title="Drinking"
                        value="Open to all"
                        isLocked
                    />
                    <View style={styles.divider} />

                    <PreferenceItem
                        title="Politics"
                        value="Open to all"
                        isLocked
                    />
                    <View style={styles.divider} />

                    <PreferenceItem
                        title="Education"
                        value="Open to all"
                        isLocked
                    />
                    <View style={styles.divider} />

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
        borderBottomColor: "#f0f0f0",
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "900",
        color: "#000",
        fontFamily: "NunitoSans",
    },
    scrollContent: {
        paddingBottom: 40,
        paddingTop: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '900',
        color: '#ccc', // Light gray like "Member Preferences" in screenshot
        fontFamily: 'NunitoSans',
        paddingHorizontal: 20,
        marginBottom: 4,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: '#D24E4E', // reddish warning color
        fontWeight: '700',
        fontFamily: 'NunitoSans',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
    },
    itemContent: {
        flex: 1,
        paddingRight: 16,
    },
    itemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '900',
        color: '#000',
        fontFamily: 'NunitoSans',
    },
    dealbreakerText: {
        fontSize: 12,
        color: '#ccc',
        fontFamily: 'NunitoSans',
        fontWeight: '600'
    },
    itemValue: {
        fontSize: 14,
        color: '#000',
        fontFamily: 'NunitoSans',
    },
    lockedText: {
        color: '#ccc',
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginLeft: 20,
    },
    // Upgrade Banner
    upgradeBanner: {
        backgroundColor: '#F3EBF5', // Light purple bg
        marginHorizontal: 20,
        marginVertical: 16,
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    upgradeButton: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    upgradeButtonText: {
        fontSize: 14,
        fontWeight: '900',
        color: '#7D4ca2', // Aligned purple
    },
    upgradeText: {
        flex: 1,
        fontSize: 14,
        color: '#000',
        fontFamily: 'NunitoSans',
        fontWeight: '600',
        lineHeight: 20,
    }
});
