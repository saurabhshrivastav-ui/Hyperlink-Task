import React, { useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView,
  Dimensions,
  ImageBackground,
  Image,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  Feather,
  FontAwesome5,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "../../../components/TextWrapper";
import PressableCard from "../../components/PressableCard";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ─── Dummy Data ─────────────────────────────────────────────────────────────

const COMPLETED_ACTIVITIES = [
  {
    id: 1,
    title: "Morning Run",
    time: "Today",
    details: "5.1 km | 30 min | 350 kcal",
    icon: "run",
    color: "#10B981",
    bg: "#D1FAE5",
  },
  {
    id: 2,
    title: "Cycling to Work",
    time: "Yesterday",
    details: "12.3 km | 45 min | 490 kcal",
    icon: "bike",
    color: "#8B5CF6",
    bg: "#EDE9FE",
  },
  {
    id: 3,
    title: "Evening Swim",
    time: "2 days ago",
    details: "1000 m | 25 min | 210 kcal",
    icon: "swim",
    color: "#3B82F6",
    bg: "#DBEAFE",
  },
  {
    id: 4,
    title: "Hatha Yoga Session",
    time: "3 days ago",
    details: "40 min | -- | 110 kcal",
    icon: "yoga",
    color: "#F59E0B",
    bg: "#FEF3C7",
  },
  {
    id: 5,
    title: "Walking (Afternoon)",
    time: "4 days ago",
    details: "3.2 km | 40 min | 150 kcal",
    icon: "walk",
    color: "#10B981",
    bg: "#D1FAE5",
  },
];

const GOAL_CHIPS = [
  {
    id: 1,
    label: "Target steps per day",
    icon: "shoe-print",
    family: "MaterialCommunityIcons",
    color: "#F59E0B",
  },
  {
    id: 2,
    label: "Total active minutes",
    icon: "clock-outline",
    family: "MaterialCommunityIcons",
    color: "#3B82F6",
  },
  {
    id: 3,
    label: "Running distance",
    icon: "run",
    family: "MaterialCommunityIcons",
    color: "#10B981",
  },
  {
    id: 4,
    label: "Gym sessions",
    icon: "dumbbell",
    family: "MaterialCommunityIcons",
    color: "#EF4444",
  },
  {
    id: 5,
    label: "Swim distance",
    icon: "swim",
    family: "MaterialCommunityIcons",
    color: "#3B82F6",
  },
  {
    id: 6,
    label: "Cycling distance",
    icon: "bike",
    family: "MaterialCommunityIcons",
    color: "#EC4899",
  },
];

// ─── Main Component ─────────────────────────────────────────────────────────

export default function SetFitnessGoalPage({ onBack }) {
  const topOffset =
    Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 10 : 18;

  const renderIcon = (chip) => {
    if (chip.family === "MaterialCommunityIcons") {
      return (
        <MaterialCommunityIcons name={chip.icon} size={16} color={chip.color} />
      );
    }
    return <FontAwesome5 name={chip.icon} size={14} color={chip.color} />;
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topOffset },
        ]}
      >
        {/* ── Header ── */}
        <View style={styles.headerBlock}>
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
                Set Fitness Goal
              </Text>
              <Text weight="400" style={styles.headerSubtitle}>
                Build healthy habits, one day at a time.
              </Text>
            </View>
          </View>
        </View>

        {/* ── Hero Card: Today's Activity ── */}
        <View style={styles.sectionWrap}>
          <LinearGradient
            colors={["#FFC470", "#FF9D3A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <Text weight="700" style={styles.heroTitle}>
              Today's Activity
            </Text>
            <Text weight="500" style={styles.heroSubtitle}>
              Hi, Sakshi!
            </Text>

            <View style={styles.heroStatsRow}>
              <View style={styles.statItem}>
                <MaterialCommunityIcons
                  name="shoe-print"
                  size={20}
                  color="#141414"
                />
                <Text weight="800" style={styles.statValue}>
                  8500
                </Text>
                <Text weight="500" style={styles.statLabel}>
                  steps
                </Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="location-outline" size={20} color="#141414" />
                <Text weight="700" style={styles.statValueSmall}>
                  6.2 km
                </Text>
              </View>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="fire" size={20} color="#141414" />
                <Text weight="700" style={styles.statValueSmall}>
                  410 kcal
                </Text>
              </View>
              <View style={styles.statItem}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={20}
                  color="#141414"
                />
                <Text weight="700" style={styles.statValueSmall}>
                  45 min
                </Text>
              </View>
            </View>

            <View style={styles.heroMessageWrap}>
              <Text style={styles.heroMessageEmoji}>👏</Text>
              <Text weight="500" style={styles.heroMessageText}>
                Great start today! Focusing on new goals helps build habits.
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* ── Your Completed Activities ── */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeaderRow}>
            <Text weight="700" style={styles.sectionTitle}>
              Your Completed Activities
            </Text>
            <TouchableOpacity style={styles.dropdownBtn}>
              <Text weight="600" style={styles.dropdownText}>
                Past 7 Days
              </Text>
              <MaterialCommunityIcons
                name="menu-down"
                size={18}
                color="#141414"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.activityList}>
            {COMPLETED_ACTIVITIES.map((activity, index) => (
              <View
                key={activity.id}
                style={[
                  styles.activityItem,
                  index === COMPLETED_ACTIVITIES.length - 1 && {
                    borderBottomWidth: 0,
                  },
                ]}
              >
                <View style={styles.activityLeft}>
                  <View
                    style={[
                      styles.activityIconWrap,
                      { backgroundColor: activity.bg },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={activity.icon}
                      size={20}
                      color={activity.color}
                    />
                  </View>
                  <View style={styles.activityTextWrap}>
                    <Text weight="700" style={styles.activityName}>
                      {activity.title}
                    </Text>
                    <Text weight="500" style={styles.activityDetails}>
                      {activity.details}
                    </Text>
                  </View>
                </View>
                <View style={styles.activityRight}>
                  <Text
                    weight="500"
                    style={[
                      styles.activityTime,
                      activity.time === "Today" && {
                        color: "#10B981",
                        fontWeight: "700",
                      },
                    ]}
                  >
                    {activity.time}
                  </Text>
                  {activity.time === "Today" && (
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={14}
                      color="#10B981"
                      style={{ marginTop: 4 }}
                    />
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ── Set a New Weekly Goal ── */}
        <View style={styles.sectionWrap}>
          <Text weight="700" style={styles.sectionTitle}>
            Set a New Weekly Goal
          </Text>

          <View style={styles.goalGrid}>
            {GOAL_CHIPS.map((chip) => (
              <TouchableOpacity
                key={chip.id}
                activeOpacity={0.7}
                style={styles.goalChip}
              >
                <View style={styles.goalChipIcon}>{renderIcon(chip)}</View>
                <Text weight="600" style={styles.goalChipText}>
                  {chip.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity activeOpacity={0.8} style={styles.customGoalBtn}>
            <Text weight="700" style={styles.customGoalBtnText}>
              Create Custom Goal
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F9F9FB",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  sectionWrap: {
    paddingHorizontal: 16,
    marginTop: 20,
  },

  /* Header */
  headerBlock: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  titleWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 19,
    lineHeight: 23,
    color: "#5C43BF",
  },
  headerSubtitle: {
    marginTop: 1,
    fontSize: 12,
    lineHeight: 15,
    color: "#4B5563",
  },

  /* Hero Card */
  heroCard: {
    borderRadius: 20,
    padding: 20,
    shadowColor: "#FF9D3A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  heroTitle: {
    fontSize: 16,
    color: "#141414",
  },
  heroSubtitle: {
    fontSize: 14,
    color: "#141414",
    marginTop: 2,
    opacity: 0.8,
  },
  heroStatsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 22,
    color: "#141414",
    marginTop: 4,
  },
  statValueSmall: {
    fontSize: 14,
    color: "#141414",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#141414",
    opacity: 0.8,
  },
  heroMessageWrap: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  heroMessageEmoji: {
    fontSize: 18,
    marginRight: 10,
  },
  heroMessageText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
    color: "#141414",
  },

  /* Completed Activities */
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#141414",
  },
  dropdownBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  dropdownText: {
    fontSize: 12,
    color: "#141414",
    marginRight: 2,
  },
  activityList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  activityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  activityLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  activityIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  activityTextWrap: {
    justifyContent: "center",
  },
  activityName: {
    fontSize: 14,
    color: "#111827",
    marginBottom: 2,
  },
  activityDetails: {
    fontSize: 12,
    color: "#6B7280",
  },
  activityRight: {
    alignItems: "flex-end",
  },
  activityTime: {
    fontSize: 12,
    color: "#9CA3AF",
  },

  /* New Weekly Goal Section */
  goalGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 12,
  },
  goalChip: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  goalChipIcon: {
    marginRight: 8,
    width: 20,
    alignItems: "center",
  },
  goalChipText: {
    flex: 1,
    fontSize: 12,
    color: "#374151",
  },
  customGoalBtn: {
    marginTop: 10,
    width: "100%",
    paddingVertical: 14,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "#5B32D9",
    alignItems: "center",
    justifyContent: "center",
  },
  customGoalBtnText: {
    color: "#5B32D9",
    fontSize: 14,
  },
});
