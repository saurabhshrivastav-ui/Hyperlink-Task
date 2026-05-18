import React, { useState, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  Platform,
  StatusBar,
  Animated,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "../../../components/TextWrapper";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ─── Constants ────────────────────────────────────────────────────────────────
const TABS = ["Day", "Week", "Month"];
const PURPLE = "#5C43BF";
const ORANGE = "#E67E22";

// ─── Date strip data (Day tab) ────────────────────────────────────────────────
const DATE_STRIP = [
  { month: "Feb", day: 26, active: true },
  { month: "Feb", day: 27 },
  { month: "Feb", day: 28 },
  { month: "Mar", day: "01" },
  { month: "Mar", day: "02" },
  { month: "Mar", day: "03" },
  { month: "Mar", day: "04" },
  { month: "Mar", day: "05" },
  { month: "Mar", day: "06" },
];

// ─── Activity log entries ─────────────────────────────────────────────────────
const ACTIVITIES = [
  { id: "1", label: "Running", duration: "60 mins", kcal: "220 kcal", distance: "2 km" },
  { id: "2", label: "Running", duration: "60 mins", kcal: "220 kcal", distance: "2 km" },
  { id: "3", label: "Running", duration: "60 mins", kcal: "220 kcal", distance: "2 km" },
];

// ─── Weekly bar chart data ────────────────────────────────────────────────────
const WEEK_BARS = [
  { day: "Sun", value: 900 },
  { day: "Mon", value: 600 },
  { day: "Tue", value: 700 },
  { day: "Wed", value: 450 },
  { day: "Thu", value: 1000, tooltip: { speed: "35 km/h", date: "01 May 2023 10:00 AM" } },
  { day: "Fri", value: 1500, highlight: true },
  { day: "Sat", value: 850 },
];
const MAX_BAR_VALUE = 1500;
const Y_AXIS = [0, 250, 500, 750, 1000, 1250, 1500];
const CHART_HEIGHT = 200;
const BAR_AREA_HEIGHT = 160;

// ─── Wave SVG shape for Day view hero ────────────────────────────────────────
const WaveBackground = () => (
  // Simple wave using a View with border-radius trick
  <View style={styles.waveContainer} pointerEvents="none">
    <View style={styles.wavePeach} />
  </View>
);

// ─── Activity row ─────────────────────────────────────────────────────────────
const ActivityRow = ({ item }) => (
  <View style={styles.activityRow}>
    <View style={styles.activityIconWrap}>
      <MaterialCommunityIcons name="run" size={22} color={ORANGE} />
    </View>
    <View style={styles.activityInfo}>
      <Text weight="600" style={styles.activityLabel}>{item.label}</Text>
      <Text weight="400" style={styles.activitySub}>{item.duration}</Text>
    </View>
    <View style={styles.activityRight}>
      <Text weight="700" style={styles.activityKcal}>{item.kcal}</Text>
      <Text weight="400" style={styles.activityDist}>{item.distance}</Text>
    </View>
  </View>
);

// ─── Week bar chart ───────────────────────────────────────────────────────────
const WeekChart = () => {
  const [tooltip, setTooltip] = useState(null); // { x, bar }

  const barWidth = 28;
  const chartInnerWidth = SCREEN_WIDTH - 32 - 48; // minus padding and y-axis

  return (
    <View style={styles.chartWrap}>
      {/* Y-axis labels + bars */}
      <View style={styles.chartInner}>
        {/* Y axis */}
        <View style={styles.yAxis}>
          {[...Y_AXIS].reverse().map((v) => (
            <Text key={v} weight="400" style={styles.yLabel}>{v}</Text>
          ))}
        </View>

        {/* Bars area */}
        <View style={styles.barsArea}>
          {/* Horizontal grid lines */}
          {Y_AXIS.map((v, i) => (
            <View
              key={v}
              style={[
                styles.gridLine,
                { bottom: (v / MAX_BAR_VALUE) * BAR_AREA_HEIGHT },
              ]}
            />
          ))}

          {/* Bars */}
          <View style={styles.barsRow}>
            {WEEK_BARS.map((bar, idx) => {
              const barH = Math.round((bar.value / MAX_BAR_VALUE) * BAR_AREA_HEIGHT);
              const isActive = bar.tooltip || bar.highlight;
              return (
                <TouchableOpacity
                  key={bar.day}
                  activeOpacity={0.8}
                  onPress={() =>
                    bar.tooltip
                      ? setTooltip(tooltip?.day === bar.day ? null : bar)
                      : null
                  }
                  style={styles.barColWrap}
                >
                  {/* Tooltip */}
                  {tooltip?.day === bar.day && (
                    <View style={styles.tooltipBox}>
                      <Text weight="700" style={styles.tooltipSpeed}>{bar.tooltip.speed}</Text>
                      <Text weight="400" style={styles.tooltipDate}>{bar.tooltip.date}</Text>
                    </View>
                  )}

                  {/* Circle marker on Thu */}
                  {bar.tooltip && (
                    <View style={styles.barMarker} />
                  )}

                  {/* Bar fill */}
                  <LinearGradient
                    colors={
                      bar.highlight
                        ? ["#F0A500", "#E67E22"]
                        : ["#F5C97A", "#E8A83E"]
                    }
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={[
                      styles.barFill,
                      {
                        height: barH,
                        opacity: bar.tooltip ? 0.55 : 1,
                      },
                    ]}
                  />

                  {/* Day label */}
                  <Text weight="500" style={styles.barDayLabel}>{bar.day}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      {/* X-axis label */}
      <Text weight="600" style={styles.xAxisLabel}>Weeks</Text>
    </View>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────
function FitnessHistory({ onBack }) {
  const topOffset =
    Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 10 : 18;

  const [activeTab, setActiveTab] = useState("Day");
  const [activeDateIdx, setActiveDateIdx] = useState(0);

  return (
    <View style={styles.screen}>
      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: topOffset }]}>
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.8} onPress={onBack}>
          <Ionicons name="arrow-back" size={22} color={PURPLE} />
        </TouchableOpacity>
        <View>
          <Text weight="700" style={styles.headerTitle}>Fitness History</Text>
          <Text weight="400" style={styles.headerSub}>Choose the activity you performed.</Text>
        </View>
      </View>

      {/* ── Tab switcher ── */}
      <View style={styles.tabRow}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            activeOpacity={0.85}
            style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              weight="600"
              style={[styles.tabText, activeTab === tab && styles.tabTextActive]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === "Day" && (
          <>
            {/* ── Date strip ── */}
            <FlatList
              horizontal
              data={DATE_STRIP}
              keyExtractor={(_, i) => String(i)}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dateStrip}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setActiveDateIdx(index)}
                  style={[
                    styles.dateCell,
                    (activeDateIdx === index) && styles.dateCellActive,
                  ]}
                >
                  <Text
                    weight="500"
                    style={[
                      styles.dateMonth,
                      activeDateIdx === index && styles.dateTextActive,
                    ]}
                  >
                    {item.month}
                  </Text>
                  <Text
                    weight="700"
                    style={[
                      styles.dateDay,
                      activeDateIdx === index && styles.dateTextActive,
                    ]}
                  >
                    {item.day}
                  </Text>
                </TouchableOpacity>
              )}
            />

            {/* ── Hero wave area ── */}
            <View style={styles.heroWave}>
              <WaveBackground />
              {/* Flame + kcal label */}
              <View style={styles.heroKcalWrap}>
                <Text style={styles.flameEmoji}>🔥</Text>
                <Text weight="600" style={styles.heroKcalText}>400 kcal</Text>
              </View>
            </View>

            {/* ── Summary card ── */}
            <LinearGradient
              colors={["#EDE8F8", "#F9EFF9"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.summaryCard}
            >
              {/* Total kcal row */}
              <View style={styles.summaryTopRow}>
                <View style={styles.summaryKcalRow}>
                  <Text style={styles.summaryFlame}>🔥</Text>
                  <Text weight="800" style={styles.summaryKcalValue}>400</Text>
                  <Text weight="500" style={styles.summaryKcalUnit}> kcal burned</Text>
                </View>
                <Text weight="500" style={styles.summaryDate}>26-02-2026</Text>
              </View>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Activity list */}
              {ACTIVITIES.map((item, idx) => (
                <React.Fragment key={item.id}>
                  <ActivityRow item={item} />
                  {idx < ACTIVITIES.length - 1 && <View style={styles.rowDivider} />}
                </React.Fragment>
              ))}
            </LinearGradient>

            {/* ── Edit button ── */}
            <TouchableOpacity activeOpacity={0.85} style={styles.editBtnWrap}>
              <LinearGradient
                colors={["#F3BA64", "#D87E18"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.editBtn}
              >
                <Text weight="600" style={styles.editBtnText}>Edit</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}

        {activeTab === "Week" && (
          <>
            {/* ── Calories label ── */}
            <Text weight="600" style={styles.calLabel}>Cal</Text>

            {/* ── Bar chart ── */}
            <WeekChart />
          </>
        )}

        {activeTab === "Month" && (
          <View style={styles.emptyState}>
            <Text weight="500" style={styles.emptyText}>No data for this month.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

export default React.memo(FitnessHistory);

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F3EFEB" },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: "#F3EFEB",
  },
  backBtn: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  headerTitle: { fontSize: 18, lineHeight: 22, color: PURPLE },
  headerSub: { fontSize: 12, lineHeight: 16, color: "#1A1A1A" },

  /* Tab row */
  tabRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
    elevation: 2,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  tabBtnActive: { backgroundColor: PURPLE },
  tabText: { fontSize: 13, color: "#9CA3AF" },
  tabTextActive: { color: "#FFFFFF" },

  scrollContent: { paddingBottom: 32 },

  /* Date strip */
  dateStrip: {
    paddingHorizontal: 12,
    paddingBottom: 4,
  },
  dateCell: {
    width: 52,
    height: 58,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  dateCellActive: {
    backgroundColor: PURPLE,
  },
  dateMonth: { fontSize: 11, lineHeight: 14, color: "#6B7280" },
  dateDay: { fontSize: 18, lineHeight: 22, color: "#1F2937", marginTop: 2 },
  dateTextActive: { color: "#FFFFFF" },

  /* Hero wave */
  heroWave: {
    marginHorizontal: 16,
    marginTop: 12,
    height: 90,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#FFF8F0",
    justifyContent: "flex-end",
  },
  waveContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
  },
  wavePeach: {
    position: "absolute",
    bottom: -30,
    left: -20,
    right: -20,
    height: 90,
    backgroundColor: "#FDDBB4",
    borderTopLeftRadius: 120,
    borderTopRightRadius: 80,
    opacity: 0.55,
  },
  heroKcalWrap: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  flameEmoji: { fontSize: 20, marginRight: 4 },
  heroKcalText: { fontSize: 14, color: "#1F2937" },

  /* Summary card */
  summaryCard: {
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: "#C4B5F4",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  summaryTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryKcalRow: { flexDirection: "row", alignItems: "flex-end" },
  summaryFlame: { fontSize: 22, marginRight: 4 },
  summaryKcalValue: { fontSize: 28, lineHeight: 32, color: "#1F2937" },
  summaryKcalUnit: { fontSize: 13, lineHeight: 20, color: "#6B7280", marginBottom: 2 },
  summaryDate: { fontSize: 12, color: "#6B7280" },
  divider: { height: 1, backgroundColor: "#E5E7EB", marginBottom: 10 },
  rowDivider: { height: 1, backgroundColor: "#F3F4F6", marginVertical: 4 },

  /* Activity row */
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  activityIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FDEEE2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  activityInfo: { flex: 1 },
  activityLabel: { fontSize: 14, lineHeight: 18, color: "#1F2937" },
  activitySub: { fontSize: 11, lineHeight: 15, color: "#9CA3AF", marginTop: 1 },
  activityRight: { alignItems: "flex-end" },
  activityKcal: { fontSize: 14, lineHeight: 18, color: "#1F2937" },
  activityDist: { fontSize: 11, lineHeight: 15, color: "#9CA3AF", marginTop: 1 },

  /* Edit button */
  editBtnWrap: {
    marginHorizontal: 16,
    marginTop: 18,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#D87E18",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  editBtn: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  editBtnText: { fontSize: 16, color: "#FFFFFF" },

  /* ── Week chart ── */
  calLabel: {
    marginLeft: 16,
    marginBottom: 4,
    fontSize: 13,
    color: "#6B7280",
  },
  chartWrap: {
    marginHorizontal: 16,
    marginTop: 4,
  },
  chartInner: {
    flexDirection: "row",
    height: CHART_HEIGHT,
  },
  yAxis: {
    width: 40,
    height: BAR_AREA_HEIGHT,
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingRight: 6,
    marginTop: 8,
  },
  yLabel: { fontSize: 10, color: "#9CA3AF", lineHeight: 13 },
  barsArea: {
    flex: 1,
    height: BAR_AREA_HEIGHT,
    marginTop: 8,
    position: "relative",
  },
  gridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  barsRow: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    height: BAR_AREA_HEIGHT,
  },
  barColWrap: {
    alignItems: "center",
    justifyContent: "flex-end",
    width: 32,
    height: BAR_AREA_HEIGHT,
    position: "relative",
  },
  barFill: {
    width: 22,
    borderRadius: 5,
  },
  barDayLabel: {
    fontSize: 10,
    color: "#6B7280",
    marginTop: 6,
    lineHeight: 13,
  },
  barMarker: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: PURPLE,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    position: "absolute",
    top: BAR_AREA_HEIGHT - Math.round((1000 / MAX_BAR_VALUE) * BAR_AREA_HEIGHT) - 5,
    zIndex: 10,
  },
  tooltipBox: {
    position: "absolute",
    top: -2,
    right: 2,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 20,
    width: 160,
  },
  tooltipSpeed: { fontSize: 14, color: "#1F2937" },
  tooltipDate: { fontSize: 10, color: "#9CA3AF", marginTop: 2 },
  xAxisLabel: {
    textAlign: "center",
    marginTop: 12,
    fontSize: 12,
    color: "#6B7280",
  },

  /* Empty state */
  emptyState: {
    flex: 1,
    alignItems: "center",
    paddingTop: 60,
  },
  emptyText: { fontSize: 14, color: "#9CA3AF" },
});
