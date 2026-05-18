import React, { useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  FlatList,
  ScrollView,
  Dimensions,
  Image,
  ImageBackground,
  Animated,
} from "react-native";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "../../../components/TextWrapper";
import PressableCard from "../../components/PressableCard";
import useParallaxHeader from "../../hooks/useParallaxHeader";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const HORIZONTAL_PADDING = 10;
const CHIP_GAP = 6;
const TOTAL_GAPS_WIDTH = CHIP_GAP * 5;
const AVAILABLE_WIDTH =
  SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - TOTAL_GAPS_WIDTH;
const CHIP_WIDTH = Math.floor(AVAILABLE_WIDTH / 6);
const CHIP_ITEM_WIDTH = CHIP_WIDTH + CHIP_GAP;
const CHIP_HEIGHT = 36;
const FITNESS_LAYER_TOP = "#FFD890";
const SUN_RAY_COUNT = 30;

// Device card exact dimensions
const DEVICE_CARD_WIDTH = 323;
const DEVICE_CARD_HEIGHT = 105;
const DEVICE_CARD_BORDER_RADIUS = 10;

// Watch exact dimensions
const WATCH_WIDTH = 60.77;
const WATCH_HEIGHT = 108;

// Weekly Trend exact dimensions from spec
const WEEKLY_CARD_WIDTH = 279;
const WEEKLY_CARD_HEIGHT = 137;

const CATEGORIES = [
  { label: "All", color: "#CD8CFF" },
  { label: "Sleep", color: "#5B3DBA" },
  { label: "Nutrition", color: "#16A34A" },
  { label: "Fitness", color: "#EA580C" },
  { label: "Medicine", color: "#1D4ED8" },
  { label: "Menstrual", color: "#DB2777" },
];

const WEEKLY_DATA = [
  { d: "Mon", h: 35 },
  { d: "Tues", h: 65 },
  { d: "Wed", h: 100 },
  { d: "Thurs", h: 80 },
  { d: "Fri", h: 100, active: true },
  { d: "Sat", h: 55 },
  { d: "Sun", h: 85 },
];

const ACTIVITY_PILLS = [
  { name: "walk", label: "Walking" },
  { name: "run", label: "Running" },
  { name: "bike", label: "Cycling" },
  { name: "swim", label: "Swimming" },
];

// ─── Active chip ────────────────────────────────────────────────────────────
const ActiveChip = ({ label, color }) => {
  const isFitness = label === "Fitness";
  return (
    <View style={styles.activeChipContainer}>
      <View
        style={[
          styles.activeChipSurface,
          { backgroundColor: isFitness ? FITNESS_LAYER_TOP : color },
        ]}
      />
      <View style={styles.activeChipLabel}>
        <Text
          weight="600"
          style={[styles.activeChipText, isFitness && styles.activeFitnessText]}
        >
          {label}
        </Text>
      </View>
    </View>
  );
};

// ─── Action card ─────────────────────────────────────────────────────────────
const FitnessAction = ({
  icon,
  title,
  subtitle,
  titleColor,
  variant = "default",
  containerStyle,
  onPress,
}) => {
  const gradientMap = {
    log: ["#FFFFFF", "#FDEEE2"],
    start: ["#FFFFFF", "#FDE7F1"],
    devices: ["#F8F4FF", "#E7EDFC"],
  };

  if (variant !== "default") {
    return (
      <View style={[styles.logActionWrap, containerStyle]}>
        <View style={styles.logActionShadowLayer}>
          <PressableCard
            style={[styles.actionCard, styles.logActionCard]}
            fillInner
            onPress={onPress}
          >
            <LinearGradient
              colors={gradientMap[variant]}
              locations={[0, 1]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.logActionGradient}
            >
              <View style={styles.actionIcon}>{icon}</View>
              <Text
                weight="600"
                style={[styles.actionTitle, { color: titleColor }]}
              >
                {title}
              </Text>
              <Text weight="400" style={styles.actionSub}>
                {subtitle}
              </Text>
            </LinearGradient>
          </PressableCard>
        </View>
      </View>
    );
  }

  return (
    <PressableCard
      style={[styles.actionCard, containerStyle]}
      fillInner
      onPress={onPress}
    >
      <View style={styles.actionIcon}>{icon}</View>
      <Text weight="600" style={[styles.actionTitle, { color: titleColor }]}>
        {title}
      </Text>
      <Text weight="400" style={styles.actionSub}>
        {subtitle}
      </Text>
    </PressableCard>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
function FitnessWellnessSection({
  onBack,
  onNavigateAll,
  onNavigateSleep,
  onNavigateNutrition,
  onNavigateMedicine,
  onNavigateMenstrual,
  onNavigateLogActivity,
  hideHeader = false,
}) {
  const CURRENT_CATEGORY = "Fitness";
  const topOffset =
    Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 10 : 18;
  const [active, setActive] = useState("Fitness");
  const [hasLoggedActivity, setHasLoggedActivity] = useState(false);

  // ── NEW: tracks whether a live activity session is running ──
  const [isActivityActive, setIsActivityActive] = useState(false);

  // ── NEW: elapsed seconds for live timer ──
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const flatListRef = useRef(null);
  const { scrollHandler } = useParallaxHeader();

  // ── NEW: format seconds → HH:MM:SS ──
  const formatTime = (s) => {
    const h = String(Math.floor(s / 3600)).padStart(2, "0");
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${h}:${m}:${sec}`;
  };

  // ── NEW: live timer effect ──
  useEffect(() => {
    if (!isActivityActive) {
      setElapsedSeconds(0);
      return;
    }
    const interval = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [isActivityActive]);

  // ── Handlers ──
  const handleLogActivity = () => {
    setHasLoggedActivity(true);
    setIsActivityActive(false);
  };

  // ── NEW: start a live activity session ──
  const handleStartActivity = () => {
    setHasLoggedActivity(true);
    setIsActivityActive(true);
  };

  // ── NEW: stop the live activity session ──
  const handleStopActivity = () => {
    setIsActivityActive(false);
  };

  const contentOpacityAnim = useRef(new Animated.Value(0)).current;
  const contentSlideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    const t = setTimeout(() => {
      Animated.parallel([
        Animated.spring(contentOpacityAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 65,
          friction: 10,
        }),
        Animated.spring(contentSlideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 10,
        }),
      ]).start();
    }, 500);
    return () => clearTimeout(t);
  }, [active]);

  const handleChipPress = (label, index) => {
    flatListRef.current?.scrollToIndex({
      index,
      animated: false,
      viewPosition: 0.5,
    });
    if (label !== CURRENT_CATEGORY) {
      if (label === "All" && typeof onNavigateAll === "function")
        onNavigateAll();
      if (label === "Sleep" && typeof onNavigateSleep === "function")
        onNavigateSleep();
      if (label === "Nutrition" && typeof onNavigateNutrition === "function")
        onNavigateNutrition();
      if (label === "Medicine" && typeof onNavigateMedicine === "function")
        onNavigateMedicine();
      if (label === "Menstrual" && typeof onNavigateMenstrual === "function")
        onNavigateMenstrual();
      return;
    }
    setActive(CURRENT_CATEGORY);
  };

  const getItemLayout = (_, index) => ({
    length: CHIP_ITEM_WIDTH,
    offset: CHIP_ITEM_WIDTH * index,
    index,
  });

  const renderChipItem = ({ item: chip, index }) => {
    const isActive = active === chip.label;
    return (
      <View
        style={[
          styles.chipTouch,
          index === CATEGORIES.length - 1 && { marginRight: 0 },
        ]}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => handleChipPress(chip.label, index)}
          style={{ width: "100%" }}
        >
          {isActive ? (
            <ActiveChip label={chip.label} color={chip.color} />
          ) : (
            <View style={[styles.inactiveChip, { borderColor: chip.color }]}>
              <Text
                weight="500"
                style={[styles.inactiveChipText, { color: chip.color }]}
              >
                {chip.label}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {/* ── Header ── */}
        {!hideHeader && (
          <View style={[styles.headerBlock, { paddingTop: topOffset }]}>
            <View style={styles.headerRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.backBtn}
                onPress={onBack}
              >
                <Ionicons name="arrow-back" size={25} color="#5A3FB8" />
              </TouchableOpacity>
              <View style={styles.titleWrap}>
                <Text weight="700" style={styles.headerTitle}>
                  Health Wellness
                </Text>
                <Text weight="400" style={styles.headerSubtitle}>
                  Build healthy habits, one day at a time.
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* ── Chips ── */}
        <View style={styles.chipRowContainer}>
          <FlatList
            ref={flatListRef}
            horizontal
            data={CATEGORIES}
            keyExtractor={(item) => item.label}
            renderItem={renderChipItem}
            getItemLayout={getItemLayout}
            showsHorizontalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={styles.chipRow}
            onScrollToIndexFailed={({ index }) => {
              setTimeout(
                () =>
                  flatListRef.current?.scrollToIndex({
                    index,
                    animated: false,
                    viewPosition: 0.5,
                  }),
                120,
              );
            }}
          />
        </View>

        {/* ── Hero + Action cards ── */}
        <View style={styles.topSection}>
          <View>
            <LinearGradient
              colors={["#FFD890", "#FFF5FF"]}
              locations={[0.0207, 0.9793]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.topSectionBackdrop}
            />

            <View style={styles.heroWrap}>
              <Animated.View
                style={{
                  opacity: contentOpacityAnim,
                  transform: [{ translateY: contentSlideAnim }],
                }}
              >
                <LinearGradient
                  colors={["#E48A22", "#F6AF55", "#FFE0BA"]}
                  locations={[0, 0.6, 1]}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={styles.heroCard}
                >
                  <View style={styles.heroContentLeft}>
                    <Text weight="700" style={styles.heroTitle}>
                      Hi, Sakshi!
                    </Text>
                    <Text weight="500" style={styles.heroSub}>
                      {hasLoggedActivity
                        ? "Your Today's Activity"
                        : "Set your Fitness Goal"}
                    </Text>

                    {hasLoggedActivity && (
                      <View style={styles.heroStatsWrap}>
                        <Text weight="600" style={styles.heroStatsLabel}>
                          Calories Burned
                        </Text>
                        <View style={styles.heroStatsRow}>
                          <Text weight="800" style={styles.heroStatsValue}>
                            240
                          </Text>
                          <Text weight="600" style={styles.heroStatsOf}>
                            {" "}
                            / 800
                          </Text>
                          <Text weight="600" style={styles.heroStatsUnit}>
                            {" "}
                            kcal
                          </Text>
                        </View>
                      </View>
                    )}

                    <View style={styles.heroBtnShadowOuter}>
                      <TouchableOpacity
                        activeOpacity={0.85}
                        style={styles.heroBtnWrap}
                      >
                        <LinearGradient
                          colors={["#E99331", "#FFAF59", "#D47709"]}
                          locations={[0.0003, 0.5, 0.9997]}
                          start={{ x: 0, y: 0.5 }}
                          end={{ x: 1, y: 0.5 }}
                          style={styles.heroBtn}
                        >
                          <Text weight="600" style={styles.heroBtnText}>
                            {hasLoggedActivity ? "Edit Goal" : "Set Goal"}
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.runnerIconWrap}>
                    <Image
                      source={require("../../../assets/running.webp")}
                      style={styles.runnerCharacter}
                      resizeMode="contain"
                    />
                  </View>

                  {/* Sun burst */}
                  <View style={styles.sunTrackClip}>
                    <View style={styles.sunBurstWrap}>
                      {Array.from({ length: SUN_RAY_COUNT }).map((_, idx) => {
                        const angle = -90 + (idx * 180) / (SUN_RAY_COUNT - 1);
                        return (
                          <View
                            key={`ray-${idx}`}
                            style={[
                              styles.sunRay,
                              {
                                transform: [
                                  { rotate: `${angle}deg` },
                                  { translateY: -56 },
                                ],
                              },
                            ]}
                          />
                        );
                      })}
                      <View style={styles.sunBurstOuter} />
                      <View style={styles.sunBurstInner} />
                    </View>
                  </View>
                </LinearGradient>
              </Animated.View>
            </View>

            <Animated.View
              style={{
                opacity: contentOpacityAnim,
                transform: [{ translateY: contentSlideAnim }],
              }}
            >
              <View style={styles.actionsRow}>
                {/* ── Log Activity ── */}
                <FitnessAction
                  icon={
                    <MaterialCommunityIcons
                      name="run"
                      size={14}
                      color="#E67E22"
                    />
                  }
                  title="Log Activity"
                  subtitle="Last :45min walk"
                  titleColor="#E67E22"
                  variant="log"
                  containerStyle={styles.actionItemSpacing}
                  onPress={handleLogActivity}
                />

                {/* ── Start Activity — now wired to handleStartActivity ── */}
                <FitnessAction
                  icon={
                    <MaterialCommunityIcons
                      name="timer-refresh"
                      size={14}
                      color="#EF4444"
                    />
                  }
                  title="Start Activity"
                  subtitle="Last :45min walk"
                  titleColor="#EF4444"
                  variant="start"
                  containerStyle={styles.actionItemSpacing}
                  onPress={handleStartActivity}
                />

                {/* ── Devices ── */}
                <FitnessAction
                  icon={<Feather name="link" size={14} color="#2563EB" />}
                  title="Devices"
                  subtitle="1 Connected"
                  titleColor="#2563EB"
                  variant="devices"
                />
              </View>
            </Animated.View>
          </View>
        </View>

        {/* ── Sections below (animated) ── */}
        <Animated.View
          style={{
            opacity: contentOpacityAnim,
            transform: [{ translateY: contentSlideAnim }],
          }}
        >
          {/* ── Today's Activities ── */}
          {/*
            When isActivityActive === true  → blue border highlight (Image 2 right)
            When hasLoggedActivity === true → show pills + View Details (Image 2 left)
            Otherwise                       → "No Activity Logged" + Log button (Image 1)
          */}
          <View
            style={[
              styles.activitySection,
              isActivityActive && styles.activitySectionActive,
            ]}
          >
            <Text weight="700" style={styles.activityTitle}>
              Today's Activities
            </Text>

            {!hasLoggedActivity ? (
              /* ── State 1: nothing logged ── */
              <>
                <Text weight="500" style={styles.activityEmpty}>
                  No Activity Logged
                </Text>
                <PressableCard
                  style={[styles.logBtnWrap, styles.activityLogBtnWrap]}
                  onPress={handleLogActivity}
                >
                  <LinearGradient
                    colors={["#F3BA64", "#D87E18"]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.logBtn}
                  >
                    <Text weight="600" style={styles.logBtnText}>
                      Log Activity
                    </Text>
                  </LinearGradient>
                </PressableCard>
              </>
            ) : (
              /* ── State 2 & 3: activity logged (with or without live session) ── */
              <>
                {/* Activity pills with large icon circles */}
                <View style={styles.activityPillsRow}>
                  {ACTIVITY_PILLS.map(({ name, label }) => (
                    <View key={label} style={styles.activityPillItem}>
                      <View style={styles.activityIconCircle}>
                        <MaterialCommunityIcons
                          name={name}
                          size={28}
                          color="#E67E22"
                        />
                      </View>
                      <Text weight="600" style={styles.activityPillLabel}>
                        {label}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* View Details Button */}
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => {
                    if (typeof onNavigateLogActivity === "function") {
                      onNavigateLogActivity();
                    }
                  }}
                  style={styles.viewDetailsBtnWrap}
                >
                  <LinearGradient
                    colors={["#EFA53D", "#DD7E13"]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.viewDetailsBtn}
                  >
                    <Text weight="600" style={styles.viewDetailsBtnText}>
                      View Details
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* ── Device card ── */}
          <View style={styles.deviceCardOuter}>
            <View style={styles.deviceCardShadow}>
              <LinearGradient
                colors={["#EBF2FF", "#9CBBF2"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.deviceCard}
              >
                <View style={styles.deviceTextWrap}>
                  {/* Title */}
                  <Text weight="700" style={styles.deviceTitle}>
                    {hasLoggedActivity
                      ? "Boat Abc1 Device Connected!"
                      : "Connect Device"}
                  </Text>

                  {/* Subtitle — changes when live session is active */}
                  <Text weight="400" style={styles.deviceSub}>
                    {hasLoggedActivity
                      ? isActivityActive
                        ? "Your connected device is detecting an activity."
                        : "Your connected device detected an activity."
                      : "Log activities through devices"}
                  </Text>

                  {/*
                    Meta section:
                    - isActivityActive  → green dot + live timer + distance
                    - hasLoggedActivity → static walking stats
                    - otherwise         → nothing
                  */}
                  {hasLoggedActivity && (
                    isActivityActive ? (
                      /* ── Live timer row (Image 2 right) ── */
                      <View style={styles.deviceMetaWrap}>
                        <View style={styles.deviceLiveRow}>
                          <View style={styles.deviceLiveDot} />
                          <Text weight="700" style={styles.deviceTimerText}>
                            {formatTime(elapsedSeconds)}
                          </Text>
                        </View>
                        <Text weight="500" style={styles.deviceMetaText}>
                          walking · 2.3 km
                        </Text>
                      </View>
                    ) : (
                      /* ── Static stats (Image 2 left) ── */
                      <View style={styles.deviceMetaWrap}>
                        <Text weight="500" style={styles.deviceMetaText}>
                          Walking · Distance: 2.9 km
                        </Text>
                        <Text weight="500" style={styles.deviceMetaText}>
                          Duration: 21 min
                        </Text>
                        <Text weight="500" style={styles.deviceMetaText}>
                          Estimated Calories Burnt: 120 kcal
                        </Text>
                      </View>
                    )
                  )}

                  {/* Button: "Stop Activity" when live, else "Log Activity" */}
                  <PressableCard
                    style={styles.deviceLogBtnWrap}
                    onPress={isActivityActive ? handleStopActivity : handleLogActivity}
                  >
                    <LinearGradient
                      colors={
                        isActivityActive
                          ? ["#EF4444", "#DC2626"]
                          : ["#F3BA64", "#D87E18"]
                      }
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                      style={styles.deviceLogBtn}
                    >
                      <Text weight="600" style={styles.deviceLogBtnText}>
                        {isActivityActive ? "Stop Activity" : "Log Activity"}
                      </Text>
                    </LinearGradient>
                  </PressableCard>
                </View>

                {/* Watch image absolutely positioned */}
                <View style={styles.watchWrap} pointerEvents="none">
                  <Image
                    source={require("../../../assets/watch.webp")}
                    style={styles.watchImage}
                    resizeMode="contain"
                  />
                </View>
              </LinearGradient>
            </View>
          </View>

          {/* ── Weekly Trend ── */}
          {hasLoggedActivity && (
            <View style={styles.weeklyWrap}>
              <View style={styles.weeklyHeaderRow}>
                <Text weight="700" style={styles.weeklyTitle}>
                  Weekly Trend
                </Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {}}
                  style={{ flexDirection: "row", alignItems: "center" }}
                >
                  <Text weight="600" style={styles.weeklyLink}>
                    View Stats
                  </Text>
                  <Feather
                    name="arrow-right"
                    size={14}
                    color="#E67E22"
                    style={{ marginLeft: 4 }}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.weeklyCard}>
                {/* Floating Peach Block */}
                <View style={styles.weeklyCalorieBlock}>
                  <Text weight="600" style={styles.weeklyCalorieLabel}>
                    Calories Burned
                  </Text>
                  <View style={styles.weeklyCalorieValueRow}>
                    <Text style={styles.weeklyCalorieEmoji}>🔥</Text>
                    <Text weight="700" style={styles.weeklyCalorieValue}>
                      250 cal
                    </Text>
                  </View>
                </View>

                {/* Bar Chart Row */}
                <View style={styles.weeklyBarsRow}>
                  {WEEKLY_DATA.map((item) => (
                    <View key={item.d} style={styles.weeklyBarCol}>
                      <View
                        style={[
                          styles.weeklyBarTrack,
                          item.active && { height: 86 },
                        ]}
                      >
                        {item.active && (
                          <View style={styles.weeklyBarFireCap}>
                            <Text style={styles.weeklyBarFireEmoji}>🔥</Text>
                          </View>
                        )}
                        <View
                          style={[
                            styles.weeklyBarFill,
                            { height: item.active ? "100%" : `${item.h}%` },
                            item.active && styles.weeklyBarFillActive,
                          ]}
                        />
                      </View>
                      <Text
                        weight="600"
                        style={[
                          styles.weeklyDayLabel,
                          item.active && styles.weeklyDayLabelActive,
                        ]}
                      >
                        {item.d}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* ── Insights ── */}
          <View style={styles.insightsCardWrap}>
            <View style={styles.insightsCardClip}>
              <ImageBackground
                source={require("../../../assets/bg.webp")}
                style={styles.insightsCard}
                imageStyle={styles.insightsCardImage}
                resizeMode="cover"
              >
                <Text weight="700" style={styles.insightsTitle}>
                  Helix Wellness Insights
                </Text>
                <Text weight="500" style={styles.insightsSubtitle}>
                  {hasLoggedActivity
                    ? "You are most active between 6 PM and 8 PM.\nYour longest workouts occur on weekends.\nYour current activity supports cardiovascular health."
                    : "Insights unlock after 5 days of tracking."}
                </Text>
                <PressableCard
                  style={styles.insightsBtnWrap}
                  onPress={() => {}}
                >
                  <LinearGradient
                    colors={["#B148FF", "#F6339B", "#9914F9"]}
                    locations={[0, 0.5, 1]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.insightsBtn}
                  >
                    <Text weight="600" style={styles.insightsBtnText}>
                      {hasLoggedActivity ? "View More" : "Learn How it Works"}
                    </Text>
                  </LinearGradient>
                </PressableCard>
              </ImageBackground>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

export default React.memo(FitnessWellnessSection);

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F3EFEB" },
  scrollContent: { paddingBottom: 16 },

  /* Header */
  headerBlock: {
    paddingHorizontal: 16,
    paddingBottom: 4,
    backgroundColor: "#F3EFEB",
  },
  headerRow: { flexDirection: "row", alignItems: "center" },
  backBtn: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  titleWrap: { flex: 1 },
  headerTitle: { fontSize: 19, lineHeight: 23, color: "#5C43BF" },
  headerSubtitle: {
    marginTop: 1,
    fontSize: 12,
    lineHeight: 15,
    color: "#1A1A1A",
  },

  /* Chips */
  chipRowContainer: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 2,
    paddingBottom: 0,
    backgroundColor: "transparent",
    zIndex: 12,
    overflow: "visible",
  },
  chipRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    height: CHIP_HEIGHT + 10,
    paddingBottom: 0,
  },
  chipTouch: {
    width: CHIP_WIDTH,
    height: CHIP_HEIGHT + 10,
    marginRight: CHIP_GAP,
    justifyContent: "flex-start",
  },
  activeChipContainer: {
    width: CHIP_WIDTH,
    height: CHIP_HEIGHT + 10,
    position: "relative",
    zIndex: 10,
  },
  activeChipSurface: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  activeChipLabel: {
    position: "absolute",
    top: 8,
    left: 0,
    right: 0,
    height: CHIP_HEIGHT - 8,
    alignItems: "center",
    justifyContent: "center",
  },
  activeChipText: { fontSize: 11, color: "#FFFFFF", textAlign: "center" },
  activeFitnessText: { color: "#D87E18" },
  inactiveChip: {
    width: "100%",
    height: CHIP_HEIGHT,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  inactiveChipText: { fontSize: 11, textAlign: "center" },

  /* Hero */
  topSection: {
    marginTop: 0,
    paddingBottom: 12,
    backgroundColor: "transparent",
    position: "relative",
    overflow: "hidden",
  },
  topSectionBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroWrap: { marginTop: 0, paddingHorizontal: 20, paddingTop: 28 },
  heroCard: {
    borderRadius: 24,
    minHeight: 188,
    backgroundColor: "#F8AF41",
    paddingHorizontal: 18,
    paddingVertical: 16,
    overflow: "hidden",
    position: "relative",
  },
  heroContentLeft: { width: "56%" },
  heroTitle: { fontSize: 20, lineHeight: 26, color: "#141414" },
  heroSub: { marginTop: 4, fontSize: 18, lineHeight: 22, color: "#141414" },
  heroStatsWrap: { marginTop: 10 },
  heroStatsLabel: { fontSize: 12, lineHeight: 15, color: "#141414" },
  heroStatsRow: { flexDirection: "row", alignItems: "flex-end", marginTop: 2 },
  heroStatsValue: { fontSize: 20, lineHeight: 24, color: "#141414" },
  heroStatsOf: { fontSize: 14, lineHeight: 18, color: "#141414" },
  heroStatsUnit: { fontSize: 12, lineHeight: 16, color: "#141414" },
  heroBtnShadowOuter: {
    marginTop: 28,
    alignSelf: "flex-start",
    borderRadius: 12,
    shadowColor: "#BF7BB9",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  heroBtnWrap: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#F3E6F2",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 1,
  },
  heroBtn: {
    minWidth: 136,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  heroBtnText: { fontSize: 14, lineHeight: 16, color: "#FFFFFF" },
  runnerIconWrap: { position: "absolute", top: 10, right: 34 },
  runnerCharacter: { width: 86, height: 114 },
  sunTrackClip: {
    position: "absolute",
    right: -11,
    bottom: -10,
    width: 208,
    height: 96,
    overflow: "hidden",
  },
  sunBurstWrap: {
    position: "absolute",
    left: 0,
    bottom: -104,
    width: 208,
    height: 208,
    alignItems: "center",
    justifyContent: "center",
  },
  sunRay: {
    position: "absolute",
    width: 4,
    height: 36,
    borderRadius: 2,
    backgroundColor: "#F9E3BA",
    top: "50%",
    left: "50%",
    marginLeft: -2,
    marginTop: -18,
  },
  sunBurstOuter: {
    width: 118,
    height: 118,
    borderRadius: 59,
    borderWidth: 3,
    borderColor: "#F9E3BA",
    backgroundColor: "#F8AF41",
  },
  sunBurstInner: {
    position: "absolute",
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 2,
    borderColor: "#F9E3BA",
    borderStyle: "dashed",
  },

  /* Action cards */
  actionsRow: {
    marginTop: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  actionItemSpacing: { marginRight: 8 },
  logActionWrap: {
    flex: 1,
    borderRadius: 10,
    shadowColor: "#BF7BB9",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  logActionShadowLayer: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: "transparent",
    shadowColor: "#F3E6F2",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 1,
  },
  actionCard: {
    flex: 1,
    height: 64,
    borderRadius: 10,
    backgroundColor: "#F3F2FB",
    borderWidth: 1,
    borderColor: "#E6E7F0",
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  logActionCard: {
    backgroundColor: "transparent",
    borderColor: "#FFFFFF",
    overflow: "hidden",
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  logActionGradient: {
    flex: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  actionIcon: { marginBottom: 2 },
  actionTitle: { fontSize: 13, lineHeight: 17 },
  actionSub: { fontSize: 9, lineHeight: 12, color: "#6B7280" },

  /* ── Today's Activities ── */
  activitySection: {
    marginTop: 14,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  // ── NEW: blue border when live session is active (Image 2 right) ──
  activitySectionActive: {
    borderWidth: 2,
    borderColor: "#3B82F6",
    borderRadius: 12,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    paddingBottom: 12,
  },
  activityTitle: {
    width: "100%",
    textAlign: "left",
    fontSize: 19,
    lineHeight: 22,
    color: "#1F2937",
  },
  activityEmpty: { marginTop: 14, fontSize: 13, color: "#1F2937" },
  activityPillsRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  activityPillItem: { alignItems: "center", justifyContent: "center", flex: 1 },
  activityIconCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: "#EDEAF8",
    alignItems: "center",
    justifyContent: "center",
  },
  activityPillLabel: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 16,
    color: "#1F2937",
  },

  /* View Details button */
  viewDetailsBtnWrap: {
    marginTop: 20,
    borderRadius: 20,
    overflow: "hidden",
    alignSelf: "center",
    shadowColor: "#D87E18",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  viewDetailsBtn: {
    height: 34,
    minWidth: 124,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  viewDetailsBtnText: { fontSize: 13, color: "#FFFFFF" },

  /* Log activity button (empty state) */
  logBtnWrap: { marginTop: 20, borderRadius: 20, overflow: "hidden" },
  activityLogBtnWrap: { alignSelf: "center" },
  logBtn: {
    height: 34,
    minWidth: 124,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  logBtnText: { fontSize: 13, color: "#FFFFFF" },

  /* ── Device card ── */
  deviceCardOuter: {
    marginTop: 16,
    paddingVertical: 4,
    alignItems: "center",
  },
  deviceCardShadow: {
    width: DEVICE_CARD_WIDTH,
    borderRadius: DEVICE_CARD_BORDER_RADIUS,
    shadowColor: "#7BA7D8",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 4,
  },
  deviceCard: {
    width: DEVICE_CARD_WIDTH,
    height: DEVICE_CARD_HEIGHT,
    borderRadius: DEVICE_CARD_BORDER_RADIUS,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    paddingLeft: 12,
    paddingRight: 0,
    paddingVertical: 8,
  },
  deviceTextWrap: {
    flex: 1,
    justifyContent: "center",
    paddingRight: 72,
  },
  deviceTitle: {
    fontSize: 12,
    lineHeight: 15,
    color: "#111827",
    fontWeight: "700",
  },
  deviceSub: {
    marginTop: 1,
    fontSize: 9,
    lineHeight: 12,
    color: "#111827",
  },
  deviceMetaWrap: {
    marginTop: 3,
    marginBottom: 2,
  },
  deviceMetaText: {
    fontSize: 8.5,
    lineHeight: 11,
    color: "#111827",
  },
  // ── NEW: live timer row styles ──
  deviceLiveRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  deviceLiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22C55E",
    marginRight: 5,
  },
  deviceTimerText: {
    fontSize: 13,
    lineHeight: 16,
    color: "#111827",
    fontWeight: "700",
  },
  deviceLogBtnWrap: {
    marginTop: 4,
    borderRadius: 4,
    overflow: "hidden",
    alignSelf: "flex-start",
  },
  deviceLogBtn: {
    minWidth: 70,
    height: 18,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  deviceLogBtnText: {
    fontSize: 8,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  watchWrap: {
    position: "absolute",
    right: 0,
    top: -1.5,
    width: WATCH_WIDTH + 4,
    height: WATCH_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  watchImage: {
    width: WATCH_WIDTH,
    height: WATCH_HEIGHT,
  },

  /* ── Weekly Trend ── */
  weeklyWrap: {
    marginTop: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  weeklyHeaderRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  weeklyTitle: { fontSize: 18, lineHeight: 22, color: "#1F2937" },
  weeklyLink: { fontSize: 13, lineHeight: 16, color: "#E67E22" },
  weeklyCard: {
    width: WEEKLY_CARD_WIDTH,
    height: WEEKLY_CARD_HEIGHT,
    position: "relative",
    backgroundColor: "transparent",
  },
  weeklyCalorieBlock: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "#FCEECA",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    zIndex: 10,
  },
  weeklyCalorieLabel: {
    fontSize: 10,
    lineHeight: 14,
    color: "#000000",
    marginBottom: 2,
    fontWeight: "600",
  },
  weeklyCalorieValueRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  weeklyCalorieEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  weeklyCalorieValue: {
    fontSize: 16,
    lineHeight: 20,
    color: "#000000",
    fontWeight: "700",
  },
  weeklyBarsRow: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  weeklyBarCol: {
    alignItems: "center",
    width: 30,
  },
  weeklyBarTrack: {
    width: 8,
    height: 70,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  weeklyBarFireCap: {
    position: "absolute",
    top: -14,
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: "#252438",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#F3EFEB",
    zIndex: 2,
  },
  weeklyBarFireEmoji: { fontSize: 12 },
  weeklyBarFill: {
    width: "100%",
    borderRadius: 4,
    backgroundColor: "#C8C9CE",
  },
  weeklyBarFillActive: {
    backgroundColor: "#252438",
  },
  weeklyDayLabel: {
    marginTop: 8,
    fontSize: 10,
    lineHeight: 13,
    color: "#000000",
  },
  weeklyDayLabelActive: { color: "#1F2937", fontWeight: "700" },

  /* ── Insights ── */
  insightsCardWrap: {
    width: SCREEN_WIDTH - 32,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#BF7BB9",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
  },
  insightsCardClip: { borderRadius: 10, overflow: "hidden" },
  insightsCard: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 22,
  },
  insightsCardImage: { borderRadius: 10, opacity: 0.65 },
  insightsTitle: {
    fontSize: 18,
    lineHeight: 24,
    color: "#111111",
    textAlign: "center",
  },
  insightsSubtitle: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  insightsBtnWrap: { marginTop: 10, borderRadius: 8, overflow: "hidden" },
  insightsBtn: {
    minHeight: 36,
    minWidth: 152,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  insightsBtnText: { fontSize: 13, color: "#FFFFFF", textAlign: "center" },
});