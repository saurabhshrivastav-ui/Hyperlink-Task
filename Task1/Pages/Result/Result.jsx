import React, { useRef, useEffect } from "react";
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { Feather, FontAwesome5, Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";

import ReportBanner from "../../Components/ReportBanner";
import ResultBottomMenu from "../../Components/ResultBottomMenu";
import { Text } from "../../Components/TextWrapper";

const { width } = Dimensions.get("window");

const ResultScreen = () => {
  const navigation = useNavigation();
  const animationRef = useRef(null);

  useEffect(() => {
    animationRef.current?.play();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={["#2ed573", "#1e7e34"]} style={styles.headerGradient}>
          <View style={styles.animationContainer}>
            <LottieView
              ref={animationRef}
              source={require("../../assets/Done.json")}
              autoPlay
              loop
              style={styles.animation}
            />
          </View>

          <Text style={styles.headerTitle} weight="800">
            Congratulations, Sakshi 🎉
          </Text>
          <Text style={styles.headerSubtitle}>
            You have successfully completed your assessment
          </Text>

          <View style={styles.resultCard}>
            <Text style={styles.resultCardText}>
              Based on your responses, consulting a diabetologist is advised.
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.consultContainer}>
          <Text style={styles.subheading}>Talk to a Doctor</Text>

          <TouchableOpacity
            style={styles.bookBtn}
            onPress={() => navigation.navigate("Consultation")}
          >
            <Text style={styles.bookBtnText}>Book a Consultation</Text>
          </TouchableOpacity>

          <View style={styles.consultOptions}>
            <FontAwesome5 name="video" size={26} color="#553fb5" />
            <Ionicons name="chatbox-ellipses" size={26} color="#553fb5" />
            <Feather name="file-text" size={26} color="#553fb5" />
          </View>
        </View>

        <ReportBanner />
      </ScrollView>

      <ResultBottomMenu active="sakshi" />
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
    width: width * 0.6,
    height: width * 0.6,
  },
  animation: {
    width: "100%",
    height: "100%",
  },
  headerTitle: {
    fontSize: 26,
    color: "#fff",
    marginTop: 10,
  },
  headerSubtitle: {
    color: "#f0fdf4",
    marginBottom: 20,
  },
  resultCard: {
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 16,
    borderRadius: 16,
  },
  resultCardText: {
    color: "#fff",
    textAlign: "center",
  },
  consultContainer: {
    padding: 20,
  },
  subheading: {
    fontSize: 22,
    marginBottom: 12,
  },
  bookBtn: {
    backgroundColor: "#553fb5",
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
