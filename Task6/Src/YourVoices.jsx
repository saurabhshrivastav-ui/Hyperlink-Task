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
  Switch,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { Text } from "../Components/TextWrapper";

const { width } = Dimensions.get("window");

const HEADER_BG = require("../assets/Header.png");
const DNA_PATTERN = require("../assets/bgdna.png");
const USER_AVATAR = require("../assets/doc.webp");

export default function YourVoices() {
  const navigation = useNavigation();

  const voices = [
    { id: "1", name: "Sakshi Nishad", relation: "Daughter", active: true },
    { id: "2", name: "Aditya Sharma", relation: "Son", active: false },
  ];

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
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} weight="700">
          Manage Added Voices
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {voices.map((item) => (
          <View key={item.id} style={styles.voiceCard}>
            <View style={styles.cardTopRow}>
              <Image source={USER_AVATAR} style={styles.avatarImg} />
              <View style={styles.nameContainer}>
                <Text style={styles.voiceName} weight="700">
                  {item.name}
                </Text>
                <View style={styles.relationBadge}>
                  <Text style={styles.relationText} weight="500">
                    {item.relation}
                  </Text>
                </View>
              </View>
              <View style={styles.switchContainer}>
                <Switch
                  value={item.active}
                  trackColor={{ false: "#D1D1D1", true: "#A5D6A7" }}
                  thumbColor={item.active ? "#4CAF50" : "#F4F4F4"}
                />
                <Text style={styles.activeStatusText} weight="400">
                  {item.active ? "Currently Active" : "Voice Added"}
                </Text>
              </View>
            </View>

            <View style={styles.cardActionRow}>
              <TouchableOpacity style={styles.actionBtn}>
                <Text style={styles.actionBtnText} weight="600">
                  Listen Again
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Text style={styles.actionBtnText} weight="600">
                  View Reminders
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Text style={styles.actionBtnText} weight="600">
                  Edit Voice
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <TouchableOpacity onPress={() => navigation.navigate("AddPerson")}>
          <LinearGradient
            colors={["#D946EF", "#8B5CF6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.addNewBtn}
          >
            <Text style={styles.addNewText} weight="700">
              Add New Voice
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

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
              Helix
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate("HelixChat")}
          >
            <MaterialCommunityIcons name="dna" size={20} color="#888" />
            <Text style={styles.navText} weight="500">
              Helix Chat
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
                      name="book-open-page-variant"
                      size={30}
                      color="#4A148C"
                    />
                  </View>
                </LinearGradient>
              </View>
              <Text style={styles.activeNavText} weight="700">
                Your Voices
              </Text>
            </View>
          </View>

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
  header: {
    marginTop: 50,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: { fontSize: 20, color: "#4A148C", marginLeft: 15 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 140 },
  voiceCard: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FFF",
    elevation: 3,
  },
  cardTopRow: { flexDirection: "row", alignItems: "center" },
  avatarImg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  nameContainer: { flex: 1, marginLeft: 12 },
  voiceName: { fontSize: 16, color: "#311B92" },
  relationBadge: {
    backgroundColor: "#EDE7F6",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  relationText: { fontSize: 10, color: "#5E35B1" },
  switchContainer: { alignItems: "flex-end" },
  activeStatusText: { fontSize: 9, color: "#666", marginTop: 2 },
  cardActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  actionBtn: {
    backgroundColor: "#D1C4E9",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  actionBtnText: { fontSize: 10, color: "#4A148C" },
  addNewBtn: {
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 10,
    elevation: 5,
  },
  addNewText: { color: "#FFF", fontSize: 16 },
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
