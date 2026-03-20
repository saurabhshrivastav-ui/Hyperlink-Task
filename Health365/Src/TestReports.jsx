import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Image,
  TextInput,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import {
  Ionicons,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
import { Text } from "../Components/TextWrapper";

const { width } = Dimensions.get("window");
const isMini = width <= 360;
const isSmall = width <= 390;

const REPORTS = [
  {
    id: 1,
    title: "Full Body Checkup 05Feb",
    date: "Feb 05, 2026",
  },
  {
    id: 2,
    title: "Full Body Checkup 16Dec",
    date: "Dec 16, 2025",
  },
];

const TestReports = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("test");
  const [search, setSearch] = useState("");

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Background */}
        <ImageBackground
          source={require("../assets/HeaderTestReports.webp")}
          style={styles.headerBackground}
          imageStyle={styles.headerImage}
          resizeMode="cover"
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={18} color="#7C3AED" />
          </TouchableOpacity>
          <Text weight="700" style={styles.headerTitle}>
            Test Reports
          </Text>
          <Text weight="400" style={styles.headerSubtitle}>
            Securely store and manage your health documents.
          </Text>
          {/* Bottom fade overlay */}
          <LinearGradient
            colors={["transparent", "rgba(200, 226, 245, 0.6)", "#F7F8FA"]}
            locations={[0, 0.5, 1]}
            style={styles.headerFade}
          />
        </ImageBackground>

        {/* Profile Card */}
        <View style={styles.profileCardWrapper}>
          <LinearGradient
            colors={["#FDEFFB", "#FBF1FE", "#FBF1FE"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0.4 }}
            style={styles.profileCardOuter}
          >
            <View style={styles.profileCardContent}>
              {/* Avatar with outer gradient ring */}
              <LinearGradient
                colors={["#FDBEA5", "#F695CF", "#8E66EB"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.avatarOuterRing}
              >
                <View style={styles.avatarWhiteRing}>
                  <LinearGradient
                    colors={["#EEA6C8", "#996EEB"]}
                    start={{ x: 0.13, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.avatarGradient}
                  >
                    <Text style={styles.profileInitials} weight="700">
                      SN
                    </Text>
                  </LinearGradient>
                </View>
              </LinearGradient>

              <View style={styles.profileInfo}>
                <Text style={styles.profileName} weight="700">
                  Sakshi Nishad
                </Text>
                <View style={styles.profileTags}>
                  <View style={styles.profileTag}>
                    <Text weight="500" style={styles.profileTagText}>
                      Female
                    </Text>
                  </View>
                  <View style={styles.profileTag}>
                    <Text weight="500" style={styles.profileTagText}>
                      22 yrs
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.profileDropdown}>
                <Ionicons name="chevron-down" size={24} color="#7C3AED" />
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Tabs */}
        <View style={styles.contentPadding}>
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "test" && styles.tabActive]}
            onPress={() => setActiveTab("test")}
          >
            <Text
              weight="700"
              style={[
                styles.tabText,
                activeTab === "test" && styles.tabTextActive,
              ]}
            >
              Test Reports
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "uploaded" && styles.tabActive]}
            onPress={() => setActiveTab("uploaded")}
          >
            <Text
              weight="700"
              style={[
                styles.tabText,
                activeTab === "uploaded" && styles.tabTextActive,
              ]}
            >
              Uploaded Reports
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrap}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search here"
              placeholderTextColor="#9CA3AF"
              value={search}
              onChangeText={setSearch}
            />
            <TouchableOpacity style={styles.searchFilterBtn}>
              <Feather name="sliders" size={16} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.searchIconBtn}>
              <Ionicons name="search" size={18} color="#7C3AED" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Report Cards Grid */}
        <View style={styles.reportsGrid}>
          {REPORTS.map((report) => (
            <View key={report.id} style={styles.reportCard}>
              {/* Header with title and menu */}
              <View style={styles.reportCardHeader}>
                <View style={styles.reportCardTitleRow}>
                  <MaterialCommunityIcons
                    name="file-pdf-box"
                    size={18}
                    color="#E53935"
                  />
                  <Text
                    weight="600"
                    style={styles.reportCardTitle}
                    numberOfLines={1}
                  >
                    {report.title}
                  </Text>
                </View>
                <TouchableOpacity>
                  <MaterialCommunityIcons
                    name="dots-vertical"
                    size={18}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>

              {/* PDF Preview */}
              <TouchableOpacity
                style={styles.pdfPreview}
                activeOpacity={0.7}
                onPress={() => navigation.navigate("ReportAnalysis", { title: report.title })}
              >
                <Text weight="700" style={styles.pdfText}>
                  Pdf
                </Text>
              </TouchableOpacity>

              {/* Footer */}
              <View style={styles.reportCardFooter}>
                <View style={styles.reportDateRow}>
                  <View style={styles.dateDot}>
                    <MaterialCommunityIcons
                      name="tea"
                      size={10}
                      color="#1F2937"
                    />
                  </View>
                  <Text weight="400" style={styles.reportDate}>
                    {report.date}
                  </Text>
                </View>
                <TouchableOpacity>
                  <LinearGradient
                    colors={["#B148FF", "#F6339B", "#9914F9"]}
                    locations={[0, 0.5, 1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.viewIn360Btn}
                  >
                    <Text weight="700" style={styles.viewIn360Text}>
                      View in 360
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },
  headerBackground: {
    width: "100%",
    height: 163,
    backgroundColor: "#C8E2F5",
  },
  headerImage: {
    width: "100%",
    height: "100%",
    opacity: 0.85,
  },
  headerFade: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  backButton: {
    position: "absolute",
    top: 47,
    left: 18,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  headerTitle: {
    position: "absolute",
    top: 44,
    left: 46,
    fontSize: isMini ? 18 : isSmall ? 20 : 22,
    color: "#7C3AED",
  },
  headerSubtitle: {
    position: "absolute",
    top: isMini ? 68 : isSmall ? 70 : 72,
    left: 46,
    fontSize: isMini ? 12 : isSmall ? 13 : 14,
    color: "#4B5563",
    lineHeight: isMini ? 16 : 18,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  contentPadding: {
    paddingHorizontal: 16,
  },

  /* Profile Card */
  profileCardWrapper: {
    width: 313,
    height: 108,
    marginTop: -55,
    alignSelf: "center",
    borderRadius: 16,
    overflow: "hidden",
    zIndex: 10,
    elevation: 10,
  },
  profileCardOuter: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    width: 313,
    height: 108,
  },
  profileCardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
  },
  avatarOuterRing: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    padding: 2,
  },
  avatarWhiteRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
  },
  avatarGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  profileInitials: {
    fontSize: isMini ? 18 : isSmall ? 20 : 22,
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: isMini ? 16 : isSmall ? 18 : 20,
    color: "#7C3AED",
    marginBottom: 5,
    letterSpacing: 0.2,
  },
  profileTags: {
    flexDirection: "row",
    gap: 6,
  },
  profileTag: {
    backgroundColor: "#F5F3FF",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E9D5FF",
  },
  profileTagText: {
    fontSize: isMini ? 11 : isSmall ? 12 : 13,
    color: "#7C3AED",
  },
  profileDropdown: {
    padding: 8,
    backgroundColor: "#F1E7FE",
    borderRadius: 20,
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  /* Tabs */
  tabsContainer: {
    flexDirection: "row",
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 12,
  },
  tabActive: {
    backgroundColor: "#7C3AED",
  },
  tabText: {
    fontSize: isMini ? 12 : isSmall ? 13 : 14,
    color: "#6B7280",
  },
  tabTextActive: {
    color: "#fff",
  },

  /* Search */
  searchContainer: {
    marginTop: 16,
  },
  searchInputWrap: {
    width: 324,
    height: 34,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingLeft: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: isMini ? 12 : isSmall ? 13 : 14,
    color: "#1F2937",
    height: 34,
    paddingVertical: 0,
  },
  searchFilterBtn: {
    paddingHorizontal: 10,
    height: 34,
    justifyContent: "center",
    alignItems: "center",
  },
  searchIconBtn: {
    width: 43.5,
    height: 34,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: "rgba(148, 93, 220, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  /* Reports Grid */
  reportsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 12,
  },
  reportCard: {
    width: (width - 44) / 2,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  reportCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  reportCardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 4,
  },
  reportCardTitle: {
    fontSize: isMini ? 10 : isSmall ? 11 : 12,
    color: "#1F2937",
    flex: 1,
  },
  pdfPreview: {
    height: 100,
    backgroundColor: "#FAFAFA",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  pdfText: {
    fontSize: isMini ? 18 : isSmall ? 20 : 22,
    color: "#E53935",
    opacity: 0.6,
  },
  reportCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    gap: 6,
  },
  reportDateRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  dateDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#E9D5FF",
    marginRight: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  reportDate: {
    fontSize: isMini ? 9 : isSmall ? 10 : 11,
    color: "#9CA3AF",
  },
  viewIn360Btn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  viewIn360Text: {
    fontSize: isMini ? 8 : isSmall ? 9 : 10,
    color: "#FFFFFF",
  },
});

export default TestReports;
