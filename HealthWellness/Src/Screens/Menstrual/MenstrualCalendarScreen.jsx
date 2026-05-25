import React, { useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  Dimensions,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "../../../components/TextWrapper";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const WEEK_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

// Layout — airy grid (image 2 style) with circular date markers
const GRID_H_PADDING = 14;
const GRID_WIDTH = SCREEN_WIDTH - GRID_H_PADDING * 2;
const CELL_W = Math.floor(GRID_WIDTH / 7);
const CELL_H = CELL_W + 6;
const CIRCLE_SIZE = Math.min(CELL_W - 8, 44);

// ─── Date helpers ──────────────────────────────────────────────────────────────

const normalizeDate = (d) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

const addDays = (date, days) => {
  const n = new Date(date);
  n.setDate(n.getDate() + days);
  return n;
};

const diffInDays = (a, b) => {
  const ms = 24 * 60 * 60 * 1000;
  return Math.round(
    (normalizeDate(a).getTime() - normalizeDate(b).getTime()) / ms,
  );
};

const getSafeStartDate = (details) => {
  if (!details) return new Date(2025, 8, 1);
  const day = Number(details.day),
    month = Number(details.month),
    year = Number(details.year);
  if (!day || !month || !year) return new Date(2025, 8, 1);
  const c = new Date(year, month - 1, day);
  if (isNaN(c.getTime()) || c.getDate() !== day) return new Date(2025, 8, 1);
  return c;
};

const derivePeriodDuration = (details) => {
  const cl = Math.max(21, Math.round(Number(details?.cycleLength) || 28));
  if (details?.nonPeriodDays != null)
    return Math.max(
      1,
      cl - Math.max(1, Math.round(Number(details.nonPeriodDays))),
    );
  return Math.max(1, Math.round(Number(details?.periodDuration) || 5));
};

const getPeriodState = (details) => {
  const startDate = getSafeStartDate(details);
  const cycleLength = Math.max(
    21,
    Math.round(Number(details?.cycleLength) || 28),
  );
  const periodWindow = derivePeriodDuration(details);
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

// ─── Phase classification ──────────────────────────────────────────────────────

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

// Phase metadata — gradient pairs for hero card and solid cells,
// soft variants for outline/dashed cells, plus contextual tips
const PHASE_META = {
  period: {
    label: "Menstruation",
    short: "Period",
    icon: "water",
    color: "#FF4D8D",
    softColor: "#FFE4ED",
    gradient: ["#FF8FB1", "#FF4D8D"],
    desc: "Your period is here. Rest, stay hydrated and listen to your body.",
    tip: "Iron-rich foods help replenish energy",
  },
  fertile: {
    label: "Fertile Window",
    short: "Fertile",
    icon: "leaf",
    color: "#7C3AED",
    softColor: "#EDE9FE",
    gradient: ["#A78BFA", "#7C3AED"],
    desc: "High chance of conception. Estrogen rises and energy peaks.",
    tip: "Energy levels are at their peak — make the most of it",
  },
  ovulation: {
    label: "Ovulation",
    short: "Ovulation",
    icon: "star-four-points",
    color: "#9333EA",
    softColor: "#DDD6FE",
    gradient: ["#C084FC", "#9333EA"],
    desc: "Peak fertility day. The luteinizing hormone surge triggers egg release.",
    tip: "Track basal body temperature today",
  },
  pms: {
    label: "PMS Zone",
    short: "PMS",
    icon: "weather-cloudy",
    color: "#D97706",
    softColor: "#FEF3C7",
    gradient: ["#FBBF24", "#D97706"],
    desc: "Pre-menstrual phase. Progesterone drops — mood and energy may fluctuate.",
    tip: "Practice self-care and gentle movement",
  },
  safe: {
    label: "Safe Period",
    short: "Safe",
    icon: "shield-check",
    color: "#059669",
    softColor: "#D1FAE5",
    gradient: ["#34D399", "#059669"],
    desc: "Low fertility phase. Good time for new habits and recovery.",
    tip: "Great time for new routines and challenges",
  },
};

// ─── Build month grid ──────────────────────────────────────────────────────────

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

  for (let i = firstDay - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    pushCell(d, false, new Date(year, month - 1, d));
  }
  for (let d = 1; d <= daysInMonth; d++) {
    pushCell(d, true, new Date(year, month, d));
  }
  let nd = 1;
  while (cells.length % 7 !== 0) {
    pushCell(nd, false, new Date(year, month + 1, nd));
    nd++;
  }

  const rows = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return rows;
};

// ─── Day Cell ──────────────────────────────────────────────────────────────────
// Combines: solid gradient fill for period/ovulation (info-density of img 1),
// dashed circular outline for fertile/pms (elegant style of img 2),
// soft tinted circle for safe, plus the cycle-day badge from img 1

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
      onPress={onPress}
      style={cellStyles.cell}
    >
      {/* Outer selection halo */}
      {isSelected && (
        <View style={[cellStyles.selectionHalo, { borderColor: meta.color }]} />
      )}

      {/* Inner phase circle */}
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
            {
              borderColor: meta.color,
              backgroundColor: meta.softColor,
            },
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
            style={[
              cellStyles.day,
              { color: isToday ? "#5A3FB8" : "#3A3A3A" },
            ]}
          >
            {cell.day}
          </Text>
        </View>
      )}

      {/* Today dot indicator */}
      {isToday && (
        <View style={cellStyles.todayDot}>
          <View style={cellStyles.todayDotInner} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const cellStyles = StyleSheet.create({
  cell: {
    width: CELL_W,
    height: CELL_H,
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
  dashedCircle: {
    borderWidth: 1.5,
    borderStyle: "dashed",
  },
  todayBorder: {
    borderWidth: 2,
    borderColor: "#5A3FB8",
  },
  todayBorderThick: {
    borderWidth: 2,
  },
  selectionHalo: {
    position: "absolute",
    width: CIRCLE_SIZE + 8,
    height: CIRCLE_SIZE + 8,
    borderRadius: (CIRCLE_SIZE + 8) / 2,
    borderWidth: 1.5,
    top: (CELL_H - CIRCLE_SIZE - 8) / 2,
  },
  day: { fontSize: 15, lineHeight: 18 },
  daySolid: { fontSize: 15, lineHeight: 18, color: "#FFFFFF" },
  dimDay: { fontSize: 13, color: "#CCCCCC" },
  todayDot: {
    position: "absolute",
    bottom: 2,
    width: CIRCLE_SIZE,
    alignItems: "center",
  },
  todayDotInner: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#5A3FB8",
  },
});

// ─── Cycle Phase Bar ────────────────────────────────────────────────────────────
// Horizontal segmented bar showing where you are across the full cycle.
// Each segment is colored by phase; current position is marked.

const CyclePhaseBar = ({ cycleDay, cycleLength, periodDuration }) => {
  const ovulationDay = Math.round(cycleLength - 14);
  const fertileStart = ovulationDay - 5;
  const fertileEnd = ovulationDay + 1;
  const pmsStart = cycleLength - 3;

  const segments = [];
  // Period
  segments.push({
    start: 1,
    end: periodDuration,
    phase: "period",
  });
  // Safe early
  if (periodDuration + 1 <= fertileStart - 1) {
    segments.push({
      start: periodDuration + 1,
      end: fertileStart - 1,
      phase: "safe",
    });
  }
  // Fertile (including ovulation)
  segments.push({
    start: fertileStart,
    end: fertileEnd,
    phase: "fertile",
  });
  // Safe late
  if (fertileEnd + 1 <= pmsStart - 1) {
    segments.push({
      start: fertileEnd + 1,
      end: pmsStart - 1,
      phase: "safe",
    });
  }
  // PMS
  segments.push({
    start: pmsStart,
    end: cycleLength,
    phase: "pms",
  });

  const totalDays = cycleLength;
  const markerPos = ((cycleDay - 0.5) / totalDays) * 100;

  return (
    <View style={barStyles.wrapper}>
      <View style={barStyles.labelRow}>
        <Text weight="700" style={barStyles.sectionLabel}>
          Cycle Overview
        </Text>
        <Text weight="400" style={barStyles.sectionHint}>
          Day {cycleDay} of {cycleLength}
        </Text>
      </View>
      <View style={barStyles.track}>
        {segments.map((seg, i) => {
          const meta = PHASE_META[seg.phase];
          const flex = seg.end - seg.start + 1;
          return (
            <View
              key={i}
              style={{
                flex,
                backgroundColor: meta.color,
                opacity: 0.85,
                borderLeftWidth: i > 0 ? 1 : 0,
                borderLeftColor: "#FFFFFF",
              }}
            />
          );
        })}
        {/* Position marker */}
        <View
          style={[
            barStyles.marker,
            { left: `${markerPos}%` },
          ]}
        >
          <View style={barStyles.markerStem} />
          <View style={barStyles.markerHead} />
        </View>
      </View>
      <View style={barStyles.scaleRow}>
        <Text style={barStyles.scaleText}>1</Text>
        <Text style={barStyles.scaleText}>{Math.ceil(cycleLength / 2)}</Text>
        <Text style={barStyles.scaleText}>{cycleLength}</Text>
      </View>
    </View>
  );
};

const barStyles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 14,
    paddingTop: 18,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 12,
    color: "#5A3FB8",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  sectionHint: { fontSize: 11, color: "#888888" },
  track: {
    flexDirection: "row",
    height: 10,
    borderRadius: 6,
    overflow: "visible",
    position: "relative",
    backgroundColor: "#F0EAF6",
  },
  marker: {
    position: "absolute",
    top: -8,
    alignItems: "center",
    marginLeft: -6,
  },
  markerStem: {
    width: 2,
    height: 22,
    backgroundColor: "#1A1A1A",
  },
  markerHead: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#1A1A1A",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    marginTop: -4,
  },
  scaleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingHorizontal: 2,
  },
  scaleText: { fontSize: 9, color: "#999999" },
});

// ─── Info Panel for selected day ───────────────────────────────────────────────

const InfoPanel = ({ cell, cycleLength, periodDuration, onEdit }) => {
  if (!cell) return null;
  const meta = PHASE_META[cell.phase];
  const ovulationDay = Math.round(cycleLength - 14);
  const daysToOvulation =
    ovulationDay - cell.cycleDay > 0 ? ovulationDay - cell.cycleDay : "—";
  const daysToNextPeriod = cycleLength - cell.cycleDay + 1;
  const periodDaysLeft =
    cell.cycleDay <= periodDuration ? periodDuration - cell.cycleDay + 1 : "—";

  const dateLabel = cell.date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return (
    <View style={panelStyles.panel}>
      <View style={[panelStyles.accent, { backgroundColor: meta.color }]} />

      <View style={panelStyles.topRow}>
        <View style={[panelStyles.iconCircle, { backgroundColor: meta.softColor }]}>
          <MaterialCommunityIcons
            name={meta.icon}
            size={18}
            color={meta.color}
          />
        </View>
        <View style={panelStyles.textBlock}>
          <Text weight="400" style={panelStyles.dateText}>
            {dateLabel}
          </Text>
          <Text
            weight="700"
            style={[panelStyles.phaseLabel, { color: meta.color }]}
          >
            {meta.label}
          </Text>
        </View>
        <View
          style={[panelStyles.cycleChip, { backgroundColor: meta.softColor }]}
        >
          <Text weight="700" style={[panelStyles.cycleChipText, { color: meta.color }]}>
            Day {cell.cycleDay}
          </Text>
        </View>
        {onEdit && (
          <TouchableOpacity
            onPress={onEdit}
            activeOpacity={0.8}
            style={panelStyles.editBtn}
          >
            <Ionicons name="pencil" size={13} color="#5A3FB8" />
          </TouchableOpacity>
        )}
      </View>

      <Text weight="400" style={panelStyles.desc}>
        {meta.desc}
      </Text>

      <View style={panelStyles.statsRow}>
        <View style={panelStyles.statPill}>
          <View style={[panelStyles.statIcon, { backgroundColor: "#FFE4ED" }]}>
            <MaterialCommunityIcons name="water" size={11} color="#FF4D8D" />
          </View>
          <Text weight="700" style={panelStyles.statNum}>
            {daysToNextPeriod}
          </Text>
          <Text weight="400" style={panelStyles.statLbl}>
            to next{"\n"}period
          </Text>
        </View>
        <View style={panelStyles.statDivider} />
        <View style={panelStyles.statPill}>
          <View style={[panelStyles.statIcon, { backgroundColor: "#DDD6FE" }]}>
            <MaterialCommunityIcons
              name="star-four-points"
              size={11}
              color="#9333EA"
            />
          </View>
          <Text weight="700" style={panelStyles.statNum}>
            {daysToOvulation}
          </Text>
          <Text weight="400" style={panelStyles.statLbl}>
            to{"\n"}ovulation
          </Text>
        </View>
        <View style={panelStyles.statDivider} />
        <View style={panelStyles.statPill}>
          <View style={[panelStyles.statIcon, { backgroundColor: "#FFE4ED" }]}>
            <MaterialCommunityIcons
              name="calendar-clock"
              size={11}
              color="#FF4D8D"
            />
          </View>
          <Text weight="700" style={panelStyles.statNum}>
            {periodDaysLeft}
          </Text>
          <Text weight="400" style={panelStyles.statLbl}>
            period days{"\n"}left
          </Text>
        </View>
      </View>
    </View>
  );
};

const panelStyles = StyleSheet.create({
  panel: {
    marginHorizontal: 14,
    marginType: 14,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    padding: 14,
    paddingLeft: 18,
    overflow: "hidden",
    shadowColor: "#C4AFEE",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
  },
  accent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  topRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  textBlock: { flex: 1 },
  dateText: { fontSize: 11, color: "#888888" },
  phaseLabel: { fontSize: 15, marginTop: 1 },
  cycleChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  cycleChipText: { fontSize: 11 },
  editBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F0EAF6",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
  },
  desc: {
    fontSize: 12,
    color: "#555555",
    lineHeight: 17,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F4FF",
    borderRadius: 14,
    paddingVertical: 10,
  },
  statPill: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
  statIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: "rgba(160,140,200,0.25)",
  },
  statNum: { fontSize: 16, color: "#5B21B6", lineHeight: 18 },
  statLbl: {
    fontSize: 9,
    color: "#888888",
    textAlign: "center",
    lineHeight: 11,
  },
});

// ─── Legend Chip ───────────────────────────────────────────────────────────────

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
            { backgroundColor: meta.softColor, borderWidth: 1, borderColor: meta.color },
          ]}
        />
      )}
      <Text weight="600" style={chipStyles.label}>
        {meta.label}
      </Text>
    </View>
  );
};

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
  swatch: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 7,
  },
  swatchDashed: {
    borderWidth: 1.5,
    borderStyle: "dashed",
  },
  label: { fontSize: 11, color: "#3A3A3A" },
});

// ─── Main Screen ───────────────────────────────────────────────────────────────

export default function MenstrualCalendarScreen({
  onBack,
  hideHeader = false,
  menstrualDetails,
}) {
  const topOffset =
    Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 10 : 18;

  const periodState = useMemo(
    () => getPeriodState(menstrualDetails),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      menstrualDetails?.day,
      menstrualDetails?.month,
      menstrualDetails?.year,
      menstrualDetails?.cycleLength,
      menstrualDetails?.nonPeriodDays,
      menstrualDetails?.periodDuration,
    ],
  );

  const periodDuration = useMemo(
    () => derivePeriodDuration(menstrualDetails),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [menstrualDetails],
  );

  const today = normalizeDate(new Date());

  const [calendarMonthDate, setCalendarMonthDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const calendarRows = useMemo(
    () =>
      buildGrid(
        calendarMonthDate.getFullYear(),
        calendarMonthDate.getMonth(),
        periodState.currentCycleStart,
        periodState.cycleLength,
        periodDuration,
      ),
    [
      calendarMonthDate,
      periodState.currentCycleStart,
      periodState.cycleLength,
      periodDuration,
    ],
  );

  // Today's cycle day (for hero card — always reflects today, not selection)
  const todayCycleDay = useMemo(() => {
    const diff = diffInDays(today, periodState.currentCycleStart);
    return (
      (((diff % periodState.cycleLength) + periodState.cycleLength) %
        periodState.cycleLength) +
      1
    );
  }, [today, periodState.currentCycleStart, periodState.cycleLength]);

  // Today's cell — used as default for info panel
  const todayCell = useMemo(() => {
    for (const row of calendarRows) {
      for (const cell of row) {
        if (
          cell.isCurrentMonth &&
          today.getFullYear() === calendarMonthDate.getFullYear() &&
          today.getMonth() === calendarMonthDate.getMonth() &&
          cell.day === today.getDate()
        )
          return cell;
      }
    }
    return null;
  }, [calendarRows, today, calendarMonthDate]);

  const [selectedCell, setSelectedCell] = useState(null);
  const activeCell = selectedCell ?? todayCell;

  const handlePrevMonth = () =>
    setCalendarMonthDate((p) => new Date(p.getFullYear(), p.getMonth() - 1, 1));
  const handleNextMonth = () =>
    setCalendarMonthDate((p) => new Date(p.getFullYear(), p.getMonth() + 1, 1));

  const isToday = (cell) =>
    cell.isCurrentMonth &&
    today.getFullYear() === calendarMonthDate.getFullYear() &&
    today.getMonth() === calendarMonthDate.getMonth() &&
    cell.day === today.getDate();

  const isSelected = (cell) =>
    selectedCell &&
    cell.day === selectedCell.day &&
    cell.isCurrentMonth === selectedCell.isCurrentMonth;

  return (
    <View style={styles.screen}>
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

      <View style={styles.calendarContainer}>
        {/* Background image + gradient overlay (kept from original) */}
        <Image
          source={require("../../../assets/menstrualdetbg.webp")}
          style={styles.backgroundImage}
          resizeMode="cover"
          pointerEvents="none"
        />
        <LinearGradient
          colors={["rgba(246,204,247,0.7)", "rgba(255,207,245,0.7)"]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        <LinearGradient
          colors={[
            "transparent",
            "rgba(255,255,255,0)",
            "rgba(255,255,255,0.85)",
            "#FFFFFF",
          ]}
          locations={[0, 0.25, 0.55, 0.8]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Cycle phase bar — horizontal overview of full cycle */}
          <CyclePhaseBar
            cycleDay={todayCycleDay}
            cycleLength={periodState.cycleLength}
            periodDuration={periodDuration}
          />

          {/* Month nav */}
          <View style={styles.sheetHeader}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handlePrevMonth}
              style={styles.chevronBtn}
            >
              <Ionicons name="chevron-back" size={20} color="#5A3FB8" />
            </TouchableOpacity>
            <View style={styles.sheetMonthWrap}>
              <MaterialCommunityIcons
                name="calendar-month-outline"
                size={18}
                color="#5A3FB8"
              />
              <Text weight="700" style={styles.sheetMonthText}>
                {calendarMonthDate.toLocaleDateString("en-GB", {
                  month: "long",
                  year: "numeric",
                })}
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleNextMonth}
              style={styles.chevronBtn}
            >
              <Ionicons name="chevron-forward" size={20} color="#5A3FB8" />
            </TouchableOpacity>
          </View>

          {/* Weekday labels */}
          <View style={styles.weekLabelRow}>
            {WEEK_LABELS.map((label, i) => (
              <View key={i} style={styles.weekLabelCell}>
                <Text weight="700" style={styles.weekLabel}>
                  {label}
                </Text>
              </View>
            ))}
          </View>

          {/* Calendar grid — airy, no borders, circular markers */}
          <View style={styles.calendarGrid}>
            {calendarRows.map((row, rowIdx) => (
              <View key={rowIdx} style={styles.calendarRow}>
                {row.map((cell, cellIdx) => (
                  <DayCell
                    key={cellIdx}
                    cell={cell}
                    isToday={isToday(cell)}
                    isSelected={isSelected(cell)}
                    onPress={() => {
                      if (!cell.isCurrentMonth) return;
                      const sel = isSelected(cell);
                      setSelectedCell(sel && !isToday(cell) ? null : cell);
                    }}
                  />
                ))}
              </View>
            ))}
          </View>

          {/* Info panel — selected day details */}
          <InfoPanel
            cell={activeCell}
            cycleLength={periodState.cycleLength}
            periodDuration={periodDuration}
            onEdit={onBack}
          />

          {/* Legend chips */}
          <View style={styles.legendSection}>
            <Text weight="700" style={styles.legendTitle}>
              Cycle Phases
            </Text>
            <View style={styles.legendChips}>
              {["period", "fertile", "ovulation", "pms", "safe"].map(
                (phase) => (
                  <LegendChip key={phase} phase={phase} />
                ),
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFFFFF" },

  headerBlock: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: "#FAF7FB",
    zIndex: 10,
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

  calendarContainer: { flex: 1, position: "relative" },
  backgroundImage: {
    position: "absolute",
    top: -90,
    left: 0,
    right: 0,
    width: "100%",
    height: "125%",
  },

  scrollContent: { paddingBottom: 36 },

  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginTop: 8,
  },
  chevronBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  sheetMonthWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "rgba(255,255,255,0.85)",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
  },
  sheetMonthText: { fontSize: 14, color: "#5A3FB8" },

  weekLabelRow: {
    flexDirection: "row",
    paddingHorizontal: GRID_H_PADDING,
    paddingBottom: 4,
  },
  weekLabelCell: {
    width: CELL_W,
    alignItems: "center",
    paddingVertical: 6,
  },
  weekLabel: { fontSize: 11, color: "#888888", letterSpacing: 0.4 },

  calendarGrid: {
    paddingHorizontal: GRID_H_PADDING,
  },
  calendarRow: {
    flexDirection: "row",
  },

  legendSection: { paddingHorizontal: 14, paddingTop: 22 },
  legendTitle: {
    fontSize: 12,
    color: "#5A3FB8",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  legendChips: { flexDirection: "row", flexWrap: "wrap" },
});
