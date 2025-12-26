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

const ModerateRisk = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const animationRef = useRef(null);

  // 🔥 EXTRACT DATA
  const { assessment } = route.params || {};
  const conditionName = assessment?.conditionName || "Health";
  const message = assessment?.message || "Please consult a doctor.";

  useEffect(() => {
    animationRef.current?.play();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={["#f39c12", "#e67e22"]}
          style={styles.headerGradient}
        >
          <View style={styles.animationContainer}>
            <LottieView
              ref={animationRef}
              source={require("../../../assets/Alert.json")}
              autoPlay
              loop
              style={styles.animation}
            />
          </View>

          {/* 🔥 DYNAMIC TITLE */}
          <Text style={styles.headerTitle} weight="800">
            {conditionName}: Moderate ⚠️
          </Text>

          <Text style={styles.headerSubtitle}>
            Some health indicators need attention
          </Text>

          <View style={styles.riskBadge}>
            <Ionicons name="alert-circle" size={20} color="#e67e22" />
            <Text style={styles.riskText}>MODERATE RISK</Text>
          </View>

          <View style={styles.resultCard}>
            {/* 🔥 DYNAMIC MESSAGE */}
            <Text style={styles.resultCardText}>
              {message}
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.tipsContainer}>
          <Text style={styles.subheading}>What You Should Do</Text>

          <View style={styles.tipItem}>
            <Feather name="activity" size={20} color="#e67e22" />
            <Text style={styles.tipText}>Increase physical activity</Text>
          </View>

          <View style={styles.tipItem}>
            <Ionicons name="nutrition-outline" size={20} color="#e67e22" />
            <Text style={styles.tipText}>Improve dietary habits</Text>
          </View>

          <View style={styles.tipItem}>
            <Ionicons name="time-outline" size={20} color="#e67e22" />
            <Text style={styles.tipText}>Schedule regular health checkups</Text>
          </View>
        </View>

        <View style={styles.consultContainer}>
          <Text style={styles.subheading}>Consult a Doctor</Text>

          <TouchableOpacity
            style={styles.bookBtn}
            onPress={() => navigation.navigate("Consultation")}
          >
            <Text style={styles.bookBtnText}>Book Consultation</Text>
          </TouchableOpacity>

          <View style={styles.consultOptions}>
            <FontAwesome5 name="video" size={26} color="#e67e22" />
            <Ionicons name="chatbox-ellipses" size={26} color="#e67e22" />
            <Feather name="file-text" size={26} color="#e67e22" />
          </View>
        </View>

        <ReportBanner />
      </ScrollView>

      <ResultBottomMenu active="moderate" />
    </View>
  );
};

export default ModerateRisk;

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
    textAlign: "center" 
  },
  headerSubtitle: { color: "#fff3e0", marginBottom: 12 },
  riskBadge: {
    flexDirection: "row",
    backgroundColor: "#fff3e0",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 14,
  },
  riskText: { color: "#e67e22", fontWeight: "700", marginLeft: 6 },
  resultCard: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 16,
    borderRadius: 16,
  },
  resultCardText: { color: "#fff", textAlign: "center" },
  tipsContainer: { padding: 20 },
  subheading: { fontSize: 22, marginBottom: 12, fontWeight: "700" },
  tipItem: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  tipText: { marginLeft: 10, fontSize: 16 },
  consultContainer: { padding: 20 },
  bookBtn: {
    backgroundColor: "#e67e22",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  bookBtnText: { color: "#fff", textAlign: "center", fontWeight: "700" },
  consultOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});