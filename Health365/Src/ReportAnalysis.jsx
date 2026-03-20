import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Platform,
  Modal,
  Animated,
  Pressable,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "../Components/TextWrapper";

const { width } = Dimensions.get("window");
const isMini = width <= 360;
const isSmall = width <= 390;

const CONCERNING_PARAMS = [
  {
    id: 1,
    name: "TSH",
    badge: "High",
    badgeColor: "#DC2626",
    value: "6.8",
    unit: "mIU/L",
    trendData: [
      { date: "19 Dec", value: 4.2 },
      { date: "20 Jan", value: 5.5 },
      { date: "22 Feb", value: 6.8 },
    ],
  },
  {
    id: 2,
    name: "Triglycerides",
    badge: "Elevated",
    badgeColor: "#DC2626",
    value: "248",
    unit: "mg/dL",
    trendData: [
      { date: "19 Dec", value: 195 },
      { date: "20 Jan", value: 220 },
      { date: "22 Feb", value: 248 },
    ],
  },
];

const ABNORMAL_PARAMS = [
  {
    id: 1,
    name: "HbA1c",
    badge: "Slightly Elevated",
    badgeColor: "#F59E0B",
    value: "6.1",
    unit: "%",
    trendData: [
      { date: "19 Dec", value: 5.6 },
      { date: "20 Jan", value: 5.8 },
      { date: "22 Feb", value: 6.1 },
    ],
  },
  {
    id: 2,
    name: "LDL Cholesterol",
    badge: "Borderline High",
    badgeColor: "#F59E0B",
    value: "142",
    unit: "mg/dL",
    trendData: [
      { date: "19 Dec", value: 125 },
      { date: "20 Jan", value: 133 },
      { date: "22 Feb", value: 142 },
    ],
  },
];

const NORMAL_PARAMS = [
  { id: 1, name: "Fasting Glucose", value: "92", unit: "mg/dL", trendData: [
    { date: "19 Dec", value: 88 }, { date: "20 Jan", value: 90 }, { date: "22 Feb", value: 92 },
  ]},
  { id: 2, name: "Hemoglobin", value: "13.5", unit: "g/dL", trendData: [
    { date: "19 Dec", value: 13.2 }, { date: "20 Jan", value: 13.4 }, { date: "22 Feb", value: 13.5 },
  ]},
  { id: 3, name: "Vitamin B12", value: "410", unit: "pg/mL", trendData: [
    { date: "19 Dec", value: 380 }, { date: "20 Jan", value: 395 }, { date: "22 Feb", value: 410 },
  ]},
  { id: 4, name: "Serum Creatinine", value: "0.8", unit: "mg/dL", trendData: [
    { date: "19 Dec", value: 0.7 }, { date: "20 Jan", value: 0.75 }, { date: "22 Feb", value: 0.8 },
  ]},
];

const TrendChart = ({ data }) => {
  const chartWidth = width - 80;
  const chartHeight = 200;
  const paddingLeft = 45;
  const paddingBottom = 35;
  const paddingTop = 15;
  const graphWidth = chartWidth - paddingLeft;
  const graphHeight = chartHeight - paddingBottom - paddingTop;

  const values = data.map((d) => d.value);
  const minVal = Math.floor(Math.min(...values) * 0.8);
  const maxVal = Math.ceil(Math.max(...values) * 1.15);
  const range = maxVal - minVal || 1;

  const stepCount = 4;
  const stepVal = Math.ceil(range / stepCount);
  const yLabels = [];
  for (let i = 0; i <= stepCount; i++) {
    yLabels.push(minVal + i * stepVal);
  }

  const points = data.map((d, i) => ({
    x: paddingLeft + (i / (data.length - 1)) * graphWidth,
    y: paddingTop + graphHeight - ((d.value - minVal) / range) * graphHeight,
  }));

  return (
    <View style={{ marginTop: 10, height: chartHeight, width: chartWidth }}>
      {/* Y-axis labels and grid lines */}
      {yLabels.map((label, i) => {
        const y = paddingTop + graphHeight - ((label - minVal) / range) * graphHeight;
        return (
          <View key={i} style={{ position: "absolute", top: y, left: 0, right: 0, flexDirection: "row", alignItems: "center" }}>
            <Text weight="400" style={{ width: paddingLeft - 8, textAlign: "right", fontSize: 11, color: "#6B7280" }}>
              {label}
            </Text>
            <View style={{ flex: 1, height: 1, backgroundColor: "#E5E7EB", marginLeft: 8 }} />
          </View>
        );
      })}

      {/* Shaded area between last two points */}
      {points.length >= 2 && (() => {
        const p1 = points[points.length - 2];
        const p2 = points[points.length - 1];
        const areaLeft = p1.x;
        const areaWidth = p2.x - p1.x;
        const areaTop = Math.min(p1.y, p2.y);
        const areaBottom = paddingTop + graphHeight;
        return (
          <View
            style={{
              position: "absolute",
              left: areaLeft,
              top: areaTop,
              width: areaWidth,
              height: areaBottom - areaTop,
              backgroundColor: "rgba(124, 58, 237, 0.1)",
            }}
          />
        );
      })()}

      {/* Line segments */}
      {points.map((point, i) => {
        if (i === 0) return null;
        const prev = points[i - 1];
        const dx = point.x - prev.x;
        const dy = point.y - prev.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        return (
          <View
            key={`line-${i}`}
            style={{
              position: "absolute",
              left: prev.x,
              top: prev.y - 1.25,
              width: length,
              height: 2.5,
              backgroundColor: "#7C3AED",
              transform: [{ rotate: `${angle}deg` }],
              transformOrigin: "left center",
            }}
          />
        );
      })}

      {/* Data point circles */}
      {points.map((p, i) => (
        <View
          key={`dot-${i}`}
          style={{
            position: "absolute",
            left: p.x - 6,
            top: p.y - 6,
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: "#7C3AED",
            borderWidth: 2,
            borderColor: "#fff",
          }}
        />
      ))}

      {/* X-axis date labels */}
      {data.map((d, i) => (
        <View key={`label-${i}`} style={{ position: "absolute", left: points[i].x - 25, top: paddingTop + graphHeight + 10, width: 50, alignItems: "center" }}>
          <Text weight="400" style={{ fontSize: 11, color: "#6B7280" }}>
            {d.date}
          </Text>
        </View>
      ))}
    </View>
  );
};

const ReportAnalysis = ({ navigation, route }) => {
  const reportTitle = route?.params?.title || "Full Body Checkup 16Feb";
  const [activeTab, setActiveTab] = useState("analysis");
  const [trendVisible, setTrendVisible] = useState(false);
  const [selectedParam, setSelectedParam] = useState(null);
  const [askHelixMessage, setAskHelixMessage] = useState("");
  const slideAnim = useRef(new Animated.Value(0)).current;
  const askHelixGlow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(askHelixGlow, {
          toValue: 1,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(askHelixGlow, {
          toValue: 0,
          duration: 1400,
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [askHelixGlow]);


  const openTrend = (param) => {
    setSelectedParam(param);
    setTrendVisible(true);
    Animated.spring(slideAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  };

  const closeTrend = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setTrendVisible(false);
      setSelectedParam(null);
    });
  };

  const ViewTrendsButton = ({ param }) => (
    <TouchableOpacity style={styles.viewTrendsBtn} onPress={() => openTrend(param)}>
      <LinearGradient
        colors={["#B148FF", "#F6339B", "#9914F9"]}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.viewTrendsGradient}
      >
        <Text weight="600" style={styles.viewTrendsText}>
          View Trends
        </Text>
        <Ionicons name="arrow-forward" size={10} color="#fff" />
      </LinearGradient>
    </TouchableOpacity>
  );

  const ParamRow = ({ param, showDivider = true }) => (
    <View>
      <View style={styles.paramRow}>
        <View style={styles.paramLeft}>
          <Text weight="600" style={styles.paramName}>
            {param.name}
          </Text>
          {param.badge && (
            <View
              style={[
                styles.paramBadge,
                { backgroundColor: param.badgeColor + "18" },
              ]}
            >
              <MaterialCommunityIcons
                name="information"
                size={14}
                color={param.badgeColor === "#DC2626" ? "#F59E0B" : param.badgeColor}
              />
              <Text
                weight="600"
                style={[styles.paramBadgeText, { color: param.badgeColor }]}
              >
                {param.badge}
              </Text>
            </View>
          )}
          {!param.badge && (
            <View style={styles.paramInfoBadge}>
              <MaterialCommunityIcons
                name="information"
                size={12}
                color="#F59E0B"
              />
            </View>
          )}
        </View>
        <View style={styles.paramRight}>
          <Text weight="600" style={styles.paramValue}>
            {param.value} {param.unit}
          </Text>
          <ViewTrendsButton param={param} />
        </View>
      </View>
      {showDivider && <View style={styles.paramDivider} />}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
        enabled={Platform.OS === "ios"}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
        {/* Header Background */}
        <ImageBackground
          source={require("../assets/Header.webp")}
          style={styles.headerBackground}
          resizeMode="cover"
        >
          {/* Top Bar */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={22} color="#7C3AED" />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text weight="700" style={styles.headerTitle}>
                {reportTitle}
              </Text>
            </View>
            <View style={{ width: 52 }} />
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === "analysis" && styles.tabActive,
              ]}
              onPress={() => setActiveTab("analysis")}
            >
              <Text
                weight="700"
                style={[
                  styles.tabText,
                  activeTab === "analysis" && styles.tabTextActive,
                ]}
              >
                Report Analysis
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "helix" && styles.tabActive]}
              onPress={() => setActiveTab("helix")}
            >
              <Text
                weight="700"
                style={[
                  styles.tabText,
                  activeTab === "helix" && styles.tabTextActive,
                ]}
              >
                Helix Insights
              </Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        {/* Tray */}
        <LinearGradient
          colors={["#E4CCF7", "#FFE9CF"]}
          start={{ x: 0.04, y: 0.31 }}
          end={{ x: 0.96, y: 0.69 }}
          style={styles.tray}
        >

        {activeTab === "analysis" ? (
          <>
            {/* Report Summary */}
            <View style={styles.sectionContainer}>
              <Text weight="700" style={styles.sectionTitle}>
                Report Summary
              </Text>
              <View style={styles.summaryCard}>
                <View style={styles.summaryNumberCircle}>
                  <Text weight="700" style={styles.summaryNumber}>
                    02
                  </Text>
                </View>
                <Text weight="500" style={styles.summaryText}>
                  Parameters fall outside the recommended range and may require
                  monitoring
                </Text>
              </View>
            </View>

            {/* Concerning Parameters */}
            <View style={styles.sectionContainer}>
              <Text weight="700" style={styles.sectionTitleRed}>
                Concerning Parameters
              </Text>
              <View style={styles.paramCard}>
                {CONCERNING_PARAMS.map((param, index) => (
                  <ParamRow
                    key={param.id}
                    param={param}
                    showDivider={index < CONCERNING_PARAMS.length - 1}
                  />
                ))}
                <View style={styles.paramNote}>
                  <Text weight="400" style={styles.paramNoteText}>
                    This parameter is significantly outside expected range.
                    Consulting a healthcare professional is recommended.
                  </Text>
                </View>
              </View>
            </View>

            {/* Abnormal Parameters */}
            <View style={styles.sectionContainer}>
              <Text weight="700" style={styles.sectionTitleOrange}>
                Abnormal Parameters
              </Text>
              <View style={styles.paramCard}>
                {ABNORMAL_PARAMS.map((param, index) => (
                  <ParamRow
                    key={param.id}
                    param={param}
                    showDivider={index < ABNORMAL_PARAMS.length - 1}
                  />
                ))}
                <View style={[styles.paramNote, { backgroundColor: "#FFF7E0" }]}>
                  <Text weight="400" style={styles.paramNoteText}>
                    These values are slightly outside ideal range and may benefit
                    from lifestyle monitoring or repeat testing.
                  </Text>
                </View>
              </View>
            </View>

            {/* Normal Parameters */}
            <View style={styles.sectionContainer}>
              <Text weight="700" style={styles.sectionTitleGreen}>
                Normal Parameters
              </Text>
              <View style={styles.paramCard}>
                {NORMAL_PARAMS.map((param, index) => (
                  <ParamRow
                    key={param.id}
                    param={param}
                    showDivider={index < NORMAL_PARAMS.length - 1}
                  />
                ))}
                <View style={styles.normalParamNote}>
                  <Text weight="400" style={styles.normalParamNoteText}>
                    These values fall within expected laboratory reference ranges.
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.sectionContainer}>
              <TouchableOpacity style={styles.summaryCtaWrapper} activeOpacity={0.9}>
                <LinearGradient
                  colors={["#B148FF", "#F6339B", "#9914F9"]}
                  locations={[0, 0.5, 1]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.summaryCtaButton}
                >
                  <Text weight="700" style={styles.summaryCtaText}>
                    View Smart Report
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            {/* Helix Insights Content */}
            <View style={styles.sectionContainer}>
              <Text weight="700" style={styles.sectionTitle}>
                Helix Insights
              </Text>
            </View>

            {/* Based on your report card */}
            <View style={styles.helixCardContainer}>
              <View style={styles.helixCard}>
                <Text weight="700" style={styles.helixCardTitle}>
                  Based on your report
                </Text>
                <View style={styles.helixBulletItem}>
                  <Text weight="400" style={styles.helixBulletText}>
                    • Your long-term sugar marker is slightly elevated.
                  </Text>
                </View>
                <View style={styles.helixBulletItem}>
                  <Text weight="400" style={styles.helixBulletText}>
                    • Lipid profile suggests moderate cardiovascular risk.
                  </Text>
                </View>
                <View style={styles.helixBulletItem}>
                  <Text weight="400" style={styles.helixBulletText}>
                    • Kidney function appears stable.
                  </Text>
                </View>
              </View>
            </View>

            {/* Important note card */}
            <View style={styles.helixCardContainer}>
              <View style={styles.helixImportantCard}>
                <View style={styles.helixImportantHeader}>
                  <Text weight="400" style={styles.helixWarningIcon}>⚠️</Text>
                  <Text weight="700" style={styles.helixImportantTitle}>
                    Important
                  </Text>
                </View>
                <Text weight="400" style={styles.helixImportantText}>
                  An elevated HbA1c may reflect average blood sugar levels over the past 2–3 months.
                </Text>
              </View>
            </View>

            {/* Ask Helix Button */}
            <View style={styles.askHelixContainer}>
              <View style={styles.askHelixIconColumn}>
                <TouchableOpacity>
                  <View style={styles.askHelixGlowWrap}>
                    <Animated.View
                      style={[
                        styles.askHelixGlow,
                        {
                          opacity: askHelixGlow.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.25, 0.55],
                          }),
                          transform: [
                            {
                              scale: askHelixGlow.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 1.18],
                              }),
                            },
                          ],
                        },
                      ]}
                    />
                    <LinearGradient
                      colors={["#C6E2FA", "#DBD3F7"]}
                      start={{ x: 0.5, y: 0 }}
                      end={{ x: 0.5, y: 1 }}
                      style={styles.askHelixButton}
                    >
                      <Image
                        source={require("../assets/AskHelix.webp")}
                        style={styles.askHelixIcon}
                        resizeMode="contain"
                      />
                    </LinearGradient>
                  </View>
                </TouchableOpacity>
                <Text weight="700" style={styles.askHelixLabel}>
                  ASK HELIX
                </Text>
              </View>
              <View style={styles.askHelixInputRow}>
                <TextInput
                  style={styles.askHelixInput}
                  placeholder="Ask Helix..."
                  placeholderTextColor="#9CA3AF"
                  value={askHelixMessage}
                  onChangeText={setAskHelixMessage}
                  multiline
                />
                <TouchableOpacity style={styles.askHelixSendButton}>
                  <Ionicons name="send" size={16} color="#7C3AED" />
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        </LinearGradient>
      </ScrollView>
      </KeyboardAvoidingView>

      {/* Trend Bottom Tray */}
      <Modal
        visible={trendVisible}
        transparent
        animationType="none"
        presentationStyle="overFullScreen"
        statusBarTranslucent
        hardwareAccelerated
        onRequestClose={closeTrend}
      >
        <Pressable style={styles.trendOverlay} onPress={closeTrend}>
          <Animated.View
            style={[
              styles.trendTray,
              {
                transform: [
                  {
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [600, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View style={styles.trendHandle} />
              <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 500 }}>
                {selectedParam && (
                  <View style={styles.trendContent}>
                    {/* Param header */}
                    <View style={styles.trendHeader}>
                      <View style={styles.trendHeaderLeft}>
                        <Text weight="700" style={styles.trendParamName}>
                          {selectedParam.name}
                        </Text>
                        {selectedParam.badge && (
                          <View
                            style={[
                              styles.paramBadge,
                              { backgroundColor: selectedParam.badgeColor + "18" },
                            ]}
                          >
                            <MaterialCommunityIcons
                              name="information"
                              size={14}
                              color={selectedParam.badgeColor === "#DC2626" ? "#F59E0B" : selectedParam.badgeColor}
                            />
                            <Text
                              weight="600"
                              style={[styles.paramBadgeText, { color: selectedParam.badgeColor }]}
                            >
                              {selectedParam.badge}
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text weight="700" style={styles.trendParamValue}>
                        {selectedParam.value} {selectedParam.unit}
                      </Text>
                    </View>

                    {/* Chart */}
                    {selectedParam.trendData && (
                      <TrendChart
                        data={selectedParam.trendData}
                      />
                    )}
                  </View>
                )}
              </ScrollView>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF4FF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },

  /* Tray */
  tray: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -10,
    minHeight: "100%",
    flex: 1,
    paddingBottom: 80,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },

  /* Header */
  headerBackground: {
    width: "100%",
    paddingTop: 50,
    paddingBottom: 20,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 18,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.7)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  titleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: isMini ? 16 : isSmall ? 18 : 20,
    color: "#1F2937",
  },

  /* Tabs */
  tabsContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 12,
  },
  tabActive: {
    backgroundColor: "#7C3AED",
  },
  tabText: {
    fontSize: isMini ? 12 : isSmall ? 13 : 14,
    color: "#6B7280",
  },
  tabTextActive: {
    color: "#fff",
  },

  /* Sections */
  sectionContainer: {
    paddingHorizontal: 20,
    marginTop: 22,
  },
  sectionTitle: {
    fontSize: isMini ? 16 : isSmall ? 17 : 18,
    color: "#6B21A8",
    marginBottom: 12,
    textAlign: "center",
  },
  sectionTitleRed: {
    fontSize: isMini ? 16 : isSmall ? 17 : 18,
    color: "#DC2626",
    marginBottom: 12,
  },
  sectionTitleOrange: {
    fontSize: isMini ? 16 : isSmall ? 17 : 18,
    color: "#D97706",
    marginBottom: 12,
  },
  sectionTitleGreen: {
    fontSize: isMini ? 16 : isSmall ? 17 : 18,
    color: "#16A34A",
    marginBottom: 12,
  },

  /* Summary Card */
  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF6EC",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
  summaryNumberCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FEF2F2",
    borderWidth: 2,
    borderColor: "#FECACA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  summaryNumber: {
    fontSize: 22,
    color: "#DC2626",
  },
  summaryText: {
    flex: 1,
    fontSize: isMini ? 12 : isSmall ? 13 : 14,
    color: "#4B5563",
    lineHeight: 20,
  },
  summaryCtaWrapper: {
    marginTop: 12,
    borderRadius: 12,
    overflow: "hidden",
  },
  summaryCtaButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  summaryCtaText: {
    color: "#fff",
    fontSize: 14,
    letterSpacing: 0.2,
  },

  /* Parameter Card */
  paramCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingTop: 14,
    paddingHorizontal: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
    overflow: "hidden",
  },
  paramRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  paramLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 8,
    flexWrap: "wrap",
  },
  paramName: {
    fontSize: isMini ? 13 : isSmall ? 14 : 15,
    color: "#1F2937",
  },
  paramBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  paramBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  paramBadgeText: {
    fontSize: 10,
  },
  paramInfoBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#FEF3C7",
    justifyContent: "center",
    alignItems: "center",
  },
  paramRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  paramValue: {
    fontSize: isMini ? 12 : isSmall ? 13 : 14,
    color: "#1F2937",
  },
  paramDivider: {
    height: 1,
    backgroundColor: "#F3F4F6",
  },

  /* View Trends Button */
  viewTrendsBtn: {
    borderRadius: 8,
    overflow: "hidden",
  },
  viewTrendsGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 5,
    gap: 3,
    borderRadius: 8,
  },
  viewTrendsText: {
    fontSize: 9,
    color: "#fff",
  },

  /* Note */
  paramNote: {
    marginTop: 10,
    marginHorizontal: -14,
    padding: 14,
    backgroundColor: "#FFE0E0",
  },
  paramNoteText: {
    fontSize: isMini ? 10 : isSmall ? 11 : 12,
    color: "#4B5563",
    lineHeight: 16,
  },
  normalParamNote: {
    marginTop: 12,
    marginHorizontal: -14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "#E6FFEE",
  },
  normalParamNoteText: {
    fontSize: isMini ? 10 : isSmall ? 11 : 12,
    color: "#3F6C4B",
    lineHeight: 16,
    textAlign: "center",
  },


  /* Trend Bottom Tray */
  trendOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  trendTray: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: 254,
    width: 361,
    alignSelf: "center",
    paddingBottom: Platform.OS === "ios" ? 20 : 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 20,
  },
  trendHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D1D5DB",
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  trendContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  trendHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingVertical: 10,
  },
  trendHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
    flex: 1,
  },
  trendParamName: {
    fontSize: 18,
    color: "#1F2937",
  },
  trendParamValue: {
    fontSize: 16,
    color: "#1F2937",
  },

  /* Helix Insights */
  helixCardContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  helixCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  helixCardTitle: {
    fontSize: isMini ? 14 : isSmall ? 15 : 16,
    color: "#1F2937",
    marginBottom: 12,
  },
  helixBulletItem: {
    marginBottom: 6,
  },
  helixBulletText: {
    fontSize: isMini ? 12 : isSmall ? 13 : 14,
    color: "#4B5563",
    lineHeight: 20,
  },
  helixImportantCard: {
    backgroundColor: "#FFF7E0",
    borderRadius: 14,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  helixImportantHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  helixWarningIcon: {
    fontSize: 14,
  },
  helixImportantTitle: {
    fontSize: isMini ? 14 : isSmall ? 15 : 16,
    color: "#D97706",
  },
  helixImportantText: {
    fontSize: isMini ? 12 : isSmall ? 13 : 14,
    color: "#4B5563",
    lineHeight: 20,
  },
  askHelixContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginTop: 165,
    paddingLeft: 22,
    paddingRight: 22,
    gap: 14,
  },
  askHelixIconColumn: {
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  askHelixInputRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    minHeight: 56,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  askHelixInput: {
    flex: 1,
    minHeight: 36,
    maxHeight: 90,
    fontSize: 13,
    color: "#1F2937",
  },
  askHelixSendButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F5F3FF",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  askHelixGlowWrap: {
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  askHelixGlow: {
    position: "absolute",
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(164, 120, 230, 0.4)",
  },
  askHelixButton: {
    width: 48,
    height: 48,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 5,
  },
  askHelixIcon: {
    width: 22,
    height: 22,
  },
  askHelixLabel: {
    marginTop: 2,
    fontSize: 11,
    color: "#1F2937",
    letterSpacing: 1.5,
  },
});

export default ReportAnalysis;
