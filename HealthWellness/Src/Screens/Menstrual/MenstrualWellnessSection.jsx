import React, { useMemo, useRef, useState, useEffect } from "react";
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
  Animated,
  Modal,
  Pressable,
  PanResponder,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Svg, {
  Path,
  Circle,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from "react-native-svg";
import { Text } from "../../../components/TextWrapper";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const HORIZONTAL_PADDING = 10;
const CHIP_GAP = 6;
const TOTAL_GAPS_WIDTH = CHIP_GAP * 5;
const AVAILABLE_WIDTH =
  SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - TOTAL_GAPS_WIDTH;
const CHIP_WIDTH = Math.floor(AVAILABLE_WIDTH / 6);
const CHIP_ITEM_WIDTH = CHIP_WIDTH + CHIP_GAP;
const CHIP_HEIGHT = 36;

const CATEGORIES = [
  { label: "All", color: "#CD8CFF" },
  { label: "Sleep", color: "#5B3DBA" },
  { label: "Nutrition", color: "#16A34A" },
  { label: "Fitness", color: "#EA580C" },
  { label: "Medicine", color: "#1D4ED8" },
  { label: "Menstrual", color: "#DB2777" },
];

const WEEK_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

// ─── Phase Meta & Helpers ───
const PHASE_META = {
  period: {
    label: "Menstruation",
    icon: "water",
    color: "#FF4D8D",
    softColor: "#FFE4ED",
    gradient: ["#FF8FB1", "#FF4D8D"],
  },
  fertile: {
    label: "Fertile Window",
    icon: "leaf",
    color: "#7C3AED",
    softColor: "#EDE9FE",
    gradient: ["#A78BFA", "#7C3AED"],
  },
  ovulation: {
    label: "Ovulation",
    icon: "star-four-points",
    color: "#9333EA",
    softColor: "#DDD6FE",
    gradient: ["#C084FC", "#9333EA"],
  },
  pms: {
    label: "PMS Zone",
    icon: "weather-cloudy",
    color: "#D97706",
    softColor: "#FEF3C7",
    gradient: ["#FBBF24", "#D97706"],
  },
  safe: {
    label: "Safe Period",
    icon: "shield-check",
    color: "#059669",
    softColor: "#D1FAE5",
    gradient: ["#34D399", "#059669"],
  },
};

const normalizeDate = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());
const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};
const diffInDays = (dateA, dateB) =>
  Math.round(
    (normalizeDate(dateA).getTime() - normalizeDate(dateB).getTime()) /
      86400000,
  );

const getSafeStartDate = (details) => {
  if (!details) return new Date(2025, 8, 1);
  const day = Number(details.day),
    month = Number(details.month),
    year = Number(details.year);
  if (!day || !month || !year) return new Date(2025, 8, 1);
  const candidate = new Date(year, month - 1, day);
  if (Number.isNaN(candidate.getTime()) || candidate.getDate() !== day)
    return new Date(2025, 8, 1);
  return candidate;
};

const getPhase = (cycleDay, cycleLength, periodDuration) => {
  const ovulationDay = Math.round(cycleLength - 14);
  const fertileStart = ovulationDay - 5;
  const fertileEnd = ovulationDay + 1;
  const pmsStart = cycleLength - 3;
  if (cycleDay >= 1 && cycleDay <= periodDuration) return "period";
  if (cycleDay >= pmsStart) return "pms";
  if (cycleDay === ovulationDay) return "ovulation";
  if (cycleDay >= fertileStart && cycleDay <= fertileEnd) return "fertile";
  return "safe";
};

const buildGrid = (
  year,
  month,
  currentCycleStart,
  cycleLength,
  periodDuration,
) => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  const cells = [];

  const pushCell = (day, isCurrentMonth, date) => {
    const diff = diffInDays(date, currentCycleStart);
    const cycleDay = (((diff % cycleLength) + cycleLength) % cycleLength) + 1;
    cells.push({
      day,
      isCurrentMonth,
      date,
      cycleDay,
      phase: getPhase(cycleDay, cycleLength, periodDuration),
    });
  };

  for (let i = firstDay - 1; i >= 0; i--)
    pushCell(
      prevMonthDays - i,
      false,
      new Date(year, month - 1, prevMonthDays - i),
    );
  for (let d = 1; d <= daysInMonth; d++)
    pushCell(d, true, new Date(year, month, d));

  let nd = 1;
  while (cells.length % 7 !== 0) {
    pushCell(nd, false, new Date(year, month + 1, nd));
    nd++;
  }

  const rows = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return rows;
};

const getPeriodState = (details) => {
  const startDate = getSafeStartDate(details);
  const cycleLength = Math.max(
    21,
    Math.round(Number(details?.cycleLength) || 28),
  );
  const periodWindow = Math.max(
    1,
    Math.round(Number(details?.periodDuration) || 5),
  );
  const today = normalizeDate(new Date());
  const daysFromStart = diffInDays(today, startDate);

  if (daysFromStart < 0) {
    return {
      type: "days-left",
      headline: `${-daysFromStart} days left`,
      statusColor: "#FF4E67",
      nextCycleStart: startDate,
      currentCycleStart: addDays(startDate, -cycleLength),
      cycleLength,
    };
  }
  const cyclesElapsed = Math.floor(daysFromStart / cycleLength);
  const currentCycleStart = addDays(startDate, cyclesElapsed * cycleLength);
  const nextCycleStart = addDays(currentCycleStart, cycleLength);
  const daysIntoCurrentCycle = diffInDays(today, currentCycleStart);

  if (daysIntoCurrentCycle >= 0 && daysIntoCurrentCycle < periodWindow) {
    return {
      type: "period-day",
      headline: `Day ${daysIntoCurrentCycle + 1}`,
      statusColor: "#FF5C6A",
      nextCycleStart,
      currentCycleStart,
      cycleLength,
    };
  }
  const daysUntilNext = diffInDays(nextCycleStart, today);
  if (daysUntilNext > 0) {
    return {
      type: "days-left",
      headline: `${daysUntilNext} days left`,
      statusColor: "#FF4E67",
      nextCycleStart,
      currentCycleStart,
      cycleLength,
    };
  }
  return {
    type: "days-late",
    headline: `${Math.abs(daysUntilNext)} days Late`,
    statusColor: "#FF5A6A",
    nextCycleStart,
    currentCycleStart,
    cycleLength,
  };
};

const formatDayMonth = (date) =>
  date.toLocaleDateString("en-GB", { day: "numeric", month: "long" });
const formatHeaderDate = (date) =>
  `Today, ${date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`;

const getDynamicInsights = (phase) => {
  switch (phase) {
    case "period":
      return "Energy is lower. Focus on light stretches, hydration, and restorative sleep.";
    case "fertile":
      return "Estrogen is rising! Higher energy makes this a great time for challenging workouts.";
    case "ovulation":
      return "Peak fertility and energy levels. You're likely feeling communicative and vibrant.";
    case "pms":
      return "Progesterone peaks then drops. Gentle walks and self-care are ideal right now.";
    default:
      return "Hormones are stabilizing. A balanced week for maintaining routines.";
  }
};

// ─── Sub-components ───
const ActiveChip = ({ label, color }) => {
  const isMenstrual = label === "Menstrual";
  return (
    <View style={styles.activeChipContainer}>
      {isMenstrual ? (
        <LinearGradient
          colors={["#F6CCF7", "#FFCFF5"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.activeChipSurface}
        />
      ) : (
        <View style={[styles.activeChipSurface, { backgroundColor: color }]} />
      )}
      <View style={styles.activeChipLabel}>
        <Text
          weight="600"
          style={[
            styles.activeChipText,
            isMenstrual && styles.activeMenstrualText,
          ]}
        >
          {label}
        </Text>
      </View>
    </View>
  );
};

const ActionCard = ({
  icon,
  title,
  subtitle,
  titleColor,
  subtitleColor,
  gradientColors,
  cardStyle,
  onPress,
}) => (
  <TouchableOpacity
    activeOpacity={0.85}
    style={[styles.actionCard, cardStyle]}
    onPress={onPress}
  >
    {Array.isArray(gradientColors) && gradientColors.length > 0 && (
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.actionCardGradient}
        pointerEvents="none"
      />
    )}
    <View style={styles.actionIcon}>{icon}</View>
    <Text weight="700" style={[styles.actionTitle, { color: titleColor }]}>
      {title}
    </Text>
    <Text
      weight="500"
      style={[styles.actionSubtitle, { color: subtitleColor }]}
    >
      {subtitle}
    </Text>
  </TouchableOpacity>
);

const LegendChip = ({ phase }) => {
  const meta = PHASE_META[phase];
  const isSolid = phase === "period" || phase === "ovulation";
  const isDashed = phase === "fertile" || phase === "pms";
  return (
    <View style={chipStyles.chip}>
      {isSolid ? (
        <LinearGradient
          colors={meta.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={chipStyles.swatch}
        />
      ) : isDashed ? (
        <View
          style={[
            chipStyles.swatch,
            chipStyles.swatchDashed,
            { borderColor: meta.color, backgroundColor: meta.softColor },
          ]}
        />
      ) : (
        <View
          style={[
            chipStyles.swatch,
            {
              backgroundColor: meta.softColor,
              borderWidth: 1,
              borderColor: meta.color,
            },
          ]}
        />
      )}
      <Text weight="600" style={chipStyles.label}>
        {meta.label}
      </Text>
    </View>
  );
};

const DayCell = ({ cell, isToday, isSelected, onPress }) => {
  if (!cell.isCurrentMonth) {
    return (
      <View style={cellStyles.cell}>
        <Text weight="400" style={cellStyles.dimDay}>
          {cell.day}
        </Text>
      </View>
    );
  }
  const meta = PHASE_META[cell.phase];
  const isSolid = cell.phase === "period" || cell.phase === "ovulation";
  const isDashed = cell.phase === "fertile" || cell.phase === "pms";

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={() => onPress && onPress(cell)}
      style={cellStyles.cell}
    >
      {isSelected && (
        <View style={[cellStyles.selectionHalo, { borderColor: meta.color }]} />
      )}

      {isSolid ? (
        <LinearGradient
          colors={meta.gradient}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={[cellStyles.circle, isToday && cellStyles.todayBorder]}
        >
          <Text weight="700" style={cellStyles.daySolid}>
            {cell.day}
          </Text>
        </LinearGradient>
      ) : isDashed ? (
        <View
          style={[
            cellStyles.circle,
            cellStyles.dashedCircle,
            { borderColor: meta.color, backgroundColor: meta.softColor },
            isToday && cellStyles.todayBorderThick,
          ]}
        >
          <Text
            weight={isToday ? "700" : "600"}
            style={[cellStyles.day, { color: meta.color }]}
          >
            {cell.day}
          </Text>
        </View>
      ) : (
        <View
          style={[
            cellStyles.circle,
            { backgroundColor: "rgba(255,255,255,0.65)" },
            isToday && cellStyles.todayBorder,
          ]}
        >
          <Text
            weight={isToday ? "700" : "600"}
            style={[cellStyles.day, { color: isToday ? "#5A3FB8" : "#3A3A3A" }]}
          >
            {cell.day}
          </Text>
        </View>
      )}
      {isToday && (
        <View style={cellStyles.todayDot}>
          <View style={cellStyles.todayDotInner} />
        </View>
      )}
    </TouchableOpacity>
  );
};

// ─── Main Screen Component ───
export default function MenstrualWellnessSection({
  onBack,
  onNavigateAll,
  onNavigateSleep,
  onNavigateNutrition,
  onNavigateFitness,
  onNavigateMedicine,
  onNavigateStatistics,
  onNavigateMenstrualDetails,
  onNavigateMenstrualCalendar,
  hideHeader = false,
  menstrualDetails,
  onSaveDetails,
}) {
  const CURRENT_CATEGORY = "Menstrual";
  const topOffset =
    Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 10 : 18;
  const [active, setActive] = useState("Menstrual");
  const flatListRef = useRef(null);

  const contentOpacityAnim = useRef(new Animated.Value(0)).current;
  const contentSlideAnim = useRef(new Animated.Value(30)).current;

  const [localDetails, setLocalDetails] = useState(menstrualDetails);
  useEffect(() => {
    setLocalDetails(menstrualDetails);
  }, [menstrualDetails]);

  useEffect(() => {
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
  }, [active]);

  const periodState = useMemo(
    () => getPeriodState(localDetails),
    [localDetails],
  );
  const periodDuration = Math.max(
    1,
    Math.round(Number(localDetails?.periodDuration) || 5),
  );
  const today = normalizeDate(new Date());

  const hasSavedDetails = useMemo(() => {
    const day = Number(localDetails?.day),
      month = Number(localDetails?.month),
      year = Number(localDetails?.year);
    if (!day || !month || !year) return false;
    const candidate = new Date(year, month - 1, day);
    return !Number.isNaN(candidate.getTime()) && candidate.getDate() === day;
  }, [localDetails]);

  const todayDiff = diffInDays(today, periodState.currentCycleStart);
  const todayCycleDay =
    (((todayDiff % periodState.cycleLength) + periodState.cycleLength) %
      periodState.cycleLength) +
    1;
  const currentPhase = getPhase(
    todayCycleDay,
    periodState.cycleLength,
    periodDuration,
  );

  // ─── Dynamic Cycle Bars History Generation ───
  const cycleBars = useMemo(() => {
    if (!hasSavedDetails) return [];
    const history = [];
    for (let i = 5; i >= 0; i--) {
      const start = addDays(
        periodState.currentCycleStart,
        -(i * periodState.cycleLength),
      );
      const end = addDays(start, periodState.cycleLength - 1);
      const startStr = start.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      });
      const endStr = end.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      });

      const totalDays = periodState.cycleLength;
      const elapsedDays = i === 0 ? Math.max(1, diffInDays(today, start) + 1) : totalDays;

      history.push({
        id: `cycle-${i}`,
        label: i === 0 ? `${startStr} - Now` : `${startStr} - ${endStr}`,
        days: totalDays,
        elapsedDays: Math.min(elapsedDays, totalDays),
        active: i === 0,
      });
    }
    return history;
  }, [hasSavedDetails, periodState.currentCycleStart, periodState.cycleLength]);

  // ─── Interactive Draggable Modal State ───
  const [showEditModal, setShowEditModal] = useState(false);
  const [isModalRendered, setIsModalRendered] = useState(false);
  const modalY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const [draftStartDate, setDraftStartDate] = useState(
    () => periodState.currentCycleStart,
  );
  const [editCalendarMonth, setEditCalendarMonth] = useState(
    () => periodState.currentCycleStart,
  );

  useEffect(() => {
    if (showEditModal) {
      setIsModalRendered(true);
      Animated.parallel([
        Animated.spring(modalY, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 0,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (isModalRendered) {
      Animated.parallel([
        Animated.timing(modalY, {
          toValue: SCREEN_HEIGHT,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => setIsModalRendered(false));
    }
  }, [showEditModal]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          modalY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100 || gestureState.vy > 0.8) {
          setShowEditModal(false);
        } else {
          Animated.spring(modalY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 0,
          }).start();
        }
      },
    }),
  ).current;

  const handleOpenEdit = () => {
    setDraftStartDate(periodState.currentCycleStart);
    setEditCalendarMonth(periodState.currentCycleStart);
    setShowEditModal(true);
  };

  const handleSaveDraft = () => {
    const updatedDetails = {
      ...localDetails,
      day: draftStartDate.getDate(),
      month: draftStartDate.getMonth() + 1,
      year: draftStartDate.getFullYear(),
    };
    setLocalDetails(updatedDetails);
    setShowEditModal(false);
    if (typeof onSaveDetails === "function") onSaveDetails(updatedDetails);
  };

  const editCalendarRows = useMemo(
    () =>
      buildGrid(
        editCalendarMonth.getFullYear(),
        editCalendarMonth.getMonth(),
        draftStartDate,
        periodState.cycleLength,
        periodDuration,
      ),
    [
      editCalendarMonth,
      draftStartDate,
      periodState.cycleLength,
      periodDuration,
    ],
  );

  const handleChipPress = (label, index) => {
    flatListRef.current?.scrollToIndex({
      index,
      animated: false,
      viewPosition: 0.5,
    });
    setActive(label);
    if (label !== CURRENT_CATEGORY) {
      if (label === "All" && onNavigateAll) onNavigateAll();
      if (label === "Sleep" && onNavigateSleep) onNavigateSleep();
      if (label === "Nutrition" && onNavigateNutrition) onNavigateNutrition();
      if (label === "Fitness" && onNavigateFitness) onNavigateFitness();
      if (label === "Medicine" && onNavigateMedicine) onNavigateMedicine();
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
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

        <View style={styles.chipRowContainer}>
          <FlatList
            ref={flatListRef}
            horizontal
            data={CATEGORIES}
            keyExtractor={(item) => item.label}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => handleChipPress(item.label, index)}
                style={[
                  styles.chipTouch,
                  index === CATEGORIES.length - 1 && { marginRight: 0 },
                ]}
              >
                {active === item.label ? (
                  <ActiveChip label={item.label} color={item.color} />
                ) : (
                  <View
                    style={[styles.inactiveChip, { borderColor: item.color }]}
                  >
                    <Text
                      weight="500"
                      style={[styles.inactiveChipText, { color: item.color }]}
                    >
                      {item.label}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
            getItemLayout={(_, index) => ({
              length: CHIP_ITEM_WIDTH,
              offset: CHIP_ITEM_WIDTH * index,
              index,
            })}
            showsHorizontalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={styles.chipRow}
          />
        </View>

        <View
          style={[
            styles.topSection,
            !hasSavedDetails && styles.topSectionEmpty,
          ]}
        >
          <Image
            source={require("../../../assets/menstrualdetbg.webp")}
            style={styles.topLayerFrontImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["rgba(246, 204, 247, 0.58)", "rgba(255, 207, 245, 0.58)"]}
            style={StyleSheet.absoluteFill}
          />
          <LinearGradient
            colors={["rgba(243, 239, 235, 0)", "rgba(243, 239, 235, 0.75)"]}
            locations={[0.6, 1]}
            style={StyleSheet.absoluteFill}
          />

          <Animated.View
            style={{
              opacity: contentOpacityAnim,
              transform: [{ translateY: contentSlideAnim }],
            }}
          >
            {!hasSavedDetails ? (
              <View style={styles.emptyPeriodCard}>
                <View style={styles.emptyPhoneBlock}>
                  <Image
                    source={require("../../../assets/menstrualphone.webp")}
                    style={styles.emptyPhoneImage}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.emptyPeriodTextWrap}>
                  <Text weight="700" style={styles.emptyGreetText}>
                    Hi Sakshi!
                  </Text>
                  <Text weight="600" style={styles.emptyPeriodPrompt}>
                    Add Your Period Details
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.emptyAddBtnWrap}
                    onPress={onNavigateMenstrualDetails}
                  >
                    <LinearGradient
                      colors={["#B148FF", "#F6339B", "#9914F9"]}
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                      style={styles.emptyAddBtn}
                    >
                      <Text weight="600" style={styles.emptyAddBtnText}>
                        Add Details
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.periodDetailsWrap}>
                <Text weight="700" style={styles.greetText}>
                  Hi Sakshi!
                </Text>
                <Text weight="600" style={styles.periodPrompt}>
                  Your Period Details
                </Text>

                <View style={styles.centerBadgeWrap}>
                  <Svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 200 230"
                    style={styles.centerBadgeSvg}
                  >
                    <Path
                      d="M100 10 L170 45 Q190 55 190 75 L190 155 Q190 175 170 185 L110 215 Q100 220 90 215 L30 185 Q10 175 10 155 L10 75 Q10 55 30 45 Z"
                      fill="#FDE4EA"
                    />
                    <Path
                      d="M100 10 L170 45 Q190 55 190 75 L190 155 Q190 175 170 185 L110 215 Q100 220 100 220"
                      fill="none"
                      stroke="#F47A9A"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <Circle
                      cx="100"
                      cy="220"
                      r="5"
                      fill="#FFFFFF"
                      stroke="#F47A9A"
                      strokeWidth="3"
                    />
                  </Svg>
                  <View style={styles.centerBadgeContent}>
                    <Text weight="600" style={styles.centerBadgeDate}>
                      {formatHeaderDate(today)}
                    </Text>
                    <Text weight="600" style={styles.centerBadgePeriodLabel}>
                      Period
                    </Text>
                    <Text
                      weight="700"
                      adjustsFontSizeToFit
                      numberOfLines={1}
                      style={[
                        styles.centerBadgeHeadline,
                        { color: periodState.statusColor },
                      ]}
                    >
                      {periodState.headline}
                    </Text>
                  </View>
                </View>

                <View style={styles.dateSummaryCard}>
                  <View style={styles.dropIconWrap}>
                    <View style={styles.dropShadow} />
                    <Svg width="18" height="22" viewBox="0 0 20 24">
                      <Defs>
                        <SvgLinearGradient
                          id="dropGrad"
                          x1="1"
                          y1="1"
                          x2="0"
                          y2="0"
                        >
                          <Stop offset="0.0129" stopColor="#9684A5" />
                          <Stop offset="1" stopColor="#3F4476" />
                        </SvgLinearGradient>
                      </Defs>
                      <Path
                        d="M10 2 C10 2 2 11 2 16 A 8 8 0 0 0 18 16 C 18 11 10 2 10 2 Z"
                        fill="none"
                        stroke="url(#dropGrad)"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Svg>
                  </View>
                  <View style={styles.cardTopRow}>
                    <View style={styles.cardTopLeft} />
                    <Svg width={76} height={30} viewBox="0 0 76 30">
                      <Path
                        d="M 0,0 C 15,0 22,26 38,26 C 54,26 61,0 76,0 L 76,30 L 0,30 Z"
                        fill="#5240BE"
                      />
                    </Svg>
                    <View style={styles.cardTopRight} />
                  </View>
                  <View style={styles.cardBody}>
                    <View style={styles.dateSummaryItem}>
                      <Text weight="700" style={styles.dateSummaryDate}>
                        {formatDayMonth(periodState.currentCycleStart)}
                      </Text>
                      <Text weight="500" style={styles.dateSummaryMeta}>
                        Last period date
                      </Text>
                    </View>
                    <View style={styles.dateSummaryDivider} />
                    <View style={styles.dateSummaryItem}>
                      <Text weight="700" style={styles.dateSummaryDate}>
                        {formatDayMonth(periodState.nextCycleStart)}
                      </Text>
                      <Text weight="500" style={styles.dateSummaryMeta}>
                        Next period date
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.actionRow}>
                  <ActionCard
                    icon={
                      <MaterialCommunityIcons
                        name="square-edit-outline"
                        size={20}
                        color="#EC5669"
                      />
                    }
                    title="Edit Details"
                    subtitle="Update your Period info"
                    titleColor="#EC5669"
                    subtitleColor="#E4767C"
                    gradientColors={["#FFFFFF", "#FCE6E7"]}
                    cardStyle={styles.editDetailsActionCard}
                    onPress={handleOpenEdit}
                  />
                  <ActionCard
                    icon={
                      <MaterialCommunityIcons
                        name="calendar-check-outline"
                        size={20}
                        color="#5340C4"
                      />
                    }
                    title="Calender"
                    subtitle="View your monthly cycle"
                    titleColor="#5340C4"
                    subtitleColor="#746AB8"
                    gradientColors={["#FFFFFF", "#EED6FD"]}
                    cardStyle={styles.calendarActionCard}
                    onPress={onNavigateMenstrualCalendar}
                  />
                  <ActionCard
                    icon={
                      <Ionicons
                        name="bar-chart-outline"
                        size={20}
                        color="#CF2C8B"
                      />
                    }
                    title="View Statistics"
                    subtitle="Track Patterns and Trends"
                    titleColor="#CF2C8B"
                    subtitleColor="#CE5D99"
                    gradientColors={["#FFFFFF", "#FDE7F1"]}
                    cardStyle={styles.statisticsActionCard}
                    onPress={onNavigateStatistics}
                  />
                </View>
              </View>
            )}
          </Animated.View>
        </View>

        <Animated.View
          style={{
            opacity: contentOpacityAnim,
            transform: [{ translateY: contentSlideAnim }],
          }}
        >
          {/* ─── CYCLE LENGTH SECTION ─── */}
          {hasSavedDetails && (
            <View style={styles.cycleCard}>
              <View style={styles.cycleTitleRow}>
                <TouchableOpacity activeOpacity={0.8}>
                  <Ionicons name="chevron-back" size={18} color="#000" />
                </TouchableOpacity>
                <Text weight="700" style={styles.cycleTitle}>
                  Cycle Length
                </Text>
                <TouchableOpacity activeOpacity={0.8}>
                  <Ionicons name="chevron-forward" size={18} color="#000" />
                </TouchableOpacity>
              </View>

              <View style={styles.rowsContainer}>
                {cycleBars.map((item) => {
                  const trackWidthPercent = Math.min(
                    85,
                    Math.max(45, (item.days / 40) * 85),
                  );
                  const fillWidthPercent =
                    (item.elapsedDays / item.days) * 100;

                  return (
                    <View key={item.id} style={styles.row}>
                      <View
                        style={[
                          styles.trackBounds,
                          { width: `${trackWidthPercent}%` },
                          item.active && styles.activeDashedBounds,
                        ]}
                      >
                        <LinearGradient
                          colors={
                            item.active
                              ? ["#FBA3B5", "#F462A4"]
                              : ["#F6D4D3", "#F6D4D3"]
                          }
                          start={{ x: 0, y: 0.5 }}
                          end={{ x: 1, y: 0.5 }}
                          style={[
                            styles.filledBar,
                            { width: `${fillWidthPercent}%` },
                          ]}
                        >
                          <Text
                            weight={item.active ? "800" : "600"}
                            numberOfLines={1}
                            adjustsFontSizeToFit
                            style={styles.barText}
                          >
                            {item.label}
                          </Text>
                          <View
                            style={[
                              styles.barKnob,
                              item.active && styles.barKnobActive,
                            ]}
                          />
                        </LinearGradient>
                      </View>
                      <View style={styles.daysCol}>
                        <Text weight="800" style={styles.daysValue}>
                          {item.days}
                        </Text>
                        <Text weight="600" style={styles.daysLabel}>
                          Days
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          <View style={styles.insightsCardWrap}>
            <LinearGradient
              colors={["#F6EEFA", "#E4D8F3"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.insightsCard}
            >
              <Text weight="700" style={styles.insightsTitle}>
                Helix Wellness Insights
              </Text>
              <Text weight="500" style={styles.insightsParagraph}>
                {getDynamicInsights(currentPhase)}
              </Text>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.insightsBtnWrap}
              >
                <LinearGradient
                  colors={["#B148FF", "#F6339B", "#9914F9"]}
                  locations={[0, 0.5, 1]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.insightsBtn}
                >
                  <Text weight="600" style={styles.insightsBtnText}>
                    View More
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </Animated.View>
      </ScrollView>

      {/* ─── INTERACTIVE DRAGGABLE EDIT DETAILS MODAL ─── */}
      {isModalRendered && (
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          <Animated.View
            style={[styles.modalBackdrop, { opacity: backdropOpacity }]}
          >
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              onPress={() => setShowEditModal(false)}
              activeOpacity={1}
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.bottomSheet,
              { transform: [{ translateY: modalY }] },
            ]}
          >
            <View {...panResponder.panHandlers} style={styles.dragHandleArea}>
              <View style={styles.dragHandle} />
            </View>

            <ScrollView
              style={{ flexGrow: 1 }}
              contentContainerStyle={{
                paddingBottom: Platform.OS === "ios" ? 40 : 20,
              }}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              <View style={styles.sheetHeader}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() =>
                    setEditCalendarMonth(
                      new Date(
                        editCalendarMonth.getFullYear(),
                        editCalendarMonth.getMonth() - 1,
                        1,
                      ),
                    )
                  }
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
                </TouchableOpacity>
                <View style={styles.sheetMonthWrap}>
                  <MaterialCommunityIcons
                    name="calendar-month-outline"
                    size={20}
                    color="#1A1A1A"
                  />
                  <Text weight="700" style={styles.sheetMonthText}>
                    {editCalendarMonth.toLocaleDateString("en-GB", {
                      month: "long",
                      year: "numeric",
                    })}
                  </Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() =>
                    setEditCalendarMonth(
                      new Date(
                        editCalendarMonth.getFullYear(),
                        editCalendarMonth.getMonth() + 1,
                        1,
                      ),
                    )
                  }
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="chevron-forward" size={24} color="#1A1A1A" />
                </TouchableOpacity>
              </View>

              <View style={styles.weekLabelContainer}>
                {WEEK_LABELS.map((item, index) => (
                  <Text
                    key={`week-${item}-${index}`}
                    weight="600"
                    style={styles.weekLabel}
                  >
                    {item}
                  </Text>
                ))}
              </View>

              <View style={styles.calendarGrid}>
                {editCalendarRows.map((row, rowIdx) => (
                  <View key={`week-${rowIdx}`} style={styles.calendarRow}>
                    {row.map((cell, cellIdx) => {
                      const isCellToday =
                        cell.isCurrentMonth &&
                        today.getFullYear() ===
                          editCalendarMonth.getFullYear() &&
                        today.getMonth() === editCalendarMonth.getMonth() &&
                        cell.day === today.getDate();
                      const isSelectedDate =
                        cell.isCurrentMonth &&
                        draftStartDate.getFullYear() ===
                          editCalendarMonth.getFullYear() &&
                        draftStartDate.getMonth() ===
                          editCalendarMonth.getMonth() &&
                        cell.day === draftStartDate.getDate();

                      return (
                        <DayCell
                          key={cellIdx}
                          cell={cell}
                          isToday={isCellToday}
                          isSelected={isSelectedDate}
                          onPress={(pressedCell) =>
                            setDraftStartDate(pressedCell.date)
                          }
                        />
                      );
                    })}
                  </View>
                ))}
              </View>

              <View style={styles.legendSection}>
                <View style={styles.legendChips}>
                  {["period", "fertile", "ovulation", "pms", "safe"].map(
                    (phase) => (
                      <LegendChip key={phase} phase={phase} />
                    ),
                  )}
                </View>
              </View>

              <View style={styles.sheetFooter}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleSaveDraft}
                >
                  <LinearGradient
                    colors={["#B148FF", "#F6339B", "#9914F9"]}
                    locations={[0, 0.5, 1]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.confirmBtn}
                  >
                    <Text weight="700" style={styles.confirmBtnText}>
                      Save New Start Date
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Animated.View>
        </View>
      )}
    </View>
  );
}

// ─── Modal Calendar Specific Styles ───
const CELL_W = Math.floor((SCREEN_WIDTH - 40) / 7);
const CIRCLE_SIZE = Math.min(CELL_W - 8, 38);

const chipStyles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    shadowColor: "#C4AFEE",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  swatch: { width: 14, height: 14, borderRadius: 7, marginRight: 7 },
  swatchDashed: { borderWidth: 1.5, borderStyle: "dashed" },
  label: { fontSize: 11, color: "#3A3A3A" },
});

const cellStyles = StyleSheet.create({
  cell: {
    width: CELL_W,
    height: CELL_W,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  dashedCircle: { borderWidth: 1.5, borderStyle: "dashed" },
  todayBorder: { borderWidth: 2, borderColor: "#5A3FB8" },
  todayBorderThick: { borderWidth: 2 },
  selectionHalo: {
    position: "absolute",
    width: CIRCLE_SIZE + 6,
    height: CIRCLE_SIZE + 6,
    borderRadius: (CIRCLE_SIZE + 6) / 2,
    borderWidth: 2,
  },
  day: { fontSize: 15, lineHeight: 18 },
  daySolid: { fontSize: 15, lineHeight: 18, color: "#FFFFFF" },
  dimDay: { fontSize: 13, color: "#CCCCCC" },
  todayDot: {
    position: "absolute",
    bottom: -2,
    width: CIRCLE_SIZE,
    alignItems: "center",
  },
  todayDotInner: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#5A3FB8",
  },
});

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F3EFEB" },
  scrollContent: { paddingBottom: 16 },
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
  chipRowContainer: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 2,
    paddingBottom: 0,
    backgroundColor: "transparent",
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
    alignItems: "center",
    justifyContent: "center",
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
  activeMenstrualText: { color: "#D63A9A" },
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
  topSection: {
    marginTop: -2,
    paddingTop: 12,
    paddingBottom: 16,
    position: "relative",
    overflow: "hidden",
  },
  topSectionEmpty: { paddingTop: 22, paddingBottom: 18 },
  topLayerFrontImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.72,
    zIndex: 0,
  },
  topPinkOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    zIndex: 0,
  },
  periodDetailsWrap: {
    marginHorizontal: 12,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 8,
    alignSelf: "center",
  },
  emptyPeriodCard: {
    marginHorizontal: 16,
    minHeight: 124,
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    zIndex: 5,
  },
  emptyPhoneBlock: {
    width: 86,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  emptyPhoneImage: { width: 90, height: 120 },
  emptyPeriodTextWrap: {
    flex: 1,
    alignItems: "flex-end",
    paddingRight: 8,
    zIndex: 10,
  },
  emptyGreetText: { fontSize: 26, lineHeight: 20, color: "#1F2937" },
  emptyPeriodPrompt: {
    marginTop: 4,
    fontSize: 15,
    lineHeight: 19,
    color: "#1F2937",
  },
  emptyAddBtnWrap: { marginTop: 10, borderRadius: 6, overflow: "hidden", zIndex: 15 },
  emptyAddBtn: {
    minWidth: 68,
    height: 30,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  emptyAddBtnText: { fontSize: 12, color: "#FFFFFF" },
  greetText: {
    fontSize: 21,
    lineHeight: 24,
    color: "#151515",
    textAlign: "center",
  },
  periodPrompt: {
    marginTop: 2,
    fontSize: 18,
    lineHeight: 22,
    color: "#1F1F1F",
    textAlign: "center",
  },
  centerBadgeWrap: {
    marginTop: 18,
    width: 190,
    height: 220,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    zIndex: 10,
  },
  centerBadgeSvg: { position: "absolute", width: "100%", height: "100%" },
  centerBadgeContent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    zIndex: 15,
  },
  centerBadgeDate: {
    fontSize: 12,
    color: "#1A1A1A",
    textAlign: "center",
    marginTop: -8,
  },
  centerBadgePeriodLabel: {
    marginTop: 12,
    fontSize: 18,
    lineHeight: 20,
    color: "#FA7389",
  },
  centerBadgeHeadline: {
    marginTop: 2,
    fontSize: 42,
    lineHeight: 46,
    textAlign: "center",
  },
  dateSummaryCard: {
    marginTop: 20,
    width: "100%",
    backgroundColor: "transparent",
    position: "relative",
    zIndex: 5,
  },
  cardTopRow: { flexDirection: "row", height: 30, width: "100%" },
  cardTopLeft: { flex: 1, backgroundColor: "#5240BE", borderTopLeftRadius: 22 },
  cardTopRight: {
    flex: 1,
    backgroundColor: "#5240BE",
    borderTopRightRadius: 22,
  },
  cardBody: {
    backgroundColor: "#5240BE",
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 22,
    paddingTop: 5,
    marginTop: -1,
  },
  dropIconWrap: {
    position: "absolute",
    top: -1,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  dropShadow: {
    position: "absolute",
    top: 5,
    left: 1.5,
    width: 15,
    height: 15,
    backgroundColor: "rgba(150, 132, 165, 0.25)",
    borderRadius: 7.5,
    transform: [{ scaleY: 1.15 }],
  },
  dateSummaryItem: { flex: 1, alignItems: "center", paddingHorizontal: 4 },
  dateSummaryDivider: {
    width: 1,
    height: 28,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginTop: 6,
  },
  dateSummaryDate: { color: "#FFFFFF", fontSize: 19, lineHeight: 22 },
  dateSummaryMeta: {
    color: "#AFA4D4",
    fontSize: 11,
    lineHeight: 14,
    marginTop: 6,
  },
  actionRow: {
    marginTop: 18,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 0,
  },
  actionCard: {
    width: "31.3%",
    backgroundColor: "#F6F4F7",
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#E9DDEB",
    paddingVertical: 11,
    paddingHorizontal: 8,
    shadowColor: "#D8CFDE",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 5,
    elevation: 2,
  },
  actionCardGradient: { ...StyleSheet.absoluteFillObject, borderRadius: 11 },
  editDetailsActionCard: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#FFFFFF",
    shadowColor: "#BF7BB9",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  calendarActionCard: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#FFFFFF",
    shadowColor: "#BF7BB9",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  statisticsActionCard: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#FFFFFF",
    shadowColor: "#BF7BB9",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    height: 20,
    width: 20,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  actionTitle: { marginTop: 8, fontSize: 12, lineHeight: 14 },
  actionSubtitle: { marginTop: 4, fontSize: 8, lineHeight: 10 },
  cycleCard: {
    marginHorizontal: 14,
    marginTop: 10,
    backgroundColor: "#FFF6F5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 24,
  },
  cycleTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  cycleTitle: { fontSize: 15, color: "#000000" },
  rowsContainer: { gap: 16 },
  row: { flexDirection: "row", alignItems: "center", height: 30 },
  trackBounds: {
    height: "100%",
    borderRadius: 15,
    justifyContent: "flex-start",
  },
  activeDashedBounds: {
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#FFAEC0",
    overflow: "hidden",
  },
  filledBar: {
    height: "100%",
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 12,
  },
  barText: {
    fontSize: 9.5,
    color: "#333333",
    flex: 1,
    paddingRight: 4,
  },
  barKnob: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#F59B90",
    marginRight: 6,
  },
  barKnobActive: { backgroundColor: "#E63A84" },
  daysCol: {
    marginLeft: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  daysValue: { fontSize: 13, color: "#555555" },
  daysLabel: { fontSize: 9, color: "#555555" },
  insightsCardWrap: {
    width: SCREEN_WIDTH - 28,
    alignSelf: "center",
    marginTop: 12,
    borderRadius: 10,
    shadowColor: "#BF7BB9",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
  },
  insightsCard: {
    flex: 1,
    minHeight: 129,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  insightsTitle: {
    fontSize: 18,
    lineHeight: 24,
    color: "#222222",
    textAlign: "center",
  },
  insightsParagraph: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 18,
    color: "#6B7280",
    textAlign: "center",
    paddingHorizontal: 10,
  },
  insightsBtnWrap: { marginTop: 12, borderRadius: 8, overflow: "hidden" },
  insightsBtn: {
    minHeight: 30,
    minWidth: 92,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  insightsBtnText: { fontSize: 12, color: "#FFFFFF", textAlign: "center" },

  // ─── Modal Specific Styles ───
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: SCREEN_HEIGHT * 0.9,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  dragHandleArea: {
    width: "100%",
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    backgroundColor: "transparent",
  },
  dragHandle: {
    width: 50,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#D1D5DB",
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 16,
    paddingHorizontal: 32,
  },
  sheetMonthWrap: { flexDirection: "row", alignItems: "center", gap: 8 },
  sheetMonthText: { fontSize: 18, color: "#1A1A1A" },
  weekLabelContainer: {
    flexDirection: "row",
    backgroundColor: "#FFF2E6",
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 12,
    marginHorizontal: 20,
  },
  weekLabel: { flex: 1, textAlign: "center", color: "#000000", fontSize: 13 },
  calendarGrid: { paddingHorizontal: 24 },
  calendarRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  legendSection: { marginTop: 10, paddingHorizontal: 24 },
  legendChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  sheetFooter: { marginTop: 22, paddingTop: 12, paddingHorizontal: 20 },
  confirmBtn: {
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmBtnText: { color: "#FFFFFF", fontSize: 16, lineHeight: 20 },
});