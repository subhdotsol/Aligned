import ProfileCard from "@/components/ProfileCard";
import { profiles } from "@/data/profiles";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedProfiles, setLikedProfiles] = useState<string[]>([]);
  const [passedProfiles, setPassedProfiles] = useState<string[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  const currentProfile = profiles[currentIndex];

  const goToNextProfile = () => {
    const nextIndex = (currentIndex + 1) % profiles.length;
    setCurrentIndex(nextIndex);
    // Scroll to top for new profile
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
  };

  const handleLike = (id: string) => {
    setLikedProfiles([...likedProfiles, id]);
    console.log("Liked profile:", id);
    goToNextProfile();
  };

  const handlePass = (id: string) => {
    setPassedProfiles([...passedProfiles, id]);
    console.log("Passed profile:", id);
    goToNextProfile();
  };


  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1" edges={["top"]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{currentProfile?.name || "Aligned"}</Text>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Profile Prompt Banner */}
        <View style={styles.promptBanner}>
          <TouchableOpacity style={styles.editProfileButton}>
            <Text style={styles.editProfileText}>Edit profile</Text>
          </TouchableOpacity>
          <Text style={styles.promptText}>
            Complete your profile to send and receive messages, likes, and roses.
          </Text>
        </View>

        {/* Profile Content */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ProfileCard
            profile={currentProfile}
            onLike={handleLike}
            onPass={handlePass}
          />

          {/* Bottom padding for tab bar */}
          <View style={{ height: 120 }} />
        </ScrollView>

        {/* Static X button - fixed at bottom */}
        <View style={styles.staticPassButtonContainer}>
          <TouchableOpacity
            style={styles.staticPassButton}
            onPress={() => handlePass(currentProfile.id)}
          >
            <Ionicons name="close" size={28} color="#000" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    position: "relative",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    fontFamily: "NunitoSans",
  },
  headerButton: {
    position: "absolute",
    right: 20,
    padding: 4,
  },
  promptBanner: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    padding: 14,
    backgroundColor: "#FBE8E7",
    borderRadius: 12,
    gap: 12,
  },
  editProfileButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    fontFamily: "NunitoSans",
  },
  promptText: {
    flex: 1,
    fontSize: 13,
    color: "#333",
    fontFamily: "NunitoSans",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#000",
    marginTop: 20,
    fontFamily: "NunitoSans",
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
    fontFamily: "NunitoSans",
  },
  resetButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#000",
    borderRadius: 25,
  },
  resetButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
    fontFamily: "NunitoSans",
  },
  staticPassButtonContainer: {
    position: "absolute",
    bottom: 100,
    left: 20,
    zIndex: 100,
  },
  staticPassButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
});
