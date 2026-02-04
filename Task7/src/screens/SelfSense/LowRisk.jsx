import React, { useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Animated,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text } from "../../../components/TextWrapper";
import GradientButton from "../../../components/GradientButton";
import ConsultWarningCard from "../../../components/ConsultWarningCard";

const { width } = Dimensions.get("window");
const isTablet = width >= 768;
const isDesktop = width >= 1024;
const horizontalPadding = isDesktop ? 40 : isTablet ? 28 : 20;
const contentMaxWidth = isDesktop ? 980 : isTablet ? 760 : "100%";

const LowRisk = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { assessment } = route.params || {};
  const conditionName = assessment?.conditionName || "Diabetes";
  const message = assessment?.message || "No Attention Needed";

  // Animation setup
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // 🔥 SAVE RESULT TO HISTORY AUTOMATICALLY
  useEffect(() => {
    const saveToHistory = async () => {
      try {
        const idStr = await AsyncStorage.getItem("activeUserId");
        if (!idStr) return;
        const activeId = JSON.parse(idStr);

        const usersStr = await AsyncStorage.getItem("users");
        if (!usersStr) return;
        let users = JSON.parse(usersStr);

        const newRecord = {
          id: Date.now(),
          conditionName: conditionName,
          date: new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          riskLevel: "No Attention Needed",
          totalScore: assessment?.totalScore || 0,
          maxScore: assessment?.maxPossibleScore || 40,
        };

        const updatedUsers = users.map((u) => {
          if (u.id === activeId) {
            const alreadyExists = u.history?.some(
              (h) =>
                h.id === newRecord.id ||
                (h.conditionName === newRecord.conditionName &&
                  h.date === newRecord.date)
            );
            if (!alreadyExists) {
              return { ...u, history: [...(u.history || []), newRecord] };
            }
          }
          return u;
        });

        await AsyncStorage.setItem("users", JSON.stringify(updatedUsers));
      } catch (error) {
        console.error("Failed to save history", error);
      }
    };

    saveToHistory();
  }, []);

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color="#065f46" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} weight="700">
          {conditionName} Outcome
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Main Result Card (Green) */}
        <Pressable
          style={({ hovered }) => [
            styles.cardWrapper,
            hovered && styles.cardHover,
          ]}
        >
          <LinearGradient
            colors={["#D1FAE5", "#A7F3D0"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.resultCard}
          >
            <View style={styles.resultRow}>
            {/* Big Icon Circle with Animation */}
            <Animated.View style={[styles.iconCircle, { transform: [{ scale: scaleAnim }] }]}>
              <Feather name="check" size={32} color="#fff" />
            </Animated.View>

            <View style={styles.resultTextContainer}>
              <View style={styles.pillContainer}>
                <Text style={styles.pillText} weight="700">
                  Based on your answers
                </Text>
              </View>
              <Text style={styles.resultTitle} weight="700">
                No Attention Needed
              </Text>
              <Text style={styles.resultDesc} weight="500">
                This result suggests you are currently maintaining a stable and
                healthy routine.
              </Text>
              <Text style={styles.resultDesc2} weight="500">
                Continue building good habits, and check in regularly to stay
                aware and proactive.
              </Text>
            </View>
          </View>
          </LinearGradient>
        </Pressable>

        {/* Consultation Card */}
        <ConsultWarningCard
          onConsultPress={() => console.log('Navigate to Consultation')}
          style={styles.consultCard}
        />

        {/* Influencing Factors */}
        <Text style={styles.sectionTitle} weight="600">
          How your answers influenced this result
        </Text>
        <View style={styles.listContainer}>
          {[
            "No alarming symptoms reported",
            "Healthy lifestyle patterns present",
            "No immediate family history concerns",
            "Preventive habits appear consistent",
          ].map((item, index) => (
            <View key={index} style={styles.bulletRow}>
              <Text style={styles.bulletDot} weight="500">
                •
              </Text>
              <Text style={styles.bulletText} weight="500">
                {item}
              </Text>
            </View>
          ))}
        </View>

        {/* Do's and Don'ts Section */}
        <View style={styles.gridContainer}>
          {/* Do Column */}
          <Pressable
            style={({ hovered }) => [
              styles.gridCol,
              styles.doCol,
              hovered && styles.cardHoverSmall,
            ]}
          >
            <View style={styles.colHeader}>
              <View style={styles.checkIconBox}>
                <Feather name="check" size={14} color="#fff" />
              </View>
              <Text style={styles.colTitleDo} weight="700">
                Do
              </Text>
            </View>

            <View style={styles.colContent}>
              {[
                "Maintain a balanced diet",
                "Stay physically active",
                "Keep sleep routine consistent",
                "Track wellness metrics occasionally",
              ].map((item, i) => (
                <View key={i} style={styles.gridItemRow}>
                  <Text style={styles.gridBulletDo} weight="700">
                    •
                  </Text>
                  <Text style={styles.gridText} weight="500">
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          </Pressable>

          {/* Avoid Column */}
          <Pressable
            style={({ hovered }) => [
              styles.gridCol,
              styles.avoidCol,
              hovered && styles.cardHoverSmall,
            ]}
          >
            <View style={styles.colHeader}>
              <View style={styles.crossIconBox}>
                <Feather name="x" size={14} color="#fff" />
              </View>
              <Text style={styles.colTitleAvoid} weight="700">
                Avoid
              </Text>
            </View>

            <View style={styles.colContent}>
              {[
                "Ignoring new symptoms",
                "Sudden lifestyle changes",
                "Skipping routine checkups",
              ].map((item, i) => (
                <View key={i} style={styles.gridItemRow}>
                  <Text style={styles.gridBulletAvoid} weight="700">
                    •
                  </Text>
                  <Text style={styles.gridText} weight="500">
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          </Pressable>
        </View>

        {/* Research Card */}
        <Pressable
          style={({ hovered }) => [
            styles.researchCard,
            hovered && styles.cardHover,
          ]}
        >
          <Text style={styles.researchTitle} weight="600">
            What research says
          </Text>
          <Text style={styles.researchText} weight="400">
            Research supports that consistent healthy routines and early
            awareness reduce long-term risk and support better overall
            wellbeing.
          </Text>
          <Pressable
            style={({ hovered }) => [hovered && styles.linkHover]}
          >
            <Text style={styles.learnMore} weight="700">
              Learn More &gt;
            </Text>
          </Pressable>
        </Pressable>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

export default LowRisk;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FFFB", /* fresher minty background */
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: horizontalPadding,
    paddingBottom: 18,
    backgroundColor: "transparent",
  },
  backButton: {
    padding: 8,
    marginRight: 12,
    backgroundColor: "rgba(6,95,70,0.06)",
    borderRadius: 10,
  },
  headerTitle: {
    fontSize: isTablet ? 22 : 20,
    color: "#065f46",
    letterSpacing: 0.2,
  },
  scrollContent: {
    paddingHorizontal: horizontalPadding,
    paddingBottom: 36,
    width: "100%",
    alignSelf: "center",
    maxWidth: contentMaxWidth,
  },
  cardWrapper: {
    borderRadius: 18,
    overflow: "hidden",
  },
  cardHover: {
    transform: [{ scale: 1.01 }],
  },
  // Result Card (Green)
  resultCard: {
    borderRadius: 18,
    padding: 22,
    marginBottom: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    shadowColor: "#064e3b",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(6,95,70,0.06)",
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 18,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 6,
  },
  resultTextContainer: {
    flex: 1,
  },
  pillContainer: {
    backgroundColor: "rgba(233,250,243,0.9)",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginBottom: 10,
  },
  pillText: {
    color: "#065f46",
    fontSize: 11,
  },
  resultTitle: {
    fontSize: isTablet ? 22 : 18,
    color: "#071422",
    marginBottom: 6,
  },
  resultDesc: {
    fontSize: isTablet ? 14 : 13,
    color: "#334155",
    lineHeight: isTablet ? 22 : 20,
    marginBottom: 8,
    opacity: 0.95,
  },
  resultDesc2: {
    fontSize: isTablet ? 13 : 12,
    color: "#64748b",
    lineHeight: isTablet ? 20 : 18,
  },
  // Consult Card
  consultCard: {
    backgroundColor: "rgba(240,255,250,0.95)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 26,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(6,95,70,0.06)",
  },
  disclaimerRow: {
    flexDirection: "row",
    marginBottom: 14,
    paddingRight: 8,
    alignItems: "flex-start",
  },
  orangeDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#F57C00",
    marginRight: 10,
    marginTop: 5,
  },
  disclaimerText: {
    fontSize: 12,
    color: "#0f172a",
    flex: 1,
    lineHeight: 18,
  },
  consultActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  consultBtn: {
    width: "40%",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 6,
  },
  buttonHover: {
    transform: [{ scale: 1.02 }],
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  consultBtnGradient: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  consultBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  consultIconsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    flex: 1,
    marginLeft: 12,
  },
  consultIconItem: {
    alignItems: "center",
    width: 68,
  },
  iconHover: {
    transform: [{ scale: 1.05 }],
  },
  miniIconBg: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  miniIconText: {
    fontSize: isTablet ? 10 : 9,
    color: "#475569",
    textAlign: "center",
    lineHeight: 12,
  },
  sectionTitle: {
    fontSize: isTablet ? 18 : 16,
    color: "#065f46",
    marginBottom: 14,
  },
  listContainer: {
    marginBottom: 22,
    paddingLeft: 6,
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
  },
  bulletDot: {
    fontSize: 20,
    color: "#94a3b8",
    marginRight: 10,
    marginTop: -2,
  },
  bulletText: {
    fontSize: isTablet ? 15 : 14,
    color: "#374151",
  },
  gridContainer: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 26,
  },
  gridCol: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 4,
  },
  doCol: {
    backgroundColor: "#F0FFF7",
  },
  avoidCol: {
    backgroundColor: "#FFF9F9",
  },
  colHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  checkIconBox: {
    backgroundColor: "#065f46",
    borderRadius: 6,
    padding: 6,
    marginRight: 8,
  },
  crossIconBox: {
    backgroundColor: "#C62828",
    borderRadius: 6,
    padding: 6,
    marginRight: 8,
  },
  colTitleDo: {
    color: "#0b0b0b",
    fontSize: 15,
  },
  colTitleAvoid: {
    color: "#0b0b0b",
    fontSize: 15,
  },
  gridItemRow: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "flex-start",
  },
  gridBulletDo: {
    fontSize: 14,
    marginRight: 8,
    color: "#065f46",
  },
  gridBulletAvoid: {
    fontSize: 14,
    marginRight: 8,
    color: "#C62828",
  },
  gridText: {
    fontSize: isTablet ? 13 : 12,
    color: "#0b1220",
    flex: 1,
    lineHeight: isTablet ? 20 : 18,
  },
  cardHoverSmall: {
    transform: [{ scale: 1.01 }],
  },
  researchCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 6,
  },
  researchTitle: {
    fontSize: 15,
    color: "#065f46",
    marginBottom: 10,
  },
  researchText: {
    fontSize: 13,
    color: "#6b7280",
    lineHeight: 20,
    marginBottom: 10,
  },
  learnMore: {
    fontSize: 13,
    color: "#065f46",
    textAlign: "right",
  },
  linkHover: {
    opacity: 0.9,
  },
});