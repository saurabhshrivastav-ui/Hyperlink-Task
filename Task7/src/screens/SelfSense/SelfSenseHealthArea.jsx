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

// Device-ratio based scaling
const s = (size) => (width / 375) * size;

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
        <MaterialCommunityIcons 
          name={icon} 
          size={s(24)} 
          color="#5B3DF5" 
        />
      </View>
      <Text weight="500" style={styles.gridLabel} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.7}>
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
    if (open) {
      // Opening animation with spring for smooth feel
      Animated.spring(animValue, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: false,
      }).start();
    } else {
      // Closing animation with timing for controlled feel
      Animated.timing(animValue, {
        toValue: 0,
        duration: 280,
        useNativeDriver: false,
        easing: Easing.bezier(0.4, 0.0, 0.6, 1),
      }).start();
    }
  }, [open]);

  const arrowRotation = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const contentOpacity = animValue.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0, 0.2, 1],
  });

  const gridScale = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.95, 1],
  });

  const gridTranslateY = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-15, 0],
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
            style={[
              styles.gridContainer,
              {
                opacity: contentOpacity,
                transform: [
                  { translateY: gridTranslateY },
                  { scale: gridScale },
                ],
              },
            ]}
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
              {
                id: "diabetes_pre-diabetes",
                label: "Diabetes & Pre Diabetes",
                icon: "water",
                material: true,
              },
              {
                id: "hypertension",
                label: "Hypertension",
                icon: "heart-pulse",
                material: true,
              },
              {
                id: "obesity",
                label: "Obesity",
                icon: "scale-bathroom",
                material: true,
              },
              {
                id: "pcod_pcos",
                label: "PCOD / PCOS",
                icon: "record-circle-outline",
                material: true,
              },
            ]}
          />

          {/* Cancer Awareness */}
          <HealthCard
            id="cancer"
            title="Cancer Awareness"
            subtitle="Early warning signs & risk factors"
            desc="Guidance on self-checks for breast, oral, and lung health."
            image={require("../../../assets/cancer.webp")}
            expandedCard={expandedCard}
            onToggle={toggleCard}
            onItemPress={handleConditionSelect}
            items={[
              {
                id: "breast_cancer",
                label: "Breast",
                icon: "ribbon",
                material: true,
              },
              {
                id: "cervical_cancer",
                label: "Cervical",
                icon: "human-female",
                material: true,
              },
              {
                id: "oral_cancer",
                label: "Oral",
                icon: "tooth-outline",
                material: true,
              },
              {
                id: "prostate_cancer",
                label: "Prostate",
                icon: "human-male",
                material: true,
              },
              {
                id: "colonrectal_cancer",
                label: "Colorectal",
                icon: "record-circle",
                material: true,
              },
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
              {
                id: "stress",
                label: "Mental Wellbeing",
                icon: "brain",
                material: true,
              },
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
              {
                id: "hearing",
                label: "Audiogram",
                icon: "ear-hearing",
                material: true,
              },
            ]}
          />
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <View style={styles.navbarBackground} />
        
        <View style={styles.navbarContent}>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('SelfSense')}>
            <View style={styles.navIconWrapper}>
              <MaterialCommunityIcons name="undo-variant" size={24} color="#8E8E93" />
            </View>
            <Text weight="500" style={styles.navLabel}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <View style={styles.navIconWrapper}>
              <View style={styles.dotsGrid}>
                <View style={styles.dotRow}>
                  <View style={[styles.dot, styles.dotActive]} />
                  <View style={[styles.dot, styles.dotActive]} />
                </View>
                <View style={styles.dotRow}>
                  <View style={[styles.dot, styles.dotActive]} />
                  <View style={[styles.dot, styles.dotActive]} />
                </View>
              </View>
            </View>
            <Text weight="600" style={styles.navLabelActive}>Self Checks</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItemCenter} onPress={() => navigation.navigate('SelfSenseHealthArea')}>
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
            <Text weight="500" style={styles.navLabelActive}>Speciality</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('AssessmentHistory')}>
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
    paddingHorizontal: 20,
    paddingVertical: s(16),
    backgroundColor: COLORS.bgLight,
    borderBottomWidth: 0,
    borderBottomColor: "transparent",
    maxWidth: "100%",
    width: "100%",
    alignSelf: "center",
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: s(4),
  },
  backButton: {
    width: s(32),
    height: s(32),
    borderRadius: s(8),
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    marginRight: s(8),
  },
  headerTitle: {
    fontSize: s(20),
    color: COLORS.brandBlue,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    fontSize: s(13),
    color: COLORS.textSecondary,
    lineHeight: s(18),
    marginLeft: s(40),
  },
  content: {
    padding: 20,
    marginTop: s(5),
    maxWidth: "100%",
    width: "100%",
    alignSelf: "center",
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: s(16),
    marginBottom: s(14),
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
    padding: s(14),
    paddingBottom: s(8),
  },
  cardTop: {
    flexDirection: "row",
    minHeight: s(80),
    alignItems: "flex-start",
  },
  cardTextContainer: {
    maxWidth: "70%",
    flex: 1,
    paddingRight: s(10),
  },
  cardImage: {
    width: s(85),
    height: s(85),
    resizeMode: "contain",
    position: "absolute",
    right: 0,
    top: 0,
  },
  cardTitle: {
    fontSize: s(15),
    color: COLORS.cardTitle,
    fontWeight: "700",
    marginBottom: s(2),
  },
  cardSubtitle: {
    fontSize: s(11.5),
    marginTop: s(2),
    color: "#555",
    fontWeight: "500",
  },
  cardDesc: {
    fontSize: s(10.5),
    color: "#888",
    marginTop: s(8),
    lineHeight: s(15),
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginTop: s(18),
    paddingHorizontal: s(8),
    gap: s(12),
    overflow: "hidden",
  },
  gridItem: {
    width: "30%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: s(8),
    minWidth: "auto",
    paddingVertical: s(8),
    paddingHorizontal: s(4),
  },
  gridIconContainer: {
    width: s(46),
    height: s(46),
    borderRadius: s(23),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: s(6),
    backgroundColor: "#F0E6FF",
  },
  gridIconImage: {
    width: s(32),
    height: s(32),
  },
  gridLabel: {
    fontSize: s(10),
    textAlign: "center",
    color: "#333",
    fontWeight: "500",
    lineHeight: s(14),
    minHeight: s(28),
  },
  cardFooter: {
    backgroundColor: "#E8DCFF",
    paddingVertical: s(12),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: s(6),
    borderTopWidth: 0,
  },
  cardFooterActive: {
    backgroundColor: "#DDD0FF",
  },
  footerText: {
    fontSize: s(12),
    color: COLORS.footerText,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  // Bottom Navigation Styles
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
    width: s(28),
    height: s(28),
    alignItems: "center",
    justifyContent: "center",
  },
  dotsGrid: {
    alignItems: "center",
    justifyContent: "center",
    gap: s(4),
  },
  dotRow: {
    flexDirection: "row",
    gap: s(4),
  },
  dot: {
    width: s(5),
    height: s(5),
    borderRadius: s(2.5),
    backgroundColor: "#8E8E93",
  },
  dotActive: {
    backgroundColor: "#5B3DF5",
  },
  specialityIcon: {
    alignItems: "center",
    justifyContent: "center",
    gap: s(4),
  },
  specialityRow: {
    flexDirection: "row",
    gap: s(4),
  },
  specialityDot: {
    width: s(6),
    height: s(6),
    borderRadius: s(3),
  },
  dotPink: {
    backgroundColor: "#E91E63",
  },
  dotPurple: {
    backgroundColor: "#7C4DFF",
  },
  navLabel: {
    fontSize: s(9),
    color: "#8E8E93",
    marginTop: s(4),
  },
  navLabelActive: {
    fontSize: s(9),
    color: "#5B3DF5",
    marginTop: s(4),
    fontWeight: "600",
  },
});
