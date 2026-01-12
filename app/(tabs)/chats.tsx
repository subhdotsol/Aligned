import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Chats() {
    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea} edges={["top"]}>
                <Text style={styles.headerTitle}>Matches</Text>

                <View style={styles.content}>
                    <Image
                        source={require("@/assets/images/matches_empty.png")}
                        style={styles.illustration}
                        resizeMode="contain"
                    />

                    <Text style={styles.description}>
                        Complete your profile to start getting matches
                    </Text>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.editProfileButton}>
                            <Text style={styles.editProfileText}>Edit profile</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.upgradeButton}>
                            <Ionicons name="sparkles-outline" size={20} color="#000" />
                            <Text style={styles.upgradeText}>Upgrade to Aligned Pro</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
        paddingHorizontal: 24,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "700",
        color: "#000",
        fontFamily: "NunitoSans",
        marginTop: 20,
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 80, // Space for tab bar
    },
    illustration: {
        width: 300,
        height: 300,
        marginBottom: 24,
    },
    description: {
        fontSize: 20,
        fontWeight: "700",
        color: "#000",
        textAlign: "center",
        fontFamily: "Tinos-Bold",
        maxWidth: "80%",
        marginBottom: 40,
    },
    buttonContainer: {
        width: "100%",
        gap: 16,
    },
    editProfileButton: {
        backgroundColor: "#000",
        paddingVertical: 18,
        borderRadius: 30,
        alignItems: "center",
        width: "100%",
    },
    editProfileText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        fontFamily: "NunitoSans",
    },
    upgradeButton: {
        backgroundColor: "#fff",
        paddingVertical: 18,
        borderRadius: 30,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        gap: 10,
        borderWidth: 1,
        borderColor: "#E5E5E5",
        width: "100%",
    },
    upgradeText: {
        color: "#000",
        fontSize: 16,
        fontWeight: "600",
        fontFamily: "NunitoSans",
    },
});
