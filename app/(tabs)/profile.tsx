
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";

const PROFILE_IMAGE = { uri: "https://avatars.githubusercontent.com/u/77573811?v=4" };

type Tab = "Get more" | "Safety" | "My Aligned";

export default function Profile() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("Get more");

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.headerLogo}>Align</Text>
              <View style={styles.headerRightIcons}>
                <TouchableOpacity onPress={() => router.push('/dating-preferences')}>
                  <Ionicons name="options-outline" size={24} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/settings')}>
                  <Ionicons name="settings-outline" size={24} color="#000" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.profileInfo}>
              <View style={styles.avatarContainer}>
                {/* Progress Circle */}
                <Svg height="120" width="120" viewBox="0 0 120 120" style={styles.progressCircle}>
                  <Circle
                    cx="60"
                    cy="60"
                    r="58"
                    stroke="#F0F0F0"
                    strokeWidth="4"
                    fill="none"
                  />
                  <Circle
                    cx="60"
                    cy="60"
                    r="58"
                    stroke="#7D4ca2"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 58}`}
                    strokeDashoffset={`${2 * Math.PI * 58 * (1 - 0.11)}`} // 11% progress
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                  />
                </Svg>
                <Image source={PROFILE_IMAGE} style={styles.avatar} />
                <View style={styles.percentBadge}>
                  <Text style={styles.percentText}>11%</Text>
                </View>
                <TouchableOpacity style={styles.editIcon}>
                  <Ionicons name="pencil" size={14} color="#555" />
                </TouchableOpacity>
              </View>

              <View style={styles.nameContainer}>
                <Text style={styles.name}>Shubh</Text>
                <MaterialCommunityIcons name="check-decagram" size={22} color="#b4b4b4" />
              </View>
              <Text style={styles.statusText}>Incomplete profile</Text>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            {(["Get more", "Safety", "My Aligned"] as Tab[]).map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.activeTab]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                  {tab}
                </Text>
                {tab === "My Aligned" && <View style={styles.notificationDot} />}
              </TouchableOpacity>
            ))}
          </View>

          {/* Content */}
          <View style={styles.tabContent}>
            {activeTab === "Get more" && (
              <View style={styles.getMoreContent}>
                {/* Aligned Pro Banner */}
                <View style={styles.proBanner}>
                  <Image
                    source={require("@/assets/images/aligned_pro_banner.png")}
                    style={styles.bannerImage}
                    resizeMode="cover"
                  />
                  <View style={styles.bannerOverlay}>
                    <Text style={styles.proTitle}>Aligned Pro</Text>
                    <Text style={styles.proSubtitle}>Get seen sooner and{"\n"}go on 3x as many dates</Text>
                    <TouchableOpacity style={styles.upgradeBtn}>
                      <Text style={styles.upgradeBtnText}>Upgrade</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Boost Card */}
                <View style={styles.optionCard}>
                  <View style={[styles.iconCircle, { backgroundColor: "#1A7474" }]}>
                    <Ionicons name="flash" size={24} color="#fff" />
                    <View style={styles.badgeCount}><Text style={styles.badgeText}>0</Text></View>
                  </View>
                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionTitle}>Boost</Text>
                    <Text style={styles.optionSubtitle}>Get seen by 11X more people</Text>
                  </View>
                </View>

                {/* Roses Card */}
                <View style={styles.optionCard}>
                  <View style={[styles.iconCircle, { backgroundColor: "#9D8CA1" }]}>
                    <Ionicons name="rose" size={24} color="#fff" />
                    <View style={styles.badgeCount}><Text style={styles.badgeText}>0</Text></View>
                  </View>
                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionTitle}>Roses</Text>
                    <Text style={styles.optionSubtitle}>2x as likely to lead to a date</Text>
                  </View>
                </View>
              </View>
            )}

            {activeTab === "Safety" && (
              <View style={styles.safetyContent}>
                <View style={styles.optionCard}>
                  <View style={[styles.iconCircle, { backgroundColor: "#F5F5F5" }]}>
                    <MaterialCommunityIcons name="shield-check-outline" size={24} color="#000" />
                  </View>
                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionTitle}>Selfie Verification</Text>
                    <Text style={styles.optionSubtitle}>You're not verified yet.</Text>
                  </View>
                </View>

                <View style={styles.optionCard}>
                  <View style={[styles.iconCircle, { backgroundColor: "#E3E4FA" }]}>
                    <MaterialCommunityIcons name="eye-off-outline" size={24} color="#000" />
                    <View style={styles.checkBadge}><Ionicons name="checkmark" size={10} color="#fff" /></View>
                  </View>
                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionTitle}>Comment Filter</Text>
                    <Text style={styles.optionSubtitle}>Hiding likes with disrespectful language.</Text>
                  </View>
                </View>

                <View style={styles.optionCard}>
                  <View style={[styles.iconCircle, { backgroundColor: "#F5F5F5" }]}>
                    <Ionicons name="hand-left-outline" size={24} color="#000" />
                  </View>
                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionTitle}>Block List</Text>
                    <Text style={styles.optionSubtitle}>Block people you know.</Text>
                  </View>
                </View>

                <Text style={styles.sectionTitle}>Explore safety resources</Text>
                <View style={styles.resourcesRow}>
                  <TouchableOpacity style={styles.resourceBtn}>
                    <Ionicons name="call-outline" size={20} color="#000" />
                    <Text style={styles.resourceText}>Crisis Hotlines</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.resourceBtn}>
                    <Ionicons name="help-circle-outline" size={20} color="#000" />
                    <Text style={styles.resourceText}>Help Center</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {activeTab === "My Aligned" && (
              <View style={styles.myAlignedContent}>
                {/* Complete Profile Card */}
                <View style={styles.completeProfileCard}>
                  <View style={styles.logoBadge}>
                    <Text style={styles.logoLetter}>A</Text>
                    <View style={styles.alertDot} />
                  </View>
                  <Text style={styles.completeTitle}>Complete your profile</Text>
                  <Text style={styles.completeSubtitle}>You're almost there — just a few more details to start matching.</Text>
                  <TouchableOpacity style={styles.editProfileBtn}>
                    <Text style={styles.editProfileBtnText}>Edit profile</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.optionCard}>
                  <View style={[styles.iconCircle, { backgroundColor: "#F5F5F5" }]}>
                    <Ionicons name="help" size={24} color="#000" />
                  </View>
                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionTitle}>Help Center</Text>
                    <Text style={styles.optionSubtitle}>Safety, Security, and more</Text>
                  </View>
                </View>

                <View style={styles.optionCard}>
                  <View style={[styles.iconCircle, { backgroundColor: "#F5F5F5" }]}>
                    <Ionicons name="bulb-outline" size={24} color="#000" />
                  </View>
                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionTitle}>What Works</Text>
                    <Text style={styles.optionSubtitle}>Check out our expert dating tips</Text>
                  </View>
                </View>
              </View>
            )}
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
  scrollContent: {
    paddingBottom: 100, // Space for tab bar
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  headerLogo: {
    fontFamily: "Tinos-Bold",
    fontSize: 28,
    color: "#000",
  },
  headerRightIcons: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  profileInfo: {
    alignItems: "center",
  },
  avatarContainer: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    position: "relative",
  },
  progressCircle: {
    position: "absolute",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  percentBadge: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "#7D4ca2",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#fff",
  },
  percentText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  editIcon: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 6,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    fontFamily: "NunitoSans",
  },
  statusText: {
    fontSize: 14,
    color: "#666",
    fontFamily: "NunitoSans",
  },
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginHorizontal: 0,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#000",
  },
  tabText: {
    fontSize: 15,
    color: "#666",
    fontWeight: "600",
    fontFamily: "NunitoSans",
  },
  activeTabText: {
    color: "#000",
  },
  notificationDot: {
    position: "absolute",
    top: 14,
    right: 14, // Adjusted for typical screen width
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FF3B30",
  },
  tabContent: {
    padding: 20,
  },
  // Get More Styles
  getMoreContent: {
    gap: 16,
  },
  proBanner: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)", // Slight darken
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  proTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    fontFamily: "Tinos-Bold", // Using Serif for elegance
    marginBottom: 8,
  },
  proSubtitle: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
    fontFamily: "NunitoSans",
    fontWeight: "600",
  },
  upgradeBtn: {
    backgroundColor: "#fff",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
  },
  upgradeBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    gap: 16,
    marginBottom: 12,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  badgeCount: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#555",
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    fontFamily: "NunitoSans",
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 14,
    color: "#666",
    fontFamily: "NunitoSans",
  },
  // Safety Styles
  safetyContent: {
    gap: 12,
  },
  checkBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#000",
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginTop: 20,
    marginBottom: 12,
    fontFamily: "NunitoSans",
  },
  resourcesRow: {
    flexDirection: "row",
    gap: 12,
  },
  resourceBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    backgroundColor: "#fff",
  },
  resourceText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  // My Aligned (Settings)
  myAlignedContent: {
    gap: 16,
  },
  completeProfileCard: {
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    marginBottom: 12,
  },
  logoBadge: {
    width: 48,
    height: 48,
    backgroundColor: "#F5F5F5",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    position: "relative",
  },
  logoLetter: {
    fontSize: 24,
    fontWeight: "900", // Extra bold for logo feel
    fontFamily: "Tinos-Bold",
  },
  alertDot: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FF3B30",
    borderWidth: 2,
    borderColor: "#fff",
  },
  completeTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
  },
  completeSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  editProfileBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#000",
  },
  editProfileBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
  },
});