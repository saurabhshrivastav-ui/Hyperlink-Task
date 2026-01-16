import React, { useState } from "react";
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
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { Text } from "../Components/TextWrapper";

const { width } = Dimensions.get("window");

const HERO_IMAGE = require("../assets/HelixMobileillustrator.webp");
const CHAT_ILLUSTRATION = require("../assets/helixchatillustrator.webp");

const HEADER_BG = require("../assets/Header.png");
const DNA_PATTERN = require("../assets/bgdna.png");

export default function HelixVoice() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("Helix");

  const handleAddVoicePress = () => {
    navigation.navigate("AddPerson");
  };

  const navItems = [
    { key: "Home", icon: "keyboard-backspace", rotate: "180deg" },
    { key: "Helix", icon: "dots-grid" },
    { key: "Helix Chat", icon: "dna" },
    { key: "Your Voices", icon: "book-open-page-variant-outline" },
    { key: "Profile", icon: "account-circle-outline" },
  ];

  const handleTabPress = (itemKey) => {
    setActiveTab(itemKey);

    if (itemKey === "Helix Chat") {
      navigation.navigate("HelixChat");
    } else if (itemKey === "Your Voices") {
      navigation.navigate("YourVoices");
    } else if (itemKey === "Helix" || itemKey === "Home") {
      navigation.navigate("HelixVoice");
    }
  };

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
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={28} color="#4A148C" />
          </TouchableOpacity>
        </View>

        <View style={styles.heroContainer}>
          <View style={styles.heroTextSide}>
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

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleAddVoicePress}
              style={styles.ctaButtonWrapper}
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

          <View style={styles.heroImageSide} pointerEvents="none">
            <Image
              source={HERO_IMAGE}
              style={styles.heroImage}
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={styles.chatIllustrationContainer}>
          <Image
            source={CHAT_ILLUSTRATION}
            style={styles.chatImage}
            resizeMode="contain"
          />
        </View>
      </ScrollView>

      <View style={styles.navbarWrapper}>
        <Image
          source={DNA_PATTERN}
          style={styles.staticFooterDna}
          resizeMode="contain"
          pointerEvents="none"
        />

        <View style={styles.navbarBackground} />

        <View style={styles.navbarContent}>
          {navItems.map((item) => {
            const isActive = activeTab === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.navItemContainer,
                  isActive && styles.navItemContainerActive,
                ]}
                onPress={() => handleTabPress(item.key)}
                activeOpacity={0.9}
              >
                {isActive ? (
                  <View style={styles.activeItemWrapper}>
                    <View style={styles.activeCircleOuter}>
                      <LinearGradient
                        colors={["#E0C3FC", "#8EC5FC"]}
                        style={styles.activeCircleGradient}
                      >
                        <View style={styles.activeCircleInner}>
                          <MaterialCommunityIcons
                            name={
                              item.icon === "book-open-page-variant-outline"
                                ? "book-open-page-variant"
                                : item.icon
                            }
                            size={30}
                            color="#4A148C"
                            style={
                              item.rotate
                                ? { transform: [{ rotate: item.rotate }] }
                                : {}
                            }
                          />
                        </View>
                      </LinearGradient>
                    </View>
                    <Text style={styles.activeNavText} weight="700">
                      {item.key}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.inactiveItemWrapper}>
                    <MaterialCommunityIcons
                      name={item.icon}
                      size={20}
                      color="#888"
                      style={
                        item.rotate
                          ? { transform: [{ rotate: item.rotate }] }
                          : {}
                      }
                    />
                    <Text style={styles.navText} weight="500">
                      {item.key}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
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
  scrollContent: {
    paddingBottom: 130,
  },
  header: {
    paddingHorizontal: 20,
    marginTop: 50,
    marginBottom: 10,
    alignItems: "flex-start",
  },
  heroContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
    overflow: "visible",
  },
  heroTextSide: {
    flex: 0.55,
    paddingRight: 5,
    zIndex: 10,
  },
  heroImageSide: {
    flex: 0.45,
    alignItems: "flex-end",
    justifyContent: "center",
    zIndex: 0,
  },
  heroImage: {
    width: "100%",
    height: 280,
    transform: [{ scale: 1.35 }, { translateX: 10 }, { translateY: 10 }],
  },
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
  ctaButtonWrapper: {
    zIndex: 20,
    elevation: 10,
    alignSelf: "flex-start",
  },
  ctaButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
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
  chatIllustrationContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    marginTop: -20,
    marginBottom: 30,
    width: width,
  },
  chatImage: {
    width: width - 20,
    height: 250,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  navbarContent: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    paddingBottom: 15,
    width: "100%",
  },
  navItemContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
    height: 85,
    width: width / 5,
  },
  navItemContainerActive: {
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  inactiveItemWrapper: {
    alignItems: "center",
    justifyContent: "flex-end",
    height: 40,
  },
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
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
  navText: {
    fontSize: 9,
    color: "#888",
    marginTop: 2,
  },
  activeNavText: {
    fontSize: 10,
    color: "#4A148C",
    marginTop: 0,
  },
});
