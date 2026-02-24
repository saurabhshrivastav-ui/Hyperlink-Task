import React, { useRef, useState, useEffect, useCallback } from "react";
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
import { useNavigation, useRoute } from "@react-navigation/native";
import { Text } from "../Components/TextWrapper";

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = width * 0.38;
const PKG_ITEM_WIDTH = CARD_WIDTH + 12; // card + gap
const PKG_CLONE_COUNT = 40;

const popularPackages = [
  {
    id: 1,
    title: "Full Body Checkup",
    desc: "A complete yearly health screen",
    price: "1599/-",
  },
  {
    id: 2,
    title: "Full Body Checkup",
    desc: "A complete yearly health screen",
    price: "1599/-",
  },
  {
    id: 3,
    title: "Full Body Checkup",
    desc: "A complete yearly health screen",
    price: "1599/-",
  },
];

const TestDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Accept test data from route params with fallback defaults
  const testTitle = route.params?.testTitle || "Diabetes Screening\n(HbAIC & Fasting Sugar)";
  const testCount = route.params?.testCount || 2;
  const reportTime = route.params?.reportTime || "15 hrs";
  const price = route.params?.price || 479;
  const originalPrice = route.params?.originalPrice || 625;
  const discount = route.params?.discount || "25% off";

  const pkgScrollRef = useRef(null);
  const pkgScrollX = useRef(0);
  const pkgLoopData = useRef(
    Array.from({ length: popularPackages.length * PKG_CLONE_COUNT }, (_, i) => ({
      ...popularPackages[i % popularPackages.length],
      _key: `pkg-${i}`,
    }))
  ).current;
  const PKG_ONE_SET = popularPackages.length * PKG_ITEM_WIDTH;
  const PKG_ORIGIN = PKG_ONE_SET * Math.floor(PKG_CLONE_COUNT / 2);

  useEffect(() => {
    if (pkgScrollRef.current) {
      pkgScrollRef.current.scrollTo({ x: PKG_ORIGIN, animated: false });
      pkgScrollX.current = PKG_ORIGIN;
    }
  }, []);

  const pkgRecenter = (x) => {
    pkgScrollX.current = x;
    const setsFromOrigin = Math.abs(x - PKG_ORIGIN) / PKG_ONE_SET;
    if (setsFromOrigin > 5) {
      const offset = ((x % PKG_ONE_SET) + PKG_ONE_SET) % PKG_ONE_SET;
      const newX = PKG_ORIGIN + offset;
      pkgScrollX.current = newX;
      if (pkgScrollRef.current) {
        pkgScrollRef.current.scrollTo({ x: newX, animated: false });
      }
    }
  };

  const [showPatientSheet, setShowPatientSheet] = useState(false);
  const [showSlotSheet, setShowSlotSheet] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Animation refs for smooth tray transitions
  const patientSlideAnim = useRef(new Animated.Value(height)).current;
  const patientFadeAnim = useRef(new Animated.Value(0)).current;
  // Staggered float anims for each content block in patient sheet
  const patientItem1 = useRef(new Animated.Value(0)).current;
  const patientItem2 = useRef(new Animated.Value(0)).current;
  const patientItem3 = useRef(new Animated.Value(0)).current;
  const patientItem4 = useRef(new Animated.Value(0)).current;

  const slotSlideAnim = useRef(new Animated.Value(height)).current;
  const slotFadeAnim = useRef(new Animated.Value(0)).current;
  // Staggered float anims for each content block in slot sheet
  const slotItem1 = useRef(new Animated.Value(0)).current;
  const slotItem2 = useRef(new Animated.Value(0)).current;
  const slotItem3 = useRef(new Animated.Value(0)).current;
  const slotItem4 = useRef(new Animated.Value(0)).current;
  const slotItem5 = useRef(new Animated.Value(0)).current;

  // Drag-to-dismiss threshold (px)
  const DISMISS_THRESHOLD = 120;

  const patientPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) {
          patientSlideAnim.setValue(g.dy);
          patientFadeAnim.setValue(1 - g.dy / (height * 0.6));
        }
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > DISMISS_THRESHOLD || g.vy > 0.5) {
          closePatientSheet();
        } else {
          Animated.parallel([
            Animated.timing(patientSlideAnim, {
              toValue: 0,
              duration: 250,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(patientFadeAnim, {
              toValue: 1,
              duration: 250,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    })
  ).current;

  const slotPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) {
          slotSlideAnim.setValue(g.dy);
          slotFadeAnim.setValue(1 - g.dy / (height * 0.6));
        }
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > DISMISS_THRESHOLD || g.vy > 0.5) {
          closeSlotSheet();
        } else {
          Animated.parallel([
            Animated.timing(slotSlideAnim, {
              toValue: 0,
              duration: 250,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(slotFadeAnim, {
              toValue: 1,
              duration: 250,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    })
  ).current;

  // Helper: stagger float-in for items
  const floatIn = (items, delay = 60) => {
    items.forEach(a => a.setValue(0));
    Animated.stagger(delay, items.map(anim =>
      Animated.spring(anim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      })
    )).start();
  };

  // Helper: build float style from an Animated.Value (0→1)
  const floatStyle = (anim, floatY = 30) => ({
    opacity: anim,
    transform: [
      { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [floatY, 0] }) },
      { scale: anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.97, 1.02, 1] }) },
    ],
  });

  const openPatientSheet = useCallback(() => {
    setShowPatientSheet(true);
    Animated.parallel([
      Animated.timing(patientFadeAnim, {
        toValue: 1,
        duration: 350,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(patientSlideAnim, {
        toValue: 0,
        duration: 450,
        easing: Easing.bezier(0.16, 1, 0.3, 1),
        useNativeDriver: true,
      }),
    ]).start(() => {
      floatIn([patientItem1, patientItem2, patientItem3, patientItem4], 80);
    });
  }, []);

  const closePatientSheet = useCallback((callback) => {
    Animated.parallel([
      Animated.timing(patientFadeAnim, {
        toValue: 0,
        duration: 280,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(patientSlideAnim, {
        toValue: height,
        duration: 380,
        easing: Easing.bezier(0.4, 0, 0.6, 1),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowPatientSheet(false);
      [patientItem1, patientItem2, patientItem3, patientItem4].forEach(a => a.setValue(0));
      if (callback) callback();
    });
  }, []);

  const openSlotSheet = useCallback(() => {
    setShowSlotSheet(true);
    Animated.parallel([
      Animated.timing(slotFadeAnim, {
        toValue: 1,
        duration: 350,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slotSlideAnim, {
        toValue: 0,
        duration: 450,
        easing: Easing.bezier(0.16, 1, 0.3, 1),
        useNativeDriver: true,
      }),
    ]).start(() => {
      floatIn([slotItem1, slotItem2, slotItem3, slotItem4, slotItem5], 70);
    });
  }, []);

  const closeSlotSheet = useCallback((callback) => {
    Animated.parallel([
      Animated.timing(slotFadeAnim, {
        toValue: 0,
        duration: 280,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(slotSlideAnim, {
        toValue: height,
        duration: 380,
        easing: Easing.bezier(0.4, 0, 0.6, 1),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowSlotSheet(false);
      [slotItem1, slotItem2, slotItem3, slotItem4, slotItem5].forEach(a => a.setValue(0));
      if (callback) callback();
    });
  }, []);

  // ---- Info Tray (Samples / Why / Preparations) ----
  const [showInfoSheet, setShowInfoSheet] = useState(false);
  const infoTypeRef = useRef("samples");

  const infoSlideAnim = useRef(new Animated.Value(height)).current;
  const infoFadeAnim = useRef(new Animated.Value(0)).current;

  const infoPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) {
          infoSlideAnim.setValue(g.dy);
          infoFadeAnim.setValue(1 - g.dy / (height * 0.6));
        }
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > DISMISS_THRESHOLD || g.vy > 0.5) {
          closeInfoSheet();
        } else {
          Animated.parallel([
            Animated.spring(infoSlideAnim, { toValue: 0, useNativeDriver: true }),
            Animated.timing(infoFadeAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
          ]).start();
        }
      },
    })
  ).current;

  const openInfoSheet = useCallback((type) => {
    infoTypeRef.current = type;
    setShowInfoSheet(true);
    Animated.parallel([
      Animated.timing(infoFadeAnim, {
        toValue: 1,
        duration: 350,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(infoSlideAnim, {
        toValue: 0,
        duration: 450,
        easing: Easing.bezier(0.16, 1, 0.3, 1),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const closeInfoSheet = useCallback(() => {
    Animated.parallel([
      Animated.timing(infoFadeAnim, {
        toValue: 0,
        duration: 280,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(infoSlideAnim, {
        toValue: height,
        duration: 380,
        easing: Easing.bezier(0.4, 0, 0.6, 1),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowInfoSheet(false);
    });
  }, []);

  // Content data for the 3 info types
  const infoContent = {
    samples: {
      icon: "flask-outline",
      iconLib: "Ionicons",
      title: "Samples Required",
      color: "#7C3AED",
      bg: "#EDE9FE",
      sections: [
        { heading: "Blood Sample", desc: "A small amount of blood (3-5 ml) is drawn from a vein in your arm using a sterile syringe." },
        { heading: "Urine Sample", desc: "A mid-stream urine sample may be required in a sterile container provided at the lab." },
        { heading: "Fasting Required?", desc: "Some tests require 8-12 hours fasting. Water is allowed. Your lab will confirm specific requirements." },
      ],
    },
    why: {
      icon: "information-circle-outline",
      iconLib: "Ionicons",
      title: "Why This Test Is Booked",
      color: "#2563EB",
      bg: "#DBEAFE",
      sections: [
        { heading: "Early Detection", desc: "Helps identify health conditions at an early stage when they are most treatable." },
        { heading: "Monitor Existing Conditions", desc: "If you have a known condition, regular testing tracks progress and treatment effectiveness." },
        { heading: "Preventive Health", desc: "Routine screening helps maintain overall wellness and catch risk factors before symptoms appear." },
      ],
    },
    preparations: {
      icon: "clipboard-outline",
      iconLib: "Ionicons",
      title: "Test Preparations",
      color: "#059669",
      bg: "#D1FAE5",
      sections: [
        { heading: "Before Your Test", desc: "Avoid heavy meals, alcohol, and strenuous exercise 24 hours before sample collection." },
        { heading: "Medications", desc: "Inform the lab about any medications or supplements you are currently taking. Do not stop any medication without consulting your doctor." },
        { heading: "On The Day", desc: "Wear comfortable clothing with sleeves that can be easily rolled up. Stay hydrated with water and arrive on time for your appointment." },
      ],
    },
    collection: {
      icon: "people-outline",
      iconLib: "Ionicons",
      title: "Who Will Collect Your Sample?",
      color: "#7C3AED",
      bg: "#EDE9FE",
      sections: [
        { heading: "Certified Phlebotomist", desc: "A trained & certified phlebotomist from our partner lab will visit your home at the scheduled time. They carry valid ID and proper equipment." },
        { heading: "Home Collection Process", desc: "The phlebotomist will verify your identity (Aadhaar/ID), label the vials in front of you, and collect the sample following strict hygiene protocols." },
        { heading: "Safety & Hygiene", desc: "Single-use sterile needles, gloves, and sealed collection tubes are used. All equipment is disposed safely after use. No cross-contamination risk." },
        { heading: "Sample Transport", desc: "Collected samples are stored in temperature-controlled bags and transported to the nearest NABL-accredited lab within 2 hours for processing." },
        { heading: "Lab Center Option", desc: "You can also visit any of our 500+ partner lab centers across the city. Walk-in slots available 6 AM – 6 PM, no appointment needed." },
      ],
    },
  };

  const slotDays = [
    { label: "Today", slots: "6 slots" },
    { label: "Tomorrow", slots: "10 slots" },
    { label: "Sun, 29 jun", slots: "12 slots" },
  ];
  const timePeriods = ["Morning", "Afternoon", "Evening"];
  const timeSlots = [
    "09.00 am - 10.00 am",
    "10.00 am - 11.00 am",
    "11.00 am - 12.00 pm",
  ];



  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
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
              Test
            </Text>
          </View>
        </LinearGradient>

        {/* Test Info Card */}
        <View style={styles.testCard}>
          <View style={styles.testCardRow}>
            <View style={styles.testImgWrap}>
              <Image
                source={require("../assets/scan.webp")}
                style={styles.testImg}
                resizeMode="cover"
              />
            </View>
            <View style={styles.testInfoRight}>
              <Text weight="700" style={styles.testTitle}>
                {testTitle}
              </Text>
              <View style={styles.pillRow}>
                <View style={styles.pill}>
                  <Text weight="500" style={styles.pillText}>
                    Contains {testCount} tests
                  </Text>
                  <MaterialIcons name="keyboard-arrow-down" size={16} color="#22C55E" />
                </View>
                <View style={styles.pill}>
                  <Text weight="500" style={styles.pillText}>
                    Report within {reportTime}
                  </Text>
                </View>
              </View>
              <View style={styles.priceRow}>
                <Text weight="700" style={styles.price}>{price}/-</Text>
                <Text weight="400" style={styles.originalPrice}>{originalPrice}/-</Text>
                <Text weight="600" style={styles.discount}>{discount}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Learn More Section - Single Card with Sub-cards */}
        <View style={styles.learnMoreSection}>
          <LinearGradient
            colors={["#E8D5F5", "#C7B8F0", "#A8A0E8"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.learnMoreCard}
          >
            <Text weight="700" style={styles.learnMoreTitle}>
              Learn more about this test
            </Text>

            {/* Description sub-card */}
            <View style={styles.learnMoreDescCard}>
              <Text weight="400" style={styles.learnMoreDescText}>
                {testTitle.replace(/\n/g, " ")} - comprehensive diagnostic screening for accurate health assessment.
              </Text>
            </View>

            {/* Info sub-cards row */}
            <View style={styles.learnMoreSubRow}>
              <TouchableOpacity style={styles.learnMoreSubCard} activeOpacity={0.7}
                onPress={() => openInfoSheet("samples")}
              >
                <View style={styles.learnMoreSubCardTop}>
                  <View style={styles.learnMoreIconWrap}>
                    <Ionicons name="flask-outline" size={16} color="#553FB5" />
                  </View>
                  <MaterialIcons name="chevron-right" size={18} color="#9CA3AF" />
                </View>
                <Text weight="400" style={styles.learnMoreSubLabel}>
                  Samples{"\n"}Required
                </Text>
                <Text weight="700" style={styles.learnMoreSubValue}>
                  Click to view
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.learnMoreSubCard} activeOpacity={0.7}
                onPress={() => openInfoSheet("why")}
              >
                <View style={styles.learnMoreSubCardTop}>
                  <View style={styles.learnMoreIconWrap}>
                    <Ionicons name="information-circle-outline" size={16} color="#553FB5" />
                  </View>
                  <MaterialIcons name="chevron-right" size={18} color="#9CA3AF" />
                </View>
                <Text weight="400" style={styles.learnMoreSubLabel}>
                  Why This Test Is{"\n"}Booked
                </Text>
                <Text weight="700" style={styles.learnMoreSubValue}>
                  Know the{"\n"}purpose
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.learnMoreSubCard} activeOpacity={0.7}
                onPress={() => openInfoSheet("preparations")}
              >
                <View style={styles.learnMoreSubCardTop}>
                  <View style={styles.learnMoreIconWrap}>
                    <Ionicons name="clipboard-outline" size={16} color="#553FB5" />
                  </View>
                  <MaterialIcons name="chevron-right" size={18} color="#9CA3AF" />
                </View>
                <Text weight="400" style={styles.learnMoreSubLabel}>
                  Test{"\n"}Preparations
                </Text>
                <Text weight="700" style={styles.learnMoreSubValue}>
                  Before your{"\n"}test
                </Text>
              </TouchableOpacity>
            </View>

            {/* Sample Collection full-width sub-card */}
            <TouchableOpacity
              style={styles.learnMoreFullCard}
              activeOpacity={0.7}
              onPress={() => openInfoSheet("collection")}
            >
              <View style={styles.learnMoreFullCardInner}>
                <View>
                  <View style={styles.learnMoreIconWrap}>
                    <Ionicons name="download-outline" size={16} color="#553FB5" />
                  </View>
                  <Text weight="400" style={styles.learnMoreFullLabel}>
                    Sample Collection
                  </Text>
                  <Text weight="700" style={styles.learnMoreFullValue}>
                    Who will collect your sample?
                  </Text>
                </View>
                <MaterialIcons name="chevron-right" size={22} color="#9CA3AF" />
              </View>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Popular Packages */}
        <View style={styles.popularSection}>
          <View style={styles.popularHeader}>
            <Text weight="700" style={styles.popularTitle}>Popular Packages</Text>
            <TouchableOpacity>
              <Text weight="600" style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            ref={pkgScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.packageList}
            scrollEventThrottle={16}
            onMomentumScrollEnd={(e) => pkgRecenter(e.nativeEvent.contentOffset.x)}
            onScrollEndDrag={(e) => pkgRecenter(e.nativeEvent.contentOffset.x)}
          >
            {pkgLoopData.map((pkg) => (
              <View key={pkg._key} style={styles.packageCard}>
                <Text weight="700" style={styles.packageTitle}>{pkg.title}</Text>
                <Text weight="400" style={styles.packageDesc}>{pkg.desc}</Text>
                <Text weight="800" style={styles.packagePrice}>{pkg.price}</Text>
                <TouchableOpacity style={styles.packageArrowBtn}>
                  <MaterialIcons name="chevron-right" size={14} color="#7C3AED" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <LinearGradient
        colors={["#E4CCF7", "#FFE9CF"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.bottomBar}
      >
        <View>
          <Text weight="400" style={styles.totalLabel}>Total Amount</Text>
          <Text weight="700" style={styles.totalPrice}>{price}/-</Text>
        </View>
        <TouchableOpacity activeOpacity={0.8} style={styles.bookTestBtnWrap}
          onPress={openPatientSheet}
        >
          <LinearGradient
            colors={["#B148FF", "#F6339B", "#9914F9"]}
            locations={[0, 0.5, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.bookTestBtn}
          >
            <Text weight="700" style={styles.bookTestBtnText}>Book a Test</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>

      {/* Patient Details Bottom Sheet */}
      <Modal
        visible={showPatientSheet}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={() => closePatientSheet()}
      >
        {/* Backdrop */}
        <Animated.View style={[styles.sheetOverlay, { opacity: patientFadeAnim }]}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => closePatientSheet()} />
        </Animated.View>

        {/* Tray */}
        <Animated.View style={[styles.sheetContainer, { transform: [{ translateY: patientSlideAnim }] }]}>
          <LinearGradient
            colors={["#E4CCF7", "#F5E0EC", "#FFE9CF"]}
            locations={[0, 0.5, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0.6 }}
            style={styles.sheetGradient}
          >
            {/* Handle – drag to dismiss */}
            <View {...patientPanResponder.panHandlers} style={styles.trayHandle}>
              <View style={styles.trayHandleBar} />
            </View>

            {/* Header */}
            <Animated.View style={[styles.sheetHeader, floatStyle(patientItem1, 24)]}>
              <TouchableOpacity onPress={() => closePatientSheet()} style={styles.sheetBackBtn}>
                <MaterialIcons name="arrow-back" size={24} color="#6D28D9" />
              </TouchableOpacity>
              <Text weight="700" style={styles.sheetTitle}>Patient details</Text>
            </Animated.View>

            <Animated.View style={floatStyle(patientItem2, 28)}>
              <Text weight="600" style={styles.sheetSubtitle}>
                Lets Start with your personal details
              </Text>
            </Animated.View>

            {/* Profile Card */}
            <Animated.View style={floatStyle(patientItem3, 32)}>
            <LinearGradient
              colors={["#FDEFFB", "#FBF1FE", "#E9DAFD"]}
              locations={[0, 0.5, 1]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.sheetProfileCard}
            >
              <View style={styles.sheetProfileRow}>
                <LinearGradient
                  colors={["#FDBEA5", "#F695CF", "#8E66EB"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.avatarOuterRing}
                >
                  <View style={styles.avatarWhiteRing}>
                    <LinearGradient
                      colors={["#EEA6C8", "#996EEB"]}
                      start={{ x: 0.13, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.avatarGradient}
                    >
                      <Text weight="700" style={styles.avatarText}>SN</Text>
                    </LinearGradient>
                  </View>
                </LinearGradient>

                <View style={styles.sheetProfileInfo}>
                  <Text weight="700" style={styles.sheetProfileName}>Sakshi Nishad</Text>
                  <View style={styles.sheetTagsRow}>
                    <View style={styles.sheetTag}>
                      <Text weight="500" style={styles.sheetTagText}>Female</Text>
                    </View>
                    <View style={styles.sheetTag}>
                      <Text weight="500" style={styles.sheetTagText}>22 yrs</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.sheetDropdownIcon}>
                  <Ionicons name="chevron-down" size={22} color="#7C3AED" />
                </View>
              </View>
            </LinearGradient>
            </Animated.View>

            {/* Book a Slot Button */}
            <Animated.View style={floatStyle(patientItem4, 36)}>
            <TouchableOpacity activeOpacity={0.8} style={styles.bookSlotBtnWrap}
              onPress={() => {
                closePatientSheet(() => {
                  openSlotSheet();
                });
              }}
            >
              <LinearGradient
                colors={["#B148FF", "#F6339B", "#9914F9"]}
                locations={[0, 0.5, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.bookSlotBtn}
              >
                <Text weight="700" style={styles.bookSlotBtnText}>Book a slot</Text>
              </LinearGradient>
            </TouchableOpacity>
            </Animated.View>
          </LinearGradient>
        </Animated.View>
      </Modal>

      {/* Slot Selection Bottom Sheet */}
      <Modal
        visible={showSlotSheet}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={() => closeSlotSheet()}
      >
        {/* Backdrop */}
        <Animated.View style={[styles.sheetOverlay, { opacity: slotFadeAnim }]}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => closeSlotSheet()} />
        </Animated.View>

        {/* Tray */}
        <Animated.View style={[styles.slotSheetContainer, { transform: [{ translateY: slotSlideAnim }] }]}>
          <LinearGradient
            colors={["#E4CCF7", "#F5E0EC", "#FFE9CF"]}
            locations={[0, 0.5, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0.6 }}
            style={styles.slotSheetGradient}
          >
            {/* Handle – drag to dismiss */}
            <View {...slotPanResponder.panHandlers} style={styles.trayHandle}>
              <View style={styles.trayHandleBar} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Header */}
              <Animated.View style={[styles.sheetHeader, floatStyle(slotItem1, 24)]}>
                <TouchableOpacity onPress={() => closeSlotSheet()} style={styles.sheetBackBtn}>
                  <MaterialIcons name="arrow-back" size={24} color="#6D28D9" />
                </TouchableOpacity>
                <Text weight="700" style={styles.sheetTitle}>Slot Selection</Text>
              </Animated.View>

              {/* Profile Card */}
              <Animated.View style={floatStyle(slotItem2, 26)}>
              <LinearGradient
                colors={["#FDEFFB", "#FBF1FE", "#E9DAFD"]}
                locations={[0, 0.5, 1]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.sheetProfileCard}
              >
                <View style={styles.sheetProfileRow}>
                  <LinearGradient
                    colors={["#FDBEA5", "#F695CF", "#8E66EB"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.avatarOuterRing}
                  >
                    <View style={styles.avatarWhiteRing}>
                      <LinearGradient
                        colors={["#EEA6C8", "#996EEB"]}
                        start={{ x: 0.13, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.avatarGradient}
                      >
                        <Text weight="700" style={styles.avatarText}>SN</Text>
                      </LinearGradient>
                    </View>
                  </LinearGradient>

                  <View style={styles.sheetProfileInfo}>
                    <Text weight="700" style={styles.sheetProfileName}>Sakshi Nishad</Text>
                    <View style={styles.sheetTagsRow}>
                      <View style={styles.sheetTag}>
                        <Text weight="500" style={styles.sheetTagText}>Female</Text>
                      </View>
                      <View style={styles.sheetTag}>
                        <Text weight="500" style={styles.sheetTagText}>22 yrs</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.sheetDropdownIcon}>
                    <Ionicons name="chevron-down" size={22} color="#7C3AED" />
                  </View>
                </View>
              </LinearGradient>
              </Animated.View>

              {/* Select Address */}
              <Animated.View style={[styles.slotAddressCard, floatStyle(slotItem3, 28)]}>
                <View style={styles.slotAddressHeader}>
                  <Text weight="600" style={styles.slotAddressTitle}>Select Address</Text>
                  <TouchableOpacity activeOpacity={0.7}>
                    <Text weight="600" style={styles.slotChangeText}>Change</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.slotDivider} />
                <Text weight="700" style={styles.slotAddressLine1}>
                  473, Torana Chs, Ramnagar, Ghatkopar West
                </Text>
                <Text weight="400" style={styles.slotAddressLine2}>
                  Mumbai, Maharashtra – 400086
                </Text>
              </Animated.View>

              {/* Select A Slot */}
              <Animated.View style={[styles.slotPickerCard, floatStyle(slotItem4, 32)]}>
                <Text weight="600" style={styles.slotPickerTitle}>Select A Slot</Text>
                <View style={styles.slotDivider} />

                {/* Day Pills */}
                <View style={styles.slotDayRow}>
                  {slotDays.map((day, index) => (
                    <TouchableOpacity
                      key={index}
                      activeOpacity={0.8}
                      onPress={() => setSelectedDay(index)}
                      style={[
                        styles.slotDayPill,
                        selectedDay === index && styles.slotDayPillActive,
                      ]}
                    >
                      <Text
                        weight="600"
                        style={[
                          styles.slotDayLabel,
                          selectedDay === index && styles.slotDayLabelActive,
                        ]}
                      >
                        {day.label}
                      </Text>
                      <Text
                        weight="400"
                        style={[
                          styles.slotDaySlots,
                          selectedDay === index && styles.slotDaySlotsActive,
                        ]}
                      >
                        {day.slots}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Time Period Pills */}
                <View style={styles.slotPeriodRow}>
                  {timePeriods.map((period, index) => (
                    <TouchableOpacity
                      key={index}
                      activeOpacity={0.8}
                      onPress={() => setSelectedPeriod(index)}
                      style={[
                        styles.slotPeriodPill,
                        selectedPeriod === index && styles.slotPeriodPillActive,
                      ]}
                    >
                      <Text
                        weight="500"
                        style={[
                          styles.slotPeriodText,
                          selectedPeriod === index && styles.slotPeriodTextActive,
                        ]}
                      >
                        {period}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Time Slots */}
                <View style={styles.slotTimesContainer}>
                  {timeSlots.map((slot, index) => (
                    <TouchableOpacity
                      key={index}
                      activeOpacity={0.8}
                      onPress={() => setSelectedSlot(index)}
                      style={styles.slotTimeRow}
                    >
                      <View style={styles.slotRadioOuter}>
                        {selectedSlot === index && <View style={styles.slotRadioInner} />}
                      </View>
                      <Text
                        weight={selectedSlot === index ? "600" : "400"}
                        style={styles.slotTimeText}
                      >
                        {slot}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </Animated.View>
            </ScrollView>

            {/* Continue Button */}
            <Animated.View style={floatStyle(slotItem5, 36)}>
            <TouchableOpacity activeOpacity={0.8} style={styles.slotContinueBtnWrap}
              onPress={() => {
                closeSlotSheet(() => {
                  navigation.navigate("BookingDetails");
                });
              }}
            >
              <LinearGradient
                colors={["#B148FF", "#F6339B", "#9914F9"]}
                locations={[0, 0.5, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.slotContinueBtn}
              >
                <Text weight="700" style={styles.slotContinueBtnText}>Continue</Text>
              </LinearGradient>
            </TouchableOpacity>
            </Animated.View>
          </LinearGradient>
        </Animated.View>
      </Modal>

      {/* Info Bottom Sheet (Samples / Why / Preparations) */}
      <Modal
        visible={showInfoSheet}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={closeInfoSheet}
      >
        <Animated.View style={[styles.sheetOverlay, { opacity: infoFadeAnim }]}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={closeInfoSheet} />
        </Animated.View>

        <Animated.View style={[styles.infoSheetContainer, { transform: [{ translateY: infoSlideAnim }] }]}>
          <LinearGradient
            colors={["#E4CCF7", "#FFE9CF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.infoSheetGradient}
          >
            <View {...infoPanResponder.panHandlers} style={styles.trayHandle}>
              <View style={styles.trayHandleBar} />
            </View>

            {["samples", "why", "preparations", "collection"].map((key) => (
              <View key={key} style={{ display: infoTypeRef.current === key ? "flex" : "none" }}>
                <ScrollView
                  style={styles.infoSheetScroll}
                  showsVerticalScrollIndicator={false}
                  bounces={true}
                >
                  <View style={styles.infoHeaderRow}>
                    <View style={[styles.infoIconWrap, { backgroundColor: infoContent[key].bg }]}>
                      <Ionicons
                        name={infoContent[key].icon}
                        size={24}
                        color={infoContent[key].color}
                      />
                    </View>
                    <Text weight="700" style={styles.infoTitle}>
                      {infoContent[key].title}
                    </Text>
                  </View>

                  {infoContent[key].sections.map((section, idx) => (
                    <View key={idx} style={styles.infoSectionCard}>
                      <View style={styles.infoSectionRow}>
                        <View style={[styles.infoSectionDot, { backgroundColor: infoContent[key].color }]} />
                        <Text weight="700" style={styles.infoSectionHeading}>
                          {section.heading}
                        </Text>
                      </View>
                      <Text weight="400" style={styles.infoSectionDesc}>
                        {section.desc}
                      </Text>
                    </View>
                  ))}

                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.infoCloseBtnWrap}
                    onPress={closeInfoSheet}
                  >
                    <LinearGradient
                      colors={["#B148FF", "#F6339B", "#9914F9"]}
                      locations={[0, 0.5, 1]}
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                      style={styles.infoCloseBtn}
                    >
                      <Text weight="700" style={styles.infoCloseBtnText}>Got It</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            ))}
          </LinearGradient>
        </Animated.View>
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
    color: "#553FB5",
  },

  // Test Info Card
  testCard: {
    width: 323,
    height: 129,
    alignSelf: "center",
    marginTop: 20,
    backgroundColor: "#FBF1FE",
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    shadowColor: "#BF7BB9",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  testCardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  testImgWrap: {
    width: 74,
    height: 74,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    shadowColor: "#BF7BB9",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  testImg: {
    width: 50,
    height: 50,
  },
  testInfoRight: {
    flex: 1,
  },
  testTitle: {
    fontSize: 14,
    color: "#1f2937",
    marginBottom: 6,
  },
  pillRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 8,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 8,
    gap: 2,
  },
  pillText: {
    fontSize: 10,
    color: "#374151",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  price: {
    fontSize: 18,
    color: "#1f2937",
  },
  originalPrice: {
    fontSize: 13,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
  },
  discount: {
    fontSize: 12,
    color: "#22C55E",
  },

  // Learn More Section
  learnMoreSection: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 20,
  },
  learnMoreCard: {
    borderRadius: 20,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#BF7BB9",
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
      android: { elevation: 4, shadowColor: "#BF7BB9" },
    }),
  },
  learnMoreTitle: {
    fontSize: 18,
    color: "#1A237E",
    marginBottom: 14,
  },
  learnMoreDescCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },
  learnMoreDescText: {
    fontSize: 13,
    color: "#374151",
    lineHeight: 19,
  },
  learnMoreSubRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  learnMoreSubCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
  },
  learnMoreSubCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  learnMoreIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  learnMoreSubLabel: {
    fontSize: 10,
    color: "#6B7280",
    lineHeight: 14,
    marginBottom: 4,
  },
  learnMoreSubValue: {
    fontSize: 11,
    color: "#1f2937",
    lineHeight: 15,
  },
  learnMoreFullCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 14,
  },
  learnMoreFullCardInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  learnMoreFullLabel: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 6,
    marginBottom: 2,
  },
  learnMoreFullValue: {
    fontSize: 12,
    color: "#1f2937",
    lineHeight: 17,
  },

  // Popular Packages
  popularSection: {
    marginTop: 24,
    paddingBottom: 20,
  },
  popularHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 12,
  },
  popularTitle: {
    fontSize: 16,
    color: "#1f2937",
  },
  viewAll: {
    fontSize: 13,
    color: "#22C55E",
  },
  packageList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  packageCard: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 0.67,
    backgroundColor: "#FCF6FF",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FFFFFF",
    ...Platform.select({
      ios: {
        shadowColor: "#3D136B",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
      },
      android: { elevation: 12, shadowColor: "#3D136B" },
    }),
  },
  packageTitle: {
    fontSize: 11,
    color: "#1A1A1A",
    marginBottom: 4,
    textAlign: "center",
  },
  packageDesc: {
    fontSize: 8,
    color: "#6D28D9",
    textAlign: "center",
    lineHeight: 10,
    marginBottom: 8,
  },
  packagePrice: {
    fontSize: 14,
    color: "#000000",
  },
  packageArrowBtn: {
    position: "absolute",
    top: "38%",
    right: -10,
    width: 21,
    height: 21,
    borderRadius: 10.5,
    borderWidth: 1,
    borderColor: "#E2D3FE",
    backgroundColor: "#F1E7FE",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: { elevation: 3 },
    }),
  },


  // Bottom Bar
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: Platform.OS === "ios" ? 32 : 18,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },
  totalLabel: {
    fontSize: 12,
    color: "#6B7280",
    letterSpacing: 0.3,
  },
  totalPrice: {
    fontSize: 24,
    color: "#1e293b",
    letterSpacing: -0.3,
    marginTop: 2,
  },
  bookTestBtnWrap: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#9914F9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  bookTestBtn: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  bookTestBtnText: {
    color: "#fff",
    fontSize: 15,
    letterSpacing: 0.3,
  },

  // Patient Details Bottom Sheet
  sheetOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.25)",
    zIndex: 1,
  },
  sheetContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 16,
    zIndex: 2,
  },
  trayHandle: {
    alignItems: "center",
    paddingTop: 14,
    paddingBottom: 12,
    cursor: "pointer",
  },
  trayHandleBar: {
    width: 48,
    height: 5,
    backgroundColor: "rgba(109,40,217,0.25)",
    borderRadius: 999,
  },
  sheetGradient: {
    paddingTop: 8,
    paddingHorizontal: 22,
    paddingBottom: Platform.OS === "ios" ? 40 : 28,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  sheetBackBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(124,58,237,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 18,
  },
  sheetTitle: {
    fontSize: 20,
    color: "#1e293b",
    letterSpacing: -0.2,
  },
  sheetSubtitle: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 18,
    lineHeight: 20,
  },
  sheetProfileCard: {
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: "rgba(255,255,255,0.8)",
    padding: 16,
    marginBottom: 22,
    shadowColor: "#BF7BB9",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
    overflow: "hidden",
  },
  sheetProfileRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarOuterRing: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    padding: 2,
  },
  avatarWhiteRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
  },
  avatarGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 18,
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  sheetProfileInfo: {
    flex: 1,
  },
  sheetProfileName: {
    fontSize: 17,
    color: "#1F2937",
    marginBottom: 5,
  },
  sheetTagsRow: {
    flexDirection: "row",
    gap: 6,
  },
  sheetTag: {
    backgroundColor: "#F5F3FF",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E9D5FF",
  },
  sheetTagText: {
    fontSize: 11,
    color: "#7C3AED",
  },
  sheetDropdownIcon: {
    padding: 8,
    backgroundColor: "#F1E7FE",
    borderRadius: 20,
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  bookSlotBtnWrap: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#9914F9",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  bookSlotBtn: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  bookSlotBtnText: {
    color: "#fff",
    fontSize: 16,
    letterSpacing: 0.4,
  },

  // Slot Selection Bottom Sheet
  slotSheetContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
    maxHeight: "92%",
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 16,
    zIndex: 2,
  },
  slotSheetGradient: {
    paddingTop: 8,
    paddingHorizontal: 22,
    paddingBottom: Platform.OS === "ios" ? 40 : 28,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  slotAddressCard: {
    backgroundColor: "#FBF1FE",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)",
    shadowColor: "#BF7BB9",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 5,
  },
  slotDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 10,
  },
  slotAddressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  slotAddressTitle: {
    fontSize: 15,
    color: "#1F2937",
  },
  slotChangeText: {
    fontSize: 13,
    color: "#6D28D9",
  },
  slotAddressLine1: {
    fontSize: 13,
    color: "#1F2937",
    marginBottom: 2,
  },
  slotAddressLine2: {
    fontSize: 12,
    color: "#6B7280",
  },
  slotPickerCard: {
    backgroundColor: "#FBF1FE",
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)",
    shadowColor: "#BF7BB9",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 5,
  },
  slotPickerTitle: {
    fontSize: 15,
    color: "#1F2937",
    marginBottom: 2,
  },
  slotDayRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  slotDayPill: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 0.6,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  slotDayPillActive: {
    backgroundColor: "#F8DFFF",
    borderColor: "#FFFFFF",
    shadowColor: "#BF7BB9",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  slotDayLabel: {
    fontSize: 12,
    color: "#374151",
  },
  slotDayLabelActive: {
    color: "#7C3AED",
  },
  slotDaySlots: {
    fontSize: 10,
    color: "#9CA3AF",
    marginTop: 2,
  },
  slotDaySlotsActive: {
    color: "#7C3AED",
  },
  slotPeriodRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },
  slotPeriodPill: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 0.6,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  slotPeriodPillActive: {
    backgroundColor: "#F8DFFF",
    borderColor: "#FFFFFF",
    shadowColor: "#BF7BB9",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  slotPeriodText: {
    fontSize: 12,
    color: "#374151",
  },
  slotPeriodTextActive: {
    color: "#7C3AED",
  },
  slotTimesContainer: {
    gap: 16,
  },
  slotTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  slotRadioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },
  slotRadioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#7C3AED",
  },
  slotTimeText: {
    fontSize: 14,
    color: "#1F2937",
  },
  slotContinueBtnWrap: {
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 12,
    shadowColor: "#9914F9",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  slotContinueBtn: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  slotContinueBtnText: {
    color: "#fff",
    fontSize: 16,
    letterSpacing: 0.4,
  },

  // ---- Info Bottom Sheet ----
  infoSheetContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  infoSheetGradient: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 0,
    paddingBottom: Platform.OS === "ios" ? 40 : 28,
    maxHeight: height * 0.72,
    shadowColor: "#a78bfa",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 12,
  },
  infoSheetScroll: {
    paddingHorizontal: 22,
  },
  infoHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    marginTop: 2,
  },
  infoIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  infoTitle: {
    fontSize: 19,
    color: "#1f2937",
    flex: 1,
  },
  infoSectionCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    shadowColor: "#c4b5fd",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 3,
  },
  infoSectionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 10,
  },
  infoSectionDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  infoSectionHeading: {
    fontSize: 15,
    color: "#1f2937",
  },
  infoSectionDesc: {
    fontSize: 13.5,
    color: "#4B5563",
    lineHeight: 21,
    paddingLeft: 19,
  },
  infoCloseBtnWrap: {
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 10,
    marginBottom: 12,
    marginHorizontal: 4,
  },
  infoCloseBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
  },
  infoCloseBtnText: {
    color: "#fff",
    fontSize: 16,
    letterSpacing: 0.3,
  },
});

export default TestDetails;
