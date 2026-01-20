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

        {/* Consultation Card (Light Purple) */}
        <Pressable
          style={({ hovered }) => [
            styles.consultCard,
            hovered && styles.cardHover,
          ]}
        >
          <View style={styles.disclaimerRow}>
            <View style={styles.orangeDot} />
            <Text style={styles.disclaimerText} weight="600">
              This is not a diagnostic tool. For urgent concerns, please
              consult
            </Text>
          </View>

          <View style={styles.consultActionRow}>
            {/* Consult Button */}
            <Pressable
              onPress={() => navigation.navigate("Consultation")}
              style={({ pressed, hovered }) => [
                styles.consultBtn,
                (pressed || hovered) && styles.buttonHover,
              ]}
            >
              <LinearGradient
                colors={["#D500F9", "#AA00FF"]}
                style={styles.consultBtnGradient}
              >
                <Text style={styles.consultBtnText} weight="700">
                  Consult Now!
                </Text>
              </LinearGradient>
            </Pressable>

            {/* Small Icons */}
            <View style={styles.consultIconsContainer}>
              <View style={styles.consultIconItem}>
                <View style={styles.miniIconBg}>
                  <FontAwesome5 name="user-md" size={14} color="#1976D2" />
                </View>
                <Text style={styles.miniIconText} weight="500">
                  One to One Consultation
                </Text>
              </View>
              <View style={styles.consultIconItem}>
                <View style={styles.miniIconBg}>
                  <MaterialCommunityIcons name="chat" size={14} color="#1976D2" />
                </View>
                <Text style={styles.miniIconText} weight="500">
                  Chat with Healer
                </Text>
              </View>
              <View style={styles.consultIconItem}>
                <View style={styles.miniIconBg}>
                  <MaterialIcons name="lightbulb-outline" size={14} color="#1976D2" />
                </View>
                <Text style={styles.miniIconText} weight="500">
                  Prescription and Health Tips
                </Text>
              </View>
            </View>
          </View>
        </Pressable>

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
    backgroundColor: "#FFF5F5", // Light pink background
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: horizontalPadding,
    paddingBottom: 15,
    backgroundColor: "#FFF5F5",
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: isTablet ? 22 : 20,
    color: "#6A1B9A", // Deep Purple
  },
  scrollContent: {
    paddingHorizontal: horizontalPadding,
    paddingBottom: 30,
    width: "100%",
    alignSelf: "center",
    maxWidth: contentMaxWidth,
  },
  cardWrapper: {
    borderRadius: 16,
  },
  cardHover: {
    transform: [{ scale: 1.01 }],
  },
  // Result Card (Orange)
  resultCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFA726", // Solid Orange
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  exclamationMark: {
    fontSize: 36,
    color: "#fff",
  },
  resultTextContainer: {
    flex: 1,
  },
  pillContainer: {
    backgroundColor: "#EDE7F6",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  pillText: {
    color: "#6A1B9A",
    fontSize: 10,
  },
  resultTitle: {
    fontSize: isTablet ? 20 : 18,
    color: "#000",
    marginBottom: 6,
  },
  resultDesc: {
    fontSize: isTablet ? 13 : 12,
    color: "#333",
    lineHeight: isTablet ? 20 : 18,
  },
  // Consult Card
  consultCard: {
    backgroundColor: "#F3E5F5", // Light purple
    borderRadius: 16,
    padding: 15,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  disclaimerRow: {
    flexDirection: "row",
    marginBottom: 15,
    paddingRight: 10,
    alignItems: "flex-start",
  },
  orangeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F57C00",
    marginRight: 8,
    marginTop: 4,
  },
  disclaimerText: {
    fontSize: 11,
    color: "#000",
    flex: 1,
    lineHeight: 16,
  },
  consultActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  consultBtn: {
    width: "35%",
    borderRadius: 8,
    overflow: "hidden",
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
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  consultBtnText: {
    color: "#fff",
    fontSize: 14,
  },
  consultIconsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    flex: 1,
    marginLeft: 10,
  },
  consultIconItem: {
    alignItems: "center",
    width: 60,
  },
  miniIconBg: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  miniIconText: {
    fontSize: isTablet ? 9 : 8,
    color: "#666",
    textAlign: "center",
    lineHeight: 10,
  },
  // Influence Section
  sectionTitle: {
    fontSize: isTablet ? 17 : 16,
    color: "#6A1B9A",
    marginBottom: 12,
  },
  listContainer: {
    marginBottom: 20,
    paddingLeft: 5,
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "center",
  },
  bulletDot: {
    fontSize: 18,
    color: "#666",
    marginRight: 8,
    marginTop: -2,
  },
  bulletText: {
    fontSize: isTablet ? 15 : 14,
    color: "#555",
  },
  // Do's and Don'ts
  gridContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 25,
  },
  gridCol: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  doCol: {
    backgroundColor: "#C8E6C9", // Light Green
  },
  avoidCol: {
    backgroundColor: "#FFCDD2", // Light Red
  },
  colHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkIconBox: {
    backgroundColor: "#2E7D32",
    borderRadius: 4,
    padding: 2,
    marginRight: 6,
  },
  crossIconBox: {
    backgroundColor: "#C62828",
    borderRadius: 4,
    padding: 2,
    marginRight: 6,
  },
  colTitleDo: {
    color: "#000",
  },
  colTitleAvoid: {
    color: "#000",
  },
  colContent: {
    paddingLeft: 2,
  },
  gridItemRow: {
    flexDirection: "row",
    marginBottom: 6,
    alignItems: "flex-start",
  },
  gridBulletDo: {
    fontSize: 12,
    marginRight: 5,
    color: "#2E7D32",
  },
  gridBulletAvoid: {
    fontSize: 12,
    marginRight: 5,
    color: "#C62828",
  },
  gridText: {
    fontSize: isTablet ? 12 : 10,
    color: "#000",
    flex: 1,
    lineHeight: isTablet ? 16 : 14,
  },
  // Research Card
  researchCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  researchTitle: {
    fontSize: 14,
    color: "#6A1B9A",
    marginBottom: 8,
  },
  researchText: {
    fontSize: 12,
    color: "#666",
    lineHeight: 18,
    marginBottom: 8,
  },
  learnMore: {
    fontSize: 12,
    color: "#6A1B9A",
    textAlign: "right",
  },
  linkHover: {
    opacity: 0.85,
  },
});
