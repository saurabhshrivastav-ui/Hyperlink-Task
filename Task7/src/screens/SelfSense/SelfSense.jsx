import React from "react";
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

const { width, height } = Dimensions.get("window");

const isSmallDevice = width < 375;
const isMediumDevice = width >= 375 && width < 768;
const isTablet = width >= 768 && width < 1024;
const isDesktop = width >= 1024;

const scale = (size) => (width / 375) * size;
const verticalScale = (size) => (height / 812) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

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
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Background Image - Extended */}
        <View style={styles.headerImageContainer}>
          <Image
            source={require("../../../assets/Header.png")}
            style={styles.headerBackgroundImage}
            resizeMode="cover"
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

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <View style={styles.navbarBackground} />
        
        <View style={styles.navbarContent}>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
            <View style={styles.navIconWrapper}>
              <MaterialCommunityIcons name="undo-variant" size={24} color="#8E8E93" />
            </View>
            <Text weight="500" style={styles.navLabel}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <View style={styles.navIconWrapper}>
              <View style={styles.dotsGrid}>
                <View style={styles.dotRow}>
                  <View style={[styles.dot, styles.dotActive]} />
                  <View style={[styles.dot, styles.dotActive]} />
                </View>
                <View style={styles.dotRow}>
                  <View style={[styles.dot, styles.dotActive]} />
                  <View style={[styles.dot, styles.dotActive]} />
                </View>
              </View>
            </View>
            <Text weight="600" style={styles.navLabelActive}>Self Checks</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItemCenter}>
            <View style={styles.navCenterIconOuter}>
              <LinearGradient
                colors={["#E0C3FC", "#8EC5FC"]}
                style={styles.navCenterIcon}
              >
                <View style={styles.navCenterIconInner}>
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
              </LinearGradient>
            </View>
            <Text weight="500" style={styles.navLabel}>Speciality</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('AssessmentHistory')}>
            <View style={styles.navIconWrapper}>
              <MaterialCommunityIcons name="clipboard-text-outline" size={22} color="#8E8E93" />
            </View>
            <Text weight="500" style={styles.navLabel}>History</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <View style={styles.navIconWrapper}>
              <MaterialCommunityIcons name="comment-account-outline" size={22} color="#8E8E93" />
            </View>
            <Text weight="500" style={styles.navLabel}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  headerImageContainer: {
    position: "relative",
    width: "100%",
    minHeight: isTablet ? verticalScale(450) : verticalScale(420),
    overflow: "visible",
    paddingBottom: verticalScale(30),
  },
  headerBackgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: isTablet ? 32 : isDesktop ? 48 : 16,
    paddingVertical: moderateScale(12),
    backgroundColor: "transparent",
    maxWidth: isDesktop ? 1200 : "100%",
    width: "100%",
    alignSelf: "center",
  },
  backButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(12),
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: moderateScale(12),
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: isTablet ? 24 : isDesktop ? 26 : moderateScale(20),
    color: "#30179F",
    letterSpacing: 0.3,
  },
  content: {
    paddingHorizontal: isTablet ? 32 : isDesktop ? 48 : 20,
    maxWidth: isDesktop ? 1200 : "100%",
    width: "100%",
    alignSelf: "center",
  },
  heroSectionInHeader: {
    marginTop: verticalScale(8),
    position: "relative",
    minHeight: isTablet ? 320 : verticalScale(220),
    flexDirection: isTablet ? "row" : "column",
    alignItems: isTablet ? "center" : "flex-start",
    paddingHorizontal: isTablet ? 32 : isDesktop ? 48 : 20,
    paddingBottom: verticalScale(60),
  },
  heroSection: {
    marginTop: verticalScale(-30),
    position: "relative",
    minHeight: isTablet ? 320 : isDesktop ? 380 : verticalScale(240),
    flexDirection: isTablet ? "row" : "column",
    alignItems: isTablet ? "center" : "flex-start",
  },
  heroTextContainer: {
    width: isTablet ? "55%" : "100%",
    paddingRight: isTablet ? 0 : width * 0.45,
    zIndex: 2,
    paddingTop: verticalScale(5),
  },
  heroTitle: {
    fontSize: 14,
    color: "#30179F",
    lineHeight: 18,
    fontWeight: "700",
    marginBottom: 1,
  },
  heroDescription: {
    fontSize: isTablet ? 15 : isDesktop ? 16 : moderateScale(12),
    color: COLORS.textPrimary,
    marginTop: verticalScale(6),
    lineHeight: isTablet ? 22 : isDesktop ? 24 : moderateScale(16.5),
    opacity: 0.8,
  },
  startCheckButtonContainer: {
    marginTop: verticalScale(12),
    alignSelf: "flex-start",
    borderRadius: 8,
    overflow: "hidden",
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
    position: isTablet ? "relative" : "absolute",
    right: isTablet ? 0 : -10,
    top: isTablet ? 0 : verticalScale(-25),
    width: isTablet ? "50%" : width * 0.58,
    height: isTablet ? 360 : width * 0.62,
    resizeMode: "contain",
    zIndex: 5,
  },
  warningBannerContainer: {
    backgroundColor: "#FBF1FE",
    borderRadius: moderateScale(14),
    padding: isTablet ? 16 : moderateScale(13),
    marginTop: verticalScale(-25),
    marginHorizontal: isTablet ? 32 : isDesktop ? 48 : 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    zIndex: 10,
  },
  warningBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFAF5",
    borderRadius: moderateScale(10),
    padding: moderateScale(9),
    borderWidth: 1,
    borderColor: "#FFE0C7",
  },
  warningIconContainer: {
    marginRight: moderateScale(7),
    backgroundColor: "#FFECD6",
    borderRadius: moderateScale(14),
    width: moderateScale(26),
    height: moderateScale(26),
    alignItems: "center",
    justifyContent: "center",
  },
  warningText: {
    fontSize: isTablet ? 11.5 : moderateScale(10.5),
    color: COLORS.textPrimary,
    flex: 1,
    lineHeight: isTablet ? 17 : moderateScale(15),
    fontWeight: "500",
  },
  consultationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: verticalScale(11),
    gap: moderateScale(5),
  },
  consultButton: {
    flex: 0.33,
    minWidth: moderateScale(92),
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
    minWidth: moderateScale(62),
  },
  consultOptionText: {
    fontSize: isTablet ? 9 : moderateScale(7.5),
    color: COLORS.textPrimary,
    textAlign: "center",
    marginTop: moderateScale(3),
    lineHeight: isTablet ? 12.5 : moderateScale(10.5),
    fontWeight: "500",
  },
  personaSection: {
    borderRadius: moderateScale(12),
    padding: isTablet ? 16 : moderateScale(12),
    marginTop: verticalScale(1),
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
    fontSize: isTablet ? 16 : isDesktop ? 18 : moderateScale(14),
    color: COLORS.textPrimary,
    marginBottom: moderateScale(4),
    fontWeight: "700",
  },
  personaDescription: {
    fontSize: isTablet ? 11 : moderateScale(10),
    color: COLORS.textSecondary,
    lineHeight: isTablet ? 16 : moderateScale(14),
    marginBottom: verticalScale(8),
  },
  personaBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: moderateScale(6),
    flexWrap: "nowrap",
  },
  personaCards: {
    flexDirection: "row",
    gap: moderateScale(6),
    alignItems: "center",
    flex: 0,
    flexShrink: 0,
  },
  personaCard: {
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(8),
    paddingVertical: moderateScale(6),
    paddingHorizontal: moderateScale(6),
    alignItems: "center",
    width: moderateScale(50),
    minHeight: moderateScale(52),
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
    width: moderateScale(22),
    height: moderateScale(22),
    borderRadius: moderateScale(11),
    backgroundColor: "#F5F8FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: moderateScale(3),
  },
  personaCardIconHighlight: {
    backgroundColor: "#FFF5F5",
  },
  personaCardValue: {
    fontSize: moderateScale(9),
    color: COLORS.textPrimary,
    marginBottom: 1,
    fontWeight: "700",
  },
  personaCardLabel: {
    fontSize: moderateScale(6),
    color: "#6C7A99",
    textAlign: "center",
    lineHeight: moderateScale(7.5),
  },
  createPersonaButton: {
    alignSelf: "center",
    marginLeft: "auto",
    flexShrink: 0,
  },
  createPersonaButtonGradient: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    minHeight: moderateScale(34),
    alignItems: "center",
    justifyContent: "center",
  },
  createPersonaButtonText: {
    fontSize: 10.5,
    color: COLORS.white,
    fontWeight: "700",
    textAlign: "center",
  },
  helpSection: {
    marginTop: verticalScale(24),
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(16),
    padding: isTablet ? 24 : moderateScale(18),
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  helpTitle: {
    fontSize: isTablet ? 19 : isDesktop ? 20 : moderateScale(17),
    color: COLORS.textPrimary,
    marginBottom: verticalScale(14),
    fontWeight: "700",
  },
  helpList: {
    gap: verticalScale(10),
  },
  helpItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: moderateScale(4),
  },
  helpText: {
    fontSize: isTablet ? 14 : moderateScale(13),
    color: "#444444",
    lineHeight: isTablet ? 22 : moderateScale(20),
    flex: 1,
  },
  // Bottom Navigation Styles
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    justifyContent: "flex-end",
    zIndex: 50,
  },
  navbarBackground: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 85,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  navbarContent: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    paddingBottom: 15,
    width: "100%",
  },
  navItem: {
    alignItems: "center",
    justifyContent: "flex-end",
    height: 85,
    width: width / 5,
  },
  navItemCenter: {
    alignItems: "center",
    justifyContent: "flex-end",
    height: 85,
    width: width / 5,
    marginBottom: 20,
  },
  navCenterIconOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
  },
  navCenterIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F0E6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  navCenterIconInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  navIconWrapper: {
    width: moderateScale(28),
    height: moderateScale(28),
    alignItems: "center",
    justifyContent: "center",
  },
  dotsGrid: {
    alignItems: "center",
    justifyContent: "center",
    gap: moderateScale(4),
  },
  dotRow: {
    flexDirection: "row",
    gap: moderateScale(4),
  },
  dot: {
    width: moderateScale(5),
    height: moderateScale(5),
    borderRadius: moderateScale(2.5),
    backgroundColor: "#8E8E93",
  },
  dotActive: {
    backgroundColor: "#5B3DF5",
  },
  specialityIcon: {
    alignItems: "center",
    justifyContent: "center",
    gap: moderateScale(4),
  },
  specialityRow: {
    flexDirection: "row",
    gap: moderateScale(4),
  },
  specialityDot: {
    width: moderateScale(6),
    height: moderateScale(6),
    borderRadius: moderateScale(3),
  },
  dotPink: {
    backgroundColor: "#E91E63",
  },
  dotPurple: {
    backgroundColor: "#7C4DFF",
  },
  navLabel: {
    fontSize: moderateScale(9),
    color: "#8E8E93",
    marginTop: moderateScale(4),
  },
  navLabelActive: {
    fontSize: moderateScale(9),
    color: "#5B3DF5",
    marginTop: moderateScale(4),
    fontWeight: "600",
  },
});