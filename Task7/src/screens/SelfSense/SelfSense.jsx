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
    backgroundColor: "#FDF4FF", /* page background — gradient only in header now */
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
    height: s(380),
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    zIndex: 0,
    borderWidth: 1.5,
    borderColor: "rgba(120,78,200,0.32)", /* slightly darker border */
    shadowColor: "rgba(96,52,170,0.18)",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 8,
    overflow: "hidden",
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
    width: s(40),
    height: s(40),
    alignItems: "center",
    justifyContent: "center",
    marginRight: s(12),
  },
  headerTitle: {
    fontSize: s(20),
    color: "#24106B", /* darker purple for better contrast */
    letterSpacing: 0.3,
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
    fontSize: s(16),
    color: "#24106B", /* darker and slightly larger */
    lineHeight: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  heroDescription: {
    fontSize: s(12),
    color: COLORS.textPrimary,
    marginTop: s(6),
    lineHeight: s(16.5),
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
    fontSize: s(17),
    color: COLORS.textPrimary,
    marginBottom: s(14),
    fontWeight: "700",
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
    fontSize: s(13),
    color: "#444444",
    lineHeight: s(20),
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
    width: s(28),
    height: s(28),
    alignItems: "center",
    justifyContent: "center",
  },
  dotsGrid: {
    alignItems: "center",
    justifyContent: "center",
    gap: s(4),
  },
  dotRow: {
    flexDirection: "row",
    gap: s(4),
  },
  dot: {
    width: s(5),
    height: s(5),
    borderRadius: s(2.5),
    backgroundColor: "#8E8E93",
  },
  dotActive: {
    backgroundColor: "#5B3DF5",
  },
  specialityIcon: {
    alignItems: "center",
    justifyContent: "center",
    gap: s(4),
  },
  specialityRow: {
    flexDirection: "row",
    gap: s(4),
  },
  specialityDot: {
    width: s(6),
    height: s(6),
    borderRadius: s(3),
  },
  dotPink: {
    backgroundColor: "#E91E63",
  },
  dotPurple: {
    backgroundColor: "#7C4DFF",
  },
  navLabel: {
    fontSize: s(9),
    color: "#8E8E93",
    marginTop: s(4),
  },
  navLabelActive: {
    fontSize: s(9),
    color: "#5B3DF5",
    marginTop: s(4),
    fontWeight: "600",
  },
});