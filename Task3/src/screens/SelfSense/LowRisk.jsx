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

import ReportBanner from "../../../components/ReportBanner";
import { Text } from "../../../components/TextWrapper";

const { width } = Dimensions.get("window");

const ResultScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const animationRef = useRef(null);

  // 🔥 EXTRACT DATA FROM PARAMS
  const { assessment } = route.params || {};
  const conditionName = assessment?.conditionName || "Health";
  const message = assessment?.message || "You are in good health.";

  useEffect(() => {
    animationRef.current?.play();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
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

          {/* 🔥 DYNAMIC TITLE */}
          <Text style={styles.headerTitle} weight="800">
            {conditionName}: Low Risk ✅
          </Text>

          <Text style={styles.headerSubtitle}>
            Your indicators are within a safe range
          </Text>

          {/* LOW RISK BADGE */}
          <View style={styles.lowRiskBadge}>
            <Ionicons name="shield-checkmark" size={20} color="#2ecc71" />
            <Text style={styles.lowRiskText}>LOW RISK</Text>
          </View>

          {/* RESULT CARD */}
          <View style={styles.resultCard}>
            {/* 🔥 DYNAMIC MESSAGE FROM JSON */}
            <Text style={styles.resultCardText}>
              {message}
            </Text>
          </View>
        </LinearGradient>

        {/* HEALTH TIPS */}
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

        {/* OPTIONAL CONSULT */}
        <View style={styles.consultContainer}>
          <Text style={styles.subheading}>Need Expert Advice?</Text>

          <TouchableOpacity
            style={styles.bookBtn}
            onPress={() => navigation.navigate("Consultation")}
          >
            <Text style={styles.bookBtnText}>Consult a Doctor (Optional)</Text>
          </TouchableOpacity>

          <View style={styles.consultOptions}>
            <FontAwesome5 name="video" size={26} color="#2ecc71" />
            <Ionicons name="chatbox-ellipses" size={26} color="#2ecc71" />
            <Feather name="file-text" size={26} color="#2ecc71" />
          </View>
        </View>

        <ReportBanner />
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

export default ResultScreen;

const styles = StyleSheet.create({
  headerGradient: {
    padding: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: "center",
  },
  animationContainer: {
    width: width * 0.55,
    height: width * 0.55,
  },
  animation: {
    width: "100%",
    height: "100%",
  },
  headerTitle: {
    fontSize: 26,
    color: "#fff",
    marginTop: 10,
    textAlign: "center",
  },
  headerSubtitle: {
    color: "#ecfdf5",
    marginBottom: 12,
    textAlign: "center",
  },
  lowRiskBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eafaf1",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 14,
  },
  lowRiskText: {
    color: "#27ae60",
    fontWeight: "700",
    marginLeft: 6,
  },
  resultCard: {
    backgroundColor: "rgba(255,255,255,0.18)",
    padding: 16,
    borderRadius: 16,
  },
  resultCardText: {
    color: "#fff",
    textAlign: "center",
    lineHeight: 20,
  },
  tipsContainer: {
    padding: 20,
  },
  subheading: {
    fontSize: 22,
    marginBottom: 12,
    fontWeight: "700",
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  tipText: {
    marginLeft: 10,
    fontSize: 16,
  },
  consultContainer: {
    padding: 20,
  },
  bookBtn: {
    backgroundColor: "#27ae60",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  bookBtnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },
  consultOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});