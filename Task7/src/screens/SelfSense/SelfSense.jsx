import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "../../../components/TextWrapper";
import GradientButton from "../../../components/GradientButton";
import ConsultWarningCard from "../../../components/ConsultWarningCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const s = (size) => (width / 375) * size;

const COLORS = {
  brandPurple: "#5B3DF5",
  pink: "#C754D8",
  brightPink: "#D946EF",
  blue: "#4A8FE7",
  darkBlue: "#3A7BD5",
  bgGradientStart: "#E8D5F2",
  bgGradientMid: "#F0E6F6",
  bgGradientEnd: "#FAF0F5",
  warning: "#FF9F43",
  textPrimary: "#2D2D2D",
  textSecondary: "#666666",
  white: "#FFFFFF",
  shadow: "rgba(0, 0, 0, 0.1)",
};

export default function SelfSense({ navigation }) {
  const isFocused = useIsFocused();
  const [inProgressAssessments, setInProgressAssessments] = useState([]);

  // Load in-progress assessments from AsyncStorage
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const allKeys = await AsyncStorage.getAllKeys();
        const progressKeys = allKeys.filter((k) => k.startsWith("assessment_progress_"));
        if (progressKeys.length === 0) {
          setInProgressAssessments([]);
          return;
        }
        const entries = await AsyncStorage.multiGet(progressKeys);
        const progressList = entries
          .map(([key, value]) => {
            try {
              return JSON.parse(value);
            } catch {
              return null;
            }
          })
          .filter(Boolean)
          .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
        setInProgressAssessments(progressList);
      } catch (e) {
        console.log("Error loading progress:", e);
      }
    };
    if (isFocused) loadProgress();
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerImageContainer}>
          {/* header-only background — using your gradient (+ slightly darker for contrast) */}
          <LinearGradient
            // original: linear-gradient(112.54deg, rgba(228, 204, 247, 0.6) 2.07%, rgba(255, 233, 207, 0.6) 97.93%)
            // converted & darkened: increased saturation and opacity for better contrast on mobile
            colors={[
              "rgba(196,170,230,0.78)", // darker version of rgba(228,204,247,0.6)
              "rgba(245,205,175,0.78)", // darker version of rgba(255,233,207,0.6)
            ]}
            locations={[0.0207, 0.9793]}
            /* approximate 112.54deg direction */
            start={{ x: 0.12, y: 0.02 }}
            end={{ x: 0.88, y: 0.98 }}
            style={styles.headerGradient}
          />

          <SafeAreaView style={styles.header}>
            <TouchableOpacity
              onPress={() => {
                if (navigation.canGoBack()) {
                  navigation.goBack();
                }
              }}
              style={styles.backButton}
            >
              <Feather name="arrow-left" size={24} color="#5B3DF5" />
            </TouchableOpacity>
            <Text weight="600" style={styles.headerTitle}>
              Self Sense
            </Text>
          </SafeAreaView>

          {/* Hero Section - Inside header background */}
          <View style={styles.heroSectionInHeader}>
            <View style={styles.heroTextContainer}>
              <Text
                weight="700"
                style={styles.heroTitle}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.85}
              >
                Understand Your Health.
              </Text>
              <Text
                weight="700"
                style={styles.heroTitle}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.85}
              >
                One Check at a Time.
              </Text>
              <Text weight="400" style={styles.heroDescription}>
                Guided self-checks to help you notice early warning signs and health patterns, without replacing medical advice.
              </Text>

              {/* Start Self Check Button */}
              <GradientButton
                title="Start Self Check"
                variant="pink"
                onPress={() => navigation.navigate("SelfSenseHealthArea")}
                style={styles.startCheckButtonContainer}
              />
            </View>

            {/* Hero Image */}
            <Image
              source={require("../../../assets/SelfSense.webp")}
              style={styles.heroImage}
            />
          </View>

          {/* Warning Banner with Consultation Options */}
          <ConsultWarningCard
            onConsultPress={() => console.log('Navigate to Consultation')}
            style={styles.warningBannerContainer}
          />
        </View>

        {/* Main Content */}
        <View style={styles.content}>

          {/* In-Progress Assessment Card */}
          {inProgressAssessments.length > 0 && (
            <View style={styles.progressSection}>
              <Text weight="700" style={styles.progressSectionTitle}>
                Continue Assessment
              </Text>
              {inProgressAssessments.map((item) => {
                const percent = item.totalQuestions > 0
                  ? Math.round((item.answeredCount / item.totalQuestions) * 100)
                  : 0;
                return (
                  <TouchableOpacity
                    key={item.conditionId}
                    style={styles.progressCard}
                    activeOpacity={0.85}
                    onPress={() =>
                      navigation.navigate("Questionnaires", {
                        conditionId: item.conditionId,
                        conditionName: item.conditionName,
                      })
                    }
                  >
                    <LinearGradient
                      colors={["#F5F0FF", "#FFF5FB"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.progressCardGradient}
                    >
                      <View style={styles.progressCardTop}>
                        <View style={styles.progressCardInfo}>
                          <View style={styles.progressIconCircle}>
                            <MaterialCommunityIcons
                              name="clipboard-text-clock-outline"
                              size={18}
                              color="#7C3AED"
                            />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text weight="600" style={styles.progressConditionName}>
                              {item.conditionName}
                            </Text>
                            <Text weight="400" style={styles.progressSubtext}>
                              {item.answeredCount} of {item.totalQuestions} questions answered
                            </Text>
                          </View>
                          <View style={styles.progressPercentBadge}>
                            <Text weight="700" style={styles.progressPercentText}>
                              {percent}%
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Progress Bar */}
                      <View style={styles.progressBarBg}>
                        <LinearGradient
                          colors={["#7C3AED", "#EC4899"]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={[
                            styles.progressBarFill,
                            { width: `${percent}%` },
                          ]}
                        />
                      </View>

                      <View style={styles.progressCardBottom}>
                        <Text weight="500" style={styles.progressContinueText}>
                          Tap to continue
                        </Text>
                        <Feather name="arrow-right" size={14} color="#7C3AED" />
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Build Health Persona Section */}
          <LinearGradient
            colors={["#CDE8FF", "#E0EEFF", "#F3EBFF"]}
            start={{ x: 0, y: 0.14 }}
            end={{ x: 0.6, y: 0.87 }}
            style={styles.personaSection}
          >
            <Text weight="700" style={styles.personaTitle}>
              Build your Health Persona
            </Text>
            <Text weight="400" style={styles.personaDescription}>
              Help us to understand you better, so your self checks are more relevant and accurate.
            </Text>

            {/* Persona Info Cards and Button Row */}
            <View style={styles.personaBottomRow}>
              <View style={styles.personaCards}>
                <View style={styles.personaCard}>
                  <View style={styles.personaCardIconCircle}>
                    <Feather name="clock" size={12} color="#5B3DF5" />
                  </View>
                  <Text weight="700" style={styles.personaCardValue}>
                    2 min
                  </Text>
                  <Text weight="400" style={styles.personaCardLabel}>
                    Duration
                  </Text>
                </View>

                <View style={[styles.personaCard, styles.personaCardHighlight]}>
                  <View style={[styles.personaCardIconCircle, styles.personaCardIconHighlight]}>
                    <MaterialCommunityIcons name="shield-check" size={12} color="#E74C3C" />
                  </View>
                  <Text weight="700" style={styles.personaCardValue}>
                    Private
                  </Text>
                  <Text weight="400" style={styles.personaCardLabel}>
                    Anonymous
                  </Text>
                </View>

                <View style={styles.personaCard}>
                  <View style={styles.personaCardIconCircle}>
                    <MaterialCommunityIcons name="file-document-outline" size={12} color="#4A8FE7" />
                  </View>
                  <Text weight="700" style={styles.personaCardValue}>
                    20
                  </Text>
                  <Text weight="400" style={styles.personaCardLabel}>
                    Questions
                  </Text>
                </View>
              </View>

              {/* Create My Persona Button */}
              <GradientButton
                title="Create My Persona"
                variant="blue"
                onPress={() => console.log('Create Persona')}
                size="small"
                style={styles.createPersonaButton}
              />
            </View>
          </LinearGradient>

          {/* How Self Sense Helps You */}
          <View style={styles.helpSection}>
            <Text weight="700" style={styles.helpTitle}>
              How Self Sense Helps You
            </Text>

            <View style={styles.helpList}>
              <View style={styles.helpItem}>
                <Text weight="400" style={styles.helpText}>
                  🔍 Understand possible health risks
                </Text>
              </View>

              <View style={styles.helpItem}>
                <Text weight="400" style={styles.helpText}>
                  🩺 See how symptoms connect over time
                </Text>
              </View>

              <View style={styles.helpItem}>
                <Text weight="400" style={styles.helpText}>
                  📊 Track changes, not guesses
                </Text>
              </View>

              <View style={styles.helpItem}>
                <Text weight="400" style={styles.helpText}>
                  💡 Know when to seek professional care
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <View style={styles.navbarBackground} />
        
        <View style={styles.navbarContent}>
          <TouchableOpacity style={styles.tabContainer} onPress={() => navigation.navigate('Home')}>
            <View style={styles.iconHolder}>
              <View style={styles.inactiveCircle}>
                <MaterialCommunityIcons name="undo-variant" size={22} color="#7f8c8d" />
              </View>
            </View>
            <Text weight="500" style={[styles.navLabel, styles.inactiveLabel]}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabContainer}>
            <View style={styles.iconHolder}>
              <View style={styles.activeOuterBuffer}>
                <LinearGradient
                  colors={["#6ea6e7", "#daeffe", "#e0d3ff"]}
                  style={styles.activeCircle}
                >
                  <View style={styles.dotsGrid}>
                    <View style={styles.dotRow}>
                      <View style={[styles.dot, { backgroundColor: "#5b3cc4" }]} />
                      <View style={[styles.dot, { backgroundColor: "#5b3cc4" }]} />
                    </View>
                    <View style={styles.dotRow}>
                      <View style={[styles.dot, { backgroundColor: "#5b3cc4" }]} />
                      <View style={[styles.dot, { backgroundColor: "#5b3cc4" }]} />
                    </View>
                  </View>
                </LinearGradient>
              </View>
            </View>
            <Text weight="900" style={[styles.navLabel, styles.activeLabel]}>Self Checks</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabContainer}>
            <View style={styles.iconHolder}>
              <View style={styles.inactiveCircle}>
                <View style={styles.specialityIcon}>
                  <View style={styles.specialityRow}>
                    <View style={[styles.specialityDot, styles.dotPink]} />
                    <View style={[styles.specialityDot, styles.dotPurple]} />
                    <View style={[styles.specialityDot, styles.dotPink]} />
                  </View>
                  <View style={styles.specialityRow}>
                    <View style={[styles.specialityDot, styles.dotPurple]} />
                    <View style={[styles.specialityDot, styles.dotPink]} />
                    <View style={[styles.specialityDot, styles.dotPurple]} />
                  </View>
                  <View style={styles.specialityRow}>
                    <View style={[styles.specialityDot, styles.dotPink]} />
                    <View style={[styles.specialityDot, styles.dotPurple]} />
                    <View style={[styles.specialityDot, styles.dotPink]} />
                  </View>
                </View>
              </View>
            </View>
            <Text weight="500" style={[styles.navLabel, styles.inactiveLabel]}>Speciality</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabContainer} onPress={() => navigation.navigate('AssessmentHistory')}>
            <View style={styles.iconHolder}>
              <View style={styles.inactiveCircle}>
                <MaterialCommunityIcons name="clipboard-text-outline" size={22} color="#7f8c8d" />
              </View>
            </View>
            <Text weight="500" style={[styles.navLabel, styles.inactiveLabel]}>History</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabContainer}>
            <View style={styles.iconHolder}>
              <View style={styles.inactiveCircle}>
                <MaterialCommunityIcons name="comment-account-outline" size={22} color="#7f8c8d" />
              </View>
            </View>
            <Text weight="500" style={[styles.navLabel, styles.inactiveLabel]}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7fafc",
  },
  headerImageContainer: {
    position: "relative",
    width: "100%",
    minHeight: s(420),
    overflow: "visible",
    paddingBottom: s(30),
  },
  /* gradient restricted to header only */
  headerGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 420,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    zIndex: 0,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: s(16),
    paddingVertical: s(12),
    backgroundColor: "transparent",
    maxWidth: "100%",
    width: "100%",
    alignSelf: "center",
    zIndex: 2,
  },
  backButton: {
    backgroundColor: "rgba(255,255,255,0.25)",
    padding: 8,
    borderRadius: 12,
    marginRight: s(12),
  },
  headerTitle: {
    fontSize: 22,
    color: "#553fb5",
    marginLeft: 12,
  },
  content: {
    paddingHorizontal: s(20),
    maxWidth: "100%",
    width: "100%",
    alignSelf: "center",
  },
  heroSectionInHeader: {
    marginTop: s(8),
    position: "relative",
    minHeight: s(200),
    flexDirection: "column",
    alignItems: "flex-start",
    paddingHorizontal: s(20),
    paddingBottom: s(40),
    zIndex: 2,
    overflow: "visible",
  },
  heroSection: {
    marginTop: s(-30),
    position: "relative",
    minHeight: s(240),
    flexDirection: "column",
    alignItems: "flex-start",
  },
  heroTextContainer: {
    width: "100%",
    paddingRight: width * 0.45,
    zIndex: 2,
    paddingTop: s(5),
  },
  heroTitle: {
    fontSize: 23,
    color: "#24106B",
    lineHeight: 22,
    marginBottom: 4,
  },
  heroDescription: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginTop: 6,
    lineHeight: 19.5,
    opacity: 0.8,
  },
  startCheckButtonContainer: {
    marginTop: s(12),
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "rgba(124,58,237,0.24)",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.28,
    shadowRadius: 22,
    elevation: 10,
  },
  startCheckButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderRadius: 12,
    gap: 6,
    shadowColor: "#EC4899",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  startCheckButtonText: {
    fontSize: 15,
    color: COLORS.white,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  heroImage: {
    position: "absolute",
    /* place the illustration on right side, bottom overlaps card */
    right: 0,
    top: s(10),
    width: width * 0.55,
    height: s(210),
    resizeMode: "contain",
    zIndex: 40, /* ensure it's above the consult card */
    elevation: 22,
  },
  warningBannerContainer: {
    backgroundColor: "#FBF1FE", /* light purple background */
    borderRadius: s(16),
    padding: s(14),
    marginTop: -s(6), /* pull card up slightly */
    marginHorizontal: s(16),
    shadowColor: "rgba(245,158,11,0.15)",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(245,158,11,0.08)",
    zIndex: 10,
  },
  warningBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFAF5",
    borderRadius: s(10),
    padding: s(9),
    borderWidth: 1,
    borderColor: "#FFE0C7",
  },
  warningIconContainer: {
    marginRight: s(7),
    backgroundColor: "#FFECD6",
    borderRadius: s(14),
    width: s(26),
    height: s(26),
    alignItems: "center",
    justifyContent: "center",
  },
  warningText: {
    fontSize: s(10.5),
    color: COLORS.textPrimary,
    flex: 1,
    lineHeight: s(15),
    fontWeight: "500",
  },
  consultationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: s(11),
    gap: s(5),
  },
  consultButton: {
    flex: 0.33,
    minWidth: s(92),
    borderRadius: 12,
    overflow: "hidden",
  },
  consultButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    shadowColor: "#EC4899",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  consultButtonText: {
    fontSize: 11,
    color: COLORS.white,
    fontWeight: "700",
    letterSpacing: 0.2,
    textAlign: "center",
  },
  consultOptionItem: {
    alignItems: "center",
    flex: 0.22,
    minWidth: s(62),
  },
  consultOptionText: {
    fontSize: s(7.5),
    color: COLORS.textPrimary,
    textAlign: "center",
    marginTop: s(3),
    lineHeight: s(10.5),
    fontWeight: "500",
  },
  personaSection: {
    borderRadius: s(12),
    padding: s(12),
    marginTop: s(1),
    borderWidth: 1,
    borderColor: "#D4E4FF",
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    overflow: "visible",
  },
  personaTitle: {
    fontSize: s(14),
    color: COLORS.textPrimary,
    marginBottom: s(4),
    fontWeight: "700",
  },
  personaDescription: {
    fontSize: s(10),
    color: COLORS.textSecondary,
    lineHeight: s(14),
    marginBottom: s(8),
  },
  personaBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: s(6),
    flexWrap: "nowrap",
  },
  personaCards: {
    flexDirection: "row",
    gap: s(6),
    alignItems: "center",
    flex: 0,
    flexShrink: 0,
  },
  personaCard: {
    backgroundColor: COLORS.white,
    borderRadius: s(8),
    paddingVertical: s(6),
    paddingHorizontal: s(6),
    alignItems: "center",
    width: s(50),
    minHeight: s(52),
    borderWidth: 1,
    borderColor: "#E8EEF5",
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  personaCardHighlight: {
    borderColor: "#E8D4F0",
    backgroundColor: "#FDF8FF",
  },
  personaCardIconCircle: {
    width: s(22),
    height: s(22),
    borderRadius: s(11),
    backgroundColor: "#F5F8FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: s(3),
  },
  personaCardIconHighlight: {
    backgroundColor: "#FFF5F5",
  },
  personaCardValue: {
    fontSize: s(9),
    fontWeight: "700",
  },
  personaCardLabel: {
    fontSize: s(6),
    color: "#6C7A99",
    textAlign: "center",
    lineHeight: s(7.5),
  },
  createPersonaButton: {
    alignSelf: "center",
    marginLeft: "auto",
    flexShrink: 0,
  },
  createPersonaButtonGradient: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    minHeight: s(34),
    alignItems: "center",
    justifyContent: "center",
  },
  createPersonaButtonText: {
    fontSize: 10.5,
    color: COLORS.white,
    fontWeight: "700",
    textAlign: "center",
  },
  // In-Progress Assessment Card Styles
  progressSection: {
    marginBottom: s(16),
  },
  progressSectionTitle: {
    fontSize: s(14),
    color: COLORS.textPrimary,
    marginBottom: s(10),
  },
  progressCard: {
    borderRadius: s(14),
    overflow: "hidden",
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: s(10),
  },
  progressCardGradient: {
    borderRadius: s(14),
    padding: s(14),
    borderWidth: 1,
    borderColor: "#E9D5FF",
  },
  progressCardTop: {
    marginBottom: s(10),
  },
  progressCardInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(10),
  },
  progressIconCircle: {
    width: s(36),
    height: s(36),
    borderRadius: s(18),
    backgroundColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
  },
  progressConditionName: {
    fontSize: s(13),
    color: "#1F2937",
    marginBottom: 2,
  },
  progressSubtext: {
    fontSize: s(10.5),
    color: "#6B7280",
  },
  progressPercentBadge: {
    backgroundColor: "#7C3AED",
    paddingHorizontal: s(10),
    paddingVertical: s(4),
    borderRadius: s(10),
  },
  progressPercentText: {
    fontSize: s(12),
    color: "#FFFFFF",
  },
  progressBarBg: {
    height: s(6),
    backgroundColor: "#E5E7EB",
    borderRadius: s(3),
    overflow: "hidden",
    marginBottom: s(8),
  },
  progressBarFill: {
    height: "100%",
    borderRadius: s(3),
  },
  progressCardBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: s(4),
  },
  progressContinueText: {
    fontSize: s(11),
    color: "#7C3AED",
  },
  helpSection: {
    marginTop: s(24),
    backgroundColor: COLORS.white,
    borderRadius: s(16),
    padding: s(18),
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  helpTitle: {
    fontSize: 22,
    color: COLORS.textPrimary,
    marginBottom: 14,
  },
  helpList: {
    gap: s(10),
  },
  helpItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: s(4),
  },
  helpText: {
    fontSize: 17,
    color: "#444444",
    lineHeight: 20,
    flex: 1,
  },
  // Bottom Navigation Styles
  bottomNav: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 70,
    elevation: 10,
    zIndex: 999,
  },
  navbarBackground: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: 70,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e2e2e2",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  navbarContent: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    height: 70,
    paddingBottom: 10,
  },
  tabContainer: {
    width: width / 5,
    alignItems: "center",
  },
  iconHolder: {
    height: 86,
    width: 86,
    justifyContent: "center",
    alignItems: "center",
    top: -32,
    backgroundColor: "transparent",
  },
  activeOuterBuffer: {
    height: 78,
    width: 78,
    borderRadius: 39,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  activeCircle: {
    height: 66,
    width: 66,
    borderRadius: 33,
    borderWidth: 3,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  inactiveCircle: {
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 35,
  },
  dotsGrid: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  dotRow: {
    flexDirection: "row",
    gap: 4,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#7f8c8d",
  },
  specialityIcon: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  specialityRow: {
    flexDirection: "row",
    gap: 4,
  },
  specialityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotPink: {
    backgroundColor: "#E91E63",
  },
  dotPurple: {
    backgroundColor: "#7C4DFF",
  },
  navLabel: {
    fontSize: 13,
    marginTop: -35,
  },
  activeLabel: {
    color: "#3498db",
  },
  inactiveLabel: {
    color: "#535353ff",
  },
});