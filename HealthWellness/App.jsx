import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar as RNStatusBar,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import WellnessHeaderSection from "./Src/Screens/Wellness/WellnessHeaderSection";
import SleepWellnessSection from "./Src/Screens/Sleep/SleepWellnessSection";
import NutritionWellnessSection from "./Src/Screens/Nutrition/NutritionWellnessSection";
import FitnessWellnessSection from "./Src/Screens/Fitness/FitnessWellnessSection";
import LogActivityScreen from "./Src/Screens/Fitness/LogActivityScreen";
import SetFitnessGoalScreen from "./Src/Screens/Fitness/SetFitnessGoalScreen";
import MedicineWellnessSection from "./Src/Screens/Medicine/MedicineWellnessSection";
import MenstrualWellnessSection from "./Src/Screens/Menstrual/MenstrualWellnessSection";
import MenstrualDetailsForm from "./Src/Screens/Menstrual/MenstrualDetailsForm";
import PeriodStatistics from "./Src/Screens/Menstrual/PeriodStatistics";
import MenstrualCalendarScreen from "./Src/Screens/Menstrual/MenstrualCalendarScreen";
import FitnessHistory from "./Src/Screens/Fitness/Fitnesshistory";

// IMPORT YOUR NEW FITNESS TIMER COMPONENT HERE
import FitnessTimer from "./Src/Screens/Fitness/Fitnesstimer"; // Make sure this path is correct!

import { Text } from "./components/TextWrapper";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("wellness");
  const [routeParams, setRouteParams] = useState({});
  const [menstrualDetails, setMenstrualDetails] = useState(null);
  const [fitnessData, setFitnessData] = useState({ goal: undefined, burned: undefined });

  const topOffset = Platform.OS === "android" ? (RNStatusBar.currentHeight || 0) + 10 : 18;

  const navigateTo = (screen, params = {}) => {
    if (screen === currentScreen) return;
    setRouteParams(params);
    setCurrentScreen(screen);
  };

  const renderScreen = (screen) => {
    if (screen === "wellness") {
      return (
        <WellnessHeaderSection
          hideHeader
          onNavigateSleep={() => navigateTo("sleep")}
          onNavigateNutrition={() => navigateTo("nutrition")}
          onNavigateFitness={() => navigateTo("fitness")}
          onNavigateMedicine={() => navigateTo("medicine")}
          onNavigateMenstrual={() => navigateTo("menstrual")}
        />
      );
    }

    if (screen === "sleep") {
      return (
        <SleepWellnessSection
          hideHeader
          onBack={() => navigateTo("wellness")}
          onNavigateAll={() => navigateTo("wellness")}
          onNavigateNutrition={() => navigateTo("nutrition")}
          onNavigateFitness={() => navigateTo("fitness")}
          onNavigateMedicine={() => navigateTo("medicine")}
          onNavigateMenstrual={() => navigateTo("menstrual")}
        />
      );
    }

    if (screen === "nutrition") {
      return (
        <NutritionWellnessSection
          hideHeader
          onBack={() => navigateTo("wellness")}
          onNavigateAll={() => navigateTo("wellness")}
          onNavigateSleep={() => navigateTo("sleep")}
          onNavigateFitness={() => navigateTo("fitness")}
          onNavigateMedicine={() => navigateTo("medicine")}
          onNavigateMenstrual={() => navigateTo("menstrual")}
        />
      );
    }

    if (screen === "fitness") {
      return (
        <FitnessWellnessSection
          hideHeader
          burned={fitnessData.burned}
          onBack={() => navigateTo("wellness")}
          onNavigateAll={() => navigateTo("wellness")}
          onNavigateSleep={() => navigateTo("sleep")}
          onNavigateNutrition={() => navigateTo("nutrition")}
          onNavigateMedicine={() => navigateTo("medicine")}
          onNavigateMenstrual={() => navigateTo("menstrual")}
          onNavigateLogActivity={() => navigateTo("logActivity")}
          onNavigateSetGoal={() => navigateTo("setFitnessGoal")}
          onNavigateHistory={(params) => navigateTo("fitnessHistory", params)} 
          onNavigateTimer={() => navigateTo("fitnessTimer")} // <-- Added Link to Timer
        />
      );
    }

    // ── NEW: Render Fitness Timer ──
    if (screen === "fitnessTimer") {
      return (
        <FitnessTimer onBack={() => navigateTo("fitness")} />
      );
    }

    if (screen === "fitnessHistory") {
      return (
        <FitnessHistory 
          onBack={() => navigateTo("fitness")} 
          initialTab={routeParams?.initialTab || "Day"}
        />
      );
    }

    if (screen === "logActivity") {
      return (
        <LogActivityScreen
          onBack={() => navigateTo("fitness")}
          onActivityAdded={(activityData) => {
            setFitnessData((prev) => ({
              goal: prev.goal, 
              burned: (prev.burned || 240) + (activityData?.kcal || 0), 
            }));
            navigateTo("fitness");
          }}
        />
      );
    }

    if (screen === "setFitnessGoal") {
      return (
        <SetFitnessGoalScreen 
          onBack={(data) => {
            if (data && typeof data.goal !== 'undefined') {
              setFitnessData(prev => ({ ...prev, goal: data.goal, burned: data.burned ?? prev.burned }));
            }
            navigateTo("fitness");
          }} 
        />
      );
    }

    if (screen === "medicine") {
      return (
        <MedicineWellnessSection
          hideHeader
          onBack={() => navigateTo("wellness")}
          onNavigateAll={() => navigateTo("wellness")}
          onNavigateSleep={() => navigateTo("sleep")}
          onNavigateNutrition={() => navigateTo("nutrition")}
          onNavigateFitness={() => navigateTo("fitness")}
          onNavigateMenstrual={() => navigateTo("menstrual")}
        />
      );
    }

    if (screen === "menstrualDetails") {
      return (
        <MenstrualDetailsForm
          onBack={() => navigateTo("menstrual")}
          onSaveDetails={(details) => {
            setMenstrualDetails(details);
            navigateTo("menstrual");
          }}
        />
      );
    }

    if (screen === "statistics") {
      return <PeriodStatistics onBack={() => navigateTo("menstrual")} />;
    }

    if (screen === "menstrualCalendar") {
      return (
        <MenstrualCalendarScreen
          onBack={() => navigateTo("menstrual")}
          menstrualDetails={menstrualDetails}
        />
      );
    }

    return (
      <MenstrualWellnessSection
        hideHeader
        onBack={() => navigateTo("wellness")}
        onNavigateAll={() => navigateTo("wellness")}
        onNavigateSleep={() => navigateTo("sleep")}
        onNavigateNutrition={() => navigateTo("nutrition")}
        onNavigateFitness={() => navigateTo("fitness")}
        onNavigateMedicine={() => navigateTo("medicine")}
        onNavigateStatistics={() => navigateTo("statistics")}
        onNavigateMenstrualDetails={() => navigateTo("menstrualDetails")}
        onNavigateMenstrualCalendar={() => navigateTo("menstrualCalendar")}
        menstrualDetails={menstrualDetails}
      />
    );
  };

  return (
    <>
      <StatusBar style="dark" translucent={false} backgroundColor="#F3EFEB" />
      {currentScreen !== "menstrualDetails" &&
        currentScreen !== "statistics" &&
        currentScreen !== "menstrualCalendar" &&
        currentScreen !== "logActivity" &&
        currentScreen !== "setFitnessGoal" &&
        currentScreen !== "fitnessTimer" &&    // <-- Added fitnessTimer to hide header
        currentScreen !== "fitnessHistory" && (
        <View style={[styles.headerBlock, { paddingTop: topOffset }]}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.backBtn}
              onPress={() => {
                if (currentScreen !== "wellness") {
                  navigateTo("wellness");
                }
              }}
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

      <View style={styles.screenTransitionWrap}>
        {renderScreen(currentScreen)}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  headerBlock: {
    paddingHorizontal: 16,
    paddingBottom: 4,
    backgroundColor: "#F3EFEB",
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
    color: "#1A1A1A",
  },
  screenTransitionWrap: {
    flex: 1,
    overflow: "hidden",
  },
});
