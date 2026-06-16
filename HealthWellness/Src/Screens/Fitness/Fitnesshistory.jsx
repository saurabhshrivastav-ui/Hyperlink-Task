import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path, Defs, LinearGradient as SvgGradient, Stop } from "react-native-svg";
import { Text } from "../../../components/TextWrapper";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const TABS = ["Day", "Week", "Month"];
const PURPLE = "#5C43BF";
const ORANGE = "#E67E22";

// --- Mock Data ---

const DAY_DATES = [
  { month: "Feb", day: "26" },
  { month: "Feb", day: "27" },
  { month: "Feb", day: "28" },
  { month: "Mar", day: "01" },
  { month: "Mar", day: "02" },
  { month: "Mar", day: "03" },
  { month: "Mar", day: "04" },
];

const DAY_ACTIVITIES = [
  { id: 1, type: "Running", duration: "60 mins", calories: "220 kcal", distance: "2 km", icon: "run" },
  { id: 2, type: "Running", duration: "60 mins", calories: "220 kcal", distance: "2 km", icon: "run" },
  { id: 3, type: "Running", duration: "60 mins", calories: "220 kcal", distance: "2 km", icon: "run" },
];

const WEEK_BARS = [
  { day: "Sun", value: 1050 },
  { day: "Mon", value: 650 },
  { day: "Tue", value: 900 },
  { day: "Wed", value: 480 },
  { 
    day: "Thu", 
    value: 1000, 
    tooltip: { main: "35 km/h", date: "01 May 2023 10:00 AM" } 
  },
  { day: "Fri", value: 1450 },
  { day: "Sat", value: 850 },
];

const MONTH_BARS = [
  { day: "W1", value: 3200 },
  { day: "W2", value: 4500, tooltip: { main: "4500 kcal", date: "Week 2, May 2023" } },
  { day: "W3", value: 2800 },
  { day: "W4", value: 5000 },
];

const BAR_AREA_HEIGHT = 220;

// --- Sub-Components ---

const DayChart = () => {
  const [activeDate, setActiveDate] = useState("26");

  return (
    <View style={styles.dayWrap}>
      {/* Date Scroller */}
      <View style={styles.dateScrollerWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateScrollContent}>
          {DAY_DATES.map((item, index) => {
            const isActive = activeDate === item.day;
            return (
              <TouchableOpacity
                key={index}
                style={[styles.dateItem, isActive && styles.dateItemActive]}
                onPress={() => setActiveDate(item.day)}
                activeOpacity={0.8}
              >
                <Text weight={isActive ? "600" : "500"} style={[styles.dateMonthText, isActive && styles.dateTextActive]}>
                  {item.month}
                </Text>
                <Text weight={isActive ? "700" : "600"} style={[styles.dateDayText, isActive && styles.dateTextActive]}>
                  {item.day}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Curve Area */}
      <View style={styles.curveContainer}>
        {/* Absolute position text over the curve */}
        <View style={styles.floatingKcalWrap}>
          <Text style={styles.fireEmoji}>🔥</Text>
          <Text weight="700" style={styles.floatingKcalText}>400 kcal</Text>
        </View>

        <Svg width="100%" height="148" viewBox="0 0 448 148" preserveAspectRatio="none">
          <Defs>
            <SvgGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
              {/* UPDATED: Lighter #ffebd9 gradient instead of dark orange */}
              <Stop offset="0" stopColor="#ffebd9" stopOpacity="1" />
              <Stop offset="1" stopColor="#ffebd9" stopOpacity="0" />
            </SvgGradient>
          </Defs>
          {/* Filled gradient area */}
          <Path
            d="M0,100 C80,100 130,10 224,10 C330,10 380,80 448,60 L448,148 L0,148 Z"
            fill="url(#waveGrad)"
          />
          {/* Top stroke line - Lightened to match the softer fill */}
          <Path
            d="M0,100 C80,100 130,10 224,10 C330,10 380,80 448,60"
            fill="none"
            stroke="#FDC79B" 
            strokeWidth="2"
          />
        </Svg>
      </View>

      {/* Summary Card */}
      <LinearGradient
        colors={["#EBDDF5", "#FDEEE2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.summaryCard}
      >
        <View style={styles.summaryHeader}>
          <View style={styles.summaryTitleWrap}>
            <Text style={styles.summaryFireEmoji}>🔥</Text>
            <Text weight="700" style={styles.summaryCaloriesMain}>400</Text>
            <Text weight="500" style={styles.summaryCaloriesSub}> kcal burned</Text>
          </View>
          <Text weight="600" style={styles.summaryDate}>26-02-2026</Text>
        </View>

        <View style={styles.activityList}>
          {DAY_ACTIVITIES.map((activity, index) => (
            <View key={index} style={styles.activityItem}>
              <View style={styles.activityIconWrap}>
                <MaterialCommunityIcons name={activity.icon} size={24} color={ORANGE} />
              </View>
              <View style={styles.activityDetailsWrap}>
                <View>
                  <Text weight="700" style={styles.activityTitle}>{activity.type}</Text>
                  <Text weight="500" style={styles.activitySub}>{activity.duration}</Text>
                </View>
                <View style={styles.activityStatsWrap}>
                  <Text weight="700" style={styles.activityStatMain}>{activity.calories}</Text>
                  <Text weight="500" style={styles.activityStatSub}>{activity.distance}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity activeOpacity={0.85} style={styles.editBtnWrap}>
          <LinearGradient
            colors={["#ECA645", "#D87E18"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.editBtn}
          >
            <Text weight="600" style={styles.editBtnText}>Edit</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const GenericBarChart = ({ data, maxVal, yAxisSteps, activeLabel, onActiveChange, xAxisTitle }) => {
  return (
    <View style={styles.chartWrap}>
      <Text weight="700" style={styles.yAxisTopLabel}>Cal</Text>
      
      <View style={styles.chartInner}>
        <View style={styles.yAxis}>
          {[...yAxisSteps].reverse().map((v) => (
            <Text key={v} weight="500" style={styles.yLabel}>{v}</Text>
          ))}
        </View>

        <View style={styles.barsArea}>
          {yAxisSteps.map((v) => (
            <View
              key={`grid-${v}`}
              style={[
                styles.gridLine,
                { bottom: (v / maxVal) * BAR_AREA_HEIGHT },
              ]}
            />
          ))}

          <View style={styles.barsRow}>
            {data.map((bar) => {
              const barHeight = (bar.value / maxVal) * BAR_AREA_HEIGHT;
              const isActive = activeLabel === bar.day;

              return (
                <TouchableOpacity
                  key={bar.day}
                  activeOpacity={0.9}
                  onPress={() => onActiveChange(bar.day)}
                  style={styles.barColWrap}
                >
                  {isActive && bar.tooltip && (
                    <View style={styles.tooltipBox}>
                      <Text style={styles.tooltipMainText}>
                        <Text weight="800" style={{ fontSize: 16 }}>
                          {bar.tooltip.main.split(" ")[0]}
                        </Text>
                        <Text weight="600" style={{ fontSize: 12 }}>
                          {" "}{bar.tooltip.main.substring(bar.tooltip.main.indexOf(" ") + 1)}
                        </Text>
                      </Text>
                      <Text weight="500" style={styles.tooltipDate}>
                        {bar.tooltip.date}
                      </Text>
                    </View>
                  )}

                  {isActive && (
                    <>
                      <View style={[styles.dashedLine, { height: barHeight }]} />
                      <View style={[styles.activeMarker, { bottom: barHeight - 6 }]} />
                    </>
                  )}

                  <View style={[styles.barFill, { height: barHeight }]} />

                  <Text weight="500" style={styles.barDayLabel}>
                    {bar.day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
      <Text weight="700" style={styles.xAxisLabel}>{xAxisTitle}</Text>
    </View>
  );
};

const WeekChart = () => {
  const [activeDay, setActiveDay] = useState("Thu"); 
  const yAxis = [0, 250, 500, 750, 1000, 1250, 1500];

  return (
    <GenericBarChart 
      data={WEEK_BARS} 
      maxVal={1500} 
      yAxisSteps={yAxis} 
      activeLabel={activeDay} 
      onActiveChange={setActiveDay}
      xAxisTitle="Weeks"
    />
  );
};

const MonthChart = () => {
  const [activeWeek, setActiveWeek] = useState("W2"); 
  const yAxis = [0, 1000, 2000, 3000, 4000, 5000];

  return (
    <GenericBarChart 
      data={MONTH_BARS} 
      maxVal={5000} 
      yAxisSteps={yAxis} 
      activeLabel={activeWeek} 
      onActiveChange={setActiveWeek}
      xAxisTitle="Month (Aggregated by Weeks)"
    />
  );
};

// --- Main Screen ---

export default function FitnessHistory({ onBack, initialTab = "Day" }) {
  const topOffset = Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 10 : 18;
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: topOffset }]}>
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.8} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={PURPLE} />
        </TouchableOpacity>
        <View>
          <Text weight="700" style={styles.headerTitle}>Fitness History</Text>
          <Text weight="400" style={styles.headerSub}>Choose the activity you performed.</Text>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <View style={styles.tabRow}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                activeOpacity={0.85}
                style={[styles.tabBtn, isActive && styles.tabBtnActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  weight={isActive ? "600" : "400"}
                  style={[styles.tabText, isActive && styles.tabTextActive]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {activeTab === "Day" && <DayChart />}
        {activeTab === "Week" && <WeekChart />}
        {activeTab === "Month" && <MonthChart />}
      </ScrollView>
    </View>
  );
}

// --- Styles ---

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
  },
  backBtn: { width: 30, height: 30, justifyContent: "center", marginRight: 8 },
  headerTitle: { fontSize: 18, color: PURPLE },
  headerSub: { fontSize: 12, color: "#1A1A1A", marginTop: 2 },
  
  tabContainer: { backgroundColor: "#FFFFFF", paddingHorizontal: 16, paddingBottom: 20 },
  tabRow: {
    flexDirection: "row",
    backgroundColor: PURPLE,
    borderRadius: 8,
    padding: 2,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  tabBtnActive: { backgroundColor: "#FFFFFF" },
  tabText: { fontSize: 14, color: "#FFFFFF" },
  tabTextActive: { color: PURPLE },
  
  scrollContent: { paddingBottom: 32 },

  // --- Day View Styles ---
  dayWrap: {
    // Parent wrapper 
  },
  dateScrollerWrap: {
    marginBottom: 0,
    paddingHorizontal: 16,
  },
  dateScrollContent: {
    paddingVertical: 10,
  },
  dateItem: {
    width: 50,  
    height: 60,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    backgroundColor: "transparent",
  },
  dateItemActive: {
    backgroundColor: PURPLE,
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  dateMonthText: {
    fontSize: 12,
    color: "#B4AEE8",
    marginBottom: 2,
  },
  dateDayText: {
    fontSize: 16,
    color: "#B4AEE8",
  },
  dateTextActive: {
    color: "#FFFFFF",
  },
  curveContainer: {
    width: '100%',
    height: 148,
    marginTop: 19, // As per "top: 19px" in design relative to elements above
    position: 'relative',
    overflow: 'visible',
  },
  floatingKcalWrap: {
    position: 'absolute',
    left: 32, // As per "left: 32px" in design
    top: 55, // Adjusted to sit visually on the start of the curve
    alignItems: 'center',
    zIndex: 10,
  },
  fireEmoji: { 
    fontSize: 20, 
    marginBottom: 2 
  },
  floatingKcalText: { 
    fontSize: 13, 
    color: "#1A1A1A" 
  },
  summaryCard: {
    borderRadius: 24,
    padding: 20,
    paddingTop: 30,
    marginHorizontal: 16,
    marginTop: -20, // Overlap the card slightly with the bottom of the wave
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  summaryTitleWrap: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  summaryFireEmoji: { fontSize: 24, marginRight: 6 },
  summaryCaloriesMain: { fontSize: 28, color: "#1A1A1A" },
  summaryCaloriesSub: { fontSize: 12, color: "#4B5563" },
  summaryDate: { fontSize: 13, color: "#1A1A1A" },
  activityList: {
    marginBottom: 20,
  },
  activityItem: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activityIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F4ECFA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  activityDetailsWrap: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  activityTitle: { fontSize: 15, color: "#1A1A1A" },
  activitySub: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  activityStatsWrap: { alignItems: "flex-end" },
  activityStatMain: { fontSize: 14, color: "#1A1A1A" },
  activityStatSub: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  editBtnWrap: {
    borderRadius: 12,
    overflow: "hidden",
  },
  editBtn: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  editBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
  },

  // --- Chart Styles (Week/Month) ---
  chartWrap: { paddingHorizontal: 16, marginTop: 10 },
  yAxisTopLabel: { fontSize: 12, color: "#4B5563", marginBottom: 8, marginLeft: 2 },
  chartInner: { flexDirection: "row", height: BAR_AREA_HEIGHT + 30 },
  yAxis: {
    width: 40,
    height: BAR_AREA_HEIGHT,
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  yLabel: { fontSize: 11, color: "#9CA3AF" },
  barsArea: { flex: 1, height: BAR_AREA_HEIGHT, position: "relative" },
  gridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "#F3F4F6",
  },
  barsRow: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: BAR_AREA_HEIGHT,
    paddingHorizontal: 10,
  },
  barColWrap: {
    alignItems: "center",
    justifyContent: "flex-end",
    width: 30,
    height: BAR_AREA_HEIGHT,
    position: "relative",
  },
  barFill: {
    width: 8,
    backgroundColor: ORANGE,
    borderRadius: 4,
    zIndex: 2,
  },
  barDayLabel: {
    fontSize: 11,
    color: "#9CA3AF",
    position: "absolute",
    bottom: -24,
  },
  activeMarker: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: PURPLE,
    position: "absolute",
    zIndex: 10,
  },
  dashedLine: {
    position: "absolute",
    bottom: 0,
    width: 0,
    borderWidth: 1,
    borderColor: ORANGE,
    borderStyle: "dashed",
    zIndex: 1,
  },
  tooltipBox: {
    position: "absolute",
    bottom: "100%",
    marginBottom: 10,
    left: -100, 
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: 170,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 20,
  },
  tooltipMainText: { color: "#1F2937", marginBottom: 4 },
  tooltipDate: { fontSize: 11, color: "#6B7280" },
  xAxisLabel: {
    textAlign: "center",
    marginTop: 28,
    fontSize: 12,
    color: "#4B5563",
  },
});
