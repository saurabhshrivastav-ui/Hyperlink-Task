import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated,
  Dimensions,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "../../../components/TextWrapper";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

// ── Activity data ────────────────────────────────────────────────────────────
const ALL_ACTIVITIES = [
  {
    id: "running",
    name: "Running",
    icon: "run",
    desc: "Running 1 hr burns almost 300kcal..",
    speeds: [
      { label: "Slow", value: "8.0 km/h" },
      { label: "Moderate", value: "12.0 km/h" },
      { label: "Fast", value: "17.0 km/h" },
    ],
    baseCal: 300,
  },
  {
    id: "walking",
    name: "Walking",
    icon: "walk",
    desc: "Walking 1 hr burns almost 150kcal..",
    speeds: [
      { label: "Slow", value: "3.0 km/h" },
      { label: "Moderate", value: "5.0 km/h" },
      { label: "Fast", value: "7.0 km/h" },
    ],
    baseCal: 150,
  },
  {
    id: "cycling",
    name: "Cycling",
    icon: "bike",
    desc: "Cycling 1 hr burns almost 400kcal..",
    speeds: [
      { label: "Slow", value: "10.0 km/h" },
      { label: "Moderate", value: "18.0 km/h" },
      { label: "Fast", value: "28.0 km/h" },
    ],
    baseCal: 400,
  },
  {
    id: "swimming",
    name: "Swimming",
    icon: "swim",
    desc: "Swimming 1 hr burns almost 350kcal..",
    speeds: [
      { label: "Slow", value: "1.0 km/h" },
      { label: "Moderate", value: "2.0 km/h" },
      { label: "Fast", value: "3.0 km/h" },
    ],
    baseCal: 350,
  },
  {
    id: "yoga",
    name: "Yoga",
    icon: "yoga",
    desc: "Yoga 1 hr burns almost 180kcal..",
    speeds: [
      { label: "Light", value: "Low" },
      { label: "Moderate", value: "Med" },
      { label: "Intense", value: "High" },
    ],
    baseCal: 180,
  },
  {
    id: "hiit",
    name: "HIIT",
    icon: "fire",
    desc: "HIIT 1 hr burns almost 600kcal..",
    speeds: [
      { label: "Light", value: "Low" },
      { label: "Moderate", value: "Med" },
      { label: "Intense", value: "High" },
    ],
    baseCal: 600,
  },
];

const QUICK_DAILY = [
  { id: "swimming", label: "Swimming", sub: "1 hr" },
  { id: "walking", label: "Walking", sub: "1.5 hrs" },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
const iconForActivity = (iconName, size = 26, color = "#E67E22") => {
  const map = {
    run: "run",
    walk: "walk",
    bike: "bike",
    swim: "swim",
    yoga: "yoga",
    fire: "fire",
  };
  return (
    <MaterialCommunityIcons
      name={map[iconName] || "run"}
      size={size}
      color={color}
    />
  );
};

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function LogActivityScreen({ onBack, onActivityAdded }) {
  const topOffset =
    Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 10 : 18;

  const [query, setQuery] = useState("");
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedSpeedIdx, setSelectedSpeedIdx] = useState(0);
  const [date, setDate] = useState("11/03/2026");
  const [time, setTime] = useState("");
  const [distance, setDistance] = useState("");

  // Bottom sheet animation
  const sheetAnim = useRef(new Animated.Value(0)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  const filteredActivities = query.trim()
    ? ALL_ACTIVITIES.filter((a) =>
        a.name.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  const openSheet = (activity) => {
    setSelectedActivity(activity);
    setSelectedSpeedIdx(0);
    setTime("");
    setDistance("");
    Animated.parallel([
      Animated.spring(sheetAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 60,
        friction: 12,
      }),
      Animated.timing(overlayAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeSheet = () => {
    Animated.parallel([
      Animated.timing(sheetAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setSelectedActivity(null));
  };

  const estimatedCal = () => {
    if (!selectedActivity) return 240;
    const mins = parseFloat(time) || 0;
    return Math.round((selectedActivity.baseCal / 60) * mins) || 240;
  };

  const sheetTranslateY = sheetAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [400, 0],
  });

  return (
    <View style={styles.screen}>
      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: topOffset }]}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.backBtn}
          onPress={onBack}
        >
          <Ionicons name="arrow-back" size={22} color="#5A3FB8" />
        </TouchableOpacity>
        <View>
          <Text weight="700" style={styles.headerTitle}>
            Log Activity
          </Text>
          <Text weight="400" style={styles.headerSub}>
            Choose the activity you performed.
          </Text>
        </View>
      </View>

      {/* ── Search bar ── */}
      <View style={styles.searchWrap}>
        <Ionicons
          name="search"
          size={16}
          color="#9CA3AF"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Activity"
          placeholderTextColor="#9CA3AF"
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {query.trim() === "" ? (
          /* ── Quick Daily Logs ── */
          <>
            <Text weight="700" style={styles.sectionTitle}>
              Quick Daily Logs
            </Text>
            <View style={styles.quickRow}>
              {QUICK_DAILY.map((q) => {
                const act = ALL_ACTIVITIES.find((a) => a.id === q.id);
                return (
                  <TouchableOpacity
                    key={q.id}
                    activeOpacity={0.8}
                    style={styles.quickCard}
                    onPress={() => act && openSheet(act)}
                  >
                    <View style={styles.quickIconCircle}>
                      {iconForActivity(act?.icon || "walk", 22, "#E67E22")}
                    </View>
                    <Text weight="600" style={styles.quickLabel}>
                      {q.label}
                    </Text>
                    <Text weight="400" style={styles.quickSub}>
                      {q.sub}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Spacer + bottom note */}
            <View style={styles.notFoundWrap}>
              <Text weight="400" style={styles.notFoundText}>
                Didn't Found , What you are looking for?
              </Text>
            </View>
          </>
        ) : (
          /* ── Search results ── */
          <>
            {filteredActivities.length > 0 ? (
              filteredActivities.map((act) => (
                <TouchableOpacity
                  key={act.id}
                  activeOpacity={0.85}
                  style={styles.resultRow}
                  onPress={() => openSheet(act)}
                >
                  <View style={styles.resultIconCircle}>
                    {iconForActivity(act.icon, 26, "#E67E22")}
                  </View>
                  <View style={styles.resultText}>
                    <Text weight="700" style={styles.resultName}>
                      {act.name}
                    </Text>
                    <Text weight="400" style={styles.resultDesc}>
                      {act.desc}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.resultPlusBtn}
                    onPress={() => openSheet(act)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="add" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))
            ) : (
              <Text
                weight="400"
                style={[styles.notFoundText, { marginTop: 32 }]}
              >
                No activities found for "{query}"
              </Text>
            )}

            <View style={styles.notFoundWrap}>
              <Text weight="400" style={styles.notFoundText}>
                Didn't Found , What you are looking for?
              </Text>
            </View>
          </>
        )}
      </ScrollView>

      {/* ── Add Custom Activity button ── */}
      <View style={styles.addCustomWrap}>
        <TouchableOpacity activeOpacity={0.85} style={styles.addCustomBtn}>
          <LinearGradient
            colors={["#F3BA64", "#D87E18"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.addCustomGradient}
          >
            <Text weight="700" style={styles.addCustomText}>
              + Add Custom Activity
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* ── Bottom sheet overlay ── */}
      {selectedActivity && (
        <>
          <Animated.View
            style={[styles.overlay, { opacity: overlayAnim }]}
            pointerEvents="auto"
          >
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              onPress={closeSheet}
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.sheet,
              { transform: [{ translateY: sheetTranslateY }] },
            ]}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
              {/* Sheet handle */}
              <View style={styles.sheetHandle} />

              {/* Activity title row */}
              <View style={styles.sheetTitleRow}>
                <View style={styles.sheetIconCircle}>
                  {iconForActivity(selectedActivity.icon, 28, "#E67E22")}
                </View>
                <Text weight="700" style={styles.sheetTitle}>
                  {selectedActivity.name}
                </Text>
              </View>

              {/* Speed chips */}
              <View style={styles.speedRow}>
                {selectedActivity.speeds.map((s, idx) => (
                  <TouchableOpacity
                    key={idx}
                    activeOpacity={0.85}
                    onPress={() => setSelectedSpeedIdx(idx)}
                    style={[
                      styles.speedChip,
                      idx === selectedSpeedIdx && styles.speedChipActive,
                    ]}
                  >
                    <Text
                      weight="600"
                      style={[
                        styles.speedChipLabel,
                        idx === selectedSpeedIdx && styles.speedChipLabelActive,
                      ]}
                    >
                      {s.label}
                    </Text>
                    <Text
                      weight="400"
                      style={[
                        styles.speedChipValue,
                        idx === selectedSpeedIdx && styles.speedChipValueActive,
                      ]}
                    >
                      {s.value}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Date / Time row */}
              <View style={styles.fieldRow}>
                <View style={styles.fieldGroup}>
                  <Text weight="500" style={styles.fieldLabel}>
                    Date
                  </Text>
                  <View style={styles.fieldInputWrap}>
                    <TextInput
                      style={styles.fieldInput}
                      value={date}
                      onChangeText={setDate}
                      placeholder="DD/MM/YYYY"
                      placeholderTextColor="#9CA3AF"
                    />
                    <Ionicons
                      name="calendar-outline"
                      size={16}
                      color="#9CA3AF"
                      style={styles.fieldSuffix}
                    />
                  </View>
                </View>

                <View style={[styles.fieldGroup, { marginLeft: 12 }]}>
                  <Text weight="500" style={styles.fieldLabel}>
                    Time
                  </Text>
                  <View style={styles.fieldInputWrap}>
                    <TextInput
                      style={styles.fieldInput}
                      value={time}
                      onChangeText={setTime}
                      placeholder="60"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numeric"
                    />
                    <Text weight="500" style={styles.fieldSuffixText}>
                      min
                    </Text>
                  </View>
                </View>
              </View>

              {/* Distance */}
              <View style={styles.fieldGroup}>
                <Text weight="500" style={styles.fieldLabel}>
                  Distance
                </Text>
                <View style={styles.fieldInputWrap}>
                  <TextInput
                    style={[styles.fieldInput, { flex: 1 }]}
                    value={distance}
                    onChangeText={setDistance}
                    placeholder="Enter your distance"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                  />
                  <Text weight="500" style={styles.fieldSuffixText}>
                    km
                  </Text>
                </View>
              </View>

              {/* Calories estimate */}
              <View style={styles.calRow}>
                <Text style={styles.calEmoji}>🔥</Text>
                <Text weight="800" style={styles.calValue}>
                  {estimatedCal()}
                </Text>
                <Text weight="500" style={styles.calUnit}>
                  {" "}
                  kcal Burned
                </Text>
              </View>

              {/* Add Activity button */}
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.addActivityBtn}
                onPress={() => {
                  closeSheet();
                  if (typeof onActivityAdded === "function") onActivityAdded();
                }}
              >
                <LinearGradient
                  colors={["#F3BA64", "#D87E18"]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.addActivityGradient}
                >
                  <Text weight="700" style={styles.addActivityText}>
                    + Add Activity
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </Animated.View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFFFFF" },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
  },
  backBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  headerTitle: { fontSize: 18, lineHeight: 22, color: "#5A3FB8" },
  headerSub: { fontSize: 12, lineHeight: 16, color: "#6B7280" },

  /* Search */
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#1F2937",
    paddingVertical: 0,
  },

  /* Scroll */
  scroll: { paddingHorizontal: 16, paddingBottom: 100 },

  /* Section title */
  sectionTitle: {
    fontSize: 16,
    lineHeight: 20,
    color: "#1F2937",
    marginBottom: 12,
  },

  /* Quick cards */
  quickRow: { flexDirection: "row", gap: 12 },
  quickCard: {
    width: 90,
    backgroundColor: "#FAF5FF",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  quickIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFF0E6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  quickLabel: {
    fontSize: 12,
    lineHeight: 15,
    color: "#1F2937",
    textAlign: "center",
  },
  quickSub: {
    fontSize: 10,
    lineHeight: 13,
    color: "#9CA3AF",
    textAlign: "center",
  },

  /* Not found */
  notFoundWrap: { marginTop: "auto", paddingTop: 32, alignItems: "center" },
  notFoundText: { fontSize: 13, color: "#6B7280", textAlign: "center" },

  /* Search result rows */
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F5FF",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: "#EDE9FE",
  },
  resultIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFF0E6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  resultText: { flex: 1 },
  resultName: { fontSize: 15, lineHeight: 19, color: "#1F2937" },
  resultDesc: { fontSize: 11, lineHeight: 14, color: "#9CA3AF", marginTop: 2 },
  resultPlusBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E67E22",
    alignItems: "center",
    justifyContent: "center",
  },

  /* Add Custom */
  addCustomWrap: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === "ios" ? 28 : 16,
    paddingTop: 10,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  addCustomBtn: { borderRadius: 12, overflow: "hidden" },
  addCustomGradient: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  addCustomText: { fontSize: 15, color: "#FFFFFF" },

  /* Bottom sheet overlay */
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
    zIndex: 10,
  },

  /* Bottom sheet */
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 36 : 24,
    paddingTop: 12,
    zIndex: 11,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 16,
  },
  sheetHandle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E5E7EB",
    marginBottom: 16,
  },

  /* Sheet title */
  sheetTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sheetIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FFF0E6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  sheetTitle: { fontSize: 20, lineHeight: 26, color: "#1F2937" },

  /* Speed chips */
  speedRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  speedChip: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  speedChipActive: {
    backgroundColor: "#FFF0E6",
    borderColor: "#E67E22",
  },
  speedChipLabel: { fontSize: 12, lineHeight: 15, color: "#6B7280" },
  speedChipLabelActive: { color: "#E67E22" },
  speedChipValue: {
    fontSize: 10,
    lineHeight: 13,
    color: "#9CA3AF",
    marginTop: 2,
  },
  speedChipValueActive: { color: "#E67E22" },

  /* Fields */
  fieldRow: { flexDirection: "row", marginBottom: 14 },
  fieldGroup: { flex: 1, marginBottom: 14 },
  fieldLabel: {
    fontSize: 12,
    lineHeight: 15,
    color: "#6B7280",
    marginBottom: 6,
  },
  fieldInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 42,
    backgroundColor: "#FAFAFA",
  },
  fieldInput: { flex: 1, fontSize: 13, color: "#1F2937", paddingVertical: 0 },
  fieldSuffix: { marginLeft: 4 },
  fieldSuffixText: { fontSize: 12, color: "#9CA3AF", marginLeft: 4 },

  /* Cal row */
  calRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    marginTop: 4,
  },
  calEmoji: { fontSize: 22, lineHeight: 28, marginRight: 4 },
  calValue: { fontSize: 28, lineHeight: 34, color: "#1F2937" },
  calUnit: { fontSize: 14, lineHeight: 20, color: "#6B7280" },

  /* Add activity button */
  addActivityBtn: { borderRadius: 12, overflow: "hidden" },
  addActivityGradient: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  addActivityText: { fontSize: 15, color: "#FFFFFF" },
});
