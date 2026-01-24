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
  Ionicons,
  Octicons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "../../../components/TextWrapper";

const { width, height } = Dimensions.get("window");

// Responsive breakpoints
const isSmallDevice = width < 375;
const isMediumDevice = width >= 375 && width < 768;
const isTablet = width >= 768 && width < 1024;
const isDesktop = width >= 1024;

// Responsive scaling functions
const scale = (size) => (width / 375) * size;
const verticalScale = (size) => (height / 812) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

const SCREEN_PADDING = isTablet ? 32 : isDesktop ? 48 : 20;

const COLORS = {
  brandBlue: "#5B3DF5",
  heroPink: "#FF4F9A",
  heroDark: "#2D2D2D",
  cardTitle: "#4B3CC4",
  iconBgCircle: "#5B3DF5",
  footerBg: "#F0E6FF",
  footerText: "#5B3DF5",
  footerBgActive: "#E8DCFF",
  bgLight: "#FAF3FD",
  white: "#FFFFFF",
  textPrimary: "#2D2D2D",
  textSecondary: "#666666",
  shadow: "rgba(0, 0, 0, 0.1)",
};

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

// Wrapper for Grid Items
const GridItem = ({ icon, label, material, id, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() => onPress(id, label)}
      activeOpacity={0.65}
    >
      <View style={styles.gridIconContainer}>
        <Image 
          source={require("../../../assets/HealthIcons.png")} 
          style={styles.gridIconImage}
          resizeMode="contain"
        />
      </View>
      <Text weight="500" style={styles.gridLabel} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
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
  onItemPress,
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
                onPress={onItemPress}
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

export default function SelfSenseHealthArea({ navigation }) {
  const [expandedCard, setExpandedCard] = useState(null);

  const toggleCard = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedCard(expandedCard === id ? null : id);
  };

  const handleConditionSelect = (conditionId, conditionName) => {
    navigation.navigate("SelfSensePersonalDetails", {
      conditionId: conditionId,
      conditionName: conditionName,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <SafeAreaView style={styles.header}>
          <View style={styles.headerTopRow}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Feather name="arrow-left" size={24} color="#5B3DF5" />
            </TouchableOpacity>
            <Text weight="600" style={styles.headerTitle}>
              Choose a Health Area
            </Text>
          </View>
          <Text weight="400" style={styles.headerSubtitle}>
            Tap a category to start a guided self-check.
          </Text>
        </SafeAreaView>

        <View style={styles.content}>
          {/* Chronic Conditions */}
          <HealthCard
            id="chronic"
            title="Chronic Conditions"
            subtitle="Long-term lifestyle-linked conditions"
            desc="Understand risks linked to diabetes, PCOS, blood pressure, and more."
            image={require("../../../assets/MobHands.png")}
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
            subtitle="Early warning signs & risk factors"
            desc="Self-checks for common cancer related symptoms and lifestyle risks."
            image={require("../../../assets/cancer.webp")}
            expandedCard={expandedCard}
            onToggle={toggleCard}
            onItemPress={handleConditionSelect}
            items={[
              { id: "breast_cancer", label: "Breast", icon: "ribbon", material: true },
              { id: "lung_cancer", label: "Lung", icon: "lungs", material: true },
              { id: "oral_cancer", label: "Oral", icon: "mouth", material: true },
              { id: "skin_cancer", label: "Skin", icon: "theme-light-dark", material: true },
              { id: "prostate_cancer", label: "Prostate", icon: "gender-male", material: true },
              { id: "colon_cancer", label: "Colon", icon: "record-circle", material: true },
            ]}
          />

          {/* Mental Wellbeing */}
          <HealthCard
            id="mental"
            title="Mental Wellbeing"
            subtitle="Emotional & mental health awareness."
            desc="Check stress levels, emotional patterns, and burnout indicators."
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
            title="Hearing & Sensory Health"
            subtitle="Hearing health & exposure awareness"
            desc="Understanding hearing loss risks and ear health concerns."
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

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <View style={styles.navbarBackground} />
        
        <View style={styles.navbarContent}>
          <TouchableOpacity style={styles.navItem}>
            <View style={styles.navIconWrapper}>
              <MaterialCommunityIcons name="undo-variant" size={24} color="#8E8E93" />
            </View>
            <Text weight="500" style={styles.navLabel}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <View style={styles.navIconWrapper}>
              <View style={styles.dotsGrid}>
                <View style={styles.dotRow}>
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                </View>
                <View style={styles.dotRow}>
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                </View>
              </View>
            </View>
            <Text weight="500" style={styles.navLabel}>Self Checks</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItemCenter}>
            <View style={styles.navCenterIconOuter}>
              <LinearGradient
                colors={["#E0C3FC", "#8EC5FC"]}
                style={styles.navCenterIcon}
              >
                <View style={styles.navCenterIconInner}>
                  <View style={styles.specialityIcon}>
                    <View style={styles.specialityRow}>
                      <View style={[styles.specialityDot, styles.dotPink]} />
                      <View style={[styles.specialityDot, styles.dotPurple]} />
                      <View style={[styles.specialityDot, styles.dotPink]} />
                    </View>
                    <View style={styles.specialityRow}>
                      <View style={[styles.specialityDot, styles.dotPurple]} />
                      <View style={[styles.specialityDot, styles.dotPink]} />
                      <View style={[styles.specialityDot, styles.dotPurple]} />
                    </View>
                    <View style={styles.specialityRow}>
                      <View style={[styles.specialityDot, styles.dotPink]} />
                      <View style={[styles.specialityDot, styles.dotPurple]} />
                      <View style={[styles.specialityDot, styles.dotPink]} />
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </View>
            <Text weight="600" style={styles.navLabelActive}>Speciality</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <View style={styles.navIconWrapper}>
              <MaterialCommunityIcons name="clipboard-text-outline" size={22} color="#8E8E93" />
            </View>
            <Text weight="500" style={styles.navLabel}>History</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <View style={styles.navIconWrapper}>
              <MaterialCommunityIcons name="comment-account-outline" size={22} color="#8E8E93" />
            </View>
            <Text weight="500" style={styles.navLabel}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgLight,
  },
  header: {
    paddingHorizontal: SCREEN_PADDING,
    paddingVertical: moderateScale(16),
    backgroundColor: COLORS.bgLight,
    borderBottomWidth: 0,
    borderBottomColor: "transparent",
    maxWidth: isDesktop ? 1200 : "100%",
    width: "100%",
    alignSelf: "center",
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: moderateScale(4),
  },
  backButton: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(8),
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    marginRight: moderateScale(8),
  },
  headerTitle: {
    fontSize: isTablet ? 22 : isDesktop ? 24 : moderateScale(20),
    color: COLORS.brandBlue,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    fontSize: isTablet ? 14 : moderateScale(13),
    color: COLORS.textSecondary,
    lineHeight: isTablet ? 20 : moderateScale(18),
    marginLeft: moderateScale(40),
  },
  content: {
    padding: SCREEN_PADDING,
    marginTop: verticalScale(5),
    maxWidth: isDesktop ? 1200 : "100%",
    width: "100%",
    alignSelf: "center",
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(16),
    marginBottom: verticalScale(14),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    overflow: "hidden",
    borderLeftWidth: 4,
    borderLeftColor: "#C9B8E8",
  },
  cardActiveBorder: {
    borderLeftColor: "#C9B8E8",
    borderLeftWidth: 4,
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 6,
  },
  cardBody: {
    padding: isTablet ? 18 : moderateScale(14),
    paddingBottom: isTablet ? 12 : moderateScale(8),
  },
  cardTop: {
    flexDirection: "row",
    minHeight: isTablet ? 90 : moderateScale(80),
    alignItems: "flex-start",
  },
  cardTextContainer: {
    maxWidth: "70%",
    flex: 1,
    paddingRight: moderateScale(10),
  },
  cardImage: {
    width: isTablet ? 100 : moderateScale(85),
    height: isTablet ? 100 : moderateScale(85),
    resizeMode: "contain",
    position: "absolute",
    right: 0,
    top: 0,
  },
  cardTitle: {
    fontSize: isTablet ? 18 : moderateScale(15),
    color: COLORS.cardTitle,
    fontWeight: "700",
    marginBottom: moderateScale(2),
  },
  cardSubtitle: {
    fontSize: isTablet ? 13 : moderateScale(11.5),
    marginTop: moderateScale(2),
    color: "#555",
    fontWeight: "500",
  },
  cardDesc: {
    fontSize: isTablet ? 12 : moderateScale(10.5),
    color: "#888",
    marginTop: moderateScale(8),
    lineHeight: isTablet ? 18 : moderateScale(15),
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: verticalScale(18),
    paddingHorizontal: moderateScale(8),
    gap: isTablet ? 12 : moderateScale(10),
  },
  gridItem: {
    width: isTablet ? "30%" : "30%",
    backgroundColor: "#F8F5FC",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(12),
    minWidth: isTablet ? 100 : "auto",
    paddingVertical: moderateScale(16),
    paddingHorizontal: moderateScale(8),
    borderRadius: moderateScale(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  gridIconContainer: {
    width: isTablet ? 50 : moderateScale(44),
    height: isTablet ? 50 : moderateScale(44),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: moderateScale(8),
  },
  gridIconImage: {
    width: isTablet ? 40 : moderateScale(36),
    height: isTablet ? 40 : moderateScale(36),
  },
  gridLabel: {
    fontSize: isTablet ? 13 : moderateScale(11),
    textAlign: "center",
    color: "#333",
    fontWeight: "500",
    numberOfLines: 1,
  },
  cardFooter: {
    backgroundColor: "#E8DCFF",
    paddingVertical: moderateScale(12),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: moderateScale(6),
    borderTopWidth: 0,
  },
  cardFooterActive: {
    backgroundColor: "#DDD0FF",
  },
  footerText: {
    fontSize: isTablet ? 13 : moderateScale(12),
    color: COLORS.footerText,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    justifyContent: "flex-end",
    zIndex: 50,
  },
  navbarBackground: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 85,
    backgroundColor: COLORS.white,
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
  navItem: {
    alignItems: "center",
    justifyContent: "flex-end",
    height: 85,
    width: width / 5,
  },
  navItemCenter: {
    alignItems: "center",
    justifyContent: "flex-end",
    height: 85,
    width: width / 5,
    marginBottom: 20,
  },
  navCenterIconOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
  },
  navCenterIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F0E6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  navCenterIconInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  navIconWrapper: {
    width: moderateScale(28),
    height: moderateScale(28),
    alignItems: "center",
    justifyContent: "center",
  },
  dotsGrid: {
    alignItems: "center",
    justifyContent: "center",
    gap: moderateScale(4),
  },
  dotRow: {
    flexDirection: "row",
    gap: moderateScale(4),
  },
  dot: {
    width: moderateScale(5),
    height: moderateScale(5),
    borderRadius: moderateScale(2.5),
    backgroundColor: "#8E8E93",
  },
  specialityIcon: {
    alignItems: "center",
    justifyContent: "center",
    gap: moderateScale(4),
  },
  specialityRow: {
    flexDirection: "row",
    gap: moderateScale(4),
  },
  specialityDot: {
    width: moderateScale(6),
    height: moderateScale(6),
    borderRadius: moderateScale(3),
  },
  dotPink: {
    backgroundColor: "#E91E63",
  },
  dotPurple: {
    backgroundColor: "#7C4DFF",
  },
  navLabel: {
    fontSize: moderateScale(9),
    color: "#8E8E93",
    marginTop: moderateScale(4),
  },
  navLabelActive: {
    fontSize: moderateScale(9),
    color: "#5B3DF5",
    marginTop: moderateScale(3),
    fontWeight: "600",
  },
});
