import React, { useRef, useEffect } from "react";
import { View, ScrollView, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";

import ResultBottomMenu from "../../Components/ResultBottomMenu";
import ReportBanner from "../../Components/ReportBanner";
import { Text } from "../../Components/TextWrapper";

const { width } = Dimensions.get("window");

const ResultScreenSaurabh = () => {
  const animationRef = useRef(null);

  useEffect(() => {
    animationRef.current?.play();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.header}>
          <LottieView
            ref={animationRef}
            source={require("../../assets/Done.json")}
            autoPlay
            loop
            style={styles.animation}
          />
          <Text style={styles.title}>Congratulations, Saurabh 🎉</Text>
          <Text style={styles.subtitle}>Your assessment is complete</Text>
        </LinearGradient>

        <ReportBanner />
      </ScrollView>

      <ResultBottomMenu active="saurabh" />
    </View>
  );
};

export default ResultScreenSaurabh;

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
    color: "#ede9fe",
  },
});
