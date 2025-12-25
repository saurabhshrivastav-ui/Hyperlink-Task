import React, { useRef, useEffect } from "react";
import { View, ScrollView, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";

import ResultBottomMenu from "../../Components/ResultBottomMenu";
import ReportBanner from "../../Components/ReportBanner";
import { Text } from "../../Components/TextWrapper";

const { width } = Dimensions.get("window");

const ResultScreenAditya = () => {
  const animationRef = useRef(null);

  useEffect(() => {
    animationRef.current?.play();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <LinearGradient colors={["#4facfe", "#00f2fe"]} style={styles.header}>
          <LottieView
            ref={animationRef}
            source={require("../../assets/Done.json")}
            autoPlay
            loop
            style={styles.animation}
          />
          <Text style={styles.title}>Congratulations, Aditya 🎉</Text>
          <Text style={styles.subtitle}>Assessment completed successfully</Text>
        </LinearGradient>

        <ReportBanner />
      </ScrollView>

      <ResultBottomMenu active="aditya" />
    </View>
  );
};

export default ResultScreenAditya;

const styles = StyleSheet.create({
  header: {
    padding: 30,
    alignItems: "center",
  },
  animation: {
    width: width * 0.6,
    height: width * 0.6,
  },
  title: {
    fontSize: 26,
    color: "#fff",
  },
  subtitle: {
    color: "#e0f2fe",
  },
});
