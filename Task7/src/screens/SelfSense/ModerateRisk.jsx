import React, { useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Pressable,
  Image,
  Animated,
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

const ModerateRisk = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Extract params (keeping your existing logic)
  const { assessment } = route.params || {};
  const conditionName = assessment?.conditionName || "Diabetes"; // Defaulted to Diabetes per image
  const message = assessment?.message || "Moderate Attention Need";

  // Animation setup using React Native Animated
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

  // 🔥 SAVE RESULT TO HISTORY (Your existing logic preserved)
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
          riskLevel: "Moderate Attention Need", // Updated to match image text
          totalScore: assessment?.totalScore || 0,
          maxScore: assessment?.maxPossibleScore || 40,
        };

        const updatedUsers = users.map((u) => {
          if (u.id === activeId) {
            const alreadyExists = u.history?.some(
              (h) =>
                h.id === newRecord.id ||
                (h.conditionName === newRecord.conditionName &&
                  h.date === newRecord.date),
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
          <Feather name="arrow-left" size={24} color="#5e35b1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} weight="700">
          {conditionName} Outcome
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Main Result Card (Orange) */}
        <Pressable
          style={({ hovered }) => [
            styles.cardWrapper,
            hovered && styles.cardHover,
          ]}
        >
          <LinearGradient
            colors={["#FFDAB9", "#FFCCBC"]} // Peach/Orange gradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.resultCard}
          >
            <View style={styles.resultRow}>
            {/* Big Icon Circle with Animation */}
            <Animated.View style={[styles.iconCircle, { transform: [{ scale: scaleAnim }] }]}
            >
              <Text style={styles.exclamationMark} weight="700">
                !
              </Text>
            </Animated.View>

            <View style={styles.resultTextContainer}>
              <View style={styles.pillContainer}>
                <Text style={styles.pillText} weight="700">
                  Based on your answers
                </Text>
              </View>
              <Text style={styles.resultTitle} weight="700">
                Moderate Attention Need
              </Text>
              <Text style={styles.resultDesc} weight="500">
                Your responses show a combination of lifestyle factors and
                symptoms that may increase risk over time. Monitoring and
                preventive action are advised.
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
            "Mild symptom patterns reported",
            "Lifestyle habits may need improvement",
            "Sleep routine inconsistencies",
            "Stress indicators present",
            "Preventive checks may be delayed",
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
          <View style={[styles.gridCol, styles.doCol]}>
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
                "Improve sleep routine consistency",
                "Stay physically active",
                "Track related health patterns weekly",
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
          </View>

          {/* Avoid Column */}
          <View style={[styles.gridCol, styles.avoidCol]}>
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
                "Ignoring recurring symptoms",
                "Prolonged unhealthy routines",
                "Delaying checkups for too long",
                "High stress without recovery habits",
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
          </View>
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
            Studies show that early awareness and lifestyle adjustments can
            significantly reduce long-term risk and improve overall wellbeing.
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

export default ModerateRisk;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF9FB", /* very light warm canvas */
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
    backgroundColor: "rgba(90,53,145,0.06)",
    borderRadius: 10,
  },
  headerTitle: {
    fontSize: isTablet ? 22 : 20,
    color: "#6A1B9A",
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
  resultCard: {
    borderRadius: 18,
    padding: 22,
    marginBottom: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    shadowColor: "#6A1B9A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 22,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(106,27,154,0.06)",
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#FFA726",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 18,
    shadowColor: "#FFA726",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 6,
  },
  exclamationMark: {
    fontSize: 40,
    color: "#fff",
  },
  resultTextContainer: {
    flex: 1,
  },
  pillContainer: {
    backgroundColor: "rgba(237,231,246,0.6)",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginBottom: 10,
  },
  pillText: {
    color: "#6A1B9A",
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
  },
  consultCard: {
    backgroundColor: "rgba(250,245,255,0.95)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 26,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(106,27,154,0.06)",
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
    shadowColor: "#FFA726",
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
  sectionTitle: {
    fontSize: isTablet ? 18 : 16,
    color: "#6A1B9A",
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
    color: "#444",
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
    backgroundColor: "#F7FFFB",
  },
  avoidCol: {
    backgroundColor: "#FFF7F5",
  },
  colHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  checkIconBox: {
    backgroundColor: "#2E7D32",
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
    color: "#6A1B9A",
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
    color: "#6A1B9A",
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
    color: "#6A1B9A",
    textAlign: "right",
  },
  linkHover: {
    opacity: 0.9,
  },
});
