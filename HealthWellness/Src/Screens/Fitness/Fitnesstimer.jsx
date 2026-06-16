import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  Platform,
  StatusBar,
  Switch,
  Alert,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle } from "react-native-svg";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { Text } from "../../../components/TextWrapper";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// ─── Constants ────────────────────────────────────────────────────────────────
const PURPLE = "#5C43BF";
const ORANGE = "#E67E22";
const ORANGE_DARK = "#D87E18";
const ORANGE_GRAD = ["#F3BA64", "#D87E18"];
const BG = "#F5F4FB"; // slight lavender tint matching image bg
const ARC_COLOR = "#3D3565"; // dark charcoal-purple for the arc

// ─── Screen state machine ─────────────────────────────────────────────────────
const SCREENS = {
  SEARCH: "SEARCH",
  MAP_ROUTE: "MAP_ROUTE",
  WORKOUT_PLAN: "WORKOUT_PLAN", // New Screen State
  TIMER_SETUP: "TIMER_SETUP",
  ACTIVE_TIMER: "ACTIVE_TIMER",
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const ALL_ACTIVITIES = [
  {
    id: "running",
    label: "Running",
    icon: "run",
    hasMap: true,
    desc: "Running 1hr burns almost 300kcal...",
  },
  {
    id: "workout",
    label: "Workout",
    icon: "dumbbell",
    hasMap: false,
    desc: "Workout 1hr burns almost 300kcal...",
  },
  {
    id: "cycling",
    label: "Cycling",
    icon: "bike",
    hasMap: true,
    desc: "Cycling 1hr burns almost 400kcal...",
  },
  {
    id: "swimming",
    label: "Swimming",
    icon: "swim",
    hasMap: false,
    desc: "Swimming 1hr burns almost 350kcal...",
  },
  {
    id: "walking",
    label: "Walking",
    icon: "walk",
    hasMap: true,
    desc: "Walking 1hr burns almost 200kcal...",
  },
];

const QUICK_LOGS = [
  { id: "swimming", label: "Swimming", sub: "1 hr", icon: "swim" },
  { id: "walking", label: "Walking", sub: "1.5 km", icon: "walk" },
];

const PACE_OPTIONS = [
  { key: "slow", label: "Slow", speed: "8.0 km/h" },
  { key: "moderate", label: "Moderate", speed: "12.0 km/h" },
  { key: "fast", label: "Fast", speed: "17.0 km/h" },
];

const FAKE_STOPS = [
  { title: "Ekta Cha..." },
  { title: "Power Avon..." },
  { title: "Power plaza" },
];

// ─── Workout Plan Data ────────────────────────────────────────────────────────
const WORKOUT_CATEGORIES = [
  { id: "chest", label: "Chest" },
  { id: "back", label: "Back" },
  { id: "legs", label: "Legs" },
  { id: "arms", label: "Arms" },
  { id: "cardio", label: "Cardio Eq." },
];

const WORKOUT_PLANS = {
  chest: [
    { id: "1", name: "Barbell Bench Press", sets: "4 sets x 8-10 reps" },
    { id: "2", name: "Incline Dumbbell Press", sets: "3 sets x 10-12 reps" },
    { id: "3", name: "Cable Crossovers", sets: "3 sets x 15 reps" },
  ],
  back: [
    { id: "1", name: "Deadlifts", sets: "4 sets x 6-8 reps" },
    { id: "2", name: "Pull-ups", sets: "3 sets x max reps" },
    { id: "3", name: "Seated Cable Rows", sets: "3 sets x 12 reps" },
  ],
  legs: [
    { id: "1", name: "Barbell Squats", sets: "4 sets x 8 reps" },
    { id: "2", name: "Leg Press", sets: "3 sets x 10-12 reps" },
    { id: "3", name: "Romanian Deadlifts", sets: "3 sets x 10 reps" },
  ],
  arms: [
    { id: "1", name: "Overhead Press", sets: "4 sets x 8 reps" },
    { id: "2", name: "Bicep Curls", sets: "3 sets x 12 reps" },
    { id: "3", name: "Tricep Pushdowns", sets: "3 sets x 12 reps" },
  ],
  cardio: [
    { id: "1", name: "Treadmill Intervals", sets: "15 mins (1min sprint/1min walk)" },
    { id: "2", name: "Rowing Machine", sets: "10 mins steady pace" },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const pad = (n) => String(n).padStart(2, "0");
const formatTime = (s) => `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;

// ─── Shared Header ────────────────────────────────────────────────────────────
const Header = ({ onBack, transparent = false }) => {
  const topOffset =
    Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 6 : 44;
  return (
    <View
      style={[
        hdrStyles.wrap,
        { paddingTop: topOffset },
        transparent && hdrStyles.transparent,
      ]}
    >
      <TouchableOpacity
        style={hdrStyles.backBtn}
        activeOpacity={0.8}
        onPress={onBack}
      >
        <Ionicons name="arrow-back" size={22} color={PURPLE} />
      </TouchableOpacity>
      <View>
        <Text weight="700" style={hdrStyles.title}>
          Fitness Timer
        </Text>
        <Text weight="400" style={hdrStyles.sub}>
          Choose the activity you performed.
        </Text>
      </View>
    </View>
  );
};

const hdrStyles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: "#FFFFFF",
  },
  transparent: { backgroundColor: "transparent" },
  backBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  title: { fontSize: 17, color: PURPLE },
  sub: { fontSize: 11, color: "#6B7280", marginTop: 1 },
});

// ─── Circular Arc Timer (SVG-based) ───────────────────────────────────────────
const CircularTimer = ({ seconds, totalSeconds = 5040, paused }) => {
  const SIZE = 190;
  const STROKE = 16;
  const R = (SIZE - STROKE) / 2;
  const CX = SIZE / 2;
  const CIRCUM = 2 * Math.PI * R;
  const progress = Math.min(seconds / totalSeconds, 1);
  const dashOffset = CIRCUM * (1 - progress);

  return (
    <View
      style={{
        width: SIZE,
        height: SIZE,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Svg width={SIZE} height={SIZE} style={{ position: "absolute" }}>
        <Circle
          cx={CX}
          cy={CX}
          r={R}
          stroke="#D1D5DB"
          strokeWidth={STROKE}
          fill="none"
        />
        <Circle
          cx={CX}
          cy={CX}
          r={R}
          stroke={ARC_COLOR}
          strokeWidth={STROKE}
          fill="none"
          strokeDasharray={`${CIRCUM}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${CX}, ${CX}`}
        />
      </Svg>
      <View style={{ alignItems: "center" }}>
        <Text weight="700" style={arcStyles.digits}>
          {formatTime(seconds)}
        </Text>
      </View>
    </View>
  );
};

const arcStyles = StyleSheet.create({
  digits: {
    fontSize: 34,
    letterSpacing: 1,
    color: ARC_COLOR,
  },
});

// ─── Screen 1: Search ─────────────────────────────────────────────────────────
const SearchScreen = ({ onBack, onSelect }) => {
  const [query, setQuery] = useState("");

  const filtered =
    query.trim().length > 0
      ? ALL_ACTIVITIES.filter((a) =>
          a.label.toLowerCase().includes(query.toLowerCase()),
        )
      : [];

  return (
    <View style={ss.screen}>
      <Header onBack={onBack} />
      <View style={ss.searchBar}>
        <Ionicons
          name="search-outline"
          size={16}
          color="#9CA3AF"
          style={{ marginRight: 8 }}
        />
        <TextInput
          style={ss.searchInput}
          placeholder="Search Activity"
          placeholderTextColor="#9CA3AF"
          value={query}
          onChangeText={setQuery}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")}>
            <Ionicons name="close-circle" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {query.trim().length === 0 ? (
          <>
            <Text weight="700" style={ss.sectionTitle}>
              Quick Daily Logs
            </Text>
            <View style={ss.quickRow}>
              {QUICK_LOGS.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.8}
                  style={ss.quickCard}
                  onPress={() =>
                    onSelect(ALL_ACTIVITIES.find((a) => a.id === item.id))
                  }
                >
                  <View style={ss.quickIconWrap}>
                    <MaterialCommunityIcons
                      name={item.icon}
                      size={24}
                      color={ORANGE}
                    />
                  </View>
                  <Text weight="600" style={ss.quickLabel}>
                    {item.label}
                  </Text>
                  <Text weight="400" style={ss.quickSub}>
                    {item.sub}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
            {filtered.map((item) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.85}
                style={ss.resultCard}
                onPress={() => onSelect(item)}
              >
                <View style={ss.resultIconCircle}>
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={22}
                    color={ORANGE}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text weight="700" style={ss.resultLabel}>
                    {item.label}
                  </Text>
                  <Text weight="400" style={ss.resultSub} numberOfLines={1}>
                    {item.desc}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
              </TouchableOpacity>
            ))}
          </View>
        )}
        <Text weight="400" style={ss.notFoundText}>
          Didn't Found , What you are looking for?
        </Text>
        <TouchableOpacity activeOpacity={0.85} style={ss.addCustomWrap}>
          <LinearGradient
            colors={ORANGE_GRAD}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={ss.addCustomBtn}
          >
            <Ionicons
              name="add"
              size={16}
              color="#FFFFFF"
              style={{ marginRight: 4 }}
            />
            <Text weight="600" style={ss.addCustomText}>
              Add Custom Activity
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const ss = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFFFFF" },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
    marginTop: 4,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
  },
  searchInput: { flex: 1, fontSize: 14, color: "#1F2937", paddingVertical: 0 },
  sectionTitle: {
    marginHorizontal: 16,
    marginBottom: 14,
    fontSize: 15,
    color: "#1F2937",
  },
  quickRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 28,
  },
  quickCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#F0EEF8",
    shadowColor: "#7C5CFC",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  quickIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF3E8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  quickLabel: { fontSize: 13, color: "#1F2937" },
  quickSub: { fontSize: 11, color: "#9CA3AF", marginTop: 2 },
  resultCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F0EEF8",
    shadowColor: "#7C5CFC",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  resultIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFF3E8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  resultLabel: { fontSize: 14, color: "#1F2937" },
  resultSub: { fontSize: 11, color: "#9CA3AF", marginTop: 2 },
  notFoundText: {
    textAlign: "center",
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 32,
    marginBottom: 12,
  },
  addCustomWrap: {
    marginHorizontal: 16,
    borderRadius: 10,
    overflow: "hidden",
  },
  addCustomBtn: {
    flexDirection: "row",
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  addCustomText: { fontSize: 14, color: "#FFFFFF" },
});

// ─── Screen 2: Map + Route ────────────────────────────────────────────────────
const MapRouteScreen = ({ activity, onBack, onContinue }) => {
  const [autoTrack, setAutoTrack] = useState(true);
  const [gpsActive, setGpsActive] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [routePreview, setRoutePreview] = useState(false);
  const watchSub = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location access is needed.");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setUserLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    })();
    return () => watchSub.current?.remove();
  }, []);

  const stopCoords = userLocation
    ? [
        {
          latitude: userLocation.latitude + 0.007,
          longitude: userLocation.longitude - 0.002,
        },
        {
          latitude: userLocation.latitude + 0.004,
          longitude: userLocation.longitude + 0.004,
        },
        {
          latitude: userLocation.latitude + 0.001,
          longitude: userLocation.longitude + 0.006,
        },
      ]
    : [];

  const handleStart = async () => {
    if (autoTrack) {
      setGpsActive(true);
      setRouteCoords([]);
      watchSub.current = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.BestForNavigation, distanceInterval: 5 },
        (loc) => {
          const pt = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          };
          setUserLocation(pt);
          setRouteCoords((prev) => [...prev, pt]);
        },
      );
    }
    setRoutePreview(true);
  };

  const defaultRegion = userLocation
    ? { ...userLocation, latitudeDelta: 0.02, longitudeDelta: 0.02 }
    : {
        latitude: 28.6139,
        longitude: 77.209,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        region={defaultRegion}
        showsUserLocation={false}
        customMapStyle={[
          { featureType: "poi", stylers: [{ visibility: "off" }] },
        ]}
      >
        {routeCoords.length > 1 && (
          <Polyline
            coordinates={routeCoords}
            strokeColor={ORANGE}
            strokeWidth={4}
          />
        )}
        {routePreview && stopCoords.length > 0 && (
          <Polyline
            coordinates={[
              ...(userLocation ? [userLocation] : []),
              ...stopCoords,
            ]}
            strokeColor={ORANGE}
            strokeWidth={4}
          />
        )}
        {userLocation && (
          <Marker coordinate={userLocation}>
            <View style={ms.userDotOuter}>
              <View style={ms.userDotInner} />
            </View>
          </Marker>
        )}
        {routePreview &&
          stopCoords.map((s, i) => (
            <Marker key={i} coordinate={s}>
              <View style={ms.stopDot} />
            </Marker>
          ))}
      </MapView>

      <View style={ms.headerOverlay}>
        <Header onBack={onBack} transparent />
      </View>

      <View style={ms.sheet}>
        {routePreview ? (
          <>
            {FAKE_STOPS.map((stop, i) => (
              <View key={i} style={ms.stopRow}>
                <View
                  style={[
                    ms.stopBullet,
                    i === 0 && { backgroundColor: PURPLE },
                  ]}
                />
                <Text weight={i === 0 ? "700" : "500"} style={ms.stopLabel}>
                  {stop.title}
                </Text>
              </View>
            ))}
            <View style={{ height: 8 }} />
            <Text weight="700" style={ms.tripTime}>
              Total trip: 1hr 24min
            </Text>
            <Text weight="400" style={ms.tripMeta}>
              84 min (4 stops){"  "}Mostly Flat
            </Text>
            <TouchableOpacity
              activeOpacity={0.85}
              style={ms.primaryBtnWrap}
              onPress={onContinue}
            >
              <LinearGradient
                colors={ORANGE_GRAD}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={ms.primaryBtn}
              >
                <Ionicons
                  name="navigate"
                  size={16}
                  color="#FFFFFF"
                  style={{ marginRight: 6 }}
                />
                <Text weight="600" style={ms.primaryBtnText}>
                  Continue
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={ms.optionRow}>
              <View style={{ flex: 1 }}>
                <Text weight="600" style={ms.optionTitle}>
                  Auto-Track My Route
                </Text>
                <Text weight="400" style={ms.optionSub}>
                  Automatically logs where you go.
                </Text>
              </View>
              <Switch
                value={autoTrack}
                onValueChange={(v) => {
                  setAutoTrack(v);
                  if (!v) setGpsActive(false);
                }}
                trackColor={{ false: "#D1D5DB", true: "#BBF7D0" }}
                thumbColor={autoTrack ? "#22C55E" : "#F3F4F6"}
              />
            </View>

            <View style={[ms.gpsRow, autoTrack && ms.gpsRowActive]}>
              <View style={[ms.gpsDot, autoTrack && ms.gpsDotActive]} />
              <Text
                weight="500"
                style={[ms.gpsText, autoTrack && ms.gpsTextActive]}
              >
                {autoTrack
                  ? "GPS route · Your route is being auto-tracked"
                  : "GPS inactive"}
              </Text>
            </View>

            <View style={[ms.optionRow, { borderBottomWidth: 0 }]}>
              <View style={{ flex: 1 }}>
                <Text weight="600" style={ms.optionTitle}>
                  Set Custom Location
                </Text>
                <Text weight="400" style={ms.optionSub}>
                  Manually set your route.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              style={ms.primaryBtnWrap}
              onPress={handleStart}
            >
              <LinearGradient
                colors={ORANGE_GRAD}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={ms.primaryBtn}
              >
                <Ionicons
                  name="navigate"
                  size={16}
                  color="#FFFFFF"
                  style={{ marginRight: 6 }}
                />
                <Text weight="600" style={ms.primaryBtnText}>
                  Start
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const ms = StyleSheet.create({
  headerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255,255,255,0.9)",
    zIndex: 10,
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === "ios" ? 38 : 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 12,
    zIndex: 20,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  optionTitle: { fontSize: 14, color: "#1F2937" },
  optionSub: { fontSize: 11, color: "#9CA3AF", marginTop: 2 },
  gpsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginVertical: 8,
  },
  gpsRowActive: { backgroundColor: "#F0FDF4" },
  gpsDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D1D5DB",
    marginRight: 8,
  },
  gpsDotActive: { backgroundColor: "#22C55E" },
  gpsText: { fontSize: 12, color: "#6B7280" },
  gpsTextActive: { color: "#16A34A" },
  primaryBtnWrap: {
    marginTop: 14,
    borderRadius: 12,
    overflow: "hidden",
  },
  primaryBtn: {
    flexDirection: "row",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  primaryBtnText: { fontSize: 15, color: "#FFFFFF" },
  stopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  stopBullet: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#D1D5DB",
    marginRight: 10,
  },
  stopLabel: { fontSize: 13, color: "#1F2937" },
  tripTime: { fontSize: 14, color: "#1F2937", marginBottom: 2 },
  tripMeta: { fontSize: 11, color: "#9CA3AF", marginBottom: 4 },
  userDotOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(231,115,34,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  userDotInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: ORANGE,
  },
  stopDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: PURPLE,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
});

// ─── NEW Screen: Workout Planner ──────────────────────────────────────────────
const WorkoutPlannerScreen = ({ activity, onBack, onContinue }) => {
  const [selectedCat, setSelectedCat] = useState("chest");
  
  const currentPlan = WORKOUT_PLANS[selectedCat];

  return (
    <View style={wp.screen}>
      <Header onBack={onBack} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}>
        
        <View style={wp.headerRow}>
          <View style={wp.activityIconCircle}>
            <MaterialCommunityIcons name="dumbbell" size={26} color={ORANGE} />
          </View>
          <View>
            <Text weight="700" style={wp.activityLabel}>Plan Your Workout</Text>
            <Text weight="400" style={wp.activitySub}>Select a muscle group or equipment</Text>
          </View>
        </View>

        {/* Categories / Chips */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={wp.chipScroll}
          contentContainerStyle={{ gap: 8, paddingBottom: 16 }}
        >
          {WORKOUT_CATEGORIES.map((cat) => {
            const active = selectedCat === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                activeOpacity={0.8}
                style={[wp.chip, active && wp.chipActive]}
                onPress={() => setSelectedCat(cat.id)}
              >
                <Text weight="600" style={[wp.chipLabel, active && wp.chipLabelActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>

        {/* Workout Plan List */}
        <Text weight="700" style={wp.planTitle}>Suggested Routine</Text>
        <View style={wp.planCard}>
          {currentPlan.map((exercise, index) => (
            <View key={exercise.id} style={[wp.exerciseRow, index !== currentPlan.length - 1 && wp.exerciseBorder]}>
              <View style={wp.exerciseBullet}>
                <Text weight="700" style={{color: ORANGE, fontSize: 12}}>{index + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text weight="600" style={wp.exerciseName}>{exercise.name}</Text>
                <Text weight="400" style={wp.exerciseSets}>{exercise.sets}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={wp.btnWrap}
          onPress={() => onContinue({ category: selectedCat, plan: currentPlan })}
        >
          <LinearGradient
            colors={ORANGE_GRAD}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={wp.btn}
          >
            <Text weight="600" style={wp.btnText}>Proceed to Timer</Text>
          </LinearGradient>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

const wp = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFFFFF" },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 20,
  },
  activityIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFF3E8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  activityLabel: { fontSize: 20, color: "#1F2937" },
  activitySub: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  chipScroll: {
    flexGrow: 0,
    marginBottom: 8,
  },
  chip: {
    backgroundColor: "#F9FAFB",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
  },
  chipActive: {
    borderColor: ORANGE,
    backgroundColor: "#FFF7ED",
  },
  chipLabel: { fontSize: 13, color: "#6B7280" },
  chipLabelActive: { color: ORANGE },
  planTitle: {
    fontSize: 16,
    color: "#1F2937",
    marginBottom: 12,
  },
  planCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F0EEF8",
    shadowColor: "#7C5CFC",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 24,
  },
  exerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  exerciseBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  exerciseBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFF3E8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  exerciseName: { fontSize: 14, color: "#1F2937" },
  exerciseSets: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  btnWrap: { borderRadius: 12, overflow: "hidden" },
  btn: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  btnText: { fontSize: 15, color: "#FFFFFF" },
});

// ─── Screen 3: Timer Setup ────────────────────────────────────────────────────
const TimerSetupScreen = ({ activity, onBack, onStart }) => {
  const [pace, setPace] = useState("slow");
  const [minutes, setMinutes] = useState("60");

  return (
    <View style={ts.screen}>
      <Header onBack={onBack} />
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={ts.activityRow}>
          <View style={ts.activityIconCircle}>
            <MaterialCommunityIcons
              name={activity.icon}
              size={26}
              color={ORANGE}
            />
          </View>
          <Text weight="700" style={ts.activityLabel}>
            {activity.label}
          </Text>
        </View>

        <View style={ts.paceRow}>
          {PACE_OPTIONS.map((p) => {
            const active = pace === p.key;
            return (
              <TouchableOpacity
                key={p.key}
                activeOpacity={0.8}
                style={[ts.paceChip, active && ts.paceChipActive]}
                onPress={() => setPace(p.key)}
              >
                <Text
                  weight="700"
                  style={[ts.paceLabel, active && ts.paceLabelActive]}
                >
                  {p.label}
                </Text>
                <Text
                  weight="400"
                  style={[ts.paceSpeed, active && ts.paceSpeedActive]}
                >
                  ({p.speed})
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text weight="600" style={ts.timeLabel}>
          Time
        </Text>
        <View style={ts.timeRow}>
          <TextInput
            style={ts.timeInput}
            value={minutes}
            onChangeText={setMinutes}
            keyboardType="number-pad"
            placeholder="60"
            placeholderTextColor="#9CA3AF"
          />
          <Text weight="500" style={ts.timeUnit}>
            min
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          style={ts.startBtnWrap}
          onPress={() => onStart({ pace, minutes: parseInt(minutes) || 60 })}
        >
          <LinearGradient
            colors={ORANGE_GRAD}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={ts.startBtn}
          >
            <Text weight="600" style={ts.startBtnText}>
              Start Timer
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const ts = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFFFFF" },
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  activityIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFF3E8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  activityLabel: { fontSize: 22, color: "#1F2937" },
  paceRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
  },
  paceChip: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
  },
  paceChipActive: {
    borderColor: ORANGE,
    backgroundColor: "#FFF7ED",
  },
  paceLabel: { fontSize: 13, color: "#6B7280" },
  paceLabelActive: { color: ORANGE },
  paceSpeed: { fontSize: 10, color: "#9CA3AF", marginTop: 2 },
  paceSpeedActive: { color: ORANGE },
  timeLabel: { fontSize: 13, color: "#6B7280", marginBottom: 8 },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 28,
    backgroundColor: "#FFFFFF",
  },
  timeInput: { flex: 1, fontSize: 15, color: "#1F2937", paddingVertical: 0 },
  timeUnit: { fontSize: 13, color: "#9CA3AF" },
  startBtnWrap: { borderRadius: 12, overflow: "hidden" },
  startBtn: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  startBtnText: { fontSize: 15, color: "#FFFFFF" },
});

// ─── Screen 4: Active Timer ───────────────────────────────────────────────────
const ActiveTimerScreen = ({ activity, settings, onBack, onAddActivity }) => {
  const [seconds, setSeconds] = useState(0);
  const [paused, setPaused] = useState(false);
  const [calories, setCalories] = useState(0);
  const intervalRef = useRef(null);
  const startedAtRef = useRef(new Date());

  const calPerSec =
    settings.pace === "fast"
      ? 0.12
      : settings.pace === "moderate"
        ? 0.09
        : 0.06;
  const totalSeconds = (settings.minutes || 60) * 60;

  useEffect(() => {
    if (!paused) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
        setCalories((c) => Math.round(c + calPerSec));
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [paused]);

  const startedStr = startedAtRef.current.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View style={at.screen}>
      <Header
        onBack={() => {
          clearInterval(intervalRef.current);
          onBack();
        }}
      />

      <LinearGradient
        colors={["#EDE8F8", "#F7EFF8"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={at.timerCard}
      >
        <View style={at.activityBadge}>
          <View style={at.badgeIconWrap}>
            <MaterialCommunityIcons
              name={activity.icon}
              size={20}
              color={ORANGE}
            />
          </View>
          <Text weight="700" style={at.badgeLabel}>
            {activity.label}
          </Text>
        </View>

        <View style={{ marginTop: 24, marginBottom: 20 }}>
          <CircularTimer
            seconds={seconds}
            totalSeconds={totalSeconds}
            paused={paused}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          style={at.pauseWrap}
          onPress={() => setPaused((p) => !p)}
        >
          <LinearGradient
            colors={["#F3BA64", "#D87E18"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={at.pauseBtn}
          >
            <Ionicons
              name={paused ? "play" : "pause"}
              size={18}
              color="#FFFFFF"
            />
          </LinearGradient>
        </TouchableOpacity>

        <View style={at.statsRow}>
          <View style={at.statItem}>
            <Text weight="700" style={at.statValue}>
              {startedStr}
            </Text>
            <Text weight="400" style={at.statLabel}>
              Started
            </Text>
          </View>
          <View style={at.statDivider} />
          <View style={at.statItem}>
            <Text weight="700" style={at.statValue}>
              {formatTime(seconds)}
            </Text>
            <Text weight="400" style={at.statLabel}>
              Time
            </Text>
          </View>
          <View style={at.statDivider} />
          <View style={at.statItem}>
            <Text weight="700" style={at.statValue}>
              {calories}
            </Text>
            <Text weight="400" style={at.statLabel}>
              Calories
            </Text>
          </View>
        </View>
      </LinearGradient>

      <View style={at.addWrap}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => {
            clearInterval(intervalRef.current);
            onAddActivity({ seconds, calories });
          }}
        >
          <LinearGradient
            colors={ORANGE_GRAD}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={at.addBtn}
          >
            <Text weight="600" style={at.addBtnText}>
              Add Activity
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const at = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BG },
  timerCard: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 24,
    paddingTop: 20,
    paddingBottom: 28,
    paddingHorizontal: 16,
    alignItems: "center",
    shadowColor: "#7C5CFC",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  activityBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  badgeIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF3E8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  badgeLabel: { fontSize: 18, color: "#1F2937" },
  pauseWrap: {
    borderRadius: 30,
    overflow: "hidden",
    shadowColor: ORANGE_DARK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  pauseBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: 28,
    paddingHorizontal: 8,
  },
  statItem: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 17, color: "#1F2937" },
  statLabel: { fontSize: 11, color: "#9CA3AF", marginTop: 3 },
  statDivider: { width: 1, height: 30, backgroundColor: "#D1D5DB" },
  addWrap: { marginHorizontal: 16, marginTop: 16 },
  addBtn: {
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  addBtnText: { fontSize: 15, color: "#FFFFFF" },
});

// ─── Root ─────────────────────────────────────────────────────────────────────
function FitnessTimer({ onBack: onRootBack }) {
  const [screen, setScreen] = useState(SCREENS.SEARCH);
  const [activity, setActivity] = useState(null);
  const [timerSettings, setTimerSettings] = useState(null);
  const [workoutPlan, setWorkoutPlan] = useState(null); // Optional: Store for later

  const goBack = useCallback(() => {
    switch (screen) {
      case SCREENS.SEARCH:
        onRootBack?.();
        break;
      case SCREENS.MAP_ROUTE:
      case SCREENS.WORKOUT_PLAN:
        setScreen(SCREENS.SEARCH);
        break;
      case SCREENS.TIMER_SETUP:
        if (activity?.id === "workout") setScreen(SCREENS.WORKOUT_PLAN);
        else setScreen(activity?.hasMap ? SCREENS.MAP_ROUTE : SCREENS.SEARCH);
        break;
      case SCREENS.ACTIVE_TIMER:
        setScreen(SCREENS.TIMER_SETUP);
        break;
      default:
        setScreen(SCREENS.SEARCH);
    }
  }, [screen, activity]);

  const handleSelect = (act) => {
    setActivity(act);
    if (act.id === "workout") {
      setScreen(SCREENS.WORKOUT_PLAN);
    } else {
      setScreen(act.hasMap ? SCREENS.MAP_ROUTE : SCREENS.TIMER_SETUP);
    }
  };

  const handleMapContinue = () => setScreen(SCREENS.TIMER_SETUP);
  
  const handleWorkoutContinue = (planDetails) => {
    setWorkoutPlan(planDetails);
    setScreen(SCREENS.TIMER_SETUP);
  };

  const handleStartTimer = (settings) => {
    setTimerSettings(settings);
    setScreen(SCREENS.ACTIVE_TIMER);
  };

  const handleAddActivity = () => {
    onRootBack?.();
  };

  switch (screen) {
    case SCREENS.SEARCH:
      return <SearchScreen onBack={goBack} onSelect={handleSelect} />;

    case SCREENS.WORKOUT_PLAN:
      return (
        <WorkoutPlannerScreen 
          activity={activity} 
          onBack={goBack} 
          onContinue={handleWorkoutContinue} 
        />
      );

    case SCREENS.MAP_ROUTE:
      return (
        <MapRouteScreen
          activity={activity}
          onBack={goBack}
          onContinue={handleMapContinue}
        />
      );

    case SCREENS.TIMER_SETUP:
      return (
        <TimerSetupScreen
          activity={activity}
          onBack={goBack}
          onStart={handleStartTimer}
        />
      );

    case SCREENS.ACTIVE_TIMER:
      return (
        <ActiveTimerScreen
          activity={activity}
          settings={timerSettings}
          onBack={goBack}
          onAddActivity={handleAddActivity}
        />
      );

    default:
      return <SearchScreen onBack={goBack} onSelect={handleSelect} />;
  }
}

export default React.memo(FitnessTimer);
