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
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { LinearGradient } from "expo-linear-gradient";
import { Text } from "../../Components/TextWrapper";

const { width, height } = Dimensions.get("window");

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
const enableAndroidLayoutAnimation = () => {
  if (Platform.OS !== "android") return;

  // In New Architecture (Fabric), this is a no-op and logs a warning if called.
  const isFabric = !!global?.nativeFabricUIManager;

  if (
    !isFabric &&
    typeof UIManager.setLayoutAnimationEnabledExperimental === "function"
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
};

// Call once at app startup (e.g., App.jsx)
enableAndroidLayoutAnimation();

// Use animations like this where needed:
export const animateNextLayout = () => {
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
};

// Wrapper for Grid Items
const GridItem = ({ icon, label, material, id, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() => onPress(id, label)}
      activeOpacity={0.65}
    >
      <View style={styles.gridIconContainer}>
        <MaterialCommunityIcons name={icon} size={30} color="#5B3DF5" />
      </View>
      <Text
        weight="500"
        style={styles.gridLabel}
        numberOfLines={2}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
      >
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
            <Text weight="500" style={styles.cardSubtitle}>
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
                onPress={() => onItemPress?.(item)} // ✅ pass the object
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

export default function SelfSenseHealthArea({ navigation: navigationProp }) {
  const [expandedCard, setExpandedCard] = useState(null);
  const navigationHook = useNavigation();
  const navigation = navigationProp || navigationHook;

  // --- User data for history check ---
  const [users, setUsers] = useState([]);
  const [activeUserId, setActiveUserId] = useState(null);

  // --- Bottom Sheet State & Animations ---
  const [sheetVisible, setSheetVisible] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState({
    id: null,
    name: null,
    image: null,
  });
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const DISMISS_THRESHOLD = 120;

  // --- Earphone Warning Bottom Tray State ---
  const [earphoneSheetVisible, setEarphoneSheetVisible] = useState(false);
  const [pendingAudioItem, setPendingAudioItem] = useState(null);
  const earphoneFadeAnim = useRef(new Animated.Value(0)).current;
  const earphoneSlideAnim = useRef(new Animated.Value(height)).current;

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
            Animated.timing(slideAnim, {
              toValue: 0,
              duration: 200,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 150,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    }),
  ).current;

  const openSheet = () => {
    setSheetVisible(true);
    slideAnim.setValue(height);
    fadeAnim.setValue(0);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeSheet = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 250,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
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

  const openEarphoneSheet = () => {
    setEarphoneSheetVisible(true);
    earphoneSlideAnim.setValue(height);
    earphoneFadeAnim.setValue(0);
    Animated.parallel([
      Animated.timing(earphoneSlideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(earphoneFadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeEarphoneSheet = (cb) => {
    Animated.parallel([
      Animated.timing(earphoneSlideAnim, {
        toValue: height,
        duration: 250,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(earphoneFadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setEarphoneSheetVisible(false);
      if (cb) cb();
    });
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

  const proceedToCondition = (item) => {
    const hasHistory =
      activeUser?.history?.length > 0 &&
      activeUser.history.some((h) => h.conditionName === item.label);

    if (hasHistory) {
      setSelectedCondition({
        id: item.id,
        name: item.label,
        image: item.image,
      });
      openSheet();
    } else {
      navigation.navigate("SelfSensePersonalDetails", {
        conditionId: item.id,
        conditionName: item.label,
        conditionImg: item.image,
      });
    }
  };

  const handleConditionSelect = (item) => {
    if (!item?.id) return;

    // Show earphone warning sheet for Audiogram
    if (item.id === "hearing") {
      setPendingAudioItem(item);
      openEarphoneSheet();
      return;
    }

    proceedToCondition(item);
  };

  const handleEarphoneReady = () => {
    const item = pendingAudioItem;
    closeEarphoneSheet(() => {
      if (item) {
        setTimeout(() => proceedToCondition(item), 180);
      }
    });
  };

  const handleRetake = () => {
    closeSheet();
    setTimeout(() => {
      navigation.navigate("SelfSensePersonalDetails", {
        conditionId: selectedCondition.id,
        conditionName: selectedCondition.name,
        conditionImg: selectedCondition.image,
      });
    }, 180);
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.heroTopBar}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.85}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather name="arrow-left" size={20} color="#553fb5" />
            </TouchableOpacity>

            <View style={styles.heroTexts}>
              <Text style={styles.heroTitle} weight="800" numberOfLines={1}>
                Choose a Health Area
              </Text>
              <Text style={styles.heroSubtitle} weight="400" numberOfLines={2}>
                Tap a category to start a guided self-check.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {/* Chronic Conditions */}
          <HealthCard
            id="chronic"
            title="Chronic Conditions"
            subtitle="Long-term lifestyle-linked conditions"
            desc="Understand risks linked to diabetes, PCOS, blood pressure, and more."
            image={require("../../assets/MobHands.webp")}
            expandedCard={expandedCard}
            onToggle={toggleCard}
            onItemPress={handleConditionSelect}
            items={[
              {
                id: "diabetes_pre-diabetes",
                label: "Diabetes & Pre Diabetes",
                icon: "water",
                image: require("../../assets/SelfSenseDiabetes.webp"),
                material: true,
              },
              {
                id: "hypertension",
                label: "Hypertension",
                icon: "heart-pulse",
                image: require("../../assets/SelfSenseHyperTension.webp"),
                material: true,
              },
              {
                id: "obesity",
                label: "Obesity",
                icon: "scale-bathroom",
                image: require("../../assets/SelfSenseObesity.webp"),
                material: true,
              },
              {
                id: "pcod_pcos",
                label: "PCOD / PCOS",
                icon: "record-circle-outline",
                image: require("../../assets/SelfSensePCOD.webp"),
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
            image={require("../../assets/cancer.webp")}
            expandedCard={expandedCard}
            onToggle={toggleCard}
            onItemPress={handleConditionSelect}
            items={[
              {
                id: "breast_cancer",
                label: "Breast",
                icon: "ribbon",
                image: require("../../assets/SelfSenseBreastCancer.webp"),
                material: true,
              },
              {
                id: "cervical_cancer",
                label: "Cervical",
                icon: "human-female",
                image: require("../../assets/SelfSenseCervicalCancer.webp"),
                material: true,
              },
              {
                id: "oral_cancer",
                label: "Oral",
                icon: "tooth-outline",
                image: require("../../assets/SelfSenseOralCancer.webp"),
                material: true,
              },
              {
                id: "prostate_cancer",
                label: "Prostate",
                icon: "human-male",
                image: require("../../assets/SelfSenseProstateCancer.webp"),
                material: true,
              },
              {
                id: "colonrectal_cancer",
                label: "Colorectal",
                icon: "record-circle",
                image: require("../../assets/SelfSenseColorectalCancer.webp"),
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
            image={require("../../assets/MentalWell.webp")}
            expandedCard={expandedCard}
            onToggle={toggleCard}
            onItemPress={handleConditionSelect}
            items={[
              {
                id: "stress",
                label: "Mental Wellbeing",
                icon: "brain",
                image: require("../../assets/SelfSenseMentalWellBeing.webp"),
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
            image={require("../../assets/ears.webp")}
            expandedCard={expandedCard}
            onToggle={toggleCard}
            onItemPress={handleConditionSelect}
            items={[
              {
                id: "hearing",
                label: "Audiogram",
                icon: "ear-hearing",
                image: require("../../assets/SelfSenseSensoryHealth.webp"),
                material: true,
              },
            ]}
          />
        </View>
      </ScrollView>

      {/* Bottom Sheet - Already Filled Tray */}
      {sheetVisible && (
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
              <View
                {...panResponder.panHandlers}
                style={styles.sheetHandleArea}
              >
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
                      .find(
                        (item) => item.conditionName === selectedCondition.name,
                      );
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
      )}

      {/* Earphone Warning Bottom Tray */}
      {earphoneSheetVisible && (
        <View style={styles.sheetModalWrapper}>
          <Animated.View
            style={[styles.sheetOverlay, { opacity: earphoneFadeAnim }]}
          >
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={() => closeEarphoneSheet()}
            />
          </Animated.View>

          <Animated.View
            style={[{ transform: [{ translateY: earphoneSlideAnim }] }]}
          >
            <LinearGradient
              colors={["#E4CCF7", "#FFE9CF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.sheetContainer}
            >
              <View style={styles.sheetHandleArea}>
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
                      name="headphones"
                      size={28}
                      color="#7C3AED"
                    />
                  </View>
                  <Text weight="700" style={styles.sheetTitle}>
                    Wear Your Earphones
                  </Text>
                </View>

                {/* Message */}
                <View style={styles.sheetSection}>
                  <Text weight="400" style={styles.sheetSectionValue}>
                    For an accurate hearing test, please make sure:
                  </Text>
                </View>

                {/* Instructions */}
                <View style={styles.sheetPrevResult}>
                  <View style={styles.earphoneStepRow}>
                    <MaterialCommunityIcons name="headphones" size={20} color="#7C3AED" />
                    <Text weight="600" style={styles.earphoneStepText}>
                      Put on your earphones / headphones
                    </Text>
                  </View>
                  <View style={styles.earphoneStepRow}>
                    <MaterialCommunityIcons name="volume-high" size={20} color="#7C3AED" />
                    <Text weight="600" style={styles.earphoneStepText}>
                      Set your device volume to 100%
                    </Text>
                  </View>
                  <View style={[styles.earphoneStepRow, { marginBottom: 0 }]}>
                    <MaterialCommunityIcons name="volume-off" size={20} color="#7C3AED" />
                    <Text weight="600" style={styles.earphoneStepText}>
                      Be in a quiet environment
                    </Text>
                  </View>
                </View>

                {/* Question */}
                <View style={styles.sheetSection}>
                  <Text weight="600" style={styles.sheetQuestionText}>
                    Are you ready to begin?
                  </Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.sheetActions}>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.sheetRetakeBtnWrap}
                    onPress={handleEarphoneReady}
                  >
                    <LinearGradient
                      colors={["#B148FF", "#F6339B", "#9914F9"]}
                      locations={[0, 0.5, 1]}
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                      style={styles.sheetRetakeBtn}
                    >
                      <Feather
                        name="check-circle"
                        size={16}
                        color="#fff"
                        style={{ marginRight: 8 }}
                      />
                      <Text weight="700" style={styles.sheetRetakeBtnText}>
                        I'm Ready, Let's Go
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.sheetCancelBtn}
                    onPress={() => closeEarphoneSheet()}
                  >
                    <Text weight="700" style={styles.sheetCancelBtnText}>
                      Not Now
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </LinearGradient>
          </Animated.View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7fafc",
  },
  header: {
    paddingHorizontal: 20,
    width: "100%",
    alignSelf: "center",
  },

  heroTopBar: {
    marginTop: 40,
    flexDirection: "row",
    alignItems: "flex-start", // better vertical alignment
  },

  backButton: {
    backgroundColor: "rgba(255,255,255,0.25)",
    padding: 8,
    borderRadius: 12,
  },

  heroTexts: {
    flex: 1,
    marginLeft: 12,
  },

  heroTitle: {
    fontSize: 22,
    color: "#553fb5",
  },

  heroSubtitle: {
    fontSize: 18, // 18 can look huge on small screens
    color: "#553fb5",
    opacity: 0.8,
  },
  content: {
    padding: 20,
    marginTop: 5,
    maxWidth: "100%",
    width: "100%",
    alignSelf: "center",
  },
  card: {
    backgroundColor: "#FBF1FE",
    borderRadius: 16,
    marginBottom: 14,
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
    borderLeftColor: "#553fb5",
    borderLeftWidth: 4,
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 6,
  },
  cardBody: {
    padding: 14,
    paddingBottom: 8,
  },
  cardTop: {
    flexDirection: "row",
    minHeight: 80,
    alignItems: "flex-start",
  },
  cardTextContainer: {
    maxWidth: "70%",
    flex: 1,
    paddingRight: 10,
  },
  cardImage: {
    width: 85,
    height: 85,
    resizeMode: "contain",
    position: "absolute",
    right: 0,
    top: 0,
  },
  cardTitle: {
    fontSize: 22,
    color: COLORS.cardTitle,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 17,
    marginTop: 2,
    color: "#555",
  },
  cardDesc: {
    fontSize: 13,
    color: "#888",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginTop: 18,
    paddingHorizontal: 8,
    gap: 12,
    overflow: "hidden",
  },
  gridItem: {
    width: "30%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    minWidth: "auto",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  gridIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
    backgroundColor: "#F0E6FF",
  },
  gridIconImage: {
    width: 35,
    height: 35,
  },
  gridLabel: {
    fontSize: 15,
    textAlign: "center",
    color: "#333",
    lineHeight: 14,
    minHeight: 28,
  },
  cardFooter: {
    backgroundColor: "#E8DCFF",
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    borderTopWidth: 0,
  },
  cardFooterActive: {
    backgroundColor: "#DDD0FF",
  },
  footerText: {
    fontSize: 15,
    color: COLORS.footerText,
  },

  /* -------------------- Bottom Sheet -------------------- */
  sheetModalWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    backgroundColor: "transparent",
    zIndex: 100,
    elevation: 100,
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

  /* ---- Earphone Step Items ---- */
  earphoneStepRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  earphoneStepText: {
    fontSize: 14,
    color: "#1f2937",
    marginLeft: 10,
    flex: 1,
  },
});
