import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { Text } from "../Components/TextWrapper";

const { width } = Dimensions.get("window");

const HEADER_BG = require("../assets/Header.png");
const DNA_PATTERN = require("../assets/bgdna.png");
const DOC_AVATAR = require("../assets/doc.webp");

const MovingWaveform = () => {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animValue, {
          toValue: 1,
          duration: 600,
          useNativeDriver: false,
        }),
        Animated.timing(animValue, {
          toValue: 0,
          duration: 600,
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [animValue]);

  return (
    <View style={styles.waveRow}>
      {[0.6, 1.2, 0.8, 1.5, 0.7].map((factor, index) => {
        const height = animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [15 * factor, 45 * factor],
        });
        return (
          <Animated.View key={index} style={[styles.waveBar, { height }]} />
        );
      })}
    </View>
  );
};

export default function HelixChat() {
  const navigation = useNavigation();
  const [inputText, setInputText] = useState(
    "Can you help me track my calories?"
  );
  const [isVoiceMode, setIsVoiceMode] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      <View style={styles.headerBgContainer} pointerEvents="none">
        <Image
          source={HEADER_BG}
          style={styles.gradientBg}
          resizeMode="cover"
        />
        <Image
          source={DNA_PATTERN}
          style={styles.headerPatternBg}
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
          style={styles.staticFooterDna}
          resizeMode="contain"
        />
      </View>

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            isVoiceMode ? setIsVoiceMode(false) : navigation.goBack()
          }
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      {!isVoiceMode ? (
        <ScrollView
          contentContainerStyle={styles.chatScrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.bubbleLeft}>
            <Text style={styles.bubbleTextLeft} weight="500">
              Hi Sakshi!
            </Text>
          </View>
          <View style={styles.bubbleLeft}>
            <Text style={styles.bubbleTextLeft} weight="500">
              How can I help you today? 😊
            </Text>
          </View>
          <View style={styles.bubbleRightWrapper}>
            <View style={styles.bubbleRight}>
              <Text style={styles.bubbleTextRight} weight="500">
                Can you help me track my calories?
              </Text>
            </View>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.centerArea}>
          <View style={styles.avatarWrapper}>
            <Image source={DOC_AVATAR} style={styles.avatarImage} />
          </View>
          <View style={styles.waveformWrapper}>
            <MovingWaveform />
          </View>
        </View>
      )}

      {!isVoiceMode && (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
          style={styles.inputWrapper}
        >
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setIsVoiceMode(true)}
            >
              <MaterialCommunityIcons
                name="microphone-outline"
                size={24}
                color="#5E35B1"
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.audioButton}>
              <MaterialCommunityIcons
                name="waveform"
                size={20}
                color="#5E35B1"
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}

      <View style={styles.navbarWrapper}>
        <View style={styles.navbarBackground} />
        <View style={styles.navbarContent}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate("HelixVoice")}
          >
            <MaterialCommunityIcons
              name="keyboard-backspace"
              size={20}
              color="#888"
              style={{ transform: [{ rotate: "180deg" }] }}
            />
            <Text style={styles.navText} weight="500">
              Home
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate("HelixVoice")}
          >
            <MaterialCommunityIcons name="dots-grid" size={20} color="#888" />
            <Text style={styles.navText} weight="500">
              Consult
            </Text>
          </TouchableOpacity>

          <View style={styles.navItemContainerActive}>
            <View style={styles.activeItemWrapper}>
              <View style={styles.activeCircleOuter}>
                <LinearGradient
                  colors={["#E0C3FC", "#8EC5FC"]}
                  style={styles.activeCircleGradient}
                >
                  <View style={styles.activeCircleInner}>
                    <MaterialCommunityIcons
                      name="dna"
                      size={30}
                      color="#4A148C"
                    />
                  </View>
                </LinearGradient>
              </View>
              <Text style={styles.activeNavText} weight="700">
                Helix Chat
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate("YourVoices")}
          >
            <MaterialCommunityIcons
              name="book-open-page-variant-outline"
              size={20}
              color="#888"
            />
            <Text style={styles.navText} weight="500">
              Voices
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <MaterialCommunityIcons
              name="account-circle-outline"
              size={20}
              color="#888"
            />
            <Text style={styles.navText} weight="500">
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9EAF4" },
  headerBgContainer: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: 200,
  },
  footerBgContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 250,
    justifyContent: "flex-end",
  },
  gradientBg: { width: "100%", height: "100%", position: "absolute" },
  gradientBgFooter: {
    width: "100%",
    height: "100%",
    position: "absolute",
    transform: [{ rotate: "180deg" }],
  },
  headerPatternBg: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0.6,
    top: -20,
  },
  staticFooterDna: {
    position: "absolute",
    width: "100%",
    height: 120,
    opacity: 0.6,
    top: -80,
    zIndex: -1,
  },

  header: { marginTop: 50, paddingHorizontal: 20, zIndex: 10 },
  chatScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 220,
  },

  bubbleLeft: {
    backgroundColor: "#FFF",
    alignSelf: "flex-start",
    padding: 12,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    marginBottom: 10,
    maxWidth: "80%",
    elevation: 2,
  },
  bubbleTextLeft: { fontSize: 15, color: "#000" },
  bubbleRightWrapper: { alignItems: "flex-end", marginTop: 10 },
  bubbleRight: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 20,
    borderBottomRightRadius: 4,
    maxWidth: "80%",
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E1BEE7",
  },
  bubbleTextRight: { fontSize: 15, color: "#7B1FA2" },

  centerArea: { flex: 1, justifyContent: "center", alignItems: "center" },
  avatarWrapper: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: "hidden",
    elevation: 20,
    shadowColor: "#5E35B1",
    shadowOpacity: 0.4,
    shadowRadius: 15,
    borderWidth: 3,
    borderColor: "#FFF",
  },
  avatarImage: { width: "100%", height: "100%" },
  waveformWrapper: { marginTop: 30, height: 60, justifyContent: "center" },
  waveRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  waveBar: { width: 6, backgroundColor: "#5E35B1", borderRadius: 3 },

  inputWrapper: {
    position: "absolute",
    bottom: 100,
    width: "100%",
    alignItems: "center",
    zIndex: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    width: "90%",
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 10,
    elevation: 5,
  },
  textInput: { flex: 1, fontSize: 16, color: "#000" },
  iconButton: { padding: 8 },
  audioButton: {
    padding: 8,
    backgroundColor: "#F3E5F5",
    borderRadius: 10,
    marginLeft: 5,
  },

  navbarWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 120,
    justifyContent: "flex-end",
    zIndex: 50,
  },
  navbarBackground: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 85,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 10,
  },
  navbarContent: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    paddingBottom: 15,
    width: "100%",
  },
  navItem: {
    alignItems: "center",
    justifyContent: "flex-end",
    height: 85,
    width: width / 5,
  },
  navItemContainerActive: { justifyContent: "flex-end", marginBottom: 20 },
  activeItemWrapper: {
    alignItems: "center",
    justifyContent: "flex-end",
    height: 100,
  },
  activeCircleOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
    elevation: 8,
  },
  activeCircleGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  activeCircleInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  navText: { fontSize: 9, color: "#888", marginTop: 2 },
  activeNavText: { fontSize: 10, color: "#4A148C" },
});
