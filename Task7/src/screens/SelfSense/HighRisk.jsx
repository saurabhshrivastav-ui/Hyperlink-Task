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
const s = (size) => (width / 375) * size;

const HighRisk = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { assessment } = route.params || {};
  const conditionName = assessment?.conditionName || "Diabetes";
  const message = assessment?.message || "High Attention Need";

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
          riskLevel: "High Attention Need",
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
          <Feather name="arrow-left" size={24} color="#7c2d12" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} weight="700">
          {conditionName} Outcome
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Main Result Card (Red) */}
        <Pressable
          style={({ hovered }) => [
            styles.cardWrapper,
            hovered && styles.cardHover,
          ]}
        >
          <LinearGradient
            colors={["#FED7D7", "#FFC5C5"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.resultCard}
          >
            <View style={styles.resultRow}>
            {/* Big Icon Circle with Animation */}
            <Animated.View style={[styles.iconCircle, { transform: [{ scale: scaleAnim }] }]}>
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
                High Attention Need
              </Text>
              <Text style={styles.resultDesc} weight="500">
                This result suggests that your current symptom pattern and risk
                factors may require closer attention and timely action.
              </Text>
              <Text style={styles.resultDesc2} weight="500">
                This does not confirm a diagnosis, but it does indicate that getting
                clinical guidance can help prevent complications and provide clarity.
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
            "Multiple symptoms reported",
            "Symptom frequency above average",
            "Family history reported",
            "Lifestyle risk factors identified",
            "Delayed preventive screenings",
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
                "Book a doctor consultation soon",
                "Monitor symptoms closely",
                "Keep a record of symptoms",
                "Maintain hydration and proper rest",
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
                "Ignoring persistent",
                "Delaying medical advice",
                "Self-medicating without guidance",
                "panic searching online",
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
            Clinical research and global health guidelines highlight that early
            evaluation and timely intervention improve outcomes and reduce
            long-term complications when high-risk indicators are present.
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

export default HighRisk;

const styles = StyleSheet.create({
  /* Overall container updated for a neutral, soft backdrop with subtle texture feel */
  container: {
    flex: 1,
    backgroundColor: "#f7fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 18,
    marginTop: 40,
    backgroundColor: "transparent",
    borderBottomWidth: 0,
  },
  backButton: {
    backgroundColor: "rgba(255,255,255,0.25)",
    padding: 8,
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 22,
    color: "#7c2d12",
    marginLeft: 12,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 36,
    width: "100%",
    alignSelf: "center",
    maxWidth: "100%",
  },
  pagePadding: {
    paddingHorizontal: 20,
  },

  /* Card wrapper subtle lift */
  cardWrapper: {
    borderRadius: 18,
    overflow: "hidden",
  },
  cardHover: {
    transform: [{ scale: 1.01 }],
  },

  /* Result Card — glassy, with a thin accent stripe */
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

  /* Larger icon, softened inner shadow — animation preserved */
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#DC4B43",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 18,
    shadowColor: "#DC4B43",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
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
    fontSize: 15,
  },
  resultTitle: {
    fontSize: 20,
    color: "#071422",
    marginBottom: 6,
  },
  resultDesc: {
    fontSize: 17,
    color: "#334155",
    lineHeight: 20,
    marginBottom: 8,
    opacity: 0.95,
  },
  resultDesc2: {
    fontSize: 15,
    color: "#64748b",
    lineHeight: 18,
  },

  /* Consult Card — brighter, clearer call-to-action */
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
    color: "#2b2b2b",
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
    shadowColor: "#DC4B43",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
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
    fontSize: s(9),
    color: "#666",
    textAlign: "center",
    lineHeight: 12,
  },

  /* Influence Section — clearer headings */
  sectionTitle: {
    fontSize: 20,
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
    color: "#8a8a8a",
    marginRight: 10,
    marginTop: -2,
  },
  bulletText: {
    fontSize: 17,
    color: "#374151",
  },

  /* Do's and Don'ts — card-like columns */
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
    backgroundColor: "#ECFDF5",
  },
  avoidCol: {
    backgroundColor: "#FFF1F0",
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
    fontSize: 20,
  },
  colTitleAvoid: {
    color: "#0b0b0b",
    fontSize: 20,
  },
  colContent: {
    paddingLeft: 2,
  },
  gridItemRow: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "flex-start",
  },
  gridBulletDo: {
    fontSize: 19,
    marginRight: 8,
    color: "#2E7D32",
  },
  gridBulletAvoid: {
    fontSize: 19,
    marginRight: 8,
    color: "#C62828",
  },
  gridText: {
    fontSize: 17,
    color: "#222",
    flex: 1,
  },
  cardHoverSmall: {
    transform: [{ scale: 1.01 }],
  },

  /* Research Card — minimal */
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
    fontSize: 20,
    color: "#7c2d12",
    marginBottom: 10,
  },
  researchText: {
    fontSize: 16,
    color: "#666",
    lineHeight: 20,
    marginBottom: 10,
  },
  learnMore: {
    fontSize: 19,
    color: "#7c2d12",
    textAlign: "right",
  },
  linkHover: {
    opacity: 0.9,
  },
});