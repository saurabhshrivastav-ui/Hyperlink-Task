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
  Modal,
  PanResponder,
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
import AsyncStorage from "@react-native-async-storage/async-storage";
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

  // --- User data for history check ---
  const [users, setUsers] = useState([]);
  const [activeUserId, setActiveUserId] = useState(null);

  // --- Bottom Sheet State & Animations ---
  const [sheetVisible, setSheetVisible] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState({ id: null, name: null });
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const DISMISS_THRESHOLD = 120;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) {
          slideAnim.setValue(g.dy);
          fadeAnim.setValue(1 - g.dy / (height * 0.6));
        }
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > DISMISS_THRESHOLD || g.vy > 0.5) {
          closeSheet();
        } else {
          Animated.parallel([
            Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }),
            Animated.timing(fadeAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
          ]).start();
        }
      },
    })
  ).current;

  const openSheet = () => {
    setSheetVisible(true);
    slideAnim.setValue(height);
    fadeAnim.setValue(0);
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeSheet = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 150,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setSheetVisible(false);
    });
  };

  const getRiskColor = (risk) => {
    if (!risk) return "#aaa";
    if (risk.includes("High")) return "#dc3545";
    if (risk.includes("Moderate")) return "#ffc107";
    return "#28a745";
  };

  // Load users from AsyncStorage
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedUsers = await AsyncStorage.getItem("users");
        const storedActiveId = await AsyncStorage.getItem("activeUserId");
        if (storedUsers) {
          const parsedUsers = JSON.parse(storedUsers);
          setUsers(parsedUsers);
          if (parsedUsers.length > 0) {
            if (storedActiveId) {
              setActiveUserId(JSON.parse(storedActiveId));
            } else {
              setActiveUserId(parsedUsers[0].id);
            }
          }
        }
      } catch (error) {
        console.error("Failed to load data", error);
      }
    };
    loadData();
  }, []);

  const activeUser = users.find((user) => user.id === activeUserId) || null;

  const toggleCard = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedCard(expandedCard === id ? null : id);
  };

  const handleConditionSelect = (conditionId, conditionName) => {
    // Check if active user has existing history for this condition
    const hasHistory =
      activeUser?.history?.length > 0 &&
      activeUser.history.some((item) => item.conditionName === conditionName);

    if (hasHistory) {
      setSelectedCondition({ id: conditionId, name: conditionName });
      openSheet();
    } else {
      // New entry – go straight to PersonalDetails
      navigation.navigate("SelfSensePersonalDetails", {
        conditionId: conditionId,
        conditionName: conditionName,
      });
    }
  };

  const handleRetake = () => {
    closeSheet();
    setTimeout(() => {
      navigation.navigate("SelfSensePersonalDetails", {
        conditionId: selectedCondition.id,
        conditionName: selectedCondition.name,
      });
    }, 180);
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

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Bottom Sheet - Already Filled Tray */}
      <Modal
        visible={sheetVisible}
        transparent
        animationType="none"
        onRequestClose={closeSheet}
      >
        <View style={styles.sheetModalWrapper}>
          <Animated.View style={[styles.sheetOverlay, { opacity: fadeAnim }]}>
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={closeSheet}
            />
          </Animated.View>

          <Animated.View style={[{ transform: [{ translateY: slideAnim }] }]}>
            <LinearGradient
              colors={["#E4CCF7", "#FFE9CF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.sheetContainer}
            >
              <View {...panResponder.panHandlers} style={styles.sheetHandleArea}>
                <View style={styles.sheetHandleBar} />
              </View>

              <ScrollView
                style={styles.sheetScroll}
                showsVerticalScrollIndicator={false}
                bounces={true}
              >
                {/* Icon + Title */}
                <View style={styles.sheetHeaderRow}>
                  <View style={styles.sheetIconWrap}>
                    <MaterialCommunityIcons
                      name="clipboard-check-outline"
                      size={28}
                      color="#7C3AED"
                    />
                  </View>
                  <Text weight="700" style={styles.sheetTitle}>
                    Assessment Already Completed
                  </Text>
                </View>

                {/* Message */}
                <View style={styles.sheetSection}>
                  <Text weight="400" style={styles.sheetSectionValue}>
                    You have already completed the{" "}
                    <Text weight="700" style={{ color: "#7C3AED" }}>
                      {selectedCondition.name}
                    </Text>{" "}
                    self-check. Your previous results are saved in your history.
                  </Text>
                </View>

                {/* Previous Score Summary */}
                {activeUser?.history &&
                  (() => {
                    const lastEntry = [...activeUser.history]
                      .reverse()
                      .find((item) => item.conditionName === selectedCondition.name);
                    if (!lastEntry) return null;
                    return (
                      <View style={styles.sheetPrevResult}>
                        <View style={styles.sheetPrevRow}>
                          <Text weight="600" style={styles.sheetPrevLabel}>
                            Last Result
                          </Text>
                          <Text weight="400" style={styles.sheetPrevDate}>
                            {lastEntry.date}
                          </Text>
                        </View>
                        <View style={styles.sheetPrevRow}>
                          <View
                            style={[
                              styles.sheetRiskBadge,
                              {
                                backgroundColor:
                                  getRiskColor(lastEntry.riskLevel) + "20",
                              },
                            ]}
                          >
                            <Text
                              weight="700"
                              style={{
                                color: getRiskColor(lastEntry.riskLevel),
                                fontSize: 13,
                              }}
                            >
                              {lastEntry.riskLevel}
                            </Text>
                          </View>
                          <Text weight="600" style={styles.sheetPrevScore}>
                            Score: {lastEntry.totalScore}/{lastEntry.maxScore}
                          </Text>
                        </View>
                      </View>
                    );
                  })()}

                {/* Question */}
                <View style={styles.sheetSection}>
                  <Text weight="600" style={styles.sheetQuestionText}>
                    Would you like to retake this assessment?
                  </Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.sheetActions}>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.sheetRetakeBtnWrap}
                    onPress={handleRetake}
                  >
                    <LinearGradient
                      colors={["#B148FF", "#F6339B", "#9914F9"]}
                      locations={[0, 0.5, 1]}
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                      style={styles.sheetRetakeBtn}
                    >
                      <Feather
                        name="refresh-cw"
                        size={16}
                        color="#fff"
                        style={{ marginRight: 8 }}
                      />
                      <Text weight="700" style={styles.sheetRetakeBtnText}>
                        Yes, Retake Assessment
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.sheetCancelBtn}
                    onPress={closeSheet}
                  >
                    <Text weight="700" style={styles.sheetCancelBtnText}>
                      No, Go Back
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </LinearGradient>
          </Animated.View>
        </View>
      </Modal>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <View style={styles.navbarBackground} />
        
        <View style={styles.navbarContent}>
          <TouchableOpacity style={styles.tabContainer} onPress={() => navigation.navigate('SelfSense')}>
            <View style={styles.iconHolder}>
              <View style={styles.inactiveCircle}>
                <MaterialCommunityIcons name="undo-variant" size={22} color="#7f8c8d" />
              </View>
            </View>
            <Text weight="500" style={[styles.navLabel, styles.inactiveLabel]}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabContainer}>
            <View style={styles.iconHolder}>
              <View style={styles.activeOuterBuffer}>
                <LinearGradient
                  colors={["#6ea6e7", "#daeffe", "#e0d3ff"]}
                  style={styles.activeCircle}
                >
                  <View style={styles.dotsGrid}>
                    <View style={styles.dotRow}>
                      <View style={[styles.dot, { backgroundColor: "#5b3cc4" }]} />
                      <View style={[styles.dot, { backgroundColor: "#5b3cc4" }]} />
                    </View>
                    <View style={styles.dotRow}>
                      <View style={[styles.dot, { backgroundColor: "#5b3cc4" }]} />
                      <View style={[styles.dot, { backgroundColor: "#5b3cc4" }]} />
                    </View>
                  </View>
                </LinearGradient>
              </View>
            </View>
            <Text weight="900" style={[styles.navLabel, styles.activeLabel]}>Self Checks</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabContainer} onPress={() => navigation.navigate('SelfSenseHealthArea')}>
            <View style={styles.iconHolder}>
              <View style={styles.inactiveCircle}>
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
            </View>
            <Text weight="500" style={[styles.navLabel, styles.inactiveLabel]}>Speciality</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabContainer} onPress={() => navigation.navigate('AssessmentHistory')}>
            <View style={styles.iconHolder}>
              <View style={styles.inactiveCircle}>
                <MaterialCommunityIcons name="clipboard-text-outline" size={22} color="#7f8c8d" />
              </View>
            </View>
            <Text weight="500" style={[styles.navLabel, styles.inactiveLabel]}>History</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabContainer}>
            <View style={styles.iconHolder}>
              <View style={styles.inactiveCircle}>
                <MaterialCommunityIcons name="comment-account-outline" size={22} color="#7f8c8d" />
              </View>
            </View>
            <Text weight="500" style={[styles.navLabel, styles.inactiveLabel]}>Profile</Text>
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
    width: "100%",
    height: 70,
    elevation: 10,
    zIndex: 999,
  },
  navbarBackground: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: 70,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e2e2e2",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  navbarContent: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    height: 70,
    paddingBottom: 10,
  },
  tabContainer: {
    width: width / 5,
    alignItems: "center",
  },
  iconHolder: {
    height: 86,
    width: 86,
    justifyContent: "center",
    alignItems: "center",
    top: -32,
    backgroundColor: "transparent",
  },
  activeOuterBuffer: {
    height: 78,
    width: 78,
    borderRadius: 39,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  activeCircle: {
    height: 66,
    width: 66,
    borderRadius: 33,
    borderWidth: 3,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  inactiveCircle: {
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 35,
  },
  dotsGrid: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  dotRow: {
    flexDirection: "row",
    gap: 4,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#7f8c8d",
  },
  specialityIcon: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  specialityRow: {
    flexDirection: "row",
    gap: 4,
  },
  specialityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotPink: {
    backgroundColor: "#E91E63",
  },
  dotPurple: {
    backgroundColor: "#7C4DFF",
  },
  navLabel: {
    fontSize: 13,
    marginTop: -35,
  },
  activeLabel: {
    color: "#3498db",
  },
  inactiveLabel: {
    color: "#535353ff",
  },

  // --- Bottom Sheet Styles ---
  sheetModalWrapper: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "transparent",
  },
  sheetOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  sheetContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 0,
    paddingBottom: Platform.OS === "ios" ? 36 : 24,
    maxHeight: height * 0.75,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 10,
  },
  sheetHandleArea: {
    paddingTop: 10,
    paddingBottom: 6,
    alignItems: "center",
  },
  sheetHandleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D1D5DB",
    alignSelf: "center",
    marginBottom: 10,
  },
  sheetScroll: {
    paddingHorizontal: 24,
  },
  sheetIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#F3E8FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  sheetHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 6,
  },
  sheetTitle: {
    fontSize: 18,
    color: "#1f2937",
    flex: 1,
  },
  sheetSection: {
    marginBottom: 16,
  },
  sheetSectionValue: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 22,
  },
  sheetPrevResult: {
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E9D5FF",
  },
  sheetPrevRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  sheetPrevLabel: {
    fontSize: 14,
    color: "#1f2937",
  },
  sheetPrevDate: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  sheetRiskBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sheetPrevScore: {
    fontSize: 13,
    color: "#6B7280",
  },
  sheetQuestionText: {
    fontSize: 15,
    color: "#1f2937",
    textAlign: "center",
  },
  sheetActions: {
    gap: 10,
    marginTop: 8,
    marginBottom: 10,
  },
  sheetRetakeBtnWrap: {
    borderRadius: 14,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#BF7BB9",
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
        shadowColor: "#BF7BB9",
      },
    }),
  },
  sheetRetakeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
  },
  sheetRetakeBtnText: {
    color: "#fff",
    fontSize: 15,
  },
  sheetCancelBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  sheetCancelBtnText: {
    color: "#4B5563",
    fontSize: 15,
  },
});
