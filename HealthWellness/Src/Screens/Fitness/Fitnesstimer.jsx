import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
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
import Svg, { Circle } from "react-native-svg";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "../../../components/TextWrapper"; // Adjust path if needed

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// ─── Constants (Restored Purple & Orange Palette) ─────────────────────────────
const PURPLE = "#5A3FB8";
const PURPLE_LIGHT = "#F4F0FF";
const ORANGE = "#E67E22";
const ORANGE_GRAD = ["#F3BA64", "#D87E18"];
const ARC_COLOR = "#A883F8";
const ARC_BG = "#E5E7EB";

// ─── Screen state machine ─────────────────────────────────────────────────────
const SCREENS = {
  SEARCH: "SEARCH",
  MAP_ROUTE: "MAP_ROUTE",
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
    desc: "Running 1 hr burns almost 300kcal..",
  },
  {
    id: "walking",
    label: "Walking",
    icon: "walk",
    hasMap: true,
    desc: "Walking 1 hr burns almost 150kcal..",
  },
  {
    id: "workout",
    label: "Workout",
    icon: "dumbbell",
    hasMap: false,
    desc: "Workout 1 hr burns almost 300kcal..",
  },
  {
    id: "cycling",
    label: "Cycling",
    icon: "bike",
    hasMap: true,
    desc: "Cycling 1 hr burns almost 400kcal..",
  },
  {
    id: "swimming",
    label: "Swimming",
    icon: "swim",
    hasMap: false,
    desc: "Swimming 1 hr burns almost 350kcal..",
  },
];

const QUICK_DAILY = [
  { id: "swimming", label: "Swimming", sub: "1 hr" },
  { id: "walking", label: "Walking", sub: "1.5 hrs" },
];

const PACE_OPTIONS = [
  { key: "slow", label: "Slow", desc: "8.0 km/h" },
  { key: "moderate", label: "Moderate", desc: "12.0 km/h" },
  { key: "fast", label: "Fast", desc: "17.0 km/h" },
];

const WORKOUT_INTENSITIES = [
  { key: "light", label: "Light", desc: "Warm-up" },
  { key: "moderate", label: "Moderate", desc: "Active" },
  { key: "intense", label: "Intense", desc: "Max Effort" },
];

const WORKOUT_TYPES = [
  { id: "chest", label: "Chest", icon: "human-handsup", defaultTime: "60" },
  { id: "back", label: "Back", icon: "human-male", defaultTime: "60" },
  { id: "legs", label: "Legs", icon: "run", defaultTime: "90" },
  { id: "shoulders", label: "Shoulders", icon: "weight-lifter", defaultTime: "45" },
  { id: "arms", label: "Arms", icon: "arm-flex", defaultTime: "45" },
  { id: "core", label: "Core", icon: "yoga", defaultTime: "20" },
  { id: "cardio", label: "Cardio", icon: "heart-pulse", defaultTime: "30" },
];

// Rough average speeds used only to estimate how long a candidate path will take.
const ACTIVITY_SPEED_KMH = {
  running: 10,
  walking: 5,
  cycling: 18,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const pad = (n) => String(n).padStart(2, "0");
const formatTime = (s) => `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
const getCurrentDay = () => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[new Date().getDay()];
};

// Haversine distance (km) between two {latitude, longitude} points.
const haversineKm = (a, b) => {
  const R = 6371;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLng = ((b.longitude - a.longitude) * Math.PI) / 180;
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
};

const totalPathDistanceKm = (coords) => {
  let total = 0;
  for (let i = 1; i < coords.length; i++) {
    total += haversineKm(coords[i - 1], coords[i]);
  }
  return total;
};

// Builds a handful of loop-shaped candidate routes that start and end at the
// user's current location, so they can pick which path to walk/run/cycle.
// In a production build the `shape` offsets below would be replaced with
// real paths pulled from a places/directions API (e.g. nearby parks, trails,
// or roads), keyed off the user's area — the selection UI stays the same.
const buildNearbyPaths = (origin) => {
  const kmToDeg = (km) => km / 111; // ~111km per degree of latitude

  const loops = [
    {
      id: "loop-short",
      name: "Neighbourhood Loop",
      difficulty: "Easy",
      shape: [
        [0, 0],
        [0.6, 0.3],
        [0.6, -0.3],
        [0, -0.5],
        [-0.5, 0],
        [0, 0],
      ],
    },
    {
      id: "loop-medium",
      name: "Park Perimeter",
      difficulty: "Moderate",
      shape: [
        [0, 0],
        [1.1, 0.4],
        [1.4, -0.3],
        [0.6, -1.0],
        [-0.4, -0.6],
        [-0.6, 0.4],
        [0, 0],
      ],
    },
    {
      id: "loop-long",
      name: "Riverside Long Run",
      difficulty: "Hard",
      shape: [
        [0, 0],
        [1.8, 0.6],
        [2.4, -0.2],
        [1.6, -1.6],
        [0.2, -1.8],
        [-0.8, -0.6],
        [-0.6, 0.8],
        [0, 0],
      ],
    },
  ];

  return loops.map((loop) => {
    const coords = loop.shape.map(([dx, dy]) => ({
      latitude: origin.latitude + kmToDeg(dy),
      longitude: origin.longitude + kmToDeg(dx),
    }));
    return {
      id: loop.id,
      name: loop.name,
      difficulty: loop.difficulty,
      coords,
      distanceKm: totalPathDistanceKm(coords),
    };
  });
};

const estimateMinutes = (distanceKm, activityId) => {
  const speed = ACTIVITY_SPEED_KMH[activityId] || 8;
  return Math.max(1, Math.round((distanceKm / speed) * 60));
};

const iconForActivity = (iconName, size = 26, color = ORANGE) => {
  const map = {
    run: "run",
    walk: "walk",
    bike: "bike",
    swim: "swim",
    dumbbell: "dumbbell",
  };
  return (
    <MaterialCommunityIcons
      name={map[iconName] || "run"}
      size={size}
      color={color}
    />
  );
};

// ─── Shared Header ────────────────────────────────────────────────────────────
const Header = ({ onBack, transparent = false, title = "Fitness Timer" }) => {
  const topOffset =
    Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 10 : 44;
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
          {title}
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
    paddingBottom: 12,
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
  title: { fontSize: 18, lineHeight: 22, color: PURPLE },
  sub: { fontSize: 12, lineHeight: 16, color: "#6B7280" },
});

// ─── Circular Arc Timer (SVG-based) ───────────────────────────────────────────
const CircularTimer = ({ seconds, totalSeconds = 5040, paused }) => {
  const SIZE = 200;
  const STROKE = 18;
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
          stroke={ARC_BG}
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
    fontSize: 44,
    letterSpacing: 1,
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.15)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});

// ─── Screen 1: Search ─────────────────────────────────────────────────────────
const SearchScreen = ({ onBack, onSelect }) => {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? ALL_ACTIVITIES.filter((a) =>
        a.label.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  return (
    <View style={ss.screen}>
      <Header onBack={onBack} />

      <View style={ss.searchWrap}>
        <Ionicons
          name="search"
          size={16}
          color="#9CA3AF"
          style={ss.searchIcon}
        />
        <TextInput
          style={ss.searchInput}
          placeholder="Search Activity"
          placeholderTextColor="#9CA3AF"
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")}>
            <Ionicons name="close-circle" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        contentContainerStyle={ss.scroll}
        showsVerticalScrollIndicator={false}
      >
        {query.trim() === "" ? (
          <>
            <Text weight="700" style={ss.sectionTitle}>
              Quick Daily Logs
            </Text>
            <View style={ss.quickRow}>
              {QUICK_DAILY.map((q) => {
                const act = ALL_ACTIVITIES.find((a) => a.id === q.id);
                return (
                  <TouchableOpacity
                    key={q.id}
                    activeOpacity={0.8}
                    style={ss.quickCard}
                    onPress={() => act && onSelect(act)}
                  >
                    <View style={ss.quickIconCircle}>
                      {iconForActivity(act?.icon || "walk", 22, ORANGE)}
                    </View>
                    <Text weight="600" style={ss.quickLabel}>
                      {q.label}
                    </Text>
                    <Text weight="400" style={ss.quickSub}>
                      {q.sub}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={ss.notFoundWrap}>
              <Text weight="400" style={ss.notFoundText}>
                Didn't Find What you are looking for?
              </Text>
            </View>
          </>
        ) : (
          <>
            {filtered.length > 0 ? (
              filtered.map((act) => (
                <TouchableOpacity
                  key={act.id}
                  activeOpacity={0.85}
                  style={ss.resultRow}
                  onPress={() => onSelect(act)}
                >
                  <View style={ss.resultIconCircle}>
                    {iconForActivity(act.icon, 26, ORANGE)}
                  </View>
                  <View style={ss.resultText}>
                    <Text weight="700" style={ss.resultName}>
                      {act.label}
                    </Text>
                    <Text weight="400" style={ss.resultDesc}>
                      {act.desc}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
                </TouchableOpacity>
              ))
            ) : (
              <Text weight="400" style={[ss.notFoundText, { marginTop: 32 }]}>
                No activities found for "{query}"
              </Text>
            )}
            <View style={ss.notFoundWrap}>
              <Text weight="400" style={ss.notFoundText}>
                Didn't Find What you are looking for?
              </Text>
            </View>
          </>
        )}
      </ScrollView>

      <View style={ss.addCustomWrap}>
        <TouchableOpacity activeOpacity={0.85} style={ss.addCustomBtn}>
          <LinearGradient
            colors={ORANGE_GRAD}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={ss.addCustomGradient}
          >
            <Text weight="700" style={ss.addCustomText}>
              + Add Custom Activity
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ss = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFFFFF" },
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
  scroll: { paddingHorizontal: 16, paddingBottom: 100 },
  sectionTitle: {
    fontSize: 16,
    lineHeight: 20,
    color: "#1F2937",
    marginBottom: 12,
  },
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
  notFoundWrap: { marginTop: 32, alignItems: "center" },
  notFoundText: { fontSize: 13, color: "#6B7280", textAlign: "center" },
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
});

// ─── Screen 2: Map + Route ────────────────────────────────────────────────────
// Flow: get the user's location -> generate/list candidate paths in their
// area -> user taps a path card to preview it on the map -> user confirms ->
// summary + Continue. Optionally auto-track their live GPS position too.
const MapRouteScreen = ({ activity, onBack, onContinue }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(false);
  const [pathOptions, setPathOptions] = useState([]);
  const [selectedPathId, setSelectedPathId] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const [autoTrack, setAutoTrack] = useState(true);
  const [gpsActive, setGpsActive] = useState(false);
  const [routeCoords, setRouteCoords] = useState([]);
  const watchSub = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationError(true);
        Alert.alert(
          "Permission denied",
          "Location access is needed to show walking/running paths near you.",
        );
        return;
      }
      try {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        const point = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        };
        setUserLocation(point);

        // Generate the candidate paths available in the user's area.
        const paths = buildNearbyPaths(point);
        setPathOptions(paths);
        setSelectedPathId(paths[0]?.id ?? null);
      } catch (e) {
        setLocationError(true);
      }
    })();
    return () => watchSub.current?.remove();
  }, []);

  const selectedPath = useMemo(
    () => pathOptions.find((p) => p.id === selectedPathId) || null,
    [pathOptions, selectedPathId],
  );

  const handleSelectPath = (path) => {
    setSelectedPathId(path.id);
    if (mapRef.current) {
      mapRef.current.fitToCoordinates(path.coords, {
        edgePadding: { top: 120, right: 60, bottom: 260, left: 60 },
        animated: true,
      });
    }
  };

  const handleConfirm = async () => {
    if (!selectedPath) return;

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
    setConfirmed(true);
  };

  const defaultRegion = userLocation
    ? { ...userLocation, latitudeDelta: 0.03, longitudeDelta: 0.03 }
    : {
        latitude: 28.6139,
        longitude: 77.209,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      };

  const estMinutes = selectedPath
    ? estimateMinutes(selectedPath.distanceKm, activity?.id)
    : 0;

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
        {/* Faint preview of every candidate path in the area */}
        {pathOptions
          .filter((p) => p.id !== selectedPathId)
          .map((p) => (
            <Polyline
              key={p.id}
              coordinates={p.coords}
              strokeColor="#C7C2DA"
              strokeWidth={3}
            />
          ))}

        {/* Highlighted, currently-selected path */}
        {selectedPath && (
          <Polyline
            coordinates={selectedPath.coords}
            strokeColor={ORANGE}
            strokeWidth={5}
          />
        )}

        {/* Live tracked route once the activity has started */}
        {routeCoords.length > 1 && (
          <Polyline
            coordinates={routeCoords}
            strokeColor={PURPLE}
            strokeWidth={4}
          />
        )}

        {selectedPath &&
          [selectedPath.coords[0], selectedPath.coords[selectedPath.coords.length - 1]].map(
            (pt, i) => (
              <Marker key={i} coordinate={pt}>
                <View style={ms.stopDot} />
              </Marker>
            ),
          )}

        {userLocation && (
          <Marker coordinate={userLocation}>
            <View style={ms.userDotOuter}>
              <View style={ms.userDotInner} />
            </View>
          </Marker>
        )}
      </MapView>

      <View style={ms.headerOverlay}>
        <Header onBack={onBack} transparent />
      </View>

      <View style={ms.sheet}>
        {confirmed ? (
          <>
            <View style={ms.summaryCard}>
              <View style={ms.stopRow}>
                <Ionicons
                  name="location-outline"
                  size={16}
                  color="#6B7280"
                  style={{ marginRight: 8 }}
                />
                <Text weight="500" style={ms.stopLabel}>
                  {selectedPath?.name}
                </Text>
              </View>
              <View style={ms.stopRow}>
                <Ionicons
                  name="trail-sign-outline"
                  size={16}
                  color="#6B7280"
                  style={{ marginRight: 8 }}
                />
                <Text weight="500" style={ms.stopLabel}>
                  {selectedPath?.difficulty} · {selectedPath?.distanceKm.toFixed(1)} km
                </Text>
              </View>
              <View style={ms.divider} />
              <Text weight="700" style={ms.tripTime}>
                Estimated time: {estMinutes} min
              </Text>
            </View>

            <View style={ms.sheetBottomContent}>
              <Text weight="400" style={ms.tripMeta}>
                <Text weight="700" style={{ color: "#1F2937" }}>
                  {estMinutes} min
                </Text>{" "}
                ({selectedPath?.distanceKm.toFixed(1)} km) · {selectedPath?.difficulty}
              </Text>
              <TouchableOpacity
                activeOpacity={0.85}
                style={ms.primaryBtnWrap}
                onPress={() => onContinue(selectedPath)}
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
            </View>
          </>
        ) : (
          <>
            <Text weight="700" style={ms.pickerTitle}>
              Choose Your Path
            </Text>
            <Text weight="400" style={ms.pickerSub}>
              {locationError
                ? "Enable location to see paths near you."
                : userLocation
                  ? "Suggested paths near your current area"
                  : "Finding paths near you…"}
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={ms.pathScrollContent}
              style={{ marginBottom: 14 }}
            >
              {pathOptions.map((p) => {
                const active = p.id === selectedPathId;
                const min = estimateMinutes(p.distanceKm, activity?.id);
                return (
                  <TouchableOpacity
                    key={p.id}
                    activeOpacity={0.85}
                    style={[ms.pathCard, active && ms.pathCardActive]}
                    onPress={() => handleSelectPath(p)}
                  >
                    {active && (
                      <View style={ms.checkBadge}>
                        <Ionicons name="checkmark" size={12} color="#FFF" />
                      </View>
                    )}
                    <Text
                      weight={active ? "700" : "600"}
                      style={[ms.pathCardTitle, active && ms.pathCardTitleActive]}
                      numberOfLines={1}
                    >
                      {p.name}
                    </Text>
                    <Text
                      weight="400"
                      style={[ms.pathCardMeta, active && ms.pathCardMetaActive]}
                    >
                      {p.distanceKm.toFixed(1)} km · {min} min
                    </Text>
                    <View style={ms.pathCardTag}>
                      <Text weight="500" style={ms.pathCardTagText}>
                        {p.difficulty}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={ms.optionCard}>
              <View style={[ms.optionRow, { borderBottomWidth: 0 }]}>
                <View style={{ flex: 1 }}>
                  <Text weight="600" style={ms.optionTitle}>
                    Auto-Track My Route
                  </Text>
                  <Text weight="400" style={ms.optionSub}>
                    Record your live GPS position while you follow the path
                  </Text>
                </View>
                <Switch
                  value={autoTrack}
                  onValueChange={setAutoTrack}
                  trackColor={{ false: "#D1D5DB", true: "#BBF7D0" }}
                  thumbColor={autoTrack ? "#22C55E" : "#F3F4F6"}
                />
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                ms.primaryBtnWrap,
                !selectedPath && { opacity: 0.5 },
              ]}
              onPress={handleConfirm}
              disabled={!selectedPath}
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
                  Start on this Path
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
    backgroundColor: "rgba(255,255,255,0.95)",
    zIndex: 10,
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === "ios" ? 38 : 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 12,
    zIndex: 20,
  },
  pickerTitle: { fontSize: 16, lineHeight: 20, color: "#1F2937", marginBottom: 2 },
  pickerSub: { fontSize: 12, lineHeight: 16, color: "#9CA3AF", marginBottom: 14 },
  pathScrollContent: { gap: 12, paddingRight: 16 },
  pathCard: {
    width: 150,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    position: "relative",
  },
  pathCardActive: {
    backgroundColor: PURPLE_LIGHT,
    borderColor: PURPLE,
    shadowOpacity: 0.08,
  },
  pathCardTitle: { fontSize: 14, color: "#374151", marginBottom: 4 },
  pathCardTitleActive: { color: PURPLE },
  pathCardMeta: { fontSize: 12, color: "#9CA3AF", marginBottom: 8 },
  pathCardMetaActive: { color: PURPLE },
  pathCardTag: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: "#FFF0E6",
  },
  pathCardTagText: { fontSize: 10, color: ORANGE },
  checkBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: PURPLE,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    zIndex: 2,
  },
  optionCard: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  divider: { height: 1, backgroundColor: "#E5E7EB", width: "100%" },
  optionTitle: { fontSize: 14, color: "#1F2937", marginBottom: 2 },
  optionSub: { fontSize: 11, color: "#9CA3AF" },
  primaryBtnWrap: { borderRadius: 12, overflow: "hidden" },
  primaryBtn: {
    flexDirection: "row",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  primaryBtnText: { fontSize: 15, color: "#FFFFFF" },
  summaryCard: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#FFFFFF",
    marginBottom: 20,
  },
  stopRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  stopLabel: { fontSize: 13, color: "#4B5563" },
  tripTime: { fontSize: 14, color: "#1F2937", marginTop: 4 },
  sheetBottomContent: { paddingHorizontal: 4 },
  tripMeta: { fontSize: 12, color: "#9CA3AF", marginBottom: 16 },
  userDotOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(230, 126, 34, 0.3)", // Tinted Orange
    alignItems: "center",
    justifyContent: "center",
  },
  userDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: ORANGE,
  },
  stopDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#FFFFFF",
    borderWidth: 3,
    borderColor: ORANGE,
  },
});

// ─── Screen 3: Timer Setup ────────────────────────────────────────────────────
const TimerSetupScreen = ({ activity, onBack, onStart, selectedPath }) => {
  const [pace, setPace] = useState("moderate"); // Default to moderate as it exists in both
  const [minutes, setMinutes] = useState(
    selectedPath ? String(estimateMinutes(selectedPath.distanceKm, activity?.id)) : "60",
  );
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  const today = getCurrentDay();
  const isWorkout = activity?.id === "workout";

  // Use map-based paces for running/walking, and intensity levels for workout/swimming
  const intensityOptions = activity?.hasMap ? PACE_OPTIONS : WORKOUT_INTENSITIES;

  const handleWorkoutSelect = (type) => {
    setSelectedWorkout(type.id);
    setMinutes(type.defaultTime); 
  };

  return (
    <View style={ts.screen}>
      <Header onBack={onBack} />
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={ts.activityRow}>
          <View style={ts.activityIconCircle}>
            {iconForActivity(activity.icon, 28, ORANGE)}
          </View>
          <Text weight="700" style={ts.activityTitle}>
            {activity.label}
          </Text>
        </View>

        {selectedPath && (
          <View style={ts.pathBanner}>
            <Ionicons name="map-outline" size={16} color={PURPLE} style={{ marginRight: 8 }} />
            <Text weight="500" style={ts.pathBannerText}>
              Following {selectedPath.name} · {selectedPath.distanceKm.toFixed(1)} km
            </Text>
          </View>
        )}

        {/* --- PREMIUM HORIZONTAL WORKOUT SELECTION --- */}
        {isWorkout && (
          <View style={ts.dynamicWorkoutWrap}>
            <View style={ts.workoutHeader}>
              <Text weight="700" style={ts.dayLabel}>
                Today is {today}
              </Text>
              <Text weight="400" style={ts.daySub}>
                Select the target muscle group you'll be focusing on to log your activity correctly.
              </Text>
            </View>

            <ScrollView 
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={ts.workoutScrollContent}
            >
              {WORKOUT_TYPES.map((type) => {
                const isActive = selectedWorkout === type.id;
                return (
                  <TouchableOpacity
                    key={type.id}
                    activeOpacity={0.8}
                    style={[
                      ts.workoutTile,
                      isActive && ts.workoutTileActive,
                    ]}
                    onPress={() => handleWorkoutSelect(type)}
                  >
                    {isActive && (
                      <View style={ts.checkBadge}>
                        <Ionicons name="checkmark" size={12} color="#FFF" />
                      </View>
                    )}

                    <View style={ts.workoutTileContent}>
                      <View
                        style={[
                          ts.iconBox,
                          isActive ? ts.iconBoxActive : null,
                        ]}
                      >
                        <MaterialCommunityIcons
                          name={type.icon}
                          size={24}
                          color={isActive ? PURPLE : "#6B7280"}
                        />
                      </View>

                      <View style={ts.workoutTileTextWrap}>
                        <Text
                          weight={isActive ? "700" : "600"}
                          style={[
                            ts.workoutTileTitle,
                            isActive && ts.workoutTileTitleActive,
                          ]}
                        >
                          {type.label}
                        </Text>
                        <View style={ts.timeIndicator}>
                          <Ionicons
                            name="time-outline"
                            size={12}
                            color={isActive ? PURPLE : "#9CA3AF"}
                          />
                          <Text
                            weight="500"
                            style={[
                              ts.workoutTileTime,
                              isActive && ts.workoutTileTimeActive,
                            ]}
                          >
                            {type.defaultTime} min
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}
        {/* --------------------------------------------- */}

        {/* Dynamic Distance/Intensity Chips */}
        <View style={ts.speedRow}>
          {intensityOptions.map((p) => {
            const active = pace === p.key;
            return (
              <TouchableOpacity
                key={p.key}
                activeOpacity={0.85}
                style={[ts.speedChip, active && ts.speedChipActive]}
                onPress={() => setPace(p.key)}
              >
                <Text
                  weight="600"
                  style={[ts.speedChipLabel, active && ts.speedChipLabelActive]}
                >
                  {p.label}
                </Text>
                <Text
                  weight="400"
                  style={[ts.speedChipValue, active && ts.speedChipValueActive]}
                >
                  {p.desc}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={ts.fieldGroup}>
          <Text weight="500" style={ts.fieldLabel}>
            Time Limit
          </Text>
          <View style={ts.fieldInputWrap}>
            <TextInput
              style={ts.fieldInput}
              value={minutes}
              onChangeText={setMinutes}
              keyboardType="numeric"
              placeholder="60"
              placeholderTextColor="#9CA3AF"
            />
            <Text weight="500" style={ts.fieldSuffixText}>
              min
            </Text>
          </View>

          {/* Quick Time Limit Buttons */}
          <View style={ts.quickTimeWrap}>
            {["30", "45", "60", "90"].map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  ts.quickTimeBtn,
                  minutes === time && ts.quickTimeBtnActive,
                ]}
                onPress={() => setMinutes(time)}
              >
                <Text
                  style={[
                    ts.quickTimeText,
                    minutes === time && ts.quickTimeTextActive,
                  ]}
                >
                  {time}m
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          style={ts.startBtnWrap}
          onPress={() =>
            onStart({ pace, minutes: parseInt(minutes) || 60, selectedWorkout })
          }
        >
          <LinearGradient
            colors={ORANGE_GRAD}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={ts.startBtnGradient}
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
    marginBottom: 20,
    marginTop: 8,
  },
  activityIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FFF0E6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  activityTitle: { fontSize: 20, lineHeight: 26, color: "#1F2937" },

  pathBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PURPLE_LIGHT,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 20,
  },
  pathBannerText: { fontSize: 13, color: PURPLE, flexShrink: 1 },

  /* Horizontal Scroll Workout Section Styles */
  dynamicWorkoutWrap: {
    marginBottom: 28,
  },
  workoutHeader: {
    marginBottom: 16,
  },
  dayLabel: { fontSize: 18, color: "#1F2937", marginBottom: 6, letterSpacing: 0.2 },
  daySub: { fontSize: 13, color: "#6B7280", lineHeight: 18 },
  
  workoutScrollContent: {
    gap: 12,
    paddingRight: 16, 
  },
  workoutTile: {
    width: 125, // Fixed width forces tiles side-by-side inside scrollview
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    position: "relative",
  },
  workoutTileActive: {
    backgroundColor: PURPLE_LIGHT,
    borderColor: PURPLE,
    shadowOpacity: 0.08,
  },
  workoutTileContent: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  iconBoxActive: {
    backgroundColor: "#FFFFFF",
  },
  workoutTileTextWrap: {
    width: "100%",
  },
  workoutTileTitle: {
    fontSize: 15,
    color: "#374151",
    marginBottom: 4,
  },
  workoutTileTitleActive: {
    color: PURPLE,
  },
  timeIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  workoutTileTime: {
    fontSize: 12,
    color: "#9CA3AF",
    marginLeft: 4,
  },
  workoutTileTimeActive: {
    color: PURPLE,
  },
  checkBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: PURPLE,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    zIndex: 2,
  },

  /* Form & Actions */
  speedRow: { flexDirection: "row", gap: 8, marginBottom: 24 },
  speedChip: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  speedChipActive: { backgroundColor: "#FFF0E6", borderColor: ORANGE },
  speedChipLabel: { fontSize: 12, lineHeight: 15, color: "#6B7280" },
  speedChipLabelActive: { color: ORANGE },
  speedChipValue: {
    fontSize: 10,
    lineHeight: 13,
    color: "#9CA3AF",
    marginTop: 4,
  },
  speedChipValueActive: { color: ORANGE },
  fieldGroup: { flex: 1, marginBottom: 32 },
  fieldLabel: {
    fontSize: 12,
    lineHeight: 15,
    color: "#6B7280",
    marginBottom: 8,
  },
  fieldInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    backgroundColor: "#FAFAFA",
  },
  fieldInput: { flex: 1, fontSize: 14, color: "#1F2937", paddingVertical: 0 },
  fieldSuffixText: { fontSize: 13, color: "#9CA3AF", marginLeft: 4 },

  quickTimeWrap: { flexDirection: "row", marginTop: 12, gap: 8 },
  quickTimeBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 6,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "transparent",
  },
  quickTimeBtnActive: { backgroundColor: "#FFF0E6", borderColor: ORANGE },
  quickTimeText: { fontSize: 12, color: "#4B5563" },
  quickTimeTextActive: { color: ORANGE, fontWeight: "600" },

  startBtnWrap: { borderRadius: 12, overflow: "hidden" },
  startBtnGradient: {
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

  // Dynamically calculate calories based on whether pace was speed or intensity
  const calPerSec =
    (settings.pace === "fast" || settings.pace === "intense")
      ? 0.12
      : (settings.pace === "moderate")
        ? 0.09
        : 0.06; // Covers both "slow" and "light"

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
        colors={["#F8EAF6", "#E5DDF5"]} 
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={at.timerCard}
      >
        <View style={{ marginTop: 20, marginBottom: 30 }}>
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
          <View style={at.pauseBtn}>
            <Ionicons
              name={paused ? "play" : "pause"}
              size={22}
              color="#064E3B"
            />
          </View>
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
          <View style={at.statItem}>
            <Text weight="700" style={at.statValue}>
              {formatTime(seconds)}
            </Text>
            <Text weight="400" style={at.statLabel}>
              Time
            </Text>
          </View>
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
          style={{ borderRadius: 12, overflow: "hidden" }}
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
  screen: { flex: 1, backgroundColor: "#FFFFFF" },
  timerCard: {
    flex: 1,
    marginTop: 20,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 30,
    paddingBottom: 28,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  pauseWrap: {
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 44,
  },
  pauseBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#D9F99D", 
    alignItems: "center",
    justifyContent: "center",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 8,
  },
  statItem: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 22, color: "#1F2937", marginBottom: 6 },
  statLabel: { fontSize: 12, color: "#6B7280" },
  addWrap: {
    marginHorizontal: 16,
    marginBottom: Platform.OS === "ios" ? 40 : 24,
    marginTop: 16,
  },
  addBtn: { height: 50, alignItems: "center", justifyContent: "center" },
  addBtnText: { fontSize: 15, color: "#FFFFFF" },
});

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function FitnessTimer({ onBack: onRootBack }) {
  const [screen, setScreen] = useState(SCREENS.SEARCH);
  const [activity, setActivity] = useState(null);
  const [timerSettings, setTimerSettings] = useState(null);
  const [selectedPath, setSelectedPath] = useState(null);

  const goBack = useCallback(() => {
    switch (screen) {
      case SCREENS.SEARCH:
        onRootBack?.();
        break;
      case SCREENS.MAP_ROUTE:
        setScreen(SCREENS.SEARCH);
        break;
      case SCREENS.TIMER_SETUP:
        setScreen(activity?.hasMap ? SCREENS.MAP_ROUTE : SCREENS.SEARCH);
        break;
      case SCREENS.ACTIVE_TIMER:
        setScreen(SCREENS.TIMER_SETUP);
        break;
      default:
        setScreen(SCREENS.SEARCH);
    }
  }, [screen, activity, onRootBack]);

  const handleSelect = (act) => {
    setActivity(act);
    setSelectedPath(null);
    setScreen(act.hasMap ? SCREENS.MAP_ROUTE : SCREENS.TIMER_SETUP);
  };

  const handleMapContinue = (path) => {
    setSelectedPath(path);
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
          selectedPath={selectedPath}
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
