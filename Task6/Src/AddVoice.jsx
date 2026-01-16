import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ScrollView,
  Animated,
  Easing,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { Audio } from "expo-av";

import { Text } from "../Components/TextWrapper";

const { width } = Dimensions.get("window");

const HEADER_BG = require("../assets/Header.png");
const DNA_PATTERN = require("../assets/bgdna.png");

export default function AddVoiceFlow() {
  const navigation = useNavigation();

  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const [step, setStep] = useState(2);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [recordingUri, setRecordingUri] = useState(null);

  const recordingRef = useRef(null);

  useEffect(() => {
    slideAnim.setValue(0);
    fadeAnim.setValue(0);

    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await Audio.requestPermissionsAsync();
      } catch (e) {
        console.log("Permission error", e);
      }
    })();

    return () => {
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync().catch(() => {});
      }
    };
  }, []);

  useEffect(() => {
    let t;
    if (isRecording && !isPaused) {
      t = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(t);
  }, [isRecording, isPaused]);

  useEffect(() => {
    if (isRecording && !isPaused) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording, isPaused]);

  const formatTime = (s) => {
    const min = String(Math.floor(s / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${min} : ${sec}`;
  };

  const handleStartRecording = async () => {
    try {
      if (recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync().catch(() => {});
        recordingRef.current = null;
      }

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recordingRef.current = recording;

      setHasStarted(true);
      setIsRecording(true);
      setIsPaused(false);
      setSeconds(0);
      setConfirmed(false);
      setRecordingUri(null);
    } catch (err) {
      console.log("Start recording failed", err);
    }
  };

  const handlePauseRecording = async () => {
    if (!recordingRef.current) return;
    try {
      if (isPaused) {
        await recordingRef.current.startAsync();
        setIsPaused(false);
      } else {
        await recordingRef.current.pauseAsync();
        setIsPaused(true);
      }
    } catch (error) {
      console.log("Pause/Resume error", error);
    }
  };

  const handleResetRecording = async () => {
    try {
      if (recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync().catch(() => {});
        recordingRef.current = null;
      }
    } catch (error) {
      console.log("Reset error", error);
    } finally {
      setHasStarted(false);
      setIsRecording(false);
      setIsPaused(false);
      setSeconds(0);
      setConfirmed(false);
      setRecordingUri(null);
    }
  };

  const handleConfirmRecording = async () => {
    if (!recordingRef.current) return;
    try {
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      setRecordingUri(uri);
      setIsRecording(false);
      setIsPaused(false);
      setConfirmed(true);
    } catch (error) {
      console.log("Confirm error", error);
    }
  };

  const handleNavigateToPreview = () => {
    if (recordingUri) {
      navigation.navigate("PreviewVoice", { recordingUri });
    } else {
      console.log("No recording URI found");
    }
  };

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      <LinearGradient
        colors={["#F9EAF4", "#FFFFFF", "#F9EAF4"]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.headerBgContainer} pointerEvents="none">
        <Image
          source={HEADER_BG}
          style={styles.gradientBg}
          resizeMode="cover"
        />
        <Image
          source={DNA_PATTERN}
          style={styles.patternBg}
          resizeMode="contain"
        />
      </View>

      <View style={styles.footerBgContainer} pointerEvents="none">
        <Image
          source={HEADER_BG}
          style={styles.gradientBgFooter}
          resizeMode="cover"
        />
        <Image
          source={DNA_PATTERN}
          style={styles.patternBgFooter}
          resizeMode="contain"
        />
      </View>

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>

        <View style={styles.progressContainer}>
          {[1, 2, 3, 4].map((i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                i <= step ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
        <View style={{ width: 28 }} />
      </View>

      <Text style={styles.screenTitle} weight="700">
        Add Voice
      </Text>

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {step === 2 && (
          <Animated.View
            style={{
              width: "100%",
              alignItems: "center",
              opacity: fadeAnim,
              transform: [{ translateY }],
            }}
          >
            <LinearGradient
              colors={
                hasStarted
                  ? ["#A0E8AF", "#9C27B0"]
                  : ["#A0E8AF", "#D1C4E9", "#F48FB1"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.instructionCard}
            >
              <View style={styles.instructionRow}>
                <View style={styles.iconBox}>
                  <MaterialCommunityIcons
                    name="waveform"
                    size={24}
                    color="#FFF"
                  />
                </View>
                <View style={styles.instructionTextContainer}>
                  <Text style={styles.instructionTitle} weight="700">
                    Ask your loved one to record a short message.
                  </Text>
                  <Text style={styles.bulletPoint} weight="400">
                    • Record for at least 30 seconds
                  </Text>
                  <Text style={styles.bulletPoint} weight="400">
                    • Say this sentence:
                  </Text>
                  <Text style={styles.scriptText} weight="400">
                    "Hi Sakshi, I'll be your daily health buddy. Ready to take
                    care of you!"
                  </Text>
                </View>
              </View>

              {!hasStarted && (
                <TouchableOpacity
                  style={styles.recordBtnFull}
                  onPress={handleStartRecording}
                >
                  <Text style={styles.recordBtnText} weight="700">
                    Record
                  </Text>
                </TouchableOpacity>
              )}

              {hasStarted && (
                <Text style={styles.recordingStatusText} weight="600">
                  {isPaused ? "Paused" : "Recording..."}
                </Text>
              )}
            </LinearGradient>

            {hasStarted && (
              <Animated.View
                style={[
                  styles.timerContainer,
                  { transform: [{ scale: pulseAnim }] },
                ]}
              >
                <View style={styles.timerCircle}>
                  <Text style={styles.timerText} weight="700">
                    {formatTime(seconds)}
                  </Text>
                </View>
                <View
                  style={[
                    styles.timerRing,
                    { width: 160, height: 160, opacity: 0.2 },
                  ]}
                />
                <View
                  style={[
                    styles.timerRing,
                    { width: 200, height: 200, opacity: 0.1 },
                  ]}
                />
              </Animated.View>
            )}

            {hasStarted && (
              <View style={styles.controlsBar}>
                <TouchableOpacity
                  onPress={handleResetRecording}
                  style={styles.controlBtn}
                >
                  <Ionicons name="refresh" size={22} color="#FFF" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handlePauseRecording}
                  style={styles.controlBtnLarge}
                >
                  <Ionicons
                    name={isPaused ? "play" : "pause"}
                    size={28}
                    color="#FFF"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleConfirmRecording}
                  style={styles.controlBtn}
                >
                  <Ionicons name="checkmark" size={22} color="#FFF" />
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        )}
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.continueButton, !confirmed && { opacity: 0.5 }]}
          disabled={!confirmed}
          onPress={handleNavigateToPreview}
        >
          <Text style={styles.continueText} weight="700">
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F9EAF4" },
  headerBgContainer: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: 250,
  },
  footerBgContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 250,
  },
  gradientBg: { width: "100%", height: "100%", position: "absolute" },
  patternBg: {
    width: "100%",
    height: "100%",
    position: "absolute",
    opacity: 0.6,
    top: -20,
  },
  gradientBgFooter: {
    width: "100%",
    height: "100%",
    position: "absolute",
    transform: [{ rotate: "180deg" }],
  },
  patternBgFooter: {
    width: "100%",
    height: "100%",
    position: "absolute",
    opacity: 0.6,
    top: 50,
  },
  header: {
    marginTop: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  backButton: { padding: 5 },
  progressContainer: { flexDirection: "row", gap: 6 },
  progressDot: { width: 40, height: 5, borderRadius: 3 },
  activeDot: { backgroundColor: "#7B1FA2" },
  inactiveDot: { backgroundColor: "#D1C4E9" },
  screenTitle: {
    fontSize: 22,
    color: "#4A148C",
    textAlign: "center",
    marginVertical: 15,
  },
  contentContainer: { paddingHorizontal: 20, paddingBottom: 100 },
  instructionCard: {
    width: "100%",
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginBottom: 40,
  },
  instructionRow: { flexDirection: "row", marginBottom: 15 },
  iconBox: {
    width: 40,
    height: 40,
    backgroundColor: "#5E35B1",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  instructionTextContainer: { flex: 1 },
  instructionTitle: {
    fontSize: 16,
    color: "#2C2E5A",
    marginBottom: 8,
  },
  bulletPoint: { fontSize: 12, color: "#444", marginBottom: 2 },
  scriptText: {
    marginTop: 5,
    fontSize: 12,
    fontStyle: "italic",
    color: "#333",
    backgroundColor: "rgba(255,255,255,0.3)",
    padding: 8,
    borderRadius: 8,
  },
  recordBtnFull: {
    backgroundColor: "#5E35B1",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  recordBtnText: { color: "#FFF", fontSize: 16 },
  recordingStatusText: {
    color: "#2C2E5A",
    textAlign: "center",
    marginTop: 10,
    opacity: 0.7,
  },
  timerContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
    height: 200,
  },
  timerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#2C2E5A",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  timerText: { color: "#FFF", fontSize: 28 },
  timerRing: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "#5E35B1",
  },
  controlsBar: {
    flexDirection: "row",
    backgroundColor: "#5E35B1",
    borderRadius: 30,
    paddingHorizontal: 30,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    elevation: 8,
  },
  controlBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  controlBtnLarge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    alignItems: "center",
  },
  continueButton: {
    backgroundColor: "#9575CD",
    width: "90%",
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: "center",
    elevation: 3,
  },
  continueText: { color: "#FFF", fontSize: 18 },
});
