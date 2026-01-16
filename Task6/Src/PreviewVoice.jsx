import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Alert,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";
import { Audio } from "expo-av";

import { Text } from "../Components/TextWrapper";

const { width } = Dimensions.get("window");

const HEADER_BG = require("../assets/Header.png");
const DNA_PATTERN = require("../assets/bgdna.png");

const PreviewVoice = ({ navigation, route }) => {
  const { recordingUri } = route.params || {};

  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentStep = 3;

  const waveformBars = [40, 60, 45, 80, 50, 90, 60, 100, 70, 50, 80, 60, 40];

  const animatedValues = useRef(
    waveformBars.map((height) => new Animated.Value(height))
  ).current;

  useEffect(() => {
    loadAudio();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [recordingUri]);

  useEffect(() => {
    if (isPlaying && !isFinished) {
      const animations = animatedValues.map((anim, index) => {
        const baseHeight = waveformBars[index];
        return Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: Math.min(140, baseHeight * (1.2 + Math.random())),
              duration: 150 + Math.random() * 100,
              useNativeDriver: false,
              easing: Easing.linear,
            }),
            Animated.timing(anim, {
              toValue: baseHeight * 0.5,
              duration: 150 + Math.random() * 100,
              useNativeDriver: false,
              easing: Easing.linear,
            }),
          ])
        );
      });
      Animated.parallel(animations).start();
    } else {
      animatedValues.forEach((anim, index) => {
        anim.stopAnimation();
        Animated.timing(anim, {
          toValue: waveformBars[index],
          duration: 200,
          useNativeDriver: false,
        }).start();
      });
    }
  }, [isPlaying, isFinished]);

  async function loadAudio() {
    if (!recordingUri) return;
    try {
      const { sound: newSound, status } = await Audio.Sound.createAsync(
        { uri: recordingUri },
        { shouldPlay: false }
      );
      setSound(newSound);
      setDuration(status.durationMillis);
      newSound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    } catch (error) {
      console.log("Error loading sound", error);
    }
  }

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setIsPlaying(status.isPlaying);

      if (status.didJustFinish) {
        setIsPlaying(false);
        setIsFinished(true);
        setPosition(status.durationMillis);
      }
    }
  };

  const handlePlayPause = async () => {
    if (!sound) return;
    try {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        if (isFinished) {
          await sound.setPositionAsync(0);
          setIsFinished(false);
        }
        await sound.playAsync();
      }
    } catch (error) {
      console.log("Play/Pause Error:", error);
    }
  };

  const handleSliderValueChange = async (value) => {
    if (sound) {
      try {
        await sound.setPositionAsync(value);
        if (isFinished && value < duration) {
          setIsFinished(false);
        }
      } catch (error) {
        console.log("Seek Error:", error);
      }
    }
  };

  const handleContinue = async () => {
    if (sound) {
      try {
        await sound.stopAsync();
      } catch (e) {
        console.log(e);
      }
    }
    navigation.navigate("ReminderSetup");
  };

  const handleChangeVoice = async () => {
    if (sound) {
      try {
        await sound.stopAsync();
      } catch (e) {
        console.log(e);
      }
    }
    navigation.navigate("HelixAddVoice");
  };

  const formatTime = (millis) => {
    if (!millis || millis < 0) return "0:00";
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

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
          onPress={() => navigation?.goBack()}
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
                i <= currentStep ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        <View style={{ width: 28 }} />
      </View>

      <Text style={styles.screenTitle} weight="700">
        Preview Voice
      </Text>

      <View style={styles.contentContainer}>
        <View style={styles.voiceCard}>
          <View style={styles.voiceInfo}>
            <Image
              source={require("../assets/doc.webp")}
              style={styles.avatar}
            />
            <Text style={styles.voiceName} weight="500">
              Recorded Voice
            </Text>
          </View>

          <TouchableOpacity
            style={styles.changeButton}
            onPress={handleChangeVoice}
          >
            <Text style={styles.changeButtonText} weight="600">
              Change
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.visualizerContainer}>
          <View style={styles.waveformContainer}>
            {animatedValues.map((animHeight, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.waveBar,
                  {
                    height: animHeight,
                    backgroundColor: isPlaying ? "#5D3FD3" : "#8A84FF",
                  },
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.controlsContainer}>
          <Slider
            style={{ width: "100%", height: 40 }}
            minimumValue={0}
            maximumValue={duration}
            value={position}
            onSlidingComplete={handleSliderValueChange}
            minimumTrackTintColor="#9775FA"
            maximumTrackTintColor="#333333"
            thumbTintColor="#5D3FD3"
          />

          <View style={styles.timeRow}>
            <Text style={styles.timeText} weight="500">
              {formatTime(position)}
            </Text>
            <Text style={styles.timeText} weight="500">
              {formatTime(duration)}
            </Text>
          </View>

          <View style={styles.playButtonWrapper}>
            <TouchableOpacity
              style={styles.playButton}
              onPress={handlePlayPause}
              disabled={!sound}
            >
              <LinearGradient
                colors={["#E0D4FC", "#D0C0F8"]}
                style={styles.playButtonGradient}
              >
                <Ionicons
                  name={isFinished ? "refresh" : isPlaying ? "pause" : "play"}
                  size={32}
                  color="#7048B6"
                  style={{ marginLeft: isPlaying || isFinished ? 0 : 4 }}
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueButtonWrapper}
          onPress={handleContinue}
        >
          <LinearGradient
            colors={["#845EC2", "#6A4BC9"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.continueButton}
          >
            <Text style={styles.continueText} weight="700">
              Continue
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F9EAF4",
  },
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
  backButton: {
    padding: 5,
  },
  progressContainer: {
    flexDirection: "row",
    gap: 6,
  },
  progressDot: {
    width: 40,
    height: 5,
    borderRadius: 3,
  },
  activeDot: {
    backgroundColor: "#7B1FA2",
  },
  inactiveDot: {
    backgroundColor: "#D1C4E9",
  },
  screenTitle: {
    fontSize: 22,
    color: "#4A148C",
    textAlign: "center",
    marginVertical: 15,
  },
  contentContainer: {
    paddingHorizontal: 20,
    flex: 1,
  },
  voiceCard: {
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#EDE8F7",
  },
  voiceInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  voiceName: {
    fontSize: 16,
    color: "#4A3B75",
  },
  changeButton: {
    backgroundColor: "#5D3FD3",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  changeButtonText: {
    color: "#FFF",
    fontSize: 12,
  },
  visualizerContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#5D3FD3",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },
  waveformContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    height: 100,
  },
  waveBar: {
    width: 8,
    borderRadius: 50,
  },
  controlsContainer: {
    width: "100%",
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -5,
    paddingHorizontal: 5,
  },
  timeText: {
    color: "#5D3FD3",
    fontSize: 12,
  },
  playButtonWrapper: {
    alignItems: "center",
    marginTop: 20,
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    shadowColor: "#5D3FD3",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  playButtonGradient: {
    flex: 1,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFF",
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  continueButtonWrapper: {
    width: "100%",
    shadowColor: "#845EC2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  continueButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  continueText: {
    color: "#FFF",
    fontSize: 16,
    letterSpacing: 0.5,
  },
});

export default PreviewVoice;
