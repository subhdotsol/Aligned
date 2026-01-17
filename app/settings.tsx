import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import auth from '@react-native-firebase/auth';

export default function Settings() {
    const router = useRouter();

    // State for toggles
    const [pauseProfile, setPauseProfile] = useState(false);
    const [showActiveStatus, setShowActiveStatus] = useState(true);
    const [audioTranscripts, setAudioTranscripts] = useState(false);
    const [connectedGoogle, setConnectedGoogle] = useState(true);

    const SectionHeader = ({ title }: { title: string }) => (
        <Text style={styles.sectionHeader}>{title}</Text>
    );

    const signOutHandler = React.useCallback(async () => {
        console.log("DEBUG: logout handler is called")
        try {
            Alert.alert("LOGOUT", "confirm you want to logout", [{
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
            },
            {
                text: "Logout",
                onPress: () => {
                    auth().signOut().then(() => {
                        console.log("DEBUG: User signed out")
                        router.replace("/")
                    })
                }
            }])


        } catch (error) {
            console.log("DEBUG: Error signing out", error)
        }
    }, [])

    const SettingItem = ({
        title,
        subtitle,
        hasToggle,
        toggleValue,
        onToggle,
        onPress,
        verifiedBadge,
        rightIcon,
    }: {
        title: string;
        subtitle?: string;
        hasToggle?: boolean;
        toggleValue?: boolean;
        onToggle?: (val: boolean) => void;
        onPress?: () => void;
        verifiedBadge?: boolean;
        rightIcon?: React.ReactNode;
    }) => (
        <TouchableOpacity
            style={styles.settingItem}
            onPress={onPress}
            disabled={hasToggle || !onPress}
            activeOpacity={0.7}
        >
            <View style={styles.settingContent}>
                <View style={styles.titleRow}>
                    <Text style={styles.settingTitle}>{title}</Text>
                    {verifiedBadge && (
                        <View style={styles.verifiedBadge}>
                            <Ionicons name="checkmark" size={12} color="#fff" />
                        </View>
                    )}
                    {rightIcon}
                </View>
                {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
            </View>
            {hasToggle && (
                <Switch
                    trackColor={{ false: "#767577", true: "#000" }}
                    thumbColor={"#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={onToggle}
                    value={toggleValue}
                />
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea} edges={["top"]}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={28} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Settings</Text>
                    <View style={{ width: 28 }} />
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Profile Section */}
                    <SectionHeader title="Profile" />
                    <SettingItem
                        title="Pause"
                        subtitle="Pausing prevents your profile from being shown to new people. You can still chat with your current matches."
                        hasToggle
                        toggleValue={pauseProfile}
                        onToggle={setPauseProfile}
                    />
                    <View style={styles.divider} />
                    <SettingItem
                        title="Show Last Active Status"
                        subtitle="People viewing your profile can see your last active status, and you can see theirs. Your matches won't be shown your last active status."
                        hasToggle
                        toggleValue={showActiveStatus}
                        onToggle={setShowActiveStatus}
                    />

                    {/* Safety Section */}
                    <SectionHeader title="Safety" />
                    <SettingItem
                        title="Selfie Verification"
                        subtitle="You're not verified yet."
                        onPress={() => { }}
                    />
                    <View style={styles.divider} />
                    <SettingItem
                        title="Block List"
                        subtitle="Block people you know. They won't see you and you won't see them on Aligned."
                        onPress={() => { }}
                    />
                    <View style={styles.divider} />
                    <SettingItem
                        title="Comment Filter"
                        subtitle="Hide likes from people who use disrespectful language in their comments."
                        onPress={() => { }}
                    />

                    {/* Phone & email */}
                    <SectionHeader title="Phone & email" />
                    <SettingItem
                        title="+91 99705 76362"
                        verifiedBadge
                    />
                    <View style={styles.divider} />
                    <SettingItem
                        title="subhajitchaudhury05@gmail.com"
                        verifiedBadge
                    />

                    {/* Notifications */}
                    <SectionHeader title="Notifications" />
                    <SettingItem
                        title="Push Notifications"
                        onPress={() => { }}
                    />
                    <View style={styles.divider} />
                    <SettingItem
                        title="Emails"
                        onPress={() => { }}
                    />

                    {/* Subscription */}
                    <SectionHeader title="Subscription" />
                    <SettingItem
                        title="Complete Profile to Become a Member"
                        onPress={() => { }}
                    />
                    <View style={styles.divider} />
                    <SettingItem
                        title="Subscribe to Aligned"
                        subtitle="Until you complete your profile, you will have limited access and reduced exposure."
                        onPress={() => { }}
                    />
                    <View style={styles.divider} />
                    <SettingItem
                        title="Restore subscription"
                        onPress={() => { }}
                    />


                    {/* Language & Region */}
                    <SectionHeader title="Language & Region" />
                    <SettingItem
                        title="App Language"
                        subtitle="English"
                        onPress={() => { }}
                    />
                    <View style={styles.divider} />
                    <SettingItem
                        title="Audio Transcripts"
                        subtitle="You'll see text transcripts for audio content (like voice notes) so you can read what's being said."
                        hasToggle
                        toggleValue={audioTranscripts}
                        onToggle={setAudioTranscripts}
                    />
                    <View style={styles.divider} />
                    <SettingItem
                        title="Measurement Units"
                        subtitle="Miles, Feet"
                        onPress={() => { }}
                    />

                    {/* Connected accounts */}
                    <SectionHeader title="Connected accounts" />
                    <SettingItem
                        title="Google"
                        hasToggle
                        toggleValue={connectedGoogle}
                        onToggle={setConnectedGoogle}
                    />

                    {/* Legal */}
                    <SectionHeader title="Legal" />
                    <SettingItem title="Privacy Policy" onPress={() => { }} />
                    <View style={styles.divider} />
                    <SettingItem title="Terms of Service" onPress={() => { }} />
                    <View style={styles.divider} />
                    <SettingItem
                        title="Privacy Preferences"
                        onPress={() => { }}
                        rightIcon={
                            <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center', marginLeft: 8 }}>
                                <View style={styles.privacyToggleContainer}>
                                    <View style={styles.privacyToggleActive}>
                                        <Ionicons name="checkmark-sharp" size={12} color="#7D4ca2" />
                                    </View>
                                    <Ionicons name="close-sharp" size={14} color="#fff" style={{ marginLeft: 2 }} />
                                </View>
                                <View style={styles.newBadge}>
                                    <Text style={styles.newBadgeText}>NEW</Text>
                                </View>
                            </View>
                        }
                    />
                    <View style={styles.divider} />
                    <SettingItem title="Licenses" onPress={() => { }} />
                    <View style={styles.divider} />
                    <SettingItem title="Download My Data" onPress={() => { }} />

                    {/* Community */}
                    <SectionHeader title="Community" />
                    <SettingItem title="Safe Dating Tips" onPress={() => { }} />
                    <View style={styles.divider} />
                    <SettingItem title="Member Principles" onPress={() => { }} />

                    {/* Footer Actions */}
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.footerButton} onPress={signOutHandler}>
                            <Text style={styles.footerButtonText}>Log Out</Text>
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <TouchableOpacity style={styles.footerButton}>
                            <Text style={styles.footerButtonText}>Delete or Pause Account</Text>
                        </TouchableOpacity>
                    </View>

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
    },
    sectionHeader: {
        fontSize: 14,
        color: "#888",
        marginTop: 32,
        marginBottom: 8,
        marginHorizontal: 20,
        fontFamily: "NunitoSans",
        fontWeight: '900',
    },
    settingItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: "#fff",
    },
    settingContent: {
        flex: 1,
        paddingRight: 16,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: "900",
        color: "#000",
        fontFamily: "NunitoSans",
        lineHeight: 22,
    },
    settingSubtitle: {
        fontSize: 14,
        color: "#666",
        marginTop: 4,
        fontFamily: "NunitoSans",
        lineHeight: 20,
    },
    divider: {
        height: 1,
        backgroundColor: "#f0f0f0",
        marginLeft: 20,
    },
    verifiedBadge: {
        backgroundColor: "#ccc",
        width: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8
    },
    privacyToggleContainer: {
        flexDirection: 'row',
        backgroundColor: '#7D4ca2',
        borderRadius: 12,
        padding: 2,
        alignItems: 'center',
        paddingRight: 6
    },
    privacyToggleActive: {
        backgroundColor: '#fff',
        borderRadius: 10,
        width: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    newBadge: {
        backgroundColor: '#7D4ca2',
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    newBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '900'
    },
    footer: {
        marginTop: 30,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    footerButton: {
        paddingVertical: 18,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    footerButtonText: {
        fontSize: 16,
        color: '#000',
        fontWeight: '900',
        fontFamily: 'NunitoSans',
    }
});
