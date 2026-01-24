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

const { width, height } = Dimensions.get("window");

// Responsive breakpoints
const isSmallDevice = width < 375;
const isMediumDevice = width >= 375 && width < 768;
const isTablet = width >= 768 && width < 1024;
const isDesktop = width >= 1024;

// Responsive scaling
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
              <TouchableOpacity
                onPress={() => navigation.navigate("SelfSenseHealthArea")}
                activeOpacity={0.8}
                style={styles.startCheckButtonContainer}
              >
                <LinearGradient
                  colors={["#F54BC9", "#E83BC3", "#C93AD6"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.startCheckButton}
                >
                  <Text numberOfLines={1} weight="700" style={styles.startCheckButtonText}>
                    Start Self Check
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Hero Image */}
            <Image
              source={require("../../../assets/SelfSense.png")}
              style={styles.heroImage}
            />
          </View>

          {/* Warning Banner - Moved after Start Self Check */}
          <View style={styles.warningBannerContainer}>
            <View style={styles.warningBanner}>
              <View style={styles.warningIconContainer}>
                <MaterialIcons name="warning" size={20} color="#FF9F43" />
              </View>
              <Text weight="500" style={styles.warningText}>
                This is not a diagnostic tool. For urgent concerns, please consult
              </Text>
            </View>

            {/* Consultation Options - Inside warning container */}
            <View style={styles.consultationRow}>
              <TouchableOpacity 
                style={styles.consultButton} 
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#F54BC9", "#E83BC3", "#C93AD6"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.consultButtonGradient}
                >
                  <Text weight="700" style={styles.consultButtonText} numberOfLines={1}>
                    Consult Now!
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.consultOptionItem}>
                <MaterialCommunityIcons name="account-supervisor" size={24} color="#4A8FE7" />
                <Text weight="500" style={styles.consultOptionText}>
                  One to One{"\n"}Consultation
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.consultOptionItem}>
                <MaterialIcons name="home" size={24} color="#4A8FE7" />
                <Text weight="500" style={styles.consultOptionText}>
                  Chat with{"\n"}specialist
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.consultOptionItem}>
                <MaterialCommunityIcons name="run" size={24} color="#4A8FE7" />
                <Text weight="500" style={styles.consultOptionText}>
                  Prescription and{"\n"}lab referrals
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.content}>

          {/* Build Health Persona Section */}
          <View style={styles.personaSection}>
            <Text weight="700" style={styles.personaTitle}>
              Build your Health Persona
            </Text>
            <Text weight="400" style={styles.personaDescription}>
              Help us to understand you better, so your self-checks are more relevant and accurate.
            </Text>

            {/* Persona Info Cards and Button Row */}
            <View style={styles.personaBottomRow}>
              <View style={styles.personaCards}>
                <View style={styles.personaCard}>
                  <View style={styles.personaCardIconCircle}>
                    <MaterialIcons name="access-time" size={13} color="#5B3DF5" />
                  </View>
                  <Text weight="700" style={styles.personaCardValue}>
                    2 min
                  </Text>
                  <Text weight="400" style={styles.personaCardLabel}>
                    Duration
                  </Text>
                </View>

                <View style={styles.personaCard}>
                  <View style={styles.personaCardIconCircle}>
                    <MaterialIcons name="shield" size={13} color="#E74C3C" />
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
                    <MaterialCommunityIcons name="stethoscope" size={13} color="#4A8FE7" />
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
              <TouchableOpacity style={styles.createPersonaButton} activeOpacity={0.8}>
                <LinearGradient
                  colors={["#1E9BFA", "#3A7BFD", "#92C7FD"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.createPersonaButtonGradient}
                >
                  <Text numberOfLines={1} weight="700" style={styles.createPersonaButtonText}>
                    Create My Persona
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

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

        <View style={{ height: 40 }} />
      </ScrollView>
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
    right: isTablet ? 0 : -5,
    top: isTablet ? 0 : verticalScale(-10),
    width: isTablet ? "45%" : width * 0.58,
    height: isTablet ? 320 : width * 0.58,
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
    backgroundColor: "#CDE9FF",
    borderRadius: moderateScale(16),
    padding: isTablet ? 18 : moderateScale(14),
    marginTop: verticalScale(1),
    borderWidth: 1,
    borderColor: "#BFD4FF",
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  personaTitle: {
    fontSize: isTablet ? 18 : isDesktop ? 20 : moderateScale(15.5),
    color: COLORS.textPrimary,
    marginBottom: moderateScale(6),
    fontWeight: "700",
  },
  personaDescription: {
    fontSize: isTablet ? 12 : moderateScale(10.5),
    color: COLORS.textSecondary,
    lineHeight: isTablet ? 18 : moderateScale(16),
    marginBottom: verticalScale(10),
  },
  personaBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: moderateScale(8),
    flexWrap: "nowrap",
  },
  personaCards: {
    flexDirection: "row",
    gap: moderateScale(6),
    alignItems: "center",
    flex: 1,
    flexShrink: 1,
  },
  personaCard: {
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(10),
    paddingVertical: moderateScale(7),
    paddingHorizontal: moderateScale(6),
    alignItems: "center",
    width: moderateScale(52),
    minHeight: moderateScale(50),
    borderWidth: 1,
    borderColor: "#E1E7FF",
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  personaCardIconCircle: {
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: moderateScale(12),
    backgroundColor: "#F3F6FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: moderateScale(3),
  },
  personaCardValue: {
    fontSize: moderateScale(10.5),
    color: COLORS.textPrimary,
    marginBottom: 1,
    fontWeight: "700",
  },
  personaCardLabel: {
    fontSize: moderateScale(6.8),
    color: "#6C7A99",
    textAlign: "center",
    lineHeight: moderateScale(8.5),
  },
  createPersonaButton: {
    borderRadius: 8,
    overflow: "hidden",
    alignSelf: "center",
    marginLeft: moderateScale(6),
    flexShrink: 0,
    maxWidth: moderateScale(130),
    shadowColor: "#DEF0FE",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 4,
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
});