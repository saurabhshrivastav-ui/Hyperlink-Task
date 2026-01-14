import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

// --- IMPORT CUSTOM TEXT WRAPPER ---
import { Text } from "../Components/TextWrapper"; 

const { width, height } = Dimensions.get("window");

// --- ASSETS ---
const HERO_IMAGE = require("../assets/HelixMobileillustrator.webp");
const CHAT_ILLUSTRATION = require("../assets/helixchatillustrator.webp"); 

// --- BACKGROUND ASSETS ---
const HEADER_BG = require("../assets/Header.png");
const DNA_PATTERN = require("../assets/bgdna.png"); 

export default function HelixVoice() {
  const navigation = useNavigation();

  const handleAddVoicePress = () => {
    navigation.navigate("AddPerson");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* ================= BACKGROUND LAYERS ================= */}
      
      {/* 1. Header Background */}
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

      {/* 2. Footer Background */}
      <View style={styles.footerBgContainer} pointerEvents="none">
        <Image
          source={HEADER_BG}
          style={styles.gradientBgFooter}
          resizeMode="cover"
        />
        <Image
          source={DNA_PATTERN}
          style={styles.footerPatternBg}
          resizeMode="contain"
        />
      </View>

      {/* ================= MAIN CONTENT ================= */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: 'transparent' }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={28} color="#000" />
          </TouchableOpacity>
        </View>

        {/* HERO SECTION */}
        <View style={styles.heroContainer}>
          
          {/* LEFT SIDE: Text & Button */}
          <View style={[styles.heroTextSide, { zIndex: 10 }]}>
            <Text style={styles.title} weight="700">
              Hyperlink Voice AI
            </Text>
            <Text style={styles.subtitle} weight="500">
              Loved-Ones Voice Companion
            </Text>

            <Text style={styles.description} weight="400">
              Record your loved one’s voice once, and Hyperlink AI will speak to
              you in that tone reminding, asking, and motivating you daily.
            </Text>

            {/* CTA Button */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleAddVoicePress}
              style={{ zIndex: 20, elevation: 10 }} 
            >
              <LinearGradient
                colors={["#D946EF", "#8B5CF6"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.ctaButton}
              >
                <Text style={styles.ctaText} weight="700">
                  Add New Voice
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* RIGHT SIDE: Mobile Illustration */}
          <View style={styles.heroImageSide} pointerEvents="none">
            <Image
              source={HERO_IMAGE}
              style={styles.heroImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* CHAT ILLUSTRATION */}
        {/* Moved up using negative margin */}
        <View style={styles.chatIllustrationContainer}>
          <Image
            source={CHAT_ILLUSTRATION}
            style={styles.chatImage}
            resizeMode="contain"
          />
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <View style={styles.navItem}>
          <Icon name="home-outline" size={24} color="#666" />
          <Text style={styles.navText} weight="500">Home</Text>
        </View>

        <View style={styles.navItemCenter}>
          <View style={styles.centerButtonOuter}>
            <LinearGradient
              colors={["#E0C3FC", "#8EC5FC"]}
              style={styles.centerButtonInner}
            >
              {/* Changed icon color to White to stand out on purple gradient */}
              <Icon name="dots-grid" size={24} color="#FFFFFF" />
            </LinearGradient>
          </View>
          <Text style={[styles.navText, styles.activeNavText]} weight="700">
            Helix
          </Text>
        </View>

        <View style={styles.navItem}>
          <Icon name="account-outline" size={24} color="#666" />
          <Text style={styles.navText} weight="500">Profile</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9EAF4",
  },

  // --- Background Styles ---
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
    height: 150,
    justifyContent: "flex-end",
  },
  gradientBg: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  gradientBgFooter: {
    width: "100%",
    height: "100%",
    position: "absolute",
    transform: [{ rotate: "180deg" }],
  },
  headerPatternBg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.6,
    top: -20,
  },
  footerPatternBg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.6,
    top: 0,
  },

  scrollContent: {
    paddingBottom: 100,
  },

  header: {
    paddingHorizontal: 20,
    marginTop: 50,
    marginBottom: 10,
  },

  // --- Hero Section ---
  heroContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
    overflow: 'visible', 
  },
  heroTextSide: {
    flex: 0.5,
    paddingRight: 5,
    zIndex: 10, 
  },
  heroImageSide: {
    flex: 0.5,
    alignItems: "flex-end",
    justifyContent: "center",
    zIndex: 0, 
  },
  heroImage: {
    width: "100%",
    height: 280, 
    transform: [
      { scale: 1.35 },      
      { translateX: 10 },   
      { translateY: 10 }    
    ],
  },

  // Text Styles
  title: {
    fontSize: 22,
    color: "#4A148C",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#7B1FA2",
    marginBottom: 10,
  },
  description: {
    fontSize: 12,
    color: "#444",
    lineHeight: 18,
    marginBottom: 20,
  },
  ctaButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
    elevation: 5,
    shadowColor: "#D946EF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  ctaText: {
    color: "#FFF",
    fontSize: 14,
  },

  // --- Chat Illustration ---
  chatIllustrationContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    marginTop: -20, // <--- CHANGED: Negative margin moves it UP slightly
    marginBottom: 30,
    width: "100%",
  },
  chatImage: {
    width: width - 20,
    height: 250,
  },

  // --- Bottom Nav ---
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    backgroundColor: "#FFF",
    height: 80,
    paddingBottom: 20,
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    zIndex: 10,
  },
  navItem: {
    alignItems: "center",
    marginBottom: 5,
    flex: 1,
  },
  navItemCenter: {
    alignItems: "center",
    flex: 1,
    position: "relative",
    bottom: 15,
  },
  centerButtonOuter: {
    backgroundColor: "#F9EAF4",
    padding: 5,
    borderRadius: 35,
    marginBottom: 5,
  },
  centerButtonInner: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  navText: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  activeNavText: {
    color: "#5E35B1",
  },
});