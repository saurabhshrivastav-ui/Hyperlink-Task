import React from "react";
import {
  View,
  StyleSheet,
  Image, // Correctly Imported
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Text } from "../Components/TextWrapper";

// WebP Assets
import HelixBgLines from "../assets/Helixbglines.webp";
import HelixChatIllustrator from "../assets/HelixChatIllustrator.webp";
import HelixMobileIllustrator from "../assets/HelixMobileIllustrator.webp";

const { width, height } = Dimensions.get("window");

export default function HelixVoiceHome() {
  const navigation = useNavigation();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />

      {/* ===== SOFT BACKGROUND WAVES ===== */}
      <LinearGradient
        colors={["#F2D9FF", "transparent"]}
        style={styles.topGlow}
      />
      <LinearGradient
        colors={["transparent", "#F2D9FF"]}
        style={styles.bottomGlow}
      />

      {/* FIXED: Used Image component correctly */}
      <View style={styles.bgLines}>
        <Image
          source={HelixBgLines}
          style={{ width: width, height: height * 0.4, opacity: 0.6 }}
          resizeMode="cover"
        />
      </View>

      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#2C2E5A" />
        </TouchableOpacity>
      </View>

      {/* ===== HERO ===== */}
      <View style={styles.heroRow}>
        {/* Left Content */}
        <View style={styles.heroText}>
          <Text style={styles.title}>Hyperlink Voice AI</Text>
          <Text style={styles.subtitle}>Loved-Ones Voice Companion</Text>

          <Text style={styles.description}>
            Record your loved one’s voice once, and Hyperlink AI will speak to
            you in that voice — reminding, asking, and motivating you daily.
          </Text>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate("HelixAddVoice")}
          >
            <LinearGradient
              colors={["#8E2DE2", "#E94057"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ctaButton}
            >
              <Text style={styles.ctaText}>Add New Voice</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Right Illustration */}
        <View style={styles.heroVisual}>
          <Image
            source={HelixMobileIllustrator}
            style={styles.phoneImage}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* FIXED: Used Image component correctly */}
      <View style={styles.chatIllustrationWrap}>
        <Image
          source={HelixChatIllustrator}
          style={{ width: width * 0.95, height: width * 0.55 }}
          resizeMode="contain"
        />
      </View>

      {/* ===== INFO SECTION ===== */}
      <View style={styles.infoSection}>
        <View style={styles.questionBubble}>
          <Text style={styles.questionText}>
            What does Hyperlink Voice AI do?
          </Text>
        </View>

        <View style={styles.answerBubble}>
          <Text style={styles.answerText}>
            It clones a loved one’s voice (with permission) to become a daily
            health companion — reminding, asking questions, collecting wellness
            data, and motivating.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  topGlow: {
    position: "absolute",
    top: 0,
    height: height * 0.35,
    width: "100%",
  },
  bottomGlow: {
    position: "absolute",
    bottom: 0,
    height: height * 0.3,
    width: "100%",
  },
  bgLines: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  header: {
    marginTop: 52,
    paddingHorizontal: 20,
  },
  heroRow: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginTop: 20,
  },
  heroText: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 22,
    color: "#2C2E5A",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B6FD6",
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: "#555",
    marginBottom: 18,
  },
  ctaButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 22,
    alignSelf: "flex-start",
  },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  heroVisual: {
    width: width * 0.5,
    alignItems: "center",
    justifyContent: "center",
  },
  phoneImage: {
    width: "100%",
    height: height * 0.25,
  },
  chatIllustrationWrap: {
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  infoSection: {
    marginTop: 16,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  questionBubble: {
    backgroundColor: "#E455C7",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 18,
    marginBottom: 10,
  },
  questionText: {
    color: "#FFFFFF",
    fontSize: 13,
  },
  answerBubble: {
    backgroundColor: "#7A5CFF",
    padding: 16,
    borderRadius: 18,
    maxWidth: "90%",
  },
  answerText: {
    color: "#FFFFFF",
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
  },
});