import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView,
  TextInput,
  Dimensions,
  PanResponder,
  Modal,
  Animated,
  Text as RNText,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// ─── Custom Slider ────────────────────────────────────────────────────────────
const CustomSlider = ({
  min = 0,
  max = 31,
  value,
  onValueChange,
  minLabel,
  maxLabel,
}) => {
  const sliderWidth = SCREEN_WIDTH - 64;
  const thumbSize = 22;
  const containerRef = useRef(null);
  const containerXRef = useRef(0);
  const propsRef = useRef({ min, max, onValueChange });
  propsRef.current = { min, max, onValueChange };

  const measureContainer = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.measure((_x, _y, _w, _h, pageX) => {
        containerXRef.current = pageX;
      });
    }
  }, []);

  useEffect(() => {
    const id = setTimeout(measureContainer, 0);
    return () => clearTimeout(id);
  }, [measureContainer]);

  const computeAndEmit = (pageX) => {
    const { min: pMin, max: pMax, onValueChange: pCb } = propsRef.current;
    const range = pMax - pMin;
    if (!pCb) return;
    if (range <= 0) {
      pCb(pMin);
      return;
    }
    const localX = pageX - containerXRef.current;
    const clampedX = Math.max(0, Math.min(sliderWidth, localX));
    const raw = (clampedX / sliderWidth) * range + pMin;
    const next = Math.max(pMin, Math.min(pMax, Math.round(raw)));
    pCb(next);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderTerminationRequest: () => false,

      onPanResponderGrant: (e) => {
        if (containerRef.current) {
          containerRef.current.measure((_x, _y, _w, _h, pageX) => {
            containerXRef.current = pageX;
            computeAndEmit(e.nativeEvent.pageX);
          });
        } else {
          computeAndEmit(e.nativeEvent.pageX);
        }
      },
      onPanResponderMove: (e) => {
        computeAndEmit(e.nativeEvent.pageX);
      },
    }),
  ).current;

  const safeValue = Math.max(min, Math.min(max, value ?? min));
  const displayRange = max - min;
  const percentage = displayRange > 0 ? (safeValue - min) / displayRange : 0;
  const thumbPosition = percentage * sliderWidth;

  return (
    <View style={sliderStyles.wrapper}>
      <View
        ref={containerRef}
        onLayout={measureContainer}
        {...panResponder.panHandlers}
        style={[sliderStyles.container, { width: sliderWidth }]}
      >
        <View style={sliderStyles.track} pointerEvents="none" />
        <View
          style={[sliderStyles.fill, { width: thumbPosition }]}
          pointerEvents="none"
        />
        <View
          style={[sliderStyles.thumb, { left: thumbPosition - thumbSize / 2 }]}
          pointerEvents="none"
        />
      </View>
      <View style={sliderStyles.labels}>
        <RNText style={sliderStyles.label}>{minLabel}</RNText>
        <RNText style={sliderStyles.label}>{maxLabel}</RNText>
      </View>
    </View>
  );
};

const sliderStyles = StyleSheet.create({
  wrapper: { width: "100%" },
  container: {
    height: 36,
    justifyContent: "center",
    position: "relative",
    marginBottom: 4,
  },
  track: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    marginTop: -2,
  },
  fill: {
    position: "absolute",
    top: "50%",
    left: 0,
    height: 4,
    backgroundColor: "#7C3AED",
    borderRadius: 2,
    marginTop: -2,
  },
  thumb: {
    position: "absolute",
    top: "50%",
    width: 22,
    height: 22,
    backgroundColor: "#7C3AED",
    borderRadius: 11,
    marginTop: -11,
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  labels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 2,
  },
  label: { fontSize: 11, color: "#9CA3AF", fontWeight: "500" },
});

// ─── Bottom Sheet Calendar ─────────────────────────────────────────────────────
const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const DAYS_OF_WEEK = ["S", "M", "T", "W", "T", "F", "S"];
const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_CELL_SIZE = Math.floor((SCREEN_WIDTH - 40) / 7);

const CalendarBottomSheet = ({
  visible,
  onClose,
  onSelectDate,
  initialDate,
}) => {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const [isRendered, setIsRendered] = useState(visible);

  const today = new Date();
  const [displayYear, setDisplayYear] = useState(
    initialDate?.year || today.getFullYear(),
  );
  const [displayMonth, setDisplayMonth] = useState(
    initialDate?.month ? initialDate.month - 1 : today.getMonth(),
  );
  const [selectedDay, setSelectedDay] = useState(initialDate?.day || null);
  const wasVisibleRef = useRef(visible);

  useEffect(() => {
    if (visible) {
      if (!wasVisibleRef.current) {
        const t = new Date();
        setDisplayYear(initialDate?.year || t.getFullYear());
        setDisplayMonth(
          initialDate?.month ? initialDate.month - 1 : t.getMonth(),
        );
        setSelectedDay(initialDate?.day || null);
      }
      setIsRendered(true);
      slideAnim.setValue(SCREEN_HEIGHT);
      backdropAnim.setValue(0);
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 3,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (wasVisibleRef.current) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) setIsRendered(false);
      });
    }
    wasVisibleRef.current = visible;
  }, [visible, initialDate, slideAnim, backdropAnim]);

  const getDaysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const prevMonth = () => {
    if (displayMonth === 0) {
      setDisplayMonth(11);
      setDisplayYear((y) => y - 1);
    } else setDisplayMonth((m) => m - 1);
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (displayMonth === 11) {
      setDisplayMonth(0);
      setDisplayYear((y) => y + 1);
    } else setDisplayMonth((m) => m + 1);
    setSelectedDay(null);
  };

  const handleConfirm = () => {
    if (selectedDay) {
      onSelectDate({
        day: selectedDay,
        month: displayMonth + 1,
        year: displayYear,
      });
    }
    onClose();
  };

  const daysInMonth = getDaysInMonth(displayYear, displayMonth);
  const firstDay = getFirstDayOfMonth(displayYear, displayMonth);
  const cells = Array(firstDay)
    .fill(null)
    .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));
  while (cells.length % 7 !== 0) cells.push(null);

  const isToday = (day) =>
    day === today.getDate() &&
    displayMonth === today.getMonth() &&
    displayYear === today.getFullYear();
  const getSelectedLabel = () => {
    if (!selectedDay) return "Select a date";
    const d = new Date(displayYear, displayMonth, selectedDay);
    return `${WEEKDAY_LABELS[d.getDay()]}, ${selectedDay} ${MONTHS_SHORT[displayMonth]} ${displayYear}`;
  };

  const prevMonthDays = getDaysInMonth(
    displayMonth === 0 ? displayYear - 1 : displayYear,
    displayMonth === 0 ? 11 : displayMonth - 1,
  );

  if (!isRendered) return null;

  return (
    <Modal
      transparent
      visible={isRendered}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Animated.View style={[calStyles.backdrop, { opacity: backdropAnim }]}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          activeOpacity={1}
        />
      </Animated.View>

      <Animated.View
        style={[calStyles.sheet, { transform: [{ translateY: slideAnim }] }]}
      >
        <View style={calStyles.handle} />
        <View style={calStyles.header}>
          <TouchableOpacity
            onPress={prevMonth}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <RNText style={calStyles.navArrow}>‹</RNText>
          </TouchableOpacity>
          <View style={calStyles.monthYearRow}>
            <MaterialCommunityIcons
              name="calendar-month-outline"
              size={18}
              color="#555"
              style={{ marginRight: 6 }}
            />
            <RNText style={calStyles.monthYearText}>
              {MONTHS_SHORT[displayMonth]} {displayYear}
            </RNText>
          </View>
          <TouchableOpacity
            onPress={nextMonth}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <RNText style={calStyles.navArrow}>›</RNText>
          </TouchableOpacity>
        </View>

        <View style={calStyles.weekRow}>
          {DAYS_OF_WEEK.map((d, i) => (
            <View key={i} style={calStyles.weekCell}>
              <RNText style={calStyles.weekLabel}>{d}</RNText>
            </View>
          ))}
        </View>

        <View style={calStyles.divider} />

        <View style={calStyles.grid}>
          {cells.map((day, i) => {
            const isSel = day !== null && day === selectedDay;
            const isTod = day !== null && isToday(day);
            const prevDay =
              day === null && i < firstDay
                ? prevMonthDays - firstDay + i + 1
                : null;
            const nextDay =
              day === null && i >= firstDay
                ? i - firstDay - daysInMonth + 1
                : null;

            return (
              <TouchableOpacity
                key={i}
                style={calStyles.cellWrapper}
                onPress={() => {
                  if (day) setSelectedDay(isSel ? null : day);
                }}
                activeOpacity={day ? 0.7 : 1}
                disabled={!day}
              >
                {day !== null && (
                  <View
                    style={[
                      calStyles.dashedCircle,
                      isSel && calStyles.dashedCircleSelected,
                      isTod && !isSel && calStyles.dashedCircleToday,
                    ]}
                  >
                    <RNText
                      style={[
                        calStyles.dayText,
                        isSel && calStyles.dayTextSelected,
                        isTod && !isSel && calStyles.dayTextToday,
                      ]}
                    >
                      {day}
                    </RNText>
                    {isSel && (
                      <View style={calStyles.checkmark}>
                        <Ionicons name="checkmark" size={8} color="#E91E8C" />
                      </View>
                    )}
                  </View>
                )}
                {prevDay !== null && (
                  <RNText style={calStyles.overflowDay}>{prevDay}</RNText>
                )}
                {nextDay !== null && (
                  <RNText style={calStyles.overflowDay}>{nextDay}</RNText>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={calStyles.selectedDateRow}>
          <RNText style={calStyles.selectedDateText}>
            {getSelectedLabel()}
          </RNText>
        </View>

        <TouchableOpacity onPress={handleConfirm} activeOpacity={0.85}>
          <LinearGradient
            colors={["#A855F7", "#EC4899"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={calStyles.confirmBtn}
          >
            <RNText style={calStyles.confirmText}>Confirm</RNText>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
};

const calStyles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 36 : 20,
    paddingTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 20,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  navArrow: {
    fontSize: 26,
    color: "#374151",
    fontWeight: "300",
    lineHeight: 30,
    paddingHorizontal: 6,
  },
  monthYearRow: { flexDirection: "row", alignItems: "center" },
  monthYearText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1F2937",
    letterSpacing: 0.2,
  },
  weekRow: { flexDirection: "row", marginBottom: 6 },
  weekCell: {
    width: DAY_CELL_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  weekLabel: { fontSize: 13, fontWeight: "600", color: "#6B7280" },
  divider: { height: 1, backgroundColor: "#F3F4F6", marginBottom: 8 },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  cellWrapper: {
    width: DAY_CELL_SIZE,
    height: DAY_CELL_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  dashedCircle: {
    width: DAY_CELL_SIZE - 6,
    height: DAY_CELL_SIZE - 6,
    borderRadius: (DAY_CELL_SIZE - 6) / 2,
    borderWidth: 1.5,
    borderColor: "#F9A8D4",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  dashedCircleSelected: {
    borderColor: "#F472B6",
    borderStyle: "dashed",
    backgroundColor: "#FFF0F7",
  },
  dashedCircleToday: {
    borderColor: "#F472B6",
    borderStyle: "dashed",
    backgroundColor: "#FFF0F7",
  },
  dayText: { fontSize: 13, fontWeight: "500", color: "#374151" },
  dayTextSelected: { color: "#BE185D", fontWeight: "700" },
  dayTextToday: { color: "#BE185D", fontWeight: "700" },
  checkmark: { position: "absolute", bottom: 1, right: 2 },
  overflowDay: { fontSize: 13, color: "#D1D5DB", fontWeight: "400" },
  selectedDateRow: {
    alignItems: "center",
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    marginTop: 4,
  },
  selectedDateText: { fontSize: 15, fontWeight: "600", color: "#1F2937" },
  confirmBtn: {
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  confirmText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
});

// ─── Main Form ─────────────────────────────────────────────────────────────────
export default function MenstrualDetailsForm({ onBack, onSaveDetails }) {
  const topOffset =
    Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 10 : 18;

  const [dayInput, setDayInput] = useState("");
  const [monthInput, setMonthInput] = useState("");
  const [yearInput, setYearInput] = useState("");

  const [cycleLengthValue, setCycleLengthValue] = useState(28);
  const [nonPeriodDays, setNonPeriodDays] = useState(23);
  const [calendarVisible, setCalendarVisible] = useState(false);

  const dayInputRef = useRef(null);
  const monthInputRef = useRef(null);
  const yearInputRef = useRef(null);

  const safeCycle = Math.max(1, cycleLengthValue);
  const periodDuration = Math.max(
    1,
    Math.min(safeCycle, safeCycle - Math.max(0, nonPeriodDays)),
  );

  const handleDayInput = (text) => {
    const n = text.replace(/[^0-9]/g, "");
    if (n === "" || parseInt(n, 10) <= 31) {
      setDayInput(n);
      if (n.length === 2) monthInputRef.current?.focus();
    }
  };

  const handleMonthInput = (text) => {
    const n = text.replace(/[^0-9]/g, "");
    if (n === "" || parseInt(n, 10) <= 12) {
      setMonthInput(n);
      if (n.length === 2) yearInputRef.current?.focus();
    }
  };

  const handleYearInput = (text) => {
    const n = text.replace(/[^0-9]/g, "");
    if (n.length <= 4) setYearInput(n);
  };

  const handleCalendarSelect = ({ day, month, year }) => {
    setDayInput(String(day).padStart(2, "0"));
    setMonthInput(String(month).padStart(2, "0"));
    setYearInput(String(year));
  };

  const handleCycleLengthChange = (val) => {
    const newCycle = val;
    setCycleLengthValue(newCycle);
    const targetCycle = Math.max(1, newCycle);
    const newNonPeriod = Math.max(
      0,
      Math.min(targetCycle - 1, targetCycle - periodDuration),
    );
    setNonPeriodDays(newNonPeriod);
  };

  const handleNonPeriodDaysChange = (val) => {
    const upper = Math.max(0, safeCycle - 1);
    setNonPeriodDays(Math.max(0, Math.min(upper, val)));
  };

  const handlePeriodDurationChange = (val) => {
    const clamped = Math.max(1, Math.min(safeCycle, val));
    setNonPeriodDays(Math.max(0, safeCycle - clamped));
  };

  const handleSaveDetails = async () => {
    const payload = {
      day: Number(dayInput),
      month: Number(monthInput),
      year: Number(yearInput),
      cycleLength: cycleLengthValue,
      nonPeriodDays,
      periodDuration,
    };

    try {
      // 1. Save core details to Async Database
      await AsyncStorage.setItem("@menstrual_details", JSON.stringify(payload));

      // 2. Clear out any previously stored cycle history so the stats page generates fresh logic
      await AsyncStorage.removeItem("@cycle_history");
    } catch (e) {
      console.error("Error saving menstrual details to AsyncStorage", e);
    }

    if (typeof onSaveDetails === "function") {
      onSaveDetails(payload);
      return;
    }
    onBack?.();
  };

  const initialDateForCal =
    dayInput && monthInput && yearInput
      ? {
          day: Number(dayInput),
          month: Number(monthInput),
          year: Number(yearInput),
        }
      : null;

  const nonPeriodMax = Math.max(0, safeCycle - 1);
  const periodMin = 1;
  const periodMax = Math.max(periodMin, safeCycle);

  return (
    <View style={styles.screen}>
      <View style={[styles.headerBlock, { paddingTop: topOffset }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.backBtn}
            onPress={onBack}
          >
            <Ionicons name="arrow-back" size={22} color="#5A3FB8" />
          </TouchableOpacity>
          <View style={styles.titleWrap}>
            <RNText style={styles.headerTitle}>Menstrual Details</RNText>
            <RNText style={styles.headerSubtitle}>
              Build healthy habits, one day at a time.
            </RNText>
          </View>
        </View>
      </View>

      <LinearGradient
        colors={["#FADADF", "#F8E8F7", "#F5F0FF"]}
        start={{ x: 0.3, y: 0 }}
        end={{ x: 0.7, y: 1 }}
        style={styles.contentWrapper}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name="calendar-month"
                  size={22}
                  color="#5B46C5"
                />
              </View>
              <RNText style={styles.cardTitle}>
                Last menstrual period started on
              </RNText>
            </View>

            <RNText style={styles.selectDateLabel}>Select Date</RNText>
            <View style={styles.dateInputRow}>
              <View style={styles.dateFieldContainer}>
                <TextInput
                  ref={dayInputRef}
                  style={styles.dateInput}
                  placeholder="dd"
                  placeholderTextColor="#D1D5DB"
                  value={dayInput}
                  onChangeText={handleDayInput}
                  maxLength={2}
                  keyboardType="numeric"
                />
              </View>
              <RNText style={styles.dateSeparator}>/</RNText>
              <View style={styles.dateFieldContainer}>
                <TextInput
                  ref={monthInputRef}
                  style={styles.dateInput}
                  placeholder="mm"
                  placeholderTextColor="#D1D5DB"
                  value={monthInput}
                  onChangeText={handleMonthInput}
                  maxLength={2}
                  keyboardType="numeric"
                />
              </View>
              <RNText style={styles.dateSeparator}>/</RNText>
              <View style={styles.dateFieldContainer}>
                <TextInput
                  ref={yearInputRef}
                  style={styles.dateInput}
                  placeholder="yyyy"
                  placeholderTextColor="#D1D5DB"
                  value={yearInput}
                  onChangeText={handleYearInput}
                  maxLength={4}
                  keyboardType="numeric"
                />
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.calendarIcon}
                onPress={() => setCalendarVisible(true)}
              >
                <MaterialCommunityIcons
                  name="calendar-month"
                  size={24}
                  color="#1719A8"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeaderAlt}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name="calendar-sync"
                  size={22}
                  color="#5B46C5"
                />
              </View>
              <RNText style={styles.cardTitle}>Average cycle length is</RNText>
              <View style={styles.infoBadge}>
                <MaterialCommunityIcons
                  name="information-variant"
                  size={14}
                  color="#FFFFFF"
                />
              </View>
            </View>
            <View style={styles.daysRow}>
              <RNText style={styles.sliderLabel}>Days</RNText>
              <View style={styles.valueContainer}>
                <RNText style={styles.valueText}>{cycleLengthValue}</RNText>
              </View>
            </View>
            <CustomSlider
              min={0}
              max={60}
              value={cycleLengthValue}
              onValueChange={handleCycleLengthChange}
              minLabel="0"
              maxLabel="60"
            />
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeaderAlt}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name="calendar-remove"
                  size={22}
                  color="#5B46C5"
                />
              </View>
              <View style={styles.cycleLengthHeader}>
                <RNText style={styles.cardTitle}>Days without period</RNText>
                <View style={styles.valueContainer}>
                  <RNText style={styles.valueText}>{nonPeriodDays}</RNText>
                </View>
              </View>
            </View>
            <RNText style={styles.sliderLabel}>Days</RNText>
            <CustomSlider
              min={0}
              max={nonPeriodMax}
              value={nonPeriodDays}
              onValueChange={handleNonPeriodDaysChange}
              minLabel="0"
              maxLabel={String(nonPeriodMax)}
            />
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeaderAlt}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name="water"
                  size={22}
                  color="#E91E8C"
                />
              </View>
              <View style={styles.cycleLengthHeader}>
                <RNText style={styles.cardTitle}>
                  How many days your periods come?
                </RNText>
                <View style={styles.valueContainer}>
                  <RNText style={styles.valueText}>{periodDuration}</RNText>
                </View>
              </View>
            </View>
            <RNText style={styles.sliderLabel}>Days</RNText>
            <CustomSlider
              min={periodMin}
              max={periodMax}
              value={periodDuration}
              onValueChange={handlePeriodDurationChange}
              minLabel={String(periodMin)}
              maxLabel={String(periodMax)}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleSaveDetails}
            style={styles.saveButtonContainer}
          >
            <LinearGradient
              colors={["#B148FF", "#D91E63", "#9914F9"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.saveButton}
            >
              <RNText style={styles.saveButtonText}>Save Details</RNText>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>

      <CalendarBottomSheet
        visible={calendarVisible}
        onClose={() => setCalendarVisible(false)}
        onSelectDate={handleCalendarSelect}
        initialDate={initialDateForCal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFF3F8" },
  headerBlock: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: "#FFF3F8",
  },
  headerRow: { flexDirection: "row", alignItems: "center" },
  backBtn: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  titleWrap: { flex: 1 },
  headerTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#5C43BF",
    lineHeight: 24,
  },
  headerSubtitle: { fontSize: 10, color: "#6B7280", marginTop: 1 },
  contentWrapper: { flex: 1 },
  scrollContent: { paddingHorizontal: 14, paddingTop: 12, paddingBottom: 24 },
  card: {
    backgroundColor: "#F4F4F6",
    borderRadius: 20,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#EFE6F6",
    shadowColor: "#CDA7D8",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 4,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  cardHeaderAlt: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#DCD0EE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#111111",
    lineHeight: 20,
    paddingRight: 4,
  },
  infoBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#5B5B5B",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  selectDateLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#4B4B4B",
    marginBottom: 6,
  },
  dateInputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateFieldContainer: { flex: 1, alignItems: "flex-start" },
  dateInput: {
    width: "100%",
    paddingVertical: 4,
    fontSize: 18,
    fontWeight: "600",
    color: "#5B5B5B",
    borderBottomWidth: 2.5,
    borderBottomColor: "#6B6B6B",
    backgroundColor: "transparent",
    textAlign: "center",
  },
  dateSeparator: {
    fontSize: 32,
    fontWeight: "300",
    color: "#B6B6B6",
    marginHorizontal: 8,
    lineHeight: 36,
  },
  calendarIcon: { marginLeft: 10, marginBottom: 2 },
  daysRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  cycleLengthHeader: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sliderLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#202020",
    marginBottom: 6,
  },
  valueContainer: {
    minWidth: 60,
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: "#F4F4F6",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#8A8A8A",
    alignItems: "center",
    justifyContent: "center",
  },
  valueText: { fontSize: 18, fontWeight: "700", color: "#2F2F2F" },
  saveButtonContainer: { marginTop: 16, marginBottom: 8 },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#B148FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
});
