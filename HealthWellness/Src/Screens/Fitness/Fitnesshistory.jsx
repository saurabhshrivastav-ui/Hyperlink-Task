import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
  Modal,
  Platform,
  StatusBar,
} from "react-native";
import { Text } from "../../../components/TextWrapper";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Svg, {
  Polyline,
  Circle,
  Line,
  Text as SvgText,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
  Path,
} from "react-native-svg";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const C = {
  primary: "#5C43BF",
  primaryLight: "#8A74D6",
  primaryDark: "#1E1A34",
  accent: "#F37B2B",
  accentDeep: "#D9651B",
  bgLight: "#F8F9FB",
  bgCard: "#FFFFFF",
  bgCardAlt: "#FFFFFF",
  bgDark: "#FFFFFF",
  bgDarkMid: "#FFF4ED",
  bgDarkTop: "#FFFFFF",
  textMuted: "#8F8C9E",
  textLight: "#4A465B",
  textFaint: "#A8A5B6",
  white: "#FFFFFF",
  amber: "#F59E0B",
  green: "#10B981",
  red: "#EF4444",
  blue: "#3B82F6",
  teal: "#2ECFB0",
  lineChart: "#F37B2B",
  lineChartGlow: "rgba(243,123,43,0.15)",
};

const pad = (n) => String(n).padStart(2, "0");
const fmtDuration = (h) => {
  const hrs = Math.floor(h);
  const mins = Math.round((h - hrs) * 60);
  return hrs > 0 ? `${hrs}h ${pad(mins)}m` : `${mins}m`;
};

const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

const buildDateList = (pastDays = 29, futureDays = 6) => {
  const list = [];
  for (let i = -pastDays; i <= futureDays; i++) {
    const d = new Date(TODAY);
    d.setDate(TODAY.getDate() + i);
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = [
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
    list.push({
      date: d,
      dayName: dayNames[d.getDay()],
      dayNum: d.getDate(),
      month: monthNames[d.getMonth()],
      fullLabel: `${pad(d.getDate())}\n${monthNames[d.getMonth()]}`,
      isToday: i === 0,
      isPast: i < 0,
      isFuture: i > 0,
    });
  }
  return list;
};

const DATE_LIST = buildDateList(29, 6);
const TODAY_INDEX = DATE_LIST.findIndex((d) => d.isToday);

const seedForOffset = (offset) => {
  const n = Math.abs(offset * 7 + 3);
  const duration = 0.5 + ((n * 17 + 11) % 40) / 20;
  const calories = Math.round(duration * 450 + (n % 100));
  const score = 52 + ((n * 13 + 7) % 42);
  const distance = (duration * 4.5).toFixed(1);
  return {
    duration: Math.round(duration * 10) / 10,
    calories,
    score,
    distance,
  };
};

const getDayData = (dateEntry) => {
  if (dateEntry.isFuture) return null;
  const offset = dateEntry.isToday
    ? 0
    : Math.round((dateEntry.date - TODAY) / 86400000);
  return seedForOffset(offset);
};

const STAGE_DATA = [
  { t: 0, stage: 0.2 },
  { t: 0.5, stage: 1.5 },
  { t: 1.2, stage: 2.2 },
  { t: 2.0, stage: 1.8 },
  { t: 3.5, stage: 0.5 },
  { t: 4.5, stage: 2.1 },
  { t: 5.5, stage: 1.2 },
  { t: 6.0, stage: 0.1 },
];

const getIntensityLabel = (stage) => {
  if (stage >= 2.0) return "Intense";
  if (stage >= 1.0) return "Light";
  return "Rest";
};
const getIntensityColor = (stage) => {
  if (stage >= 2.0) return C.accentDeep;
  if (stage >= 1.0) return C.amber;
  return C.teal;
};

const TREND_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TREND_CALS = [450, 620, 500, 800, 300, 1100, 950];
const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEK_DUR = [1.5, 0.8, 1.2, 0.5, 2.0, 1.0, 2.5];

const MONTH_WEEKS = [
  {
    label: "Week 1",
    avgKcal: 510,
    score: 75,
    note: "Consistent light cardio. Good start.",
  },
  {
    label: "Week 2",
    avgKcal: 643,
    score: 82,
    note: "Best week! Hit all intensity goals.",
  },
  {
    label: "Week 3",
    avgKcal: 400,
    score: 68,
    note: "Missed 2 workouts. Try to catch up.",
  },
  {
    label: "Week 4",
    avgKcal: 714,
    score: 79,
    note: "Strong finish with weekend hikes.",
  },
];

const MONTH_DAILY = Array.from({ length: 28 }, (_, i) => {
  const d = seedForOffset(-(27 - i));
  return {
    day: i + 1,
    duration: d.duration,
    calories: d.calories,
    score: d.score,
  };
});

const TIPS = [
  "Try mixing in HIIT workouts to boost your daily caloric burn.",
  "Hydration is key! Drink at least 2L of water today.",
  "Rest days are just as important as workout days for muscle recovery.",
  "A 15-minute stretch post-workout prevents injuries and soreness.",
  "Consistent workout times help anchor your body's energy levels.",
];

const ScoreBadge = ({ score }) => {
  const cfg =
    score >= 80
      ? { label: "Excellent", color: C.teal }
      : score >= 65
        ? { label: "Good", color: C.amber }
        : score >= 50
          ? { label: "Fair", color: C.accent }
          : { label: "Rest", color: C.textMuted };
  return (
    <View
      style={{
        backgroundColor: `${cfg.color}22`,
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: `${cfg.color}55`,
      }}
    >
      <Text weight="600" style={{ fontSize: 11, color: cfg.color }}>
        {cfg.label}
      </Text>
    </View>
  );
};

const AnimRing = ({ score, size = 80, sw = 7, color = C.accent, label }) => {
  const r = (size - sw) / 2;
  const circ = 2 * Math.PI * r;
  const progress = (score / 100) * circ;
  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="rgba(0,0,0,0.08)"
          strokeWidth={sw}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={sw}
          fill="none"
          strokeDasharray={`${progress} ${circ}`}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2},${size / 2}`}
        />
      </Svg>
      <View style={{ position: "absolute", alignItems: "center" }}>
        <Text
          weight="700"
          style={{
            fontSize: size > 60 ? 18 : 12,
            color: C.primaryDark,
            lineHeight: size > 60 ? 22 : 16,
          }}
        >
          {score}
        </Text>
        {label && (
          <Text style={{ fontSize: 8, color: C.textMuted }}>{label}</Text>
        )}
      </View>
    </View>
  );
};

const LightRing = ({ pct, size = 44, sw = 4 }) => {
  const r = (size - sw) / 2;
  const circ = 2 * Math.PI * r;
  const progress = (pct / 100) * circ;
  const color =
    pct >= 80
      ? C.teal
      : pct >= 65
        ? C.amber
        : pct >= 50
          ? C.accentDeep
          : C.textMuted;
  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="rgba(0,0,0,0.06)"
          strokeWidth={sw}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={sw}
          fill="none"
          strokeDasharray={`${progress} ${circ}`}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2},${size / 2}`}
        />
      </Svg>
      <View style={{ position: "absolute" }}>
        <Text weight="700" style={{ fontSize: 10, color }}>
          {pct}%
        </Text>
      </View>
    </View>
  );
};

const IntensityAreaChart = ({ data, activeIdx, onDotPress }) => {
  const W = SCREEN_WIDTH - 76;
  const H = 120;
  const pL = 0,
    pR = 0,
    pT = 22,
    pB = 20;
  const iW = W - pL - pR;
  const iH = H - pT - pB;
  const maxT = data[data.length - 1].t;
  const toX = (t) => pL + (t / maxT) * iW;
  const toY = (stage) => pT + ((2.5 - stage) / 2.5) * iH;

  const linePts = data
    .map((d) => `${toX(d.t).toFixed(1)},${toY(d.stage).toFixed(1)}`)
    .join(" ");
  const bottomY = pT + iH;
  const fillD =
    `M ${toX(data[0].t).toFixed(1)},${bottomY} ` +
    data
      .map((d) => `L ${toX(d.t).toFixed(1)},${toY(d.stage).toFixed(1)}`)
      .join(" ") +
    ` L ${toX(data[data.length - 1].t).toFixed(1)},${bottomY} Z`;

  const stageYs = [toY(0), toY(1.25), toY(2.5)];
  const activePt = data[activeIdx];
  const activeX = activePt ? toX(activePt.t) : null;
  const activeY = activePt ? toY(activePt.stage) : null;
  const activeColor = activePt ? getIntensityColor(activePt.stage) : C.accent;
  const activeLabel = activePt ? getIntensityLabel(activePt.stage) : "";

  return (
    <Svg width={W} height={H}>
      <Defs>
        <SvgGradient id="intensityGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={C.accent} stopOpacity="0.25" />
          <Stop offset="70%" stopColor={C.accent} stopOpacity="0.05" />
          <Stop offset="100%" stopColor={C.accent} stopOpacity="0.00" />
        </SvgGradient>
      </Defs>
      {stageYs.map((y, i) => (
        <Line
          key={i}
          x1={pL}
          y1={y}
          x2={W - pR}
          y2={y}
          stroke="rgba(0,0,0,0.06)"
          strokeWidth="1"
          strokeDasharray="4 3"
        />
      ))}
      <Path d={fillD} fill="url(#intensityGrad)" />
      <Polyline
        points={linePts}
        fill="none"
        stroke={C.accent}
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {data.map((d, i) => {
        const x = toX(d.t);
        const y = toY(d.stage);
        const isActive = i === activeIdx;
        const dotColor = getIntensityColor(d.stage);
        return (
          <React.Fragment key={i}>
            <Circle
              cx={x}
              cy={y}
              r={isActive ? 11 : 7}
              fill={isActive ? `${dotColor}30` : "rgba(243,123,43,0.08)"}
            />
            <Circle
              cx={x}
              cy={y}
              r={isActive ? 5.5 : 3.5}
              fill={isActive ? dotColor : C.accent}
              stroke={
                isActive ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.8)"
              }
              strokeWidth={isActive ? 2 : 1}
              onPress={() => onDotPress && onDotPress(i)}
            />
          </React.Fragment>
        );
      })}

      {activePt && activeX !== null && activeY !== null && (
        <>
          <Line
            x1={activeX}
            y1={activeY}
            x2={activeX}
            y2={bottomY}
            stroke={activeColor}
            strokeWidth="1"
            strokeDasharray="3 3"
            opacity="0.5"
          />
          <Path
            d={`M ${(activeX - 26).toFixed(1)},${(activeY - 20).toFixed(1)} Q ${(activeX - 26).toFixed(1)},${(activeY - 28).toFixed(1)} ${(activeX - 18).toFixed(1)},${(activeY - 28).toFixed(1)} L ${(activeX + 18).toFixed(1)},${(activeY - 28).toFixed(1)} Q ${(activeX + 26).toFixed(1)},${(activeY - 28).toFixed(1)} ${(activeX + 26).toFixed(1)},${(activeY - 20).toFixed(1)} L ${(activeX + 26).toFixed(1)},${(activeY - 12).toFixed(1)} Q ${(activeX + 26).toFixed(1)},${(activeY - 4).toFixed(1)} ${(activeX + 18).toFixed(1)},${(activeY - 4).toFixed(1)} L ${(activeX - 18).toFixed(1)},${(activeY - 4).toFixed(1)} Q ${(activeX - 26).toFixed(1)},${(activeY - 4).toFixed(1)} ${(activeX - 26).toFixed(1)},${(activeY - 12).toFixed(1)} Z`}
            fill={activeColor}
            opacity="0.95"
          />
          <SvgText
            x={activeX}
            y={activeY - 12}
            fontSize="8.5"
            fill={C.white}
            textAnchor="middle"
            fontWeight="700"
          >
            {activeLabel}
          </SvgText>
          <SvgText
            x={activeX}
            y={activeY - 3}
            fontSize="7.5"
            fill="rgba(255,255,255,0.9)"
            textAnchor="middle"
          >
            {activePt.t.toFixed(1)}h
          </SvgText>
        </>
      )}
      {[0, 1, 2, 3, 4, 5, 6].map((v) => (
        <SvgText
          key={v}
          x={toX(v)}
          y={H - 4}
          fontSize="8.5"
          fill={C.textMuted}
          textAnchor="middle"
        >
          {v}h
        </SvgText>
      ))}
    </Svg>
  );
};

const TrendLineChart = ({ days, dataPts, activeIdx }) => {
  const Y_LABEL_W = 28;
  const W = SCREEN_WIDTH - 40 - 36;
  const INNER_W = W - Y_LABEL_W;
  const CHART_H = 82;
  const COUNT = days.length;
  const SPACING = INNER_W / COUNT;

  const maxV = Math.max(...dataPts);
  const minV = Math.min(...dataPts);
  const RANGE = maxV - minV || 1;

  const pts = days.map((day, i) => ({
    x: Y_LABEL_W + SPACING * i + SPACING / 2,
    y: CHART_H - ((dataPts[i] - minV) / RANGE) * (CHART_H - 16) - 8,
    day,
    val: dataPts[i],
  }));

  const linePts = pts
    .map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");
  const areaD =
    `M ${pts[0].x.toFixed(1)},${CHART_H} ` +
    pts.map((p) => `L ${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") +
    ` L ${pts[pts.length - 1].x.toFixed(1)},${CHART_H} Z`;

  const yLabels = [maxV, (maxV + minV) / 2, minV];

  return (
    <Svg width={W} height={CHART_H + 20}>
      <Defs>
        <SvgGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={C.lineChart} stopOpacity="0.2" />
          <Stop offset="100%" stopColor={C.lineChart} stopOpacity="0.01" />
        </SvgGradient>
      </Defs>
      {[0, 0.33, 0.66, 1].map((f, i) => (
        <Line
          key={i}
          x1={Y_LABEL_W}
          y1={8 + (1 - f) * (CHART_H - 16)}
          x2={W}
          y2={8 + (1 - f) * (CHART_H - 16)}
          stroke="rgba(0,0,0,0.05)"
          strokeWidth="1"
        />
      ))}
      {yLabels.map((v, i) => (
        <SvgText
          key={i}
          x={Y_LABEL_W - 4}
          y={i === 0 ? 12 : i === 1 ? CHART_H / 2 : CHART_H - 4}
          fontSize="8.5"
          fill={C.textFaint}
          textAnchor="end"
        >
          {Math.round(v)}
        </SvgText>
      ))}
      <Path d={areaD} fill="url(#trendFill)" />
      <Polyline
        points={linePts}
        fill="none"
        stroke={C.lineChart}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {pts.map((pt, i) => {
        const isActive = i === activeIdx;
        return (
          <React.Fragment key={i}>
            <Circle
              cx={pt.x}
              cy={pt.y}
              r={9}
              fill={C.lineChartGlow}
              opacity={isActive ? 1 : 0.5}
            />
            <Circle
              cx={pt.x}
              cy={pt.y}
              r={isActive ? 5.5 : 4}
              fill={isActive ? C.accent : C.lineChart}
              stroke={C.white}
              strokeWidth="2"
            />
            {isActive && (
              <SvgText
                x={pt.x}
                y={pt.y - 10}
                fontSize="9"
                fill={C.accent}
                textAnchor="middle"
                fontWeight="700"
              >
                {pt.val}
              </SvgText>
            )}
            <SvgText
              x={pt.x}
              y={CHART_H + 16}
              fontSize="9"
              fill={C.textFaint}
              textAnchor="middle"
            >
              {pt.day}
            </SvgText>
          </React.Fragment>
        );
      })}
    </Svg>
  );
};

const WeekBars = ({ activeIdx, onBarPress }) => {
  const MAX_H = 72;
  const maxVal = Math.max(...WEEK_DUR);
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-end",
        height: MAX_H + 38,
      }}
    >
      {WEEK_DAYS.map((day, i) => {
        const barH = (WEEK_DUR[i] / maxVal) * MAX_H;
        const isActive = i === activeIdx;
        return (
          <TouchableOpacity
            key={day}
            activeOpacity={0.7}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "flex-end",
            }}
            onPress={() => onBarPress && onBarPress(i)}
          >
            {isActive && (
              <Text
                style={{
                  fontSize: 8,
                  color: C.accentDeep,
                  marginBottom: 3,
                  textAlign: "center",
                }}
              >
                {fmtDuration(WEEK_DUR[i])}
              </Text>
            )}
            <View
              style={{
                width: 18,
                height: MAX_H,
                justifyContent: "flex-end",
                borderRadius: 9,
                overflow: "hidden",
                backgroundColor: "rgba(0,0,0,0.04)",
              }}
            >
              <LinearGradient
                colors={
                  isActive
                    ? [C.accent, C.accentDeep]
                    : ["rgba(243,123,43,0.35)", "rgba(217,101,27,0.15)"]
                }
                style={{ height: barH, borderRadius: 9 }}
              />
            </View>
            <View
              style={{
                marginTop: 5,
                width: 22,
                height: 18,
                borderRadius: 9,
                backgroundColor: isActive ? C.accentDeep : "transparent",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{ fontSize: 8, color: isActive ? C.white : C.textMuted }}
              >
                {day.slice(0, 2)}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const MonthHeatmap = ({ onDayPress, selectedDay }) => {
  const cellSize = Math.floor((SCREEN_WIDTH - 80) / 7);
  const weeks = [];
  for (let w = 0; w < 4; w++) weeks.push(MONTH_DAILY.slice(w * 7, w * 7 + 7));

  const getColor = (q) =>
    q >= 80
      ? C.accentDeep
      : q >= 65
        ? C.amber
        : q >= 50
          ? "rgba(243,123,43,0.38)"
          : "rgba(243,123,43,0.13)";

  return (
    <View>
      <View style={{ flexDirection: "row", marginBottom: 8 }}>
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <View key={i} style={{ width: cellSize, alignItems: "center" }}>
            <Text style={{ fontSize: 10, color: C.textFaint }}>{d}</Text>
          </View>
        ))}
      </View>
      {weeks.map((week, wi) => (
        <View key={wi} style={{ flexDirection: "row", marginBottom: 5 }}>
          {week.map((day) => {
            const isSelected = selectedDay === day.day;
            return (
              <TouchableOpacity
                key={day.day}
                activeOpacity={0.75}
                style={{ width: cellSize, alignItems: "center" }}
                onPress={() => onDayPress && onDayPress(day)}
              >
                <View
                  style={{
                    width: cellSize - 5,
                    height: cellSize - 5,
                    borderRadius: 9,
                    backgroundColor: getColor(day.score),
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: isSelected ? 2 : 0,
                    borderColor: isSelected ? C.primary : "transparent",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 9,
                      color: day.score >= 50 ? C.white : C.primaryDark,
                      opacity: 0.9,
                    }}
                  >
                    {day.day}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          marginTop: 10,
        }}
      >
        {[
          { c: "rgba(243,123,43,0.13)", l: "Rest" },
          { c: "rgba(243,123,43,0.38)", l: "Light" },
          { c: C.amber, l: "Active" },
          { c: C.accentDeep, l: "Intense" },
        ].map((item) => (
          <View
            key={item.l}
            style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
          >
            <View
              style={{
                width: 9,
                height: 9,
                borderRadius: 3,
                backgroundColor: item.c,
              }}
            />
            <Text style={{ fontSize: 8.5, color: C.textFaint }}>{item.l}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const TipCard = ({ tip }) => (
  <View style={s.tipCard}>
    <View style={s.tipIconWrap}>
      <Ionicons name="flame-outline" size={15} color={C.accentDeep} />
    </View>
    <Text style={s.tipText}>{tip}</Text>
  </View>
);

const DayDetailModal = ({ visible, day, onClose }) => {
  if (!day) return null;
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={s.overlay}>
        <View style={[s.sheet, { paddingBottom: 34 }]}>
          <View style={s.sheetHandle} />
          <Text weight="700" style={[s.sheetTitle, { marginBottom: 16 }]}>
            Day {day.day} — This Month
          </Text>
          <View style={{ flexDirection: "row", gap: 12, marginBottom: 14 }}>
            {[
              {
                label: "Active Time",
                val: fmtDuration(day.duration),
                icon: "timer-outline",
                color: C.teal,
              },
              {
                label: "Calories",
                val: `${day.calories} kcal`,
                icon: "flame-outline",
                color: C.accentDeep,
              },
            ].map((item) => (
              <View
                key={item.label}
                style={{
                  flex: 1,
                  backgroundColor: "rgba(92, 67, 191, 0.05)",
                  borderRadius: 14,
                  padding: 14,
                  alignItems: "center",
                }}
              >
                <Ionicons
                  name={item.icon}
                  size={18}
                  color={item.color}
                  style={{ marginBottom: 6 }}
                />
                <Text
                  weight="700"
                  style={{
                    fontSize: 18,
                    color: C.primaryDark,
                    marginBottom: 2,
                  }}
                >
                  {item.val}
                </Text>
                <Text style={{ fontSize: 10, color: C.textMuted }}>
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
          <View style={{ alignSelf: "flex-start" }}>
            <ScoreBadge score={day.score} />
          </View>
          <TouchableOpacity
            onPress={onClose}
            style={[s.sheetBtn, { backgroundColor: C.primary, marginTop: 16 }]}
          >
            <Text weight="700" style={{ color: C.white }}>
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const DayView = () => {
  const [activeDateIdx, setActiveDateIdx] = useState(TODAY_INDEX);
  const [activeStageDot, setActiveStageDot] = useState(4);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const dateScrollRef = useRef(null);

  const activeDateEntry = DATE_LIST[activeDateIdx];
  const dayData = getDayData(activeDateEntry);
  const isFuture = activeDateEntry?.isFuture ?? false;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (dateScrollRef.current) {
        const scrollX = Math.max(0, (TODAY_INDEX - 3) * 58);
        dateScrollRef.current.scrollTo({ x: scrollX, animated: false });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleDateChange = useCallback(
    (idx) => {
      const entry = DATE_LIST[idx];
      if (!entry || idx === activeDateIdx) return;
      const direction = idx > activeDateIdx ? 1 : -1;

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: direction * -20,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.97,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setActiveDateIdx(idx);
        setActiveStageDot(4);
        slideAnim.setValue(direction * 20);

        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 260,
            useNativeDriver: true,
          }),
          Animated.spring(slideAnim, {
            toValue: 0,
            speed: 18,
            bounciness: 4,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            speed: 18,
            bounciness: 4,
            useNativeDriver: true,
          }),
        ]).start();
      });
    },
    [activeDateIdx, fadeAnim, slideAnim, scaleAnim],
  );

  const formatHeaderDate = () => {
    if (!activeDateEntry) return "";
    const { date, isToday } = activeDateEntry;
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    if (isToday)
      return `Today, ${date.getDate()} ${monthNames[date.getMonth()]}`;
    return `${dayNames[date.getDay()]}, ${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      <ScrollView
        ref={dateScrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.dateRow}
      >
        {DATE_LIST.map((entry, i) => {
          const isActive = i === activeDateIdx;
          const isFutureEntry = entry.isFuture;
          return (
            <TouchableOpacity
              key={i}
              onPress={() => !isFutureEntry && handleDateChange(i)}
              activeOpacity={isFutureEntry ? 1 : 0.7}
              style={[
                s.dateTab,
                isActive && s.dateTabActive,
                isFutureEntry && s.dateTabFuture,
              ]}
            >
              {entry.isToday && !isActive && <View style={s.todayDot} />}
              <Text
                weight={isActive ? "700" : "400"}
                style={[
                  s.dateTabTxt,
                  isActive && s.dateTabTxtActive,
                  isFutureEntry && s.dateTabTxtFuture,
                ]}
              >
                {`${pad(entry.dayNum)}\n${entry.month}`}
              </Text>
              {isFutureEntry && (
                <View style={s.futureLock}>
                  <Ionicons name="lock-closed" size={7} color={C.textFaint} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Text weight="500" style={s.dateHeader}>
        {formatHeaderDate()}
      </Text>

      {isFuture ? (
        <View style={s.futurePlaceholder}>
          <Ionicons name="bicycle-outline" size={36} color={C.textFaint} />
          <Text weight="600" style={s.futurePlaceholderTitle}>
            No data yet
          </Text>
          <Text style={s.futurePlaceholderSub}>
            Activity data for this date will appear{"\n"}once the day has
            passed.
          </Text>
        </View>
      ) : (
        <>
          <View style={s.summaryRow}>
            <View>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <Ionicons name="flame" size={15} color={C.accentDeep} />
                <Text
                  weight="700"
                  style={{
                    fontSize: 22,
                    color: C.accentDeep,
                    letterSpacing: -0.5,
                  }}
                >
                  {dayData ? `${dayData.calories} kcal` : "—"}
                </Text>
              </View>
              <Text style={{ fontSize: 11, color: C.accentDeep, marginTop: 2 }}>
                {activeDateEntry.isToday
                  ? "↗ 120 kcal more than yesterday"
                  : "Logged activity"}
              </Text>
            </View>
            {dayData && <ScoreBadge score={dayData.score} />}
          </View>

          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateX: slideAnim }, { scale: scaleAnim }],
            }}
          >
            <LinearGradient colors={[C.bgCard, C.bgCardAlt]} style={s.dayCard}>
              <View style={s.dayCardHead}>
                <View>
                  <Text
                    style={{
                      fontSize: 10.5,
                      color: C.textMuted,
                      marginBottom: 2,
                    }}
                  >
                    Active Time
                  </Text>
                  <Text
                    weight="700"
                    style={{
                      fontSize: 28,
                      color: C.primaryDark,
                      letterSpacing: -0.8,
                    }}
                  >
                    {dayData ? fmtDuration(dayData.duration) : "—"}
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={{ fontSize: 11, color: C.textMuted }}>
                    {activeDateEntry
                      ? `${pad(activeDateEntry.dayNum)} ${activeDateEntry.month} ${activeDateEntry.date.getFullYear()}`
                      : ""}
                  </Text>
                  {dayData && (
                    <View style={{ marginTop: 5 }}>
                      <ScoreBadge score={dayData.score} />
                    </View>
                  )}
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  gap: 14,
                  marginBottom: 6,
                  marginTop: -4,
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flexDirection: "row", gap: 14 }}>
                  {[
                    { l: "Rest", c: C.teal },
                    { l: "Light", c: C.amber },
                    { l: "Intense", c: C.accentDeep },
                  ].map((x) => (
                    <View
                      key={x.l}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      <View
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: 4,
                          backgroundColor: x.c,
                        }}
                      />
                      <Text style={{ fontSize: 10, color: C.textMuted }}>
                        {x.l}
                      </Text>
                    </View>
                  ))}
                </View>
                <Text style={{ fontSize: 9, color: C.textMuted, opacity: 0.7 }}>
                  Tap a dot
                </Text>
              </View>

              <View style={{ marginBottom: 8 }}>
                <IntensityAreaChart
                  data={STAGE_DATA}
                  activeIdx={activeStageDot}
                  onDotPress={setActiveStageDot}
                />
              </View>

              <View style={s.statsGrid}>
                <View style={s.statBox}>
                  <Text style={s.statLabel}>Distance</Text>
                  <View style={s.statRow}>
                    <Ionicons
                      name="map-outline"
                      size={14}
                      color={C.accentDeep}
                    />
                    <Text weight="600" style={s.statVal}>
                      {dayData?.distance} km
                    </Text>
                  </View>
                </View>

                <View style={s.statBox}>
                  <Text style={s.statLabel}>Steps</Text>
                  <View style={s.statRow}>
                    <Ionicons name="walk-outline" size={14} color={C.teal} />
                    <Text weight="600" style={[s.statVal, { color: C.teal }]}>
                      {dayData ? Math.round(dayData.calories * 12.5) : "—"}
                    </Text>
                  </View>
                </View>

                <View style={s.statBox}>
                  <Text style={s.statLabel}>Avg HR</Text>
                  <View style={s.statRow}>
                    <Ionicons name="heart-outline" size={14} color={C.red} />
                    <Text weight="600" style={s.statVal}>
                      {dayData ? "135 bpm" : "—"}
                    </Text>
                  </View>
                </View>

                <View style={s.statBox}>
                  <Text style={s.statLabel}>Activity Score</Text>
                  <View style={s.statRow}>
                    {dayData ? (
                      <LightRing pct={dayData.score} size={44} sw={4} />
                    ) : (
                      <Text style={s.statVal}>—</Text>
                    )}
                  </View>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>
          <TipCard tip={TIPS[activeDateIdx % TIPS.length]} />
        </>
      )}
    </ScrollView>
  );
};

const WeekView = () => {
  const [activeBar, setActiveBar] = useState(3);
  const bestIdx = TREND_CALS.indexOf(Math.max(...TREND_CALS));
  const worstIdx = TREND_CALS.indexOf(Math.min(...TREND_CALS));
  const avgCals = Math.round(
    TREND_CALS.reduce((a, b) => a + b, 0) / TREND_CALS.length,
  );

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      <LinearGradient colors={[C.bgDarkMid, C.bgDarkTop]} style={s.gradCard}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <AnimRing
            score={85}
            size={86}
            sw={7}
            color={C.accent}
            label="Active"
          />
          <View style={{ marginLeft: 16, flex: 1 }}>
            <Text
              weight="700"
              style={{ fontSize: 12, color: C.textMuted, marginBottom: 5 }}
            >
              Weekly Activity Score
            </Text>
            <Text
              style={{ fontSize: 13, color: C.primaryDark, fontWeight: "600" }}
            >
              3 Workouts Completed
            </Text>
            <Text
              style={{ fontSize: 10, color: C.textMuted, marginBottom: 10 }}
            >
              Overall performance
            </Text>
            <View style={{ flexDirection: "row", gap: 20 }}>
              <View>
                <Text
                  weight="700"
                  style={{ fontSize: 15, color: C.primaryDark }}
                >
                  {avgCals} kcal
                </Text>
                <Text style={{ fontSize: 10, color: C.textMuted }}>
                  Avg Burn
                </Text>
              </View>
              <View>
                <Text
                  weight="700"
                  style={{ fontSize: 15, color: C.primaryDark }}
                >
                  6h 15m
                </Text>
                <Text style={{ fontSize: 10, color: C.textMuted }}>
                  Total Time
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={s.streakRow}>
          <Ionicons name="flame" size={13} color={C.amber} />
          <Text style={{ fontSize: 11.5, color: C.accentDeep, marginLeft: 6 }}>
            3-day streak of hitting calorie goals
          </Text>
        </View>
      </LinearGradient>

      <View style={s.darkCard}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <Text weight="700" style={s.cardTitle}>
            Calorie Trend
          </Text>
          <Text style={{ fontSize: 10, color: C.textMuted }}>
            Tap point to focus
          </Text>
        </View>
        <TrendLineChart
          days={TREND_DAYS}
          dataPts={TREND_CALS}
          activeIdx={activeBar}
        />

        <View
          style={{
            height: 1,
            backgroundColor: "rgba(0,0,0,0.06)",
            marginVertical: 14,
          }}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Text weight="700" style={s.cardTitle}>
            Active Duration
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <View style={s.yAxis}>
            {["2.5h", "1.5h", "0.5h", "0h"].map((l) => (
              <Text key={l} style={s.yAxisLabel}>
                {l}
              </Text>
            ))}
          </View>
          <View style={{ flex: 1 }}>
            <WeekBars activeIdx={activeBar} onBarPress={setActiveBar} />
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 8, marginTop: 14 }}>
          <View
            style={[
              s.highlight,
              {
                backgroundColor: "rgba(16,185,129,0.1)",
                borderColor: "rgba(16,185,129,0.25)",
              },
            ]}
          >
            <Ionicons name="trophy-outline" size={12} color={C.green} />
            <Text style={{ fontSize: 11, color: C.green, marginLeft: 4 }}>
              Best: {WEEK_DAYS[bestIdx]} {TREND_CALS[bestIdx]}kcal
            </Text>
          </View>
          <View
            style={[
              s.highlight,
              {
                backgroundColor: "rgba(239,68,68,0.08)",
                borderColor: "rgba(239,68,68,0.22)",
              },
            ]}
          >
            <Ionicons name="alert-circle-outline" size={12} color={C.red} />
            <Text style={{ fontSize: 11, color: C.red, marginLeft: 4 }}>
              Worst: {WEEK_DAYS[worstIdx]} {TREND_CALS[worstIdx]}kcal
            </Text>
          </View>
        </View>
      </View>

      <View style={s.darkCard}>
        <Text weight="700" style={[s.cardTitle, { marginBottom: 14 }]}>
          Weekly Averages
        </Text>
        <View style={{ flexDirection: "row" }}>
          {[
            { val: `${avgCals} kcal`, sub: "Avg Calories" },
            { val: "45m", sub: "Avg Duration" },
            { val: "4", sub: "Workouts" },
          ].map((item, i) => (
            <View key={i} style={{ flex: 1, paddingHorizontal: 4 }}>
              <Text
                weight="700"
                style={{ fontSize: 15, color: C.primaryDark, marginBottom: 4 }}
              >
                {item.val}
              </Text>
              <Text style={{ fontSize: 9, color: C.textFaint }}>
                {item.sub}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const MonthView = () => {
  const [expandedWeek, setExpandedWeek] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [dayModalVisible, setDayModalVisible] = useState(false);

  const avgCals = Math.round(
    MONTH_DAILY.reduce((s, d) => s + d.calories, 0) / MONTH_DAILY.length,
  );
  const avgScore = Math.round(
    MONTH_DAILY.reduce((s, d) => s + d.score, 0) / MONTH_DAILY.length,
  );
  const bestDay = MONTH_DAILY.reduce((a, b) =>
    b.calories > a.calories ? b : a,
  );
  const worstDay = MONTH_DAILY.reduce((a, b) =>
    b.calories < a.calories ? b : a,
  );
  const activeDays = MONTH_DAILY.filter((d) => d.calories >= 400).length;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      <LinearGradient colors={[C.bgDarkMid, C.bgDarkTop]} style={s.gradCard}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{ fontSize: 10.5, color: C.textMuted, marginBottom: 4 }}
            >
              Monthly Average Burn
            </Text>
            <Text
              weight="700"
              style={{ fontSize: 32, color: C.primaryDark, letterSpacing: -1 }}
            >
              {avgCals}
            </Text>
            <Text style={{ fontSize: 11, color: C.textMuted, marginTop: 3 }}>
              kcal/day · this month
            </Text>
          </View>
          <AnimRing
            score={avgScore}
            size={82}
            sw={6}
            color={C.accent}
            label="Score"
          />
        </View>
        <View
          style={{
            height: 1,
            backgroundColor: "rgba(0,0,0,0.06)",
            marginVertical: 14,
          }}
        />
        <View style={{ flexDirection: "row" }}>
          {[
            {
              icon: "trophy-outline",
              label: "Best Day",
              val: `Day ${bestDay.day}: ${bestDay.calories} kcal`,
              color: C.green,
            },
            {
              icon: "alert-circle-outline",
              label: "Rest Day",
              val: `Day ${worstDay.day}: ${worstDay.calories} kcal`,
              color: C.teal,
            },
            {
              icon: "checkmark-circle-outline",
              label: "Active Days",
              val: `${activeDays}/28`,
              color: C.accent,
            },
          ].map((item) => (
            <View key={item.label} style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 3,
                  marginBottom: 3,
                }}
              >
                <Ionicons name={item.icon} size={11} color={item.color} />
                <Text style={{ fontSize: 9, color: C.textMuted }}>
                  {item.label}
                </Text>
              </View>
              <Text weight="700" style={{ fontSize: 12, color: C.primaryDark }}>
                {item.val}
              </Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <View style={s.darkCard}>
        <Text weight="700" style={[s.cardTitle, { marginBottom: 14 }]}>
          Weekly Breakdown
        </Text>
        {MONTH_WEEKS.map((week, i) => {
          const isExpanded = expandedWeek === i;
          return (
            <TouchableOpacity
              key={i}
              activeOpacity={0.75}
              onPress={() => setExpandedWeek(isExpanded ? null : i)}
              style={{ marginBottom: i < MONTH_WEEKS.length - 1 ? 14 : 0 }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <Text style={{ fontSize: 12.5, color: C.primaryDark }}>
                  {week.label}
                </Text>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Text style={{ fontSize: 11, color: C.textMuted }}>
                    {week.avgKcal} kcal/day
                  </Text>
                  <ScoreBadge score={week.score} />
                  <Feather
                    name={isExpanded ? "chevron-up" : "chevron-down"}
                    size={13}
                    color={C.textMuted}
                  />
                </View>
              </View>
              <View
                style={{
                  height: 7,
                  backgroundColor: "rgba(0,0,0,0.06)",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <LinearGradient
                  colors={[C.accent, C.accentDeep]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    height: "100%",
                    width: `${(week.avgKcal / 1000) * 100}%`,
                    borderRadius: 4,
                  }}
                />
              </View>
              {isExpanded && (
                <View style={s.expandedNote}>
                  <Text
                    style={{
                      fontSize: 11.5,
                      color: C.textMuted,
                      lineHeight: 18,
                    }}
                  >
                    {week.note}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={s.darkCard}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 4,
          }}
        >
          <Text weight="700" style={s.cardTitle}>
            Activity Heatmap
          </Text>
          <Text style={{ fontSize: 10, color: C.textMuted }}>
            Tap a day for details
          </Text>
        </View>
        <Text style={{ fontSize: 10.5, color: C.textMuted, marginBottom: 14 }}>
          This month
        </Text>
        <MonthHeatmap
          onDayPress={(day) => {
            setSelectedDay(day);
            setDayModalVisible(true);
          }}
          selectedDay={selectedDay?.day}
        />
      </View>

      <LinearGradient
        colors={[C.bgDarkMid, C.bgDarkTop]}
        style={[s.gradCard, { flexDirection: "row", alignItems: "center" }]}
      >
        <AnimRing score={avgScore} size={58} sw={5} color={C.accent} />
        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text
            weight="700"
            style={{ fontSize: 14, color: C.primaryDark, marginBottom: 4 }}
          >
            Monthly Consistency: {avgScore}%
          </Text>
          <Text style={{ fontSize: 12, color: C.textMuted, lineHeight: 18 }}>
            You hit your active goals {activeDays} out of 28 days. Keep moving!
          </Text>
        </View>
      </LinearGradient>

      <TipCard tip={TIPS[0]} />
      <DayDetailModal
        visible={dayModalVisible}
        day={selectedDay}
        onClose={() => setDayModalVisible(false)}
      />
    </ScrollView>
  );
};

export default function FitnessHistory({ onBack, initialTab = "Day" }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const topOffset =
    Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 10 : 48;

  return (
    <LinearGradient colors={[C.bgLight, C.bgLight]} style={s.screen}>
      <View style={[s.header, { paddingTop: topOffset }]}>
        <View style={s.headerTopRow}>
          <TouchableOpacity
            onPress={() => onBack && onBack()}
            style={s.iconBtn}
          >
            <Feather name="arrow-left" size={20} color={C.primary} />
          </TouchableOpacity>
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text weight="800" style={s.headerTitle}>
              Fitness History
            </Text>
            <Text style={s.headerSub}>Track every rep, run & calorie.</Text>
          </View>
          <TouchableOpacity style={s.iconBtn}>
            <Feather name="settings" size={18} color={C.primary} />
          </TouchableOpacity>
        </View>
        <View style={s.tabBar}>
          {["Day", "Week", "Month"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[s.tabItem, activeTab === tab && s.tabItemActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                weight={activeTab === tab ? "700" : "500"}
                style={[s.tabTxt, activeTab === tab && s.tabTxtActive]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 10 }}>
        {activeTab === "Day" && <DayView />}
        {activeTab === "Week" && <WeekView />}
        {activeTab === "Month" && <MonthView />}
      </View>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 10 },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  headerTitle: { fontSize: 20, color: C.primary, letterSpacing: -0.3 },
  headerSub: { fontSize: 12, color: C.textMuted, marginTop: 1 },
  tabBar: {
    flexDirection: "row",
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 13,
  },
  tabItemActive: { backgroundColor: C.accent },
  tabTxt: { fontSize: 14, color: C.textMuted },
  tabTxtActive: { color: C.white },
  dateRow: {
    paddingVertical: 4,
    gap: 5,
    marginBottom: 4,
    paddingHorizontal: 2,
  },
  dateTab: {
    width: 52,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    minHeight: 54,
  },

  // 👇 CHANGED FROM C.primary TO C.accent
  dateTabActive: { backgroundColor: C.accent },

  dateTabFuture: { opacity: 0.38 },
  dateTabTxt: {
    fontSize: 11,
    color: C.textMuted,
    textAlign: "center",
    lineHeight: 16,
  },
  dateTabTxtActive: { color: C.white },
  dateTabTxtFuture: { color: C.textMuted },
  todayDot: {
    position: "absolute",
    top: 5,
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: C.accentDeep,
  },
  futureLock: { position: "absolute", bottom: 5 },
  dateHeader: {
    fontSize: 12,
    color: C.textMuted,
    marginBottom: 10,
    marginLeft: 2,
  },
  futurePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 10,
  },
  futurePlaceholderTitle: { fontSize: 16, color: C.primaryDark },
  futurePlaceholderSub: {
    fontSize: 12,
    color: C.textMuted,
    textAlign: "center",
    lineHeight: 18,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  dayCard: {
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 14,
    elevation: 3,
  },
  dayCardHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 8 },
  statBox: {
    width: "47%",
    backgroundColor: "#F8F9FB",
    borderRadius: 15,
    padding: 12,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  statLabel: { fontSize: 10.5, color: C.textMuted },
  statVal: { fontSize: 14, color: C.primaryDark },
  statRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  tipCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "rgba(92, 67, 191, 0.04)",
    borderRadius: 16,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "rgba(92, 67, 191, 0.08)",
  },
  tipIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: "rgba(92, 67, 191, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  tipText: { flex: 1, fontSize: 12, color: C.textMuted, lineHeight: 18 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.52)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: C.white,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    padding: 24,
    paddingBottom: 40,
  },
  sheetHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(0,0,0,0.12)",
    alignSelf: "center",
    marginBottom: 20,
  },
  sheetTitle: { fontSize: 17, color: C.primaryDark, marginBottom: 14 },
  sheetBtn: {
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  gradCard: { borderRadius: 22, padding: 20, marginBottom: 14 },
  darkCard: {
    backgroundColor: C.white,
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 14,
    elevation: 2,
  },
  cardTitle: { fontSize: 14.5, color: C.primaryDark },
  streakRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    backgroundColor: "rgba(243,123,43,0.1)",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  highlight: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
  },
  yAxis: { width: 30, justifyContent: "space-between", paddingBottom: 28 },
  yAxisLabel: { fontSize: 9, color: C.textFaint, textAlign: "right" },
  expandedNote: {
    marginTop: 8,
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.03)",
    borderRadius: 10,
  },
});
