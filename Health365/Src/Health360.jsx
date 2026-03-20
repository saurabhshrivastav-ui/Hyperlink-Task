import React, { useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Image,
  Animated,
  Easing,
  Platform,
  PanResponder,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Text } from "../Components/TextWrapper";

const { width, height } = Dimensions.get("window");

const REPORT_CATEGORIES = [
  {
    id: 1,
    title: "Test Reports",
    subtitle: "Blood tests, panels & diagnostics",
    files: "12 files",
    updated: "Updated 2 days ago",
    image: require("../assets/blood flask.webp"),
  },
  {
    id: 2,
    title: "Genomic Reports",
    subtitle: "DNA insights & genetic findings",
    files: "02 files",
    updated: "Updated 6 days ago",
    image: require("../assets/DNA.webp"),
  },
];

const FEATURES = [
  { id: 1, label: "Categorizes\nparameters", icon: "layers-outline" },
  { id: 2, label: "Highlights\ntrends", icon: "trending-up" },
  { id: 3, label: "Explains values in\nsimple language", icon: "chatbubble-ellipses-outline" },
  { id: 4, label: "Powered by\nHelix AI", icon: "flash-outline" },
];

const Health360 = () => {
  const navigation = useNavigation();
  const slideAnim = useRef(new Animated.Value(height)).current;
  const [trayVisible, setTrayVisible] = React.useState(false);

  const openTray = () => {
    setTrayVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 400,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const closeTray = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => setTrayVisible(false));
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 5,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          slideAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 80) {
          closeTray();
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Background */}
        <ImageBackground
          source={require("../assets/Header.webp")}
          style={styles.headerBackground}
          resizeMode="cover"
        >
          {/* Top Bar */}
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.backButton}>
              <Ionicons name="arrow-back" size={22} color="#7C3AED" />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text weight="700" style={styles.headerTitle}>
                Health 360
              </Text>
              <Text weight="400" style={styles.headerSubtitle}>
                Intelligent insights from your health reports.
              </Text>
            </View>
            {/* Gift icon */}
            <View style={styles.giftIconContainer}>
              <MaterialCommunityIcons
                name="gift-outline"
                size={22}
                color="#9333EA"
              />
            </View>
          </View>

          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Text weight="700" style={styles.heroTitle}>
              Understand your{"\n"}reports beyond numbers.
            </Text>
            <Text weight="400" style={styles.heroDescription}>
              Health 360 analyzes your lab reports and organizes parameters{"\n"}
              into clear categories — normal, abnormal, and areas to monitor.
            </Text>
          </View>

          {/* CTA Button */}
          <TouchableOpacity style={styles.ctaButtonWrapper} onPress={openTray}>
            <LinearGradient
              colors={["#B148FF", "#F6339B", "#9914F9"]}
              locations={[0, 0.5, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaButton}
            >
              <Text weight="700" style={styles.ctaText}>
                Select a Report from Vault
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </ImageBackground>

        {/* How Health 360 helps you */}
        <View style={styles.featuresSection}>
          <Text weight="700" style={styles.sectionTitle}>
            How Health 360 helps you
          </Text>
          <View style={styles.featuresGrid}>
            {FEATURES.map((feature) => (
              <View key={feature.id} style={styles.featureCard}>
                <View style={styles.featureIconCircle}>
                  <Ionicons name={feature.icon} size={22} color="#9333EA" />
                </View>
                <Text weight="500" style={styles.featureLabel}>
                  {feature.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: height * 0.45 }} />
      </ScrollView>

      {/* Bottom Tray */}
      {trayVisible && <Animated.View
        style={[
          styles.trayContainer,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        <LinearGradient
          colors={["#E4CCF7", "#FFE9CF"]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 1, y: 0.9 }}
          style={styles.trayGradient}
        >
          <Animated.View {...panResponder.panHandlers} style={styles.trayHandleArea}>
            <View style={styles.trayHandleBar} />
          </Animated.View>

          <ScrollView
            style={styles.trayScroll}
            showsVerticalScrollIndicator={false}
            bounces={true}
          >
            <Text weight="700" style={styles.trayTitle}>
              What do you want to Select?
            </Text>

            {REPORT_CATEGORIES.map((category) => (
              <TouchableOpacity key={category.id} style={[styles.trayCard, category.id === 2 && styles.trayCardGenomic]} activeOpacity={0.7} onPress={() => { if (category.id === 1) navigation.navigate("TestReports"); }}>
                <View style={styles.trayCardIcon}>
                  <Image
                    source={category.image}
                    style={styles.trayCardImage}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.trayCardInfo}>
                  <Text weight="700" style={styles.trayCardTitle}>
                    {category.title}
                  </Text>
                  <Text weight="400" style={styles.trayCardSubtitle}>
                    {category.subtitle}
                  </Text>
                  <View style={styles.trayCardMeta}>
                    <Ionicons name="folder-outline" size={12} color="#9CA3AF" />
                    <Text weight="400" style={styles.trayCardMetaText}>
                      {category.files}
                    </Text>
                    <Text weight="400" style={styles.trayCardMetaDot}>·</Text>
                    <Ionicons name="time-outline" size={12} color="#9CA3AF" />
                    <Text weight="400" style={styles.trayCardMetaText}>
                      {category.updated}
                    </Text>
                  </View>
                </View>
                <View style={styles.trayArrowButton}>
                    <Ionicons name="chevron-forward" size={18} color="#7C3AED" />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </LinearGradient>
      </Animated.View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF4FF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  /* Header Background */
  headerBackground: {
    width: "100%",
    paddingTop: 50,
    paddingBottom: 30,
  },

  /* Top Bar */
  topBar: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.7)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginTop: 2,
  },
  titleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    color: "#1F2937",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  giftIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.5)",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },

  /* Hero */
  heroSection: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 20,
    color: "#7C3AED",
    textAlign: "center",
    lineHeight: 28,
  },
  heroDescription: {
    fontSize: 11.5,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 17,
  },

  /* CTA Button */
  ctaButtonWrapper: {
    marginHorizontal: 24,
    borderRadius: 14,
    overflow: "hidden",
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 8,
  },
  ctaText: {
    color: "#fff",
    fontSize: 16,
    letterSpacing: 0.3,
  },

  /* Features Section */
  featuresSection: {
    paddingHorizontal: 20,
    marginTop: 28,
  },
  sectionTitle: {
    fontSize: 18,
    color: "#6B21A8",
    marginBottom: 18,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 14,
  },
  featureCard: {
    width: (width - 54) / 2,
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#C084FC",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  featureIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F3E8FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  featureLabel: {
    fontSize: 13,
    color: "#374151",
    textAlign: "center",
    lineHeight: 18,
  },

  /* Bottom Tray */
  trayContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: height * 0.42,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 10,
  },
  trayGradient: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === "ios" ? 36 : 24,
  },
  trayHandleArea: {
    paddingTop: 12,
    paddingBottom: 10,
    alignItems: "center",
  },
  trayHandleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D1D5DB",
  },
  trayScroll: {
    paddingHorizontal: 22,
  },
  trayTitle: {
    fontSize: 19,
    color: "#1F2937",
    marginTop: 10,
    marginBottom: 18,
  },
  trayCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECF9FF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#D4D4D4",
    shadowColor: "#BF7BB9",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  trayCardGenomic: {
    backgroundColor: "#F2EEFF",
    shadowColor: "#BF7BB9",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  trayCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  trayCardImage: {
    width: 42,
    height: 42,
  },
  trayCardInfo: {
    flex: 1,
  },
  trayCardTitle: {
    fontSize: 15,
    color: "#7C3AED",
  },
  trayCardSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  trayCardMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    gap: 4,
  },
  trayCardMetaText: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  trayCardMetaDot: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  trayArrowButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F1E7FE",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#BF7BB9",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default Health360;
