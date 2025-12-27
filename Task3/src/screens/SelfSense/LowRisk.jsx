import React, { useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Feather, FontAwesome5, Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
// 🔥 ADDED AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";

import ReportBanner from "../../../components/ReportBanner";
import { Text } from "../../../components/TextWrapper";

const { width } = Dimensions.get("window");

const LowRisk = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const animationRef = useRef(null);

  const { assessment } = route.params || {};
  const conditionName = assessment?.conditionName || "Health";
  const message = assessment?.message || "You are in good health.";

  // 🔥 SAVE RESULT TO HISTORY AUTOMATICALLY
  useEffect(() => {
    animationRef.current?.play();

    const saveToHistory = async () => {
      try {
        // 1. Get Active User ID
        const idStr = await AsyncStorage.getItem("activeUserId");
        if (!idStr) return;
        const activeId = JSON.parse(idStr);

        // 2. Get Users List
        const usersStr = await AsyncStorage.getItem("users");
        if (!usersStr) return;
        let users = JSON.parse(usersStr);

        // 3. Create New Record
        const newRecord = {
          id: Date.now(),
          conditionName: conditionName,
          date: new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          riskLevel: "Low Risk",
          totalScore: assessment?.totalScore || 0,
          maxScore: assessment?.maxPossibleScore || 40,
        };

        // 4. Update the specific user's history
        const updatedUsers = users.map((u) => {
          if (u.id === activeId) {
            // Prevent duplicate save if effect runs twice
            const alreadyExists = u.history?.some(
              (h) => h.id === newRecord.id || (h.conditionName === newRecord.conditionName && h.date === newRecord.date)
            );
            if (!alreadyExists) {
              return { ...u, history: [...(u.history || []), newRecord] };
            }
          }
          return u;
        });

        // 5. Save back to Storage
        await AsyncStorage.setItem("users", JSON.stringify(updatedUsers));
      } catch (error) {
        console.error("Failed to save history", error);
      }
    };

    saveToHistory();
  }, []);

  const handleViewRecords = () => {
    // Navigate back to the PersonalDetails screen (Make sure name matches App.jsx)
    navigation.navigate("SelfSensePersonalDetails");
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={["#2ecc71", "#27ae60"]}
          style={styles.headerGradient}
        >
          <View style={styles.animationContainer}>
            <LottieView
              ref={animationRef}
              source={require("../../../assets/Done.json")}
              autoPlay
              loop
              style={styles.animation}
            />
          </View>

          <Text style={styles.headerTitle} weight="800">
            {conditionName}: Low Risk ✅
          </Text>

          <Text style={styles.headerSubtitle}>
            Your indicators are within a safe range
          </Text>

          <View style={styles.lowRiskBadge}>
            <Ionicons name="shield-checkmark" size={20} color="#2ecc71" />
            <Text style={styles.lowRiskText}>LOW RISK</Text>
          </View>

          <View style={styles.resultCard}>
            <Text style={styles.resultCardText}>{message}</Text>
          </View>
        </LinearGradient>

        <View style={styles.tipsContainer}>
          <Text style={styles.subheading}>Maintain Healthy Habits</Text>
          <View style={styles.tipItem}>
            <Feather name="activity" size={20} color="#27ae60" />
            <Text style={styles.tipText}>Stay physically active</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="nutrition-outline" size={20} color="#27ae60" />
            <Text style={styles.tipText}>Follow a balanced diet</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="water-outline" size={20} color="#27ae60" />
            <Text style={styles.tipText}>Drink adequate water</Text>
          </View>
        </View>

        <View style={styles.consultContainer}>
          <Text style={styles.subheading}>Need Expert Advice?</Text>
          <TouchableOpacity
            style={styles.bookBtn}
            onPress={() => navigation.navigate("Consultation")}
          >
            <Text style={styles.bookBtnText}>Consult a Doctor (Optional)</Text>
          </TouchableOpacity>
        </View>

        {/* 🔥 VIEW RECORDS BUTTON */}
        <TouchableOpacity style={styles.historyBtn} onPress={handleViewRecords}>
          <Text style={styles.historyBtnText}>View Past Records</Text>
          <Feather name="arrow-right" size={18} color="#27ae60" />
        </TouchableOpacity>

        <ReportBanner />
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

export default LowRisk;

const styles = StyleSheet.create({
  headerGradient: {
    padding: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: "center",
  },
  animationContainer: { width: width * 0.55, height: width * 0.55 },
  animation: { width: "100%", height: "100%" },
  headerTitle: { fontSize: 26, color: "#fff", marginTop: 10, textAlign: "center" },
  headerSubtitle: { color: "#ecfdf5", marginBottom: 12, textAlign: "center" },
  lowRiskBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eafaf1",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 14,
  },
  lowRiskText: { color: "#27ae60", fontWeight: "700", marginLeft: 6 },
  resultCard: {
    backgroundColor: "rgba(255,255,255,0.18)",
    padding: 16,
    borderRadius: 16,
  },
  resultCardText: { color: "#fff", textAlign: "center", lineHeight: 20 },
  tipsContainer: { padding: 20 },
  subheading: { fontSize: 22, marginBottom: 12, fontWeight: "700" },
  tipItem: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  tipText: { marginLeft: 10, fontSize: 16 },
  consultContainer: { padding: 20 },
  bookBtn: {
    backgroundColor: "#27ae60",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  bookBtnText: { color: "#fff", textAlign: "center", fontWeight: "700" },
  historyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    backgroundColor: "#eafaf1",
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
    gap: 10,
  },
  historyBtnText: {
    color: "#27ae60",
    fontWeight: "700",
    fontSize: 16,
  },
  consultOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});