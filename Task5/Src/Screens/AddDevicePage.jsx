import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  Animated,
  Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";

export default function AddDevicePage({ navigation }) {
  // Animation value for the rotating scanner line
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startAnimation();
  }, []);

  const startAnimation = () => {
    spinValue.setValue(0);
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 4000, // Speed of rotation
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Main Background Gradient */}
      <LinearGradient
        colors={["#AEE2FF", "#4FA3F7"]} // Light blue to slightly darker blue
        style={styles.fullGradient}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header: Back Button & Greeting */}
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={28} color="black" />
            </TouchableOpacity>
          </View>
          <Text style={styles.headerTitle}>Hi Sakshi</Text>

          {/* Status Card */}
          <View style={styles.statusCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.findingText}>Finding your devices</Text>
              {/* Spinning Loader Icon */}
              <Animated.View style={{ transform: [{ rotate: spin }] }}>
                <MaterialCommunityIcons
                  name="loading"
                  size={24}
                  color="#4FA3F7"
                />
              </Animated.View>
            </View>

            <Text style={styles.deviceFoundText}>1 device found ..</Text>
            <Text style={styles.helperText}>
              Please be patient we are doing our best for you
            </Text>

            <TouchableOpacity style={styles.stopButton}>
              <Ionicons
                name="hand-left-outline"
                size={20}
                color="#555"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.stopButtonText}>Stop Searching</Text>
            </TouchableOpacity>
          </View>

          {/* Radar Visualization Area */}
          <View style={styles.radarContainer}>
            {/* Concentric Circles */}
            <View style={[styles.ring, styles.ring1]} />
            <View style={[styles.ring, styles.ring2]} />
            <View style={[styles.ring, styles.ring3]} />

            {/* Rotating Scanner Line */}
            <Animated.View
              style={[
                styles.scannerLineContainer,
                { transform: [{ rotate: spin }] },
              ]}
            >
              <LinearGradient
                colors={["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.5)"]}
                style={styles.scannerLine}
              />
            </Animated.View>

            {/* Center Bluetooth Button */}
            <View style={styles.centerButtonOuter}>
              <View style={styles.centerButtonInner}>
                <MaterialCommunityIcons
                  name="bluetooth"
                  size={32}
                  color="#4FA3F7"
                />
              </View>
            </View>

            {/* Detected Devices (Icons floating on rings) */}
            {/* 1. Purple Phone Icon (Left side) */}
            <View
              style={[
                styles.floatingIcon,
                styles.iconPosition1,
                { backgroundColor: "#D066FF" },
              ]}
            >
              <MaterialCommunityIcons
                name="cellphone"
                size={24}
                color="white"
              />
            </View>

            {/* 2. Blue Headphone Icon (Right side) */}
            <View
              style={[
                styles.floatingIcon,
                styles.iconPosition2,
                { backgroundColor: "#4FA3F7" },
              ]}
            >
              <MaterialCommunityIcons
                name="headphones"
                size={24}
                color="white"
              />
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fullGradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: Platform.OS === "android" ? 40 : 0,
  },
  headerRow: {
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#000",
    marginBottom: 20,
  },
  // --- Status Card Styles ---
  statusCard: {
    backgroundColor: "rgba(255,255,255,0.85)", // Slight transparency
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 40,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  findingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4FA3F7",
  },
  deviceFoundText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  helperText: {
    fontSize: 13,
    color: "#666",
    marginBottom: 20,
  },
  stopButton: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12,
    alignSelf: "flex-start",
    // Shadow for the button
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  stopButtonText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 14,
  },

  // --- Radar Styles ---
  radarContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginBottom: 50, // Push it up slightly
  },
  ring: {
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)", // Very faint white rings
    borderRadius: 999,
  },
  ring1: { width: 140, height: 140 },
  ring2: { width: 240, height: 240 },
  ring3: { width: 340, height: 340 },

  centerButtonOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(79, 163, 247, 0.2)", // Outer glow
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  centerButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#64B5F6", // Inner blue circle
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },

  // --- Scanner Line ---
  scannerLineContainer: {
    position: "absolute",
    width: 340,
    height: 340,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  scannerLine: {
    width: 2,
    height: 170, // Half the height of the container
    position: "absolute",
    top: 0,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },

  // --- Floating Icons ---
  floatingIcon: {
    position: "absolute",
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 20,
  },
  // Manually positioned based on the image visual
  iconPosition1: {
    top: "55%", // Vertical center-ish
    left: "15%", // Left side
  },
  iconPosition2: {
    top: "35%",
    right: "20%",
  },
});
