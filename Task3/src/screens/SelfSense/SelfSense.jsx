import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  LayoutAnimation,
  Platform,
  UIManager,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Entypo,
  MaterialCommunityIcons,
  FontAwesome5,
  Feather,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "../../../components/TextWrapper";

const { width } = Dimensions.get("window");
const SCREEN_PADDING = 20;

const COLORS = {
  brandBlue: "#0B6EDC",
  heroPink: "#FF4F9A",
  heroDark: "#2D2D2D",
  cardTitle: "#4B3CC4",
  iconBgCircle: "#5D9CEC",
  footerBg: "#E6DCFF",
  footerText: "#5B3DF5",
  footerBgActive: "#D4C4FC",
  bgLight: "#F8F9FD",
};

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

// Wrapper for Grid Items
const GridItem = ({ icon, label, material, id, onPress }) => {
  const IconComponent = material ? MaterialCommunityIcons : FontAwesome5;

  return (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() => onPress(id, label)} // Pass ID back to parent
      activeOpacity={0.7}
    >
      <View style={styles.gridIcon}>
        <IconComponent name={icon} size={22} color="#FFFFFF" />
      </View>
      <Text weight="500" style={styles.gridLabel}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const HealthCard = ({
  id,
  title,
  subtitle,
  desc,
  image,
  items,
  expandedCard,
  onToggle,
  onItemPress, // Receive navigation handler
}) => {
  const open = expandedCard === id;
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: open ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
    }).start();
  }, [open]);

  const arrowRotation = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const contentOpacity = animValue.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <View style={[styles.card, open && styles.cardActiveBorder]}>
      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <View style={styles.cardTextContainer}>
            <Text weight="700" style={styles.cardTitle}>
              {title}
            </Text>
            <Text weight="600" style={styles.cardSubtitle}>
              {subtitle}
            </Text>
            <Text weight="500" style={styles.cardDesc}>
              {desc}
            </Text>
          </View>
          <Image source={image} style={styles.cardImage} />
        </View>

        {open && (
          <Animated.View
            style={[styles.gridContainer, { opacity: contentOpacity }]}
          >
            {items.map((item, idx) => (
              <GridItem
                key={idx}
                {...item}
                onPress={onItemPress} // Pass handler down
              />
            ))}
          </Animated.View>
        )}
      </View>

      <TouchableOpacity
        style={[styles.cardFooter, open && styles.cardFooterActive]}
        onPress={() => onToggle(id)}
        activeOpacity={0.9}
      >
        <Text weight="700" style={styles.footerText}>
          {open ? "Close Checks" : "Explore Checks"}
        </Text>
        <Animated.View style={{ transform: [{ rotate: arrowRotation }] }}>
          <Entypo name="chevron-down" size={18} color={COLORS.footerText} />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

export default function SelfSense({ navigation }) {
  const [expandedCard, setExpandedCard] = useState(null);

  const toggleCard = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedCard(expandedCard === id ? null : id);
  };

  // 🔥 UPDATED NAVIGATION LOGIC:
  // Navigate to 'SelfSensePersonalDetails' (based on your navRow back button)
  // passing the selected condition ID and Name.
  const handleConditionSelect = (conditionId, conditionName) => {
    navigation.navigate("SelfSensePersonalDetails", {
      conditionId: conditionId,    // e.g., "diabetes"
      conditionName: conditionName // e.g., "Diabetes"
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#E8DFFF" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={["#8DBCF2", "#E6F1FF", "#E8DFFF"]}
          style={styles.heroContainer}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.navRow}>
              <TouchableOpacity
                onPress={() => navigation.navigate("SelfSensePersonalDetails")}
                style={styles.backButton}
              >
                <Feather name="arrow-left" size={24} color="#3A2E88" />
              </TouchableOpacity>
              <View style={styles.navTextContainer}>
                <Text weight="700" style={styles.navTitle}>
                  SELF SENSE
                </Text>
                <Text weight="500" style={styles.navSubtitle}>
                  Early awareness. Guided self-checks.
                </Text>
              </View>
            </View>

            <View style={styles.heroContent}>
              <View style={styles.heroTextWrapper}>
                <Text weight="700" style={styles.heroMainText}>
                  Early{"\n"}Awareness{"\n"}Starts Here.
                </Text>
              </View>
              <Image
                source={require("../../../assets/Hero.webp")}
                style={styles.heroImage}
              />
            </View>
          </SafeAreaView>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.sectionHeader}>
            <Text weight="700" style={styles.sectionTitle}>
              Select Health Area
            </Text>
            <Text weight="500" style={styles.sectionSubtitle}>
              Tap a category to begin guided assessment.
            </Text>
          </View>

          {/* Chronic Conditions */}
          <HealthCard
            id="chronic"
            title="Chronic Conditions"
            subtitle="Lifestyle & Long-term Care"
            desc="Assess risks for Diabetes, BP, Thyroid, and heart health."
            image={require("../../../assets/chronic.webp")}
            expandedCard={expandedCard}
            onToggle={toggleCard}
            onItemPress={handleConditionSelect}
            items={[
              { id: "diabetes", label: "Diabetes", icon: "water", material: true },
              { id: "hypertension", label: "Hypertension", icon: "heart-pulse", material: true },
              { id: "pcos", label: "PCOS", icon: "record-circle-outline", material: true },
              { id: "thyroid", label: "Thyroid", icon: "butterfly", material: true },
              { id: "heart", label: "Heart", icon: "heart", material: true },
              { id: "obesity", label: "Obesity", icon: "scale-bathroom", material: true },
            ]}
          />

          {/* Cancer Awareness */}
          <HealthCard
            id="cancer"
            title="Cancer Awareness"
            subtitle="Early Signs & Symptoms"
            desc="Guidance on self-checks for breast, oral, and lung health."
            image={require("../../../assets/cancer.webp")}
            expandedCard={expandedCard}
            onToggle={toggleCard}
            onItemPress={handleConditionSelect}
            items={[
              { id: "breast_cancer", label: "Breast", icon: "ribbon", material: true },
              { id: "lung_cancer", label: "Lung", icon: "lungs", material: true },
              { id: "oral_cancer", label: "Oral", icon: "emoticon-open-mouth", material: true },
              { id: "skin_cancer", label: "Skin", icon: "theme-light-dark", material: true },
              { id: "prostate_cancer", label: "Prostate", icon: "gender-male", material: true },
              { id: "colon_cancer", label: "Colon", icon: "record-circle", material: true },
            ]}
          />

          {/* Mental Wellbeing */}
          <HealthCard
            id="mental"
            title="Mental Wellbeing"
            subtitle="Emotional Balance"
            desc="Track stress, anxiety levels, and burnout symptoms."
            image={require("../../../assets/MentalWell.webp")}
            expandedCard={expandedCard}
            onToggle={toggleCard}
            onItemPress={handleConditionSelect}
            items={[
              { id: "stress", label: "Stress", icon: "brain", material: true },
              { id: "anxiety", label: "Anxiety", icon: "weather-windy", material: true },
              { id: "sleep", label: "Sleep", icon: "bed", material: true },
              { id: "burnout", label: "Burnout", icon: "battery-alert", material: true },
              { id: "mood", label: "Mood", icon: "emoticon-happy", material: true },
              { id: "focus", label: "Focus", icon: "target", material: true },
            ]}
          />

          {/* Sensory Health */}
          <HealthCard
            id="sensory"
            title="Sensory Health"
            subtitle="Hearing & Vision"
            desc="Check for hearing loss, tinnitus, and eye strain."
            image={require("../../../assets/ears.webp")}
            expandedCard={expandedCard}
            onToggle={toggleCard}
            onItemPress={handleConditionSelect}
            items={[
              { id: "hearing", label: "Hearing", icon: "ear-hearing", material: true },
              { id: "tinnitus", label: "Tinnitus", icon: "bell-off", material: true },
              { id: "vision", label: "Vision", icon: "eye", material: true },
              { id: "smell", label: "Smell", icon: "scent", material: true },
              { id: "taste", label: "Taste", icon: "silverware-fork-knife", material: true },
              { id: "touch", label: "Touch", icon: "fingerprint", material: true },
            ]}
          />
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgLight },
  heroContainer: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 0,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    overflow: "hidden",
    minHeight: 280,
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 6,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  navTextContainer: { flex: 1, paddingRight: 10 },
  navTitle: {
    fontSize: 22,
    color: COLORS.brandBlue,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    lineHeight: 26,
  },
  navSubtitle: {
    fontSize: 14,
    color: "#000000",
    lineHeight: 20,
    marginTop: 2,
    marginLeft: -4,
  },
  heroContent: { position: "relative", height: 180, marginTop: 10 },
  heroTextWrapper: { width: "60%", zIndex: 2, paddingTop: 10, marginLeft: -6 },
  heroMainText: { fontSize: 28, lineHeight: 36, color: COLORS.heroPink },
  heroImage: {
    position: "absolute",
    right: -35,
    bottom: -60,
    width: width * 0.65,
    height: width * 0.75,
    resizeMode: "contain",
    zIndex: 1,
  },
  content: { padding: SCREEN_PADDING, marginTop: 20 },
  sectionHeader: { marginBottom: 16, paddingHorizontal: 4 },
  sectionTitle: { fontSize: 20, color: "#2D2D2D", marginBottom: 4 },
  sectionSubtitle: { fontSize: 14, color: "#666" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.02)",
  },
  cardActiveBorder: { borderColor: COLORS.brandBlue, borderWidth: 1.5 },
  cardBody: { padding: 18 },
  cardTop: { flexDirection: "row", minHeight: 85 },
  cardTextContainer: { maxWidth: "72%" },
  cardImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    position: "absolute",
    right: -12,
    bottom: -18,
  },
  cardTitle: { fontSize: 17, color: COLORS.cardTitle },
  cardSubtitle: { fontSize: 13, marginTop: 4, color: "#444" },
  cardDesc: { fontSize: 12, color: "#777", marginTop: 6, lineHeight: 18 },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 22,
  },
  gridItem: {
    width: "30%",
    backgroundColor: "transparent",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 16,
  },
  gridIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.iconBgCircle,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: COLORS.iconBgCircle,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
    zIndex: 10,
  },
  gridLabel: { fontSize: 12, textAlign: "center", color: "#444" },
  cardFooter: {
    backgroundColor: COLORS.footerBg,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: "rgba(91, 61, 245, 0.05)",
  },
  cardFooterActive: { backgroundColor: COLORS.footerBgActive },
  footerText: { fontSize: 13, color: COLORS.footerText },
});