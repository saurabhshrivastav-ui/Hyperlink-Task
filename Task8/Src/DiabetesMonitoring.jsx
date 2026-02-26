import React, { useState, useRef, useCallback } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
  Image,
  Modal,
  Animated,
  Easing,
  PanResponder,
} from "react-native";
import { MaterialIcons, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { Text } from "../Components/TextWrapper";

const { width, height } = Dimensions.get("window");

const DiabetesIcon = ({ size = 28 }) => (
  <View style={[styles.sheetIconWrap, { backgroundColor: "#FEF3C7" }]}>
    <MaterialCommunityIcons name="diabetes" size={size} color="#F59E0B" />
  </View>
);

const testData = [
  {
    id: 1,
    title: "Diabetes Screening\n(HbA1c & Fasting Sugar)",
    tests: 2,
    reportTime: "15 hours",
    price: 479,
    originalPrice: 625,
    discount: "23% off",
    image: require("../assets/scan.webp"),
    purpose: "Monitor blood sugar levels and long-term glucose control.",
    details: [
      "HbA1c (Glycated Hemoglobin)",
      "Fasting Blood Sugar",
    ],
  },
  {
    id: 2,
    title: "Post Prandial\nBlood Sugar (PPBS)",
    tests: 1,
    reportTime: "6 hours",
    price: 149,
    originalPrice: 200,
    discount: "25% off",
    image: require("../assets/scan.webp"),
    purpose: "Measure glucose levels after a meal to assess insulin response.",
    details: [
      "Post Prandial Blood Sugar",
    ],
  },
  {
    id: 3,
    title: "Comprehensive Diabetes\nPanel",
    tests: 8,
    reportTime: "24 hours",
    price: 1299,
    originalPrice: 1800,
    discount: "28% off",
    image: require("../assets/scan.webp"),
    purpose: "Complete diabetes assessment including kidney and lipid markers.",
    details: [
      "HbA1c",
      "Fasting Blood Sugar",
      "Post Prandial Blood Sugar",
      "Fasting Insulin",
      "Microalbumin (Urine)",
      "Serum Creatinine",
      "Lipid Profile",
      "Kidney Function Test",
    ],
  },
];

const DiabetesMonitoring = () => {
  const navigation = useNavigation();
  const [sheetVisible, setSheetVisible] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [testsExpanded, setTestsExpanded] = useState(false);

  // Animation values
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;


  const DISMISS_THRESHOLD = 120;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) {
          slideAnim.setValue(g.dy);
          fadeAnim.setValue(1 - g.dy / (height * 0.6));
        }
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > DISMISS_THRESHOLD || g.vy > 0.5) {
          closeSheet();
        } else {
          Animated.parallel([
            Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }),
            Animated.timing(fadeAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
          ]).start();
        }
      },
    })
  ).current;



  const openSheet = (test) => {
    setSelectedTest(test);
    setTestsExpanded(false);
    setSheetVisible(true);

    slideAnim.setValue(height);
    fadeAnim.setValue(0);

    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeSheet = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 150,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setSheetVisible(false);
      setSelectedTest(null);
    });
  };



  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Gradient Header */}
        <LinearGradient
          colors={["#E8D5F5", "#F5E0EC", "#FFF0E0"]}
          locations={[0, 0.5, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.navRow}>
            <TouchableOpacity
              style={styles.backBtn}
              activeOpacity={0.7}
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="arrow-back" size={26} color="#6D28D9" />
            </TouchableOpacity>
            <Text weight="700" style={styles.navTitle}>
              Diabetes Monitoring
            </Text>
          </View>
        </LinearGradient>

        {/* Book a Test Header */}
        <View style={styles.bookHeader}>
          <Text weight="600" style={styles.bookTitle}>Book a Test</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <MaterialIcons name="search" size={26} color="#1f2937" />
          </TouchableOpacity>
        </View>

        {/* Test Cards */}
        <View style={styles.cardList}>
          {testData.map((test) => (
            <View key={test.id} style={styles.card}>
              <View style={styles.cardTopRow}>
              {/* Test Image */}
              <View style={styles.cardLeft}>
                <Image
                  source={test.image}
                  style={styles.testImage}
                  resizeMode="cover"
                />
              </View>

              {/* Test Details */}
              <View style={styles.cardRight}>
                {/* Chevron */}
                <TouchableOpacity
                  style={styles.chevronBtn}
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate("TestDetails", {
                    testTitle: test.title,
                    testCount: test.tests,
                    reportTime: test.reportTime,
                    price: test.price,
                    originalPrice: test.originalPrice,
                    discount: test.discount,
                  })}
                >
                  <MaterialIcons name="chevron-right" size={24} color="#7C3AED" />
                </TouchableOpacity>

                <Text weight="700" style={styles.testTitle}>
                  {test.title}
                </Text>

                <View style={styles.containsRow}>
                  <Text weight="500" style={styles.containsText}>
                    Contains {test.tests} tests
                  </Text>
                  <MaterialIcons name="keyboard-arrow-down" size={18} color="#22C55E" />
                </View>

                <Text weight="400" style={styles.reportText}>
                  Report within {test.reportTime}
                </Text>

                <View style={styles.priceRow}>
                  <View style={styles.priceLeft}>
                    <Text weight="700" style={styles.price}>
                      {test.price}/-
                    </Text>
                    <Text weight="400" style={styles.originalPrice}>
                      {test.originalPrice}/-
                    </Text>
                  </View>

                  <Text weight="600" style={styles.discount}>
                    {test.discount}
                  </Text>
                </View>
              </View>
              </View>

              {/* Bottom Buttons Row */}
              <View style={styles.cardBottomRow}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.bookBtnWrap}
                  onPress={() => navigation.navigate("TestDetails", {
                    testTitle: test.title,
                    testCount: test.tests,
                    reportTime: test.reportTime,
                    price: test.price,
                    originalPrice: test.originalPrice,
                    discount: test.discount,
                  })}
                >
                  <LinearGradient
                    colors={["#B148FF", "#F6339B", "#9914F9"]}
                    locations={[0, 0.5, 1]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.bookBtn}
                  >
                    <Text weight="700" style={styles.bookBtnText}>Book</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.infoBtnWrap}
                  onPress={() => openSheet(test)}
                >
                  <View style={styles.infoBtn}>
                    <Ionicons name="information-circle-outline" size={16} color="#1f2937" />
                    <Text weight="600" style={styles.infoBtnText}>Info</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Sheet Modal */}
      <Modal
        visible={sheetVisible}
        transparent
        animationType="none"
        onRequestClose={closeSheet}
      >
        <View style={styles.modalWrapper}>
          <Animated.View style={[styles.sheetOverlay, { opacity: fadeAnim }]}>
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={closeSheet}
            />
          </Animated.View>

          <Animated.View
            style={[{ transform: [{ translateY: slideAnim }] }]}
          >
            <LinearGradient
              colors={["#E4CCF7", "#FFE9CF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.sheetContainer}
            >
              <View {...panResponder.panHandlers} style={styles.handleArea}>
                <View style={styles.handleBar} />
              </View>

              {selectedTest && (
                <ScrollView
                  style={styles.sheetScroll}
                  showsVerticalScrollIndicator={false}
                  bounces={true}
                >
                  {/* Icon + Title Row */}
                  <View style={styles.sheetHeaderRow}>
                    <DiabetesIcon size={28} />
                    <Text weight="700" style={styles.sheetTitle}>
                      {selectedTest.title.replace(/\n/g, " ")}
                    </Text>
                  </View>

                  {/* Purpose */}
                  <View style={styles.sheetSection}>
                    <Text weight="700" style={styles.sheetSectionLabel}>Purpose</Text>
                    <Text weight="400" style={styles.sheetSectionValue}>
                      {selectedTest.purpose || "General diagnostic assessment."}
                    </Text>
                  </View>

                  {/* Report Time */}
                  <View style={styles.sheetSection}>
                    <Text weight="700" style={styles.sheetSectionLabel}>Report Time</Text>
                    <Text weight="700" style={styles.sheetReportTime}>
                      {selectedTest.reportTime}
                    </Text>
                  </View>

                  {/* Tests Included (Collapsible) */}
                  <View>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => setTestsExpanded(!testsExpanded)}
                      style={styles.sheetTestsHeader}
                    >
                      <Text weight="600" style={styles.sheetTestsHeaderText}>
                        Tests Included ({selectedTest.details?.length || selectedTest.tests})
                      </Text>
                      <MaterialIcons
                        name={testsExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                        size={22}
                        color="#1f2937"
                      />
                    </TouchableOpacity>

                    {testsExpanded && (
                      <View style={styles.sheetTestsList}>
                        {selectedTest.details?.map((item, idx) => (
                          <View key={idx} style={styles.detailRow}>
                            <Text weight="400" style={styles.bulletDot}>
                              {"\u2022"}
                            </Text>
                            <Text weight="400" style={styles.detailText}>
                              {item}
                            </Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>

                  {/* Price Row */}
                  <View style={styles.sheetPriceRow}>
                    <Text weight="400" style={styles.sheetOriginalPrice}>
                      {"\u20B9"}{selectedTest.originalPrice}
                    </Text>
                    <Text weight="800" style={styles.sheetPrice}>
                      {"\u20B9"}{selectedTest.price}
                    </Text>
                    <View style={styles.sheetDiscountBadge}>
                      <Text weight="600" style={styles.sheetDiscountText}>
                        {selectedTest.discount}
                      </Text>
                    </View>
                  </View>

                  {/* Book This Test Button */}
                  <View>
                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={styles.sheetBookBtnWrap}
                      onPress={() => {
                        closeSheet();
                        navigation.navigate("TestDetails", {
                          testTitle: selectedTest.title,
                          testCount: selectedTest.tests,
                          reportTime: selectedTest.reportTime,
                          price: selectedTest.price,
                          originalPrice: selectedTest.originalPrice,
                          discount: selectedTest.discount,
                        });
                      }}
                    >
                      <LinearGradient
                        colors={["#B148FF", "#F6339B", "#9914F9"]}
                        locations={[0, 0.5, 1]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.sheetBookBtn}
                      >
                        <MaterialIcons name="event" size={18} color="#fff" style={{ marginRight: 8 }} />
                        <Text weight="700" style={styles.sheetBookBtnText}>Book This Test</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              )}
            </LinearGradient>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFBFF",
  },
  scrollView: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: Platform.OS === "android" ? 44 : 54,
    paddingBottom: 18,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  backBtn: {
    padding: 4,
  },
  navTitle: {
    fontSize: 20,
    color: "#1f2937",
  },
  bookHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  bookTitle: {
    fontSize: 16,
    color: "#1f2937",
  },
  cardList: {
    paddingHorizontal: 16,
    paddingBottom: 30,
    gap: 14,
  },
  card: {
    flexDirection: "column",
    backgroundColor: "#FBF1FE",
    borderRadius: 16,
    padding: 12,
    shadowColor: "#BF7BB9",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  cardLeft: {
    width: 74,
    height: 74,
    borderRadius: 10,
    backgroundColor: "#F3EAFF",
    overflow: "hidden",
    marginRight: 12,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#BF7BB9",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  testImage: {
    width: 50,
    height: 50,
  },
  cardRight: {
    flex: 1,
    position: "relative",
  },
  chevronBtn: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#E8D5F5",
    backgroundColor: "#F1E7FE",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#BF7BB9",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  testTitle: {
    fontSize: 14,
    color: "#1f2937",
    marginBottom: 4,
    paddingRight: 40,
  },
  containsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginBottom: 2,
  },
  containsText: {
    fontSize: 12,
    color: "#22C55E",
  },
  reportText: {
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceLeft: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  price: {
    fontSize: 16,
    color: "#1f2937",
  },
  originalPrice: {
    fontSize: 12,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
  },
  discount: {
    fontSize: 11,
    color: "#22C55E",
    marginLeft: 6,
  },
  bookBtnWrap: {
    flex: 1,
    borderRadius: 10,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#BF7BB9",
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
        shadowColor: "#BF7BB9",
      },
    }),
  },
  bookBtn: {
    flexDirection: "row",
    paddingVertical: 7,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  bookBtnText: {
    color: "#fff",
    fontSize: 14,
  },
  cardBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 12,
  },
  cardTopRow: {
    flexDirection: "row",
  },
  infoBtnWrap: {
    flex: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
  infoBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F3EAFF",
  },
  infoBtnText: {
    color: "#1f2937",
    fontSize: 14,
  },

  /* ---- Bottom Sheet ---- */
  modalWrapper: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "transparent",
  },
  sheetOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  sheetContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 0,
    paddingBottom: Platform.OS === "ios" ? 36 : 24,
    maxHeight: height * 0.75,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 10,
  },
  handleArea: {
    paddingTop: 10,
    paddingBottom: 6,
    alignItems: "center",
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D1D5DB",
    alignSelf: "center",
    marginBottom: 10,
  },
  sheetScroll: {
    paddingHorizontal: 24,
  },
  sheetIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  sheetHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 6,
  },
  sheetTitle: {
    fontSize: 18,
    color: "#1f2937",
    flex: 1,
  },
  sheetSection: {
    marginBottom: 16,
  },
  sheetSectionLabel: {
    fontSize: 14,
    color: "#1f2937",
    marginBottom: 4,
  },
  sheetSectionValue: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 20,
  },
  sheetReportTime: {
    fontSize: 14,
    color: "#1f2937",
  },
  sheetTestsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
    paddingVertical: 4,
  },
  sheetTestsHeaderText: {
    fontSize: 14,
    color: "#1f2937",
  },
  sheetTestsList: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 8,
  },
  sheetPriceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 16,
    marginBottom: 16,
    gap: 8,
  },
  sheetOriginalPrice: {
    fontSize: 14,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
  },
  sheetPrice: {
    fontSize: 24,
    color: "#1f2937",
  },
  sheetDiscountBadge: {
    backgroundColor: "#DCFCE7",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  sheetDiscountText: {
    fontSize: 12,
    color: "#22C55E",
  },
  sheetBookBtnWrap: {
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 10,
  },
  sheetBookBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
  },
  sheetBookBtnText: {
    color: "#fff",
    fontSize: 15,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 5,
    paddingHorizontal: 4,
  },
  bulletDot: {
    fontSize: 16,
    color: "#1f2937",
    marginRight: 10,
    lineHeight: 22,
  },
  detailText: {
    fontSize: 13,
    color: "#1f2937",
    lineHeight: 22,
    flex: 1,
  },
});

export default DiabetesMonitoring;
