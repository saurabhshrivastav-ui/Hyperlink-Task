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
import { Ionicons } from "@expo/vector-icons";
import { Text } from "../../../components/TextWrapper";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const TABS = ["Day", "Week", "Month"];
const PURPLE = "#5C43BF";
const ORANGE = "#E67E22";

const WEEK_BARS = [
  { day: "Sun", value: 1050 },
  { day: "Mon", value: 650 },
  { day: "Tue", value: 900 },
  { day: "Wed", value: 480 },
  { 
    day: "Thu", 
    value: 1000, 
    tooltip: { speed: "35 km/h", date: "01 May 2023 10:00 AM" } 
  },
  { day: "Fri", value: 1450 },
  { day: "Sat", value: 850 },
];

const MAX_BAR_VALUE = 1500;
const Y_AXIS = [0, 250, 500, 750, 1000, 1250, 1500];
const BAR_AREA_HEIGHT = 220;

const WeekChart = () => {
  const [activeDay, setActiveDay] = useState("Thu"); 

  return (
    <View style={styles.chartWrap}>
      <Text weight="700" style={styles.yAxisTopLabel}>Cal</Text>
      
      <View style={styles.chartInner}>
        {/* Y Axis Labels */}
        <View style={styles.yAxis}>
          {[...Y_AXIS].reverse().map((v) => (
            <Text key={v} weight="500" style={styles.yLabel}>{v}</Text>
          ))}
        </View>

        {/* Chart Area */}
        <View style={styles.barsArea}>
          {/* Grid Lines */}
          {Y_AXIS.map((v) => (
            <View
              key={`grid-${v}`}
              style={[
                styles.gridLine,
                { bottom: (v / MAX_BAR_VALUE) * BAR_AREA_HEIGHT },
              ]}
            />
          ))}

          {/* Bars */}
          <View style={styles.barsRow}>
            {WEEK_BARS.map((bar) => {
              const barHeight = (bar.value / MAX_BAR_VALUE) * BAR_AREA_HEIGHT;
              const isActive = activeDay === bar.day;

              return (
                <TouchableOpacity
                  key={bar.day}
                  activeOpacity={0.9}
                  onPress={() => setActiveDay(bar.day)}
                  style={styles.barColWrap}
                >
                  {/* Tooltip */}
                  {isActive && bar.tooltip && (
                    <View style={styles.tooltipBox}>
                      <Text style={styles.tooltipSpeed}>
                        <Text weight="800" style={{ fontSize: 16 }}>
                          {bar.tooltip.speed.split(" ")[0]}
                        </Text>
                        <Text weight="600" style={{ fontSize: 12 }}>
                          {" "}{bar.tooltip.speed.split(" ")[1]}
                        </Text>
                      </Text>
                      <Text weight="500" style={styles.tooltipDate}>
                        {bar.tooltip.date}
                      </Text>
                    </View>
                  )}

                  {/* Active Marker & Dashed Line */}
                  {isActive && (
                    <>
                      <View style={[styles.dashedLine, { height: barHeight }]} />
                      <View style={[styles.activeMarker, { bottom: barHeight - 6 }]} />
                    </>
                  )}

                  {/* Solid Orange Bar */}
                  <View style={[styles.barFill, { height: barHeight }]} />

                  {/* X-Axis Label */}
                  <Text weight="500" style={styles.barDayLabel}>
                    {bar.day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      <Text weight="700" style={styles.xAxisLabel}>Weeks</Text>
    </View>
  );
};

export default function FitnessHistory({ onBack, initialTab = "Week" }) {
  const topOffset = Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 10 : 18;
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topOffset }]}>
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.8} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={PURPLE} />
        </TouchableOpacity>
        <View>
          <Text weight="700" style={styles.headerTitle}>Fitness History</Text>
          <Text weight="400" style={styles.headerSub}>Choose the activity you performed.</Text>
        </View>
      </View>

      {/* Tabs */}
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

      {/* Content */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {activeTab === "Day" && (
          <View style={styles.emptyState}>
            <Text weight="500" style={styles.emptyText}>Day History</Text>
          </View>
        )}

        {activeTab === "Week" && <WeekChart />}

        {activeTab === "Month" && (
          <View style={styles.emptyState}>
            <Text weight="500" style={styles.emptyText}>Month History</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: "#F9FAF9",
  },
  backBtn: { width: 30, height: 30, justifyContent: "center", marginRight: 8 },
  headerTitle: { fontSize: 18, color: PURPLE },
  headerSub: { fontSize: 12, color: "#1A1A1A", marginTop: 2 },
  
  tabContainer: { backgroundColor: "#F9FAF9", paddingHorizontal: 16, paddingBottom: 20 },
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
  tooltipSpeed: { color: "#1F2937", marginBottom: 4 },
  tooltipDate: { fontSize: 11, color: "#6B7280" },
  xAxisLabel: {
    textAlign: "center",
    marginTop: 28,
    fontSize: 12,
    color: "#4B5563",
  },
  emptyState: { flex: 1, alignItems: "center", paddingTop: 60 },
  emptyText: { fontSize: 14, color: "#9CA3AF" },
});