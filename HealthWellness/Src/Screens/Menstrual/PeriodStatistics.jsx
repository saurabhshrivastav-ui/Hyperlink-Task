import React, { useMemo } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "../../../components/TextWrapper";

const { width } = Dimensions.get("window");
const clamp = (value, min, max) => Math.max(min, Math.min(value, max));
const CARD_WIDTH = clamp(width - 32, 300, 360);

// ─── Date Helpers & Logic ───
const normalizeDate = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const diffInDays = (dateA, dateB) =>
  Math.round((normalizeDate(dateA).getTime() - normalizeDate(dateB).getTime()) / 86400000);

const getSafeStartDate = (details) => {
  const today = normalizeDate(new Date());
  if (!details) return today; // Fallback gracefully if no data is saved
  
  const day = Number(details.day),
    month = Number(details.month),
    year = Number(details.year);
    
  if (!day || !month || !year) return today;
  
  const candidate = new Date(year, month - 1, day);
  // Verify it's a valid date
  if (Number.isNaN(candidate.getTime()) || candidate.getDate() !== day) {
    return today;
  }
  return candidate;
};

const getPeriodState = (details) => {
  const startDate = getSafeStartDate(details);
  const cycleLength = Math.max(21, Math.round(Number(details?.cycleLength) || 28));
  const periodWindow = Math.max(1, Math.round(Number(details?.periodDuration) || 5));
  const today = normalizeDate(new Date());
  const daysFromStart = diffInDays(today, startDate);

  if (daysFromStart < 0) {
    return {
      currentCycleStart: addDays(startDate, -cycleLength),
      cycleLength,
      periodWindow,
    };
  }
  
  const cyclesElapsed = Math.floor(daysFromStart / cycleLength);
  const currentCycleStart = addDays(startDate, cyclesElapsed * cycleLength);
  return { currentCycleStart, cycleLength, periodWindow };
};

// ─── Single Row Component ───
const Row = ({ item }) => {
  // Scale the total width of the track based on cycle length (max visual limit ~60 days)
  // We reserve ~15% of width for the "XX Days" text floating on the right.
  const trackWidthPercent = Math.min(85, Math.max(45, (item.days / 60) * 85));
  
  // Calculate how much of the track should be filled (100% for past cycles, partial for active)
  const fillWidthPercent = (item.elapsedDays / item.days) * 100;

  return (
    <View style={styles.row}>
      <View style={styles.barContainer}>
        {/* The Track bounds (Dashed outline only applied if active) */}
        <View
          style={[
            styles.trackBounds,
            { width: `${trackWidthPercent}%` },
            item.active && styles.activeDashedBounds,
          ]}
        >
          {/* The Filled Bar portion */}
          <LinearGradient
            colors={item.active ? ["#FBA3B5", "#F462A4"] : ["#F6D4D3", "#F6D4D3"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={[styles.filledBar, { width: `${fillWidthPercent}%` }]}
          >
            <Text
              weight={item.active ? "800" : "600"}
              numberOfLines={1}
              adjustsFontSizeToFit
              style={styles.barText}
            >
              {item.label}
            </Text>
            <View style={[styles.barKnob, item.active && styles.barKnobActive]} />
          </LinearGradient>
        </View>
      </View>

      {/* Days Count Floating next to the Bar */}
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
};

// ─── Main Screen Component ───
export default function PeriodStatistics({ onBack, menstrualDetails }) {
  const topOffset = Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 10 : 18;
  const today = normalizeDate(new Date());

  const periodState = useMemo(() => getPeriodState(menstrualDetails), [menstrualDetails]);
  const periodDuration = Math.max(1, Math.round(Number(menstrualDetails?.periodDuration) || 5));

  // Generate 6 months of dynamic history backward from current cycle STRICTLY based on math
  const cycleBars = useMemo(() => {
    const history = [];
    
    // Iterate from 5 down to 0 so the oldest cycle is at the top of the array,
    // and the "Now" (active) cycle is at the very bottom.
    for (let i = 5; i >= 0; i--) {
      // Exact mathematical step backwards based strictly on provided cycle length
      const start = addDays(periodState.currentCycleStart, -(i * periodState.cycleLength));
      const end = addDays(start, periodState.cycleLength - 1);
      
      const startStr = start.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
      const endStr = end.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
      
      const totalDays = periodState.cycleLength;
      
      // If it's the active cycle (i=0), calculate how many days we are currently into it
      const elapsedDays = i === 0 ? Math.max(1, diffInDays(today, start) + 1) : totalDays;

      history.push({
        id: `cycle-${i}`,
        label: i === 0 ? `${startStr} - Now` : `${startStr} - ${endStr}`,
        days: totalDays,
        elapsedDays: Math.min(elapsedDays, totalDays), // cap visually at totalDays
        active: i === 0,
      });
    }
    return history;
  }, [periodState.currentCycleStart, periodState.cycleLength, today]);

  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={["#FDF0F8", "#FBDDF5", "#FFFFFF"]}
        locations={[0, 0.4, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.pageGradient}
      />

      <View style={[styles.headerBlock, { paddingTop: topOffset }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity activeOpacity={0.8} style={styles.backBtn} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="#533DB1" />
          </TouchableOpacity>
          <View style={styles.titleWrap}>
            <Text weight="700" style={styles.title}>
              Period Statistics
            </Text>
            <Text weight="500" style={styles.subtitle}>
              Build healthy habits, one day at a time.
            </Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.spacer} />

        {/* Top Summary Card */}
        <LinearGradient
          colors={["#F88A83", "#F04593"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.summaryCard}
        >
          <View style={styles.summaryTopRow}>
            <Text weight="500" style={styles.summaryLabel}>
              AVERAGE CYCLE LENGTH
            </Text>
            <View style={styles.regularPill}>
              <Text weight="600" style={styles.regularText}>
                Regular
              </Text>
              <MaterialCommunityIcons name="information-outline" size={13} color="#ED548A" />
            </View>
          </View>

          <View style={styles.summaryValueRow}>
            <Text weight="400" style={styles.summaryValue}>
              {periodState.cycleLength}
            </Text>
            <Text weight="500" style={styles.summaryUnit}>
              days
            </Text>
          </View>

          <Text weight="500" style={styles.summaryMeta}>
            {periodDuration} days      average duration
          </Text>
        </LinearGradient>

        {/* Year Navigation */}
        <View style={styles.yearRow}>
          <TouchableOpacity activeOpacity={0.8} style={styles.yearNavButton}>
            <Ionicons name="chevron-back" size={18} color="#000" />
          </TouchableOpacity>
          <View style={styles.yearCenter}>
            <MaterialCommunityIcons name="calendar-month-outline" size={18} color="#000" />
            <Text weight="800" style={styles.yearText}>
              {today.getFullYear()}
            </Text>
          </View>
          <TouchableOpacity activeOpacity={0.8} style={styles.yearNavButton}>
            <Ionicons name="chevron-forward" size={18} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Cycle Length History Card */}
        <View style={styles.cycleCard}>
          <View style={styles.cycleTitleRow}>
            <TouchableOpacity activeOpacity={0.8}>
              <Ionicons name="chevron-back" size={16} color="#000" />
            </TouchableOpacity>
            <Text weight="700" style={styles.cycleTitle}>
              Cycle Length
            </Text>
            <TouchableOpacity activeOpacity={0.8}>
              <Ionicons name="chevron-forward" size={16} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.rowsContainer}>
            {cycleBars.map((item) => (
              <Row key={item.id} item={item} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  pageGradient: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
  },
  headerBlock: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  spacer: {
    height: 6,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: {
    width: 32,
    height: 32,
    alignItems: "flex-start",
    justifyContent: "center",
    marginRight: 2,
  },
  titleWrap: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    color: "#533DB1",
    letterSpacing: 0.2,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 12,
    color: "#333333",
  },
  summaryCard: {
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 22,
    width: CARD_WIDTH,
    alignSelf: "center",
  },
  summaryTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  summaryLabel: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    letterSpacing: 0.5,
  },
  regularPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  regularText: {
    fontSize: 12,
    color: "#ED548A",
  },
  summaryValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 8,
  },
  summaryValue: {
    fontSize: 52,
    lineHeight: 60,
    color: "#FFFFFF",
  },
  summaryUnit: {
    marginBottom: 10,
    marginLeft: 8,
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
  },
  summaryMeta: {
    marginTop: 4,
    fontSize: 12,
    color: "rgba(255,255,255,0.9)",
  },
  yearRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: CARD_WIDTH,
    alignSelf: "center",
    paddingHorizontal: 12,
    marginTop: 24,
    marginBottom: 16,
  },
  yearNavButton: {
    padding: 4,
  },
  yearCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  yearText: {
    fontSize: 16,
    color: "#000000",
  },
  cycleCard: {
    width: CARD_WIDTH,
    alignSelf: "center",
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
  cycleTitle: {
    fontSize: 15,
    color: "#000000",
  },
  rowsContainer: {
    gap: 18,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    height: 30,
  },
  barContainer: {
    flex: 1,
    height: "100%",
    position: "relative",
    justifyContent: "center",
  },
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
  barKnobActive: {
    backgroundColor: "#E63A84",
  },
  daysCol: {
    marginLeft: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  daysValue: {
    fontSize: 13,
    color: "#555555",
  },
  daysLabel: {
    fontSize: 9,
    color: "#555555",
  },
});