import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView,
  Dimensions,
  Image,
  PanResponder,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "../../../components/TextWrapper";
import LogActivityScreen from "./LogActivityScreen";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function SetFitnessGoalScreen({ navigation, onBack }) {
  const topOffset = Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 10 : 18;

  const MAX_CALORIES = 2000;
  const [calories, setCalories] = useState(1800);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState(String(calories));

  const [showTray, setShowTray] = useState(false);
  const [showLogActivity, setShowLogActivity] = useState(false);
  const [addedActivities, setAddedActivities] = useState([]);

  const [editingActivity, setEditingActivity] = useState(null);

  const caloriesRef = useRef(calories);
  caloriesRef.current = calories;
  const startCalories = useRef(1800);
  const trackWidth = useRef(1);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setScrollEnabled(false);
        startCalories.current = caloriesRef.current;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (trackWidth.current > 0) {
          const percentageMoved = gestureState.dx / trackWidth.current;
          const caloriesMoved = percentageMoved * MAX_CALORIES;
          let newCalories = startCalories.current + caloriesMoved;
          if (newCalories > MAX_CALORIES) newCalories = MAX_CALORIES;
          if (newCalories < 0) newCalories = 0;
          setCalories(Math.round(newCalories));
        }
      },
      onPanResponderRelease: () => setScrollEnabled(true),
      onPanResponderTerminate: () => setScrollEnabled(true),
    }),
  ).current;

  const handleSaveGoal = () => {
    let parsed = parseInt(goalInput, 10);
    if (isNaN(parsed)) parsed = 1800;
    if (parsed > MAX_CALORIES) parsed = MAX_CALORIES;
    if (parsed < 0) parsed = 0;

    setCalories(parsed);
    setGoalInput(String(parsed));
    setIsEditingGoal(false);
  };

  const fillPercentage = (calories / MAX_CALORIES) * 100;
  const totalBurned = addedActivities.reduce(
    (sum, item) => sum + (item.kcal || 0),
    0,
  );

  if (showLogActivity) {
    return (
      <LogActivityScreen
        initialActivity={editingActivity}
        onBack={() => {
          setEditingActivity(null);
          setShowLogActivity(false);
          setShowTray(true);
        }}
        onActivityAdded={(newActivity) => {
          if (newActivity) {
            if (editingActivity) {
              setAddedActivities((prev) =>
                prev.map((a) =>
                  a.id === editingActivity.id
                    ? { ...newActivity, id: editingActivity.id }
                    : a,
                ),
              );
            } else {
              setAddedActivities((prev) => [...prev, newActivity]);
            }
          }
          setEditingActivity(null);
          setShowLogActivity(false);
          setShowTray(true);
        }}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEnabled={scrollEnabled}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topOffset },
        ]}
      >
        <View style={styles.headerBlock}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.backBtn}
              onPress={onBack || (() => navigation?.goBack())}
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

        <LinearGradient
          colors={["rgba(255,255,255,0.8)", "rgba(255,249,238,0.8)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.manualCard}
        >
          <View style={styles.cardHeaderRow}>
            <Text style={styles.fireEmoji}>🔥</Text>
            <Text weight="700" style={styles.cardTitle}>
              Set Goal Manually
            </Text>
          </View>

          <View style={styles.sliderContainer}>
            <View
              style={styles.sliderTrack}
              onLayout={(e) => {
                trackWidth.current = e.nativeEvent.layout.width;
              }}
            >
              <View
                style={[styles.sliderFill, { width: `${fillPercentage}%` }]}
              />
            </View>
            <View
              style={[styles.sliderThumb, { left: `${fillPercentage}%` }]}
              {...panResponder.panHandlers}
            >
              <MaterialCommunityIcons name="fire" size={14} color="#FFFFFF" />
            </View>
          </View>

          <View style={styles.caloriesWrap}>
            <View style={styles.caloriesValueRow}>
              {isEditingGoal ? (
                <TextInput
                  style={styles.caloriesInput}
                  value={goalInput}
                  onChangeText={setGoalInput}
                  keyboardType="numeric"
                  autoFocus={true}
                  onBlur={handleSaveGoal}
                  onSubmitEditing={handleSaveGoal}
                  maxLength={4}
                />
              ) : (
                <Text weight="800" style={styles.caloriesNumber}>
                  {calories}
                </Text>
              )}

              <Text style={styles.kcalText}> Kcal</Text>

              {!isEditingGoal && (
                <TouchableOpacity
                  style={{ marginLeft: 8 }}
                  onPress={() => {
                    setGoalInput(String(calories));
                    setIsEditingGoal(true);
                  }}
                >
                  <Ionicons name="pencil" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>
            <Text weight="400" style={styles.caloriesSubtext}>
              No. of calories burned per day
            </Text>
          </View>
        </LinearGradient>

        <LinearGradient
          colors={["#EEF9FF", "#C3EAFF", "#DBF3FF"]}
          locations={[0.0016, 0.5, 0.9984]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.routineCard}
        >
          <View style={styles.routineImageWrap}>
            <Image
              source={require("../../../assets/goalpage.webp")}
              style={styles.routineImage}
              resizeMode="contain"
            />
          </View>
          <View style={styles.routineContent}>
            <View style={styles.routineHeaderRow}>
              <Text style={styles.fireEmojiSmall}>🔥</Text>
              <Text weight="700" style={styles.routineTitle}>
                Set Your Daily Routine
              </Text>
            </View>
            <Text weight="500" style={styles.routineSubtitle}>
              + Add activities you do regularly
            </Text>
            <View style={styles.tagsContainer}>
              <View style={styles.tag}>
                <Text weight="500" style={styles.tagText}>
                  Maintain weight
                </Text>
              </View>
              <View style={styles.tag}>
                <Text weight="500" style={styles.tagText}>
                  Lose fat
                </Text>
              </View>
              <View style={styles.tag}>
                <Text weight="500" style={styles.tagText}>
                  Build muscle
                </Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.btnShadow}
              onPress={() => setShowTray(true)}
            >
              <LinearGradient
                colors={["#FAA333", "#F27815"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.addBtn}
              >
                <Text weight="600" style={styles.addBtnText}>
                  Add Activities
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ScrollView>

      <Modal
        visible={showTray}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTray(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowTray(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.trayContainer}
            onPress={() => {}}
          >
            <LinearGradient
              colors={["#E6D5F2", "#FCE0D4"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.trayGradientBox}
            >
              <Text weight="700" style={styles.trayHeaderTitle}>
                Your Daily Activities Target
              </Text>

              <View style={styles.traySummaryRow}>
                <View style={styles.summaryLeft}>
                  <Text style={styles.trayFireEmoji}>🔥</Text>

                  <Text weight="800" style={styles.summaryCalories}>
                    {totalBurned}
                    <Text
                      weight="500"
                      style={{ fontSize: 18, color: "#6B7280" }}
                    >
                      {" "}
                      / {calories}
                    </Text>
                  </Text>

                  <Text weight="500" style={styles.summaryKcalText}>
                    kcal
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.smallAddBtn}
                  onPress={() => {
                    setEditingActivity(null);
                    setShowTray(false);
                    setShowLogActivity(true);
                  }}
                >
                  <LinearGradient
                    colors={["#FAA333", "#F27815"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.smallAddBtnGrad}
                  >
                    <Text weight="600" style={styles.smallAddBtnText}>
                      Add Activities
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ flex: 1 }}
              >
                {addedActivities.length > 0 ? (
                  addedActivities.map((item, index) => (
                    <TouchableOpacity
                      key={item.id || index}
                      style={styles.activityListItem}
                      activeOpacity={0.7}
                      onPress={() => {
                        setEditingActivity(item);
                        setShowTray(false);
                        setShowLogActivity(true);
                      }}
                    >
                      <View style={styles.activityIconWrap}>
                        <MaterialCommunityIcons
                          name={item.icon || "run"}
                          size={24}
                          color="#F27815"
                        />
                      </View>
                      <View style={styles.activityMiddle}>
                        <Text weight="700" style={styles.activityName}>
                          {item.name}
                        </Text>
                        <Text weight="400" style={styles.activitySub}>
                          {item.time}
                        </Text>
                      </View>
                      <View style={styles.activityRight}>
                        <Text weight="700" style={styles.activityKcal}>
                          {item.kcal} kcal
                        </Text>
                        <Text weight="400" style={styles.activitySub}>
                          {item.distance}
                        </Text>
                      </View>

                      <View style={{ marginLeft: 12 }}>
                        <Ionicons name="pencil" size={18} color="#9CA3AF" />
                      </View>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text
                    style={{
                      textAlign: "center",
                      color: "#6B7280",
                      marginTop: 20,
                    }}
                  >
                    No activities added yet.
                  </Text>
                )}
              </ScrollView>

              {/* ── Fixed Submit Button ── */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setShowTray(false);
                  if (navigation) {
                    // Navigate back using merge to safely pass parameters to the active screen
                    navigation.navigate({
                      name: "FitnessWellnessSection", // Ensure this matches your route name exactly
                      params: { goal: calories, burned: totalBurned },
                      merge: true,
                    });
                  } else if (typeof onBack === "function") {
                    onBack({ goal: calories, burned: totalBurned });
                  }
                }}
              >
                <LinearGradient
                  colors={["#FAA333", "#D96C12"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.editBtnBox}
                >
                  <Text weight="600" style={styles.editBtnText}>
                    Submit Goal
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7FCF8" },
  scrollContent: { paddingBottom: 40 },
  headerBlock: { paddingHorizontal: 16, paddingBottom: 10, marginTop: 10 },
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
    marginTop: 2,
    fontSize: 12,
    lineHeight: 15,
    color: "#4B5563",
  },
  manualCard: {
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 20,
    shadowColor: "#BF7BB9",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 0,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  fireEmoji: { fontSize: 20, marginRight: 6 },
  cardTitle: { fontSize: 16, color: "#141414" },
  sliderContainer: {
    height: 40,
    justifyContent: "center",
    position: "relative",
  },
  sliderTrack: {
    height: 10,
    backgroundColor: "#F4EAF7",
    borderRadius: 5,
    width: "100%",
    flexDirection: "row",
  },
  sliderFill: { height: "100%", backgroundColor: "#FBAF41", borderRadius: 5 },
  sliderThumb: {
    position: "absolute",
    marginLeft: -13,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#FBAF41",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  caloriesWrap: { alignItems: "flex-end", marginTop: 10 },
  caloriesValueRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  caloriesInput: {
    fontSize: 24,
    fontWeight: "800",
    color: "#141414",
    padding: 0,
    margin: 0,
    minWidth: 50,
    textAlign: "right",
    borderBottomWidth: 1,
    borderBottomColor: "#D1D5DB",
  },
  kcalText: { fontSize: 14, color: "#141414" },
  caloriesNumber: { fontSize: 24, color: "#141414" },
  caloriesSubtext: { fontSize: 10, color: "#6B7280", marginTop: 2 },
  routineCard: {
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 16,
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    shadowColor: "#F3E6F2",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  routineImageWrap: {
    width: "35%",
    justifyContent: "center",
    alignItems: "center",
  },
  routineImage: { width: 130, height: 110, marginLeft: -10 },
  routineContent: { width: "65%", paddingLeft: 10 },
  routineHeaderRow: { flexDirection: "row", alignItems: "center" },
  fireEmojiSmall: { fontSize: 14, marginRight: 4 },
  routineTitle: { fontSize: 14, color: "#141414" },
  routineSubtitle: {
    fontSize: 10,
    color: "#4B5563",
    marginTop: 4,
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 14,
  },
  tag: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: { fontSize: 8, color: "#E06B74" },
  btnShadow: {
    alignSelf: "flex-start",
    shadowColor: "#F27815",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  addBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  addBtnText: { color: "#FFFFFF", fontSize: 12 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  trayContainer: {
    height: SCREEN_HEIGHT * 0.72,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    overflow: "hidden",
  },
  trayGradientBox: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 35,
  },
  trayHeaderTitle: {
    fontSize: 18,
    color: "#141414",
    textAlign: "center",
    marginBottom: 20,
  },
  traySummaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  summaryLeft: { flexDirection: "row", alignItems: "baseline" },
  trayFireEmoji: { fontSize: 26, marginRight: 6 },
  summaryCalories: { fontSize: 36, color: "#141414" },
  summaryKcalText: { fontSize: 14, color: "#141414", marginLeft: 6 },
  smallAddBtn: {
    shadowColor: "#F27815",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  smallAddBtnGrad: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  smallAddBtnText: { color: "#FFF", fontSize: 12 },
  activityListItem: {
    backgroundColor: "#FFF",
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  activityIconWrap: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#F4ECFA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  activityMiddle: { flex: 1 },
  activityName: { fontSize: 16, color: "#141414", marginBottom: 4 },
  activitySub: { fontSize: 12, color: "#6B7280" },
  activityRight: { alignItems: "flex-end" },
  activityKcal: { fontSize: 16, color: "#141414", marginBottom: 4 },
  editBtnBox: {
    marginTop: 10,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  editBtnText: { color: "#FFF", fontSize: 16 },
});
