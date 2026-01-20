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

const { width } = Dimensions.get("window");
const isTablet = width >= 768;
const isDesktop = width >= 1024;
const horizontalPadding = isDesktop ? 40 : isTablet ? 28 : 20;
const contentMaxWidth = isDesktop ? 980 : isTablet ? 760 : "100%";

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

        {/* Consultation Card (Light Pink) */}
        <Pressable
          style={({ hovered }) => [
            styles.consultCard,
            hovered && styles.cardHover,
          ]}
        >
          <View style={styles.disclaimerRow}>
            <View style={styles.orangeDot} />
            <Text style={styles.disclaimerText} weight="600">
              This is not a diagnostic tool. For urgent concerns, please consult
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
              <Pressable
                style={({ hovered }) => [
                  styles.consultIconItem,
                  hovered && styles.iconHover,
                ]}
              >
                <View style={styles.miniIconBg}>
                  <FontAwesome5 name="user-md" size={14} color="#1976D2" />
                </View>
                <Text style={styles.miniIconText} weight="500">
                  One to One Consultation
                </Text>
              </Pressable>
              <Pressable
                style={({ hovered }) => [
                  styles.consultIconItem,
                  hovered && styles.iconHover,
                ]}
              >
                <View style={styles.miniIconBg}>
                  <MaterialCommunityIcons name="chat" size={14} color="#1976D2" />
                </View>
                <Text style={styles.miniIconText} weight="500">
                  Chat with specialist
                </Text>
              </Pressable>
              <Pressable
                style={({ hovered }) => [
                  styles.consultIconItem,
                  hovered && styles.iconHover,
                ]}
              >
                <View style={styles.miniIconBg}>
                  <MaterialIcons name="lightbulb-outline" size={14} color="#1976D2" />
                </View>
                <Text style={styles.miniIconText} weight="500">
                  Prescription and lab referrals
                </Text>
              </Pressable>
            </View>
          </View>
        </Pressable>

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
    color: "#7c2d12",
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
  // Result Card (Red/Coral)
  resultCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#DC2626",
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
    color: "#7c2d12",
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
    marginBottom: 6,
  },
  resultDesc2: {
    fontSize: isTablet ? 12 : 11,
    color: "#666",
    lineHeight: isTablet ? 18 : 16,
  },
  // Consult Card
  consultCard: {
    backgroundColor: "#FFF0F5",
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
  iconHover: {
    transform: [{ scale: 1.05 }],
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
    color: "#7c2d12",
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
    backgroundColor: "#C8E6C9",
  },
  avoidCol: {
    backgroundColor: "#FFCDD2",
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
  cardHoverSmall: {
    transform: [{ scale: 1.01 }],
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
    color: "#7c2d12",
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
    color: "#7c2d12",
    textAlign: "right",
  },
  linkHover: {
    opacity: 0.85,
  },
});