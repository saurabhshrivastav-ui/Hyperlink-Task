import React, { useEffect, useRef, useState, useCallback } from "react";
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
import { useLoader } from "../../Components/LoaderContext";
import {
  Feather,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text } from "../../Components/TextWrapper";
import GradientButton from "../../Components/GradientButton";
import ConsultWarningCard from "../../Components/ConsultWarningCard";
import AlmostDoneCard from "../../Components/AlmostDoneCard";
import HealthFeeds from "../../Components/HealthFeeds";
import PersonaOrProgressBanner from "../../Components/PersonaOrProgressBanner";
const { width, height } = Dimensions.get("window");

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

export default function SelfSense({ navigation: navigationProp }) {
  const navigationHook = useNavigation();
  const navigation = navigationProp || navigationHook;

  const { showLoader, hideLoader } = useLoader();

  // --- In-progress assessment state ---
  const [assessmentProgress, setAssessmentProgress] = useState(null);

  // --- Health Persona state ---
  const [personaActive, setPersonaActive] = useState(false);

  // Reload progress every time screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const loadProgress = async () => {
        try {
          const raw = await AsyncStorage.getItem("selfSenseProgress");
          if (raw) {
            const data = JSON.parse(raw);
            // Only show if not fully completed
            if (data.answeredCount < data.totalQuestions) {
              setAssessmentProgress(data);
            } else {
              setAssessmentProgress(null);
            }
          } else {
            setAssessmentProgress(null);
          }
        } catch {
          setAssessmentProgress(null);
        }
      };

      loadProgress();
    }, []),
  );

  const handleCreatePersona = () => {
    setPersonaActive(true);
  };

  const handleHidePersona = () => {
    setPersonaActive(false);
  };

  // ✅ prevents loader flicker for very fast loads
  const MIN_VISIBLE_MS = 450;

  const mountedRef = useRef(true);
  const startedAtRef = useRef(0);

  useEffect(() => {
    mountedRef.current = true;
    startedAtRef.current = Date.now();

    let hideTimeout;

    const run = async () => {
      showLoader();

      try {
        await Promise.all([loadSelfSenseData()]);
      } catch (e) {
        // Even if something fails, don't keep the loader stuck.
        console.log("SelfSense load error:", e);
      } finally {
        const elapsed = Date.now() - startedAtRef.current;
        const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);

        hideTimeout = setTimeout(() => {
          if (mountedRef.current) hideLoader();
        }, remaining);
      }
    };

    run();

    return () => {
      mountedRef.current = false;
      if (hideTimeout) clearTimeout(hideTimeout);
      // ✅ ensure loader doesn't remain visible when leaving screen
      hideLoader();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadSelfSenseData = async () => {
    return Promise.resolve();
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      <ScrollView style={styles.page} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <LinearGradient
          colors={[
            "rgba(196,170,230,0.9)", // left top
            "rgba(245,205,175,0.85)", // right top
          ]}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 1 }} // diagonal left → right
          style={styles.headerGradient}
        >
          {/* Bottom Blend Overlay */}
          <LinearGradient
            colors={[
              "rgba(248,250,252,0)", // transparent (no effect on top)
              "rgba(248,250,252,0.6)", // soft blend
              "rgba(248,250,252,1)", // full background color
            ]}
            locations={[0.6, 0.85, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.heroTopBar}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Feather name="arrow-left" size={20} color="#553fb5" />
            </TouchableOpacity>

            <Text weight="800" style={styles.topBarText}>
              SELF SENSE
            </Text>
          </View>
        </LinearGradient>

        {/* space reserved for tabs */}
        <View style={{ height: 85 }} />

        {/* Hero Section - Inside header background */}
        <View style={styles.heroSectionInHeader}>
          <View style={styles.heroTextContainer}>
            <Text
              weight="500"
              style={styles.heroTitle}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.85}
            >
              Understand Your Health.
            </Text>
            <Text
              weight="500"
              style={styles.heroTitle}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.85}
            >
              One Check at a Time.
            </Text>
            <Text weight="400" style={styles.heroDescription}>
              Guided self-checks to help you notice early warning signs and
              health patterns, without replacing medical advice.
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
            source={require("../../assets/SelfSense.webp")}
            style={styles.heroImage}
          />
        </View>

        {/* Warning Banner with Consultation Options */}
        <ConsultWarningCard
          onConsultPress={() => console.log("Navigate to Consultation")}
          style={styles.warningBannerContainer}
        />
        {assessmentProgress && (
          <AlmostDoneCard
            assessmentText={`${assessmentProgress.conditionName} Assessment`}
            percent={Math.round(
              (assessmentProgress.answeredCount /
                assessmentProgress.totalQuestions) *
                100,
            )}
            style={styles.almostDoneBanner}
            onPress={() =>
              navigation.navigate("QuestionnairesScreen", {
                conditionId: assessmentProgress.conditionId,
                conditionName: assessmentProgress.conditionName,
              })
            }
          />
        )}

        {/* Main Content */}
        <View style={styles.content}>
          {/* Build Health Persona */}
          <PersonaOrProgressBanner
            showAlmostDone={true}
            onBuildPress={handleCreatePersona}
          />
          {/* Health Persona Active - shown after clicking Create My Persona */}
          {personaActive && (
            <PersonaOrProgressBanner
              showAlmostDone={false}
              onPersonaPress={handleHidePersona}
            />
          )}

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
        <HealthFeeds />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7fafc",
  },

  /* gradient restricted to header only */
  headerGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 420, // slightly taller for smoother fade
    zIndex: 0,
    paddingHorizontal: 20,
  },

  heroTopBar: {
    marginTop: 40,
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    backgroundColor: "rgba(255,255,255,0.25)",
    padding: 8,
    borderRadius: 12,
  },

  topBarText: {
    fontSize: 22,
    color: "#553fb5",
    marginLeft: 12,
  },

  content: {
    paddingHorizontal: 15,
    maxWidth: "100%",
    width: "100%",
    alignSelf: "center",
    gap: 14,
    marginTop: 14,
  },
  heroSectionInHeader: {
    marginTop: 8,
    position: "relative",
    minHeight: 200,
    flexDirection: "column",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingBottom: 40,
    zIndex: 2,
    overflow: "visible",
  },
  heroSection: {
    marginTop: -30,
    position: "relative",
    minHeight: 240,
    flexDirection: "column",
    alignItems: "flex-start",
  },
  heroTextContainer: {
    width: "100%",
    paddingRight: width * 0.45,
    zIndex: 2,
    paddingTop: 5,
  },
  heroTitle: {
    fontSize: 23,
    color: "#24106B" /* darker and slightly larger */,
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
    marginTop: 12,
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "rgba(124,58,237,0.24)",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.28,
    shadowRadius: 22,
    elevation: 10,
  },
  heroImage: {
    position: "absolute",
    right: 0,
    top: 10,
    width: 200,
    height: 270,
    resizeMode: "contain",
    zIndex: 40,
    elevation: 22,
  },
  almostDoneBanner: {
    marginTop: -6,
    marginHorizontal: 16,
    zIndex: 10,

    // keep shadows here (so they apply even if card style changes)
    shadowColor: "rgba(245,158,11,0.15)",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  warningBannerContainer: {
    backgroundColor: "#FBF1FE" /* light purple background */,
    borderRadius: 16,
    padding: 14,
    marginTop: -6 /* pull card up slightly */,
    marginHorizontal: 16,
    shadowColor: "rgba(245,158,11,0.15)",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#fff",
    zIndex: 10,
  },
  warningBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFAF5",
    borderRadius: 10,
    padding: 9,
    borderWidth: 1,
    borderColor: "#FFE0C7",
  },
  warningIconContainer: {
    marginRight: 7,
    backgroundColor: "#FFECD6",
    borderRadius: 14,
    width: 26,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  warningText: {
    fontSize: 10.5,
    color: COLORS.textPrimary,
    flex: 1,
    lineHeight: 15,
  },
  consultationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 11,
    gap: 5,
  },
  consultButton: {
    flex: 0.33,
    minWidth: 92,
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
    letterSpacing: 0.2,
    textAlign: "center",
  },
  consultOptionItem: {
    alignItems: "center",
    flex: 0.22,
    minWidth: 62,
  },
  consultOptionText: {
    fontSize: 7.5,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginTop: 3,
    lineHeight: 10.5,
  },

  helpSection: {
    marginTop: 24,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 18,
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
    gap: 5,
  },
  helpItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  helpText: {
    fontSize: 17,
    color: "#444444",
    lineHeight: 20,
    flex: 1,
  },
});
