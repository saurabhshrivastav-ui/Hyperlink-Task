import React, { useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
// 🔥 ADDED useRoute
import { useNavigation, useRoute } from "@react-navigation/native";
import { Feather, FontAwesome5, Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";

import ReportBanner from "../../../components/ReportBanner";
import ResultBottomMenu from "../../../components/ResultBottomMenu";
import { Text } from "../../../components/TextWrapper";

const { width } = Dimensions.get("window");

const HighRisk = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const animationRef = useRef(null);

  // 🔥 EXTRACT DATA
  const { assessment } = route.params || {};
  const conditionName = assessment?.conditionName || "Health";
  const message = assessment?.message || "Immediate attention required.";

  useEffect(() => {
    animationRef.current?.play();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={["#c0392b", "#8e0000"]}
          style={styles.headerGradient}
        >
          <View style={styles.animationContainer}>
            <LottieView
              ref={animationRef}
              source={require("../../../assets/Risky.json")}
              autoPlay
              loop
              style={styles.animation}
            />
          </View>

          {/* 🔥 DYNAMIC TITLE */}
          <Text style={styles.headerTitle} weight="800">
            {conditionName}: High Risk 🚨
          </Text>

          <Text style={styles.headerSubtitle}>
            Immediate medical attention is strongly recommended
          </Text>

          <View style={styles.riskBadge}>
            <Ionicons name="warning" size={20} color="#c0392b" />
            <Text style={styles.riskText}>HIGH RISK</Text>
          </View>

          <View style={styles.resultCard}>
            {/* 🔥 DYNAMIC MESSAGE */}
            <Text style={styles.resultCardText}>{message}</Text>
          </View>
        </LinearGradient>

        <View style={styles.tipsContainer}>
          <Text style={styles.subheading}>Urgent Actions Required</Text>

          <View style={styles.tipItem}>
            <Ionicons name="call-outline" size={20} color="#c0392b" />
            <Text style={styles.tipText}>Contact a doctor immediately</Text>
          </View>

          <View style={styles.tipItem}>
            <Ionicons name="medkit-outline" size={20} color="#c0392b" />
            <Text style={styles.tipText}>Follow medical advice strictly</Text>
          </View>

          <View style={styles.tipItem}>
            <Ionicons name="alert-outline" size={20} color="#c0392b" />
            <Text style={styles.tipText}>Do not ignore symptoms</Text>
          </View>
        </View>

        <View style={styles.consultContainer}>
          <TouchableOpacity
            style={styles.emergencyBtn}
            onPress={() => navigation.navigate("Consultation")}
          >
            <Text style={styles.emergencyText}>
              Book Emergency Consultation
            </Text>
          </TouchableOpacity>
        </View>

        <ReportBanner />
      </ScrollView>

      <ResultBottomMenu active="high" />
    </View>
  );
};

export default HighRisk;

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
  animation: { width: "100%", height: "100%" },
  headerTitle: {
    fontSize: 26,
    color: "#fff",
    marginTop: 10,
    textAlign: "center",
  },
  headerSubtitle: { color: "#ffebee", marginBottom: 12 },
  riskBadge: {
    flexDirection: "row",
    backgroundColor: "#fdecea",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 14,
  },
  riskText: { color: "#c0392b", fontWeight: "700", marginLeft: 6 },
  resultCard: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 16,
    borderRadius: 16,
  },
  resultCardText: {
    color: "#fff",
    textAlign: "center",
    lineHeight: 20,
  },
  tipsContainer: { padding: 20 },
  subheading: {
    fontSize: 22,
    marginBottom: 12,
    fontWeight: "700",
    color: "#c0392b",
  },
  tipItem: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  tipText: { marginLeft: 10, fontSize: 16 },
  consultContainer: { padding: 20 },
  emergencyBtn: {
    backgroundColor: "#c0392b",
    padding: 14,
    borderRadius: 10,
  },
  emergencyText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "800",
    fontSize: 16,
  },
});
