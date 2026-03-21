import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image,
  Animated,
  Easing,
  ScrollView,
  Alert,
} from "react-native";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome5,
  Ionicons,
  Entypo,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Text } from "../Components/TextWrapper";
import { getBookings, updateBookingStatus } from "./BookingStore";

const { width } = Dimensions.get("window");

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  NAVBAR CONSTANTS (same as Hyperlab.jsx)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const TAB_COUNT = 5;
const TAB_WIDTH = width / TAB_COUNT;
const ACTIVE_ICON_SIZE = 66;
const INACTIVE_ICON_SIZE = 40;
const NOTCH_RADIUS = ACTIVE_ICON_SIZE / 2 + 25;
const NOTCH_DEPTH = 40;
const NAV_HEIGHT = 70;
const ICON_FLOAT = -32;

const getPath = (indexValue) => {
  const center = indexValue * TAB_WIDTH + TAB_WIDTH / 2;
  return `
    M0,0
    L${center - NOTCH_RADIUS},0
    C${center - NOTCH_RADIUS + 20},0
      ${center - NOTCH_RADIUS / 2},${NOTCH_DEPTH}
      ${center},${NOTCH_DEPTH}
    C${center + NOTCH_RADIUS / 2},${NOTCH_DEPTH}
      ${center + NOTCH_RADIUS - 20},0
      ${center + NOTCH_RADIUS},0
    L${width},0
    L${width},${NAV_HEIGHT}
    L0,${NAV_HEIGHT}
    Z
  `;
};

const NAV_ITEMS = [
  { label: "Home", route: "HyperTask", icon: "home", lib: Entypo },
  {
    label: "Lab Test",
    route: "LabTest",
    icon: "test-tube",
    lib: MaterialCommunityIcons,
  },
  {
    label: "Speciality",
    route: "Speciality",
    icon: "grid",
    lib: MaterialCommunityIcons,
  },
  {
    label: "History",
    route: "LabHistory",
    icon: "clipboard-text-outline",
    lib: MaterialCommunityIcons,
  },
  { label: "Profile", route: "Profile", icon: "user-alt", lib: FontAwesome5 },
];

// ━━━━━ Icon / Nav helpers ━━━━━
const IconWrapper = ({ isFocused, children }) => (
  <View style={[styles.iconHolder, isFocused && styles.iconHolderActive]}>
    {isFocused ? (
      <View style={styles.activeOuterBuffer}>
        <LinearGradient
          colors={["#6ea6e7", "#daeffe", "#e0d3ff"]}
          style={styles.activeCircle}
        >
          {children}
        </LinearGradient>
      </View>
    ) : (
      <View style={styles.inactiveCircle}>{children}</View>
    )}
  </View>
);

const CustomTabIcon = ({ item, isFocused }) => {
  const color = isFocused ? "#5b3cc4" : "#7f8c8d";
  const IconLib = item.lib;
  if (IconLib) {
    return (
      <IconWrapper isFocused={isFocused}>
        <IconLib name={item.icon} size={22} color={color} />
      </IconWrapper>
    );
  }
  return null;
};

const NavItem = ({ item, isFocused, onPress }) => (
  <TouchableOpacity
    style={styles.tabContainer}
    activeOpacity={0.8}
    onPress={onPress}
  >
    <CustomTabIcon item={item} isFocused={isFocused} />
    <Text
      weight={isFocused ? "900" : "500"}
      style={[
        styles.label,
        isFocused ? styles.activeLabel : styles.inactiveLabel,
      ]}
    >
      {item.label}
    </Text>
  </TouchableOpacity>
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  TABS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const TABS = ["Upcoming", "Completed", "Cancelled"];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  BOOKING CARD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const STATUS_MAP = ["upcoming", "completed", "cancelled"];

const STATUS_COLORS = {
  upcoming: { badge: ["#F97316", "#EA580C"], text: "#F97316" },
  completed: { badge: ["#22C55E", "#16A34A"], text: "#16A34A" },
  cancelled: { badge: ["#EF4444", "#DC2626"], text: "#DC2626" },
};

const SAMPLE_DATA = {
  "Diabetes Screening (HbAIC & Fasting Sugar)": {
    icon: "flask-outline",
    title: "Diabetes Screening – Sample Info",
    color: "#7C3AED",
    bg: "#EDE9FE",
    sections: [
      {
        heading: "Blood Sample (Fasting)",
        desc: "A 3-5 ml venous blood sample is drawn after 8-12 hours of fasting. Only plain water is allowed before the test.",
      },
      {
        heading: "HbA1c – No Fasting Needed",
        desc: "HbA1c measures your 3-month average blood sugar. This part does not require fasting and can be drawn any time.",
      },
      {
        heading: "Fasting Blood Sugar (FBS)",
        desc: "FBS measures your current glucose level after an overnight fast. Avoid tea, coffee, juice, and smoking before collection.",
      },
      {
        heading: "Home Collection Available",
        desc: "Our certified phlebotomist will visit your address between 6 AM – 10 AM. Keep your Aadhaar/ID ready. Reports delivered within 15 hrs.",
      },
    ],
  },
  "Thyroid Profile (T3, T4, TSH)": {
    icon: "flask-outline",
    title: "Thyroid Profile – Sample Info",
    color: "#0891B2",
    bg: "#CFFAFE",
    sections: [
      {
        heading: "Blood Sample",
        desc: "A 3 ml venous blood sample is drawn from your arm. No fasting is required for this test.",
      },
      {
        heading: "Best Time for Collection",
        desc: "TSH levels peak early morning. Sample collection between 7 AM – 9 AM gives the most accurate results.",
      },
      {
        heading: "Medication Note",
        desc: "If you are on thyroid medication (Thyroxine), take your sample before your morning dose for accurate readings.",
      },
      {
        heading: "Home Collection Available",
        desc: "Our phlebotomist will collect the sample at your doorstep. Reports are typically available within 12-24 hrs.",
      },
    ],
  },
  "Complete Blood Count (CBC)": {
    icon: "flask-outline",
    title: "CBC – Sample Info",
    color: "#DC2626",
    bg: "#FEE2E2",
    sections: [
      {
        heading: "Blood Sample (EDTA Tube)",
        desc: "A 2-3 ml blood sample is collected in a purple-top EDTA tube. This test measures RBC, WBC, platelets, and hemoglobin.",
      },
      {
        heading: "No Fasting Required",
        desc: "You can eat and drink normally before the test. Hydration actually helps with easier blood draw.",
      },
      {
        heading: "What It Detects",
        desc: "Screens for anemia, infections, clotting disorders, immune deficiencies, and blood cancers like leukemia.",
      },
      {
        heading: "Home Collection Available",
        desc: "Sample collected at home with results delivered within 6-8 hours on the same day.",
      },
    ],
  },
  "Lipid Profile": {
    icon: "flask-outline",
    title: "Lipid Profile – Sample Info",
    color: "#EA580C",
    bg: "#FFF7ED",
    sections: [
      {
        heading: "Blood Sample (Fasting)",
        desc: "A 3 ml fasting blood sample is required. Fast for 9-12 hours before collection — water is fine.",
      },
      {
        heading: "What It Measures",
        desc: "Total Cholesterol, LDL (bad), HDL (good), Triglycerides, and VLDL. Essential for heart disease risk assessment.",
      },
      {
        heading: "Pre-Test Instructions",
        desc: "Avoid alcohol for 24 hrs and fatty meals the night before. Continue regular medications unless advised otherwise.",
      },
      {
        heading: "Home Collection Available",
        desc: "Early morning home collection recommended (6 AM – 9 AM). Reports within 12-15 hrs.",
      },
    ],
  },
  _default: {
    icon: "flask-outline",
    title: "Sample Collection Details",
    color: "#7C3AED",
    bg: "#EDE9FE",
    sections: [
      {
        heading: "Blood Sample",
        desc: "A small blood sample (3-5 ml) is drawn from a vein in your arm using a sterile syringe. Process takes under 2 minutes.",
      },
      {
        heading: "Urine Sample",
        desc: "A mid-stream urine sample may be required in a sterile container provided at the time of collection.",
      },
      {
        heading: "Fasting Instructions",
        desc: "Some tests require 8-12 hours of fasting. Only water is allowed. Avoid heavy meals the night before.",
      },
      {
        heading: "Home Collection Available",
        desc: "Our certified phlebotomist visits your address at the scheduled time. Keep Aadhaar/ID ready for verification.",
      },
    ],
  },
};

const BookingCard = ({
  booking,
  onCancel,
  onComplete,
  onSamplePress,
  navigation,
}) => {
  const colors = STATUS_COLORS[booking.status] || STATUS_COLORS.upcoming;

  const DetailLine = ({ icon, label, value }) => (
    <View style={styles.detailLine}>
      <MaterialCommunityIcons name={icon} size={16} color="#7C3AED" />
      <Text weight="600" style={styles.detailLabel}>
        {label}
      </Text>
      <Text weight="400" style={styles.detailValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );

  return (
    <View style={styles.bookingCard}>
      {/* Date badge + test title */}
      <View style={styles.cardHeader}>
        <LinearGradient
          colors={colors.badge}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.dateBadge}
        >
          <MaterialCommunityIcons
            name="calendar-clock"
            size={13}
            color="#fff"
          />
          <Text weight="600" style={styles.dateBadgeText}>
            {booking.date}
          </Text>
        </LinearGradient>

        <View style={styles.statusChip}>
          <View style={[styles.statusDot, { backgroundColor: colors.text }]} />
          <Text
            weight="600"
            style={[styles.statusChipText, { color: colors.text }]}
          >
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Text>
        </View>
      </View>

      <Text weight="700" style={styles.testTitle}>
        {booking.testTitle}
      </Text>

      {/* Details */}
      <View style={styles.detailsBlock}>
        <DetailLine
          icon="account"
          label="Patient:"
          value={booking.patientName}
        />
        <DetailLine icon="phone" label="Contact:" value={booking.contact} />
        <DetailLine
          icon="map-marker"
          label="Address:"
          value={booking.address}
        />
        <DetailLine icon="clock-outline" label="Time:" value={booking.time} />
      </View>

      {/* Sample Collection Tappable */}
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.sampleCollectionRow}
        onPress={() => {
          if (onSamplePress) onSamplePress(booking);
        }}
      >
        <View style={styles.sampleCollectionLeft}>
          <View style={styles.sampleIconWrap}>
            <Ionicons name="flask-outline" size={18} color="#7C3AED" />
          </View>
          <View>
            <Text weight="600" style={styles.sampleCollectionTitle}>
              Sample Collection
            </Text>
            <Text weight="400" style={styles.sampleCollectionSub}>
              Tap to view collection details
            </Text>
          </View>
        </View>
        <MaterialIcons name="chevron-right" size={22} color="#7C3AED" />
      </TouchableOpacity>

      {/* Payment & Report Status */}
      <View style={styles.statusRow}>
        <View style={styles.statusItem}>
          <Text weight="500" style={styles.statusLabel}>
            Payment
          </Text>
          <View style={styles.paidBadge}>
            <Ionicons name="checkmark-circle" size={14} color="#16A34A" />
            <Text weight="600" style={styles.paidText}>
              {booking.paymentStatus || "Paid"}
            </Text>
          </View>
        </View>
        <View style={styles.statusItem}>
          <Text weight="500" style={styles.statusLabel}>
            Report Status
          </Text>
          <View
            style={[
              styles.reportBadge,
              { backgroundColor: colors.text + "18" },
            ]}
          >
            <Text
              weight="600"
              style={[styles.reportText, { color: colors.text }]}
            >
              {booking.reportStatus ||
                booking.status.charAt(0).toUpperCase() +
                  booking.status.slice(1)}
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.cardActions}>
        {booking.status === "upcoming" && (
          <>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.actionBtnOutline}
              onPress={() => onCancel(booking.id)}
            >
              <MaterialIcons name="cancel" size={16} color="#DC2626" />
              <Text
                weight="600"
                style={[styles.actionBtnText, { color: "#DC2626" }]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={{ flex: 1 }}
              onPress={() => onComplete(booking.id)}
            >
              <LinearGradient
                colors={["#22C55E", "#16A34A"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.actionBtnGradient}
              >
                <Ionicons name="checkmark-circle" size={16} color="#fff" />
                <Text weight="700" style={styles.actionBtnTextWhite}>
                  Mark Completed
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}
        {booking.status === "completed" && (
          <>
            <TouchableOpacity activeOpacity={0.8} style={{ flex: 1 }}>
              <LinearGradient
                colors={["#22C55E", "#16A34A"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.actionBtnGradient}
              >
                <MaterialCommunityIcons
                  name="rotate-3d-variant"
                  size={16}
                  color="#fff"
                />
                <Text weight="700" style={styles.actionBtnTextWhite}>
                  View in 360°
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.actionBtnOutline}
              onPress={() => navigation.navigate("LabTest")}
            >
              <MaterialIcons name="replay" size={16} color="#7C3AED" />
              <Text
                weight="600"
                style={[styles.actionBtnText, { color: "#7C3AED" }]}
              >
                Book Again
              </Text>
            </TouchableOpacity>
          </>
        )}
        {booking.status === "cancelled" && (
          <View style={styles.cancelledRow}>
            <View style={styles.refundBadge}>
              <MaterialIcons name="info-outline" size={14} color="#DC2626" />
              <Text weight="600" style={styles.refundText}>
                Refund Initiated
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.actionBtnOutline, { borderColor: "#7C3AED" }]}
              onPress={() => navigation.navigate("LabTest")}
            >
              <MaterialIcons name="replay" size={16} color="#7C3AED" />
              <Text
                weight="600"
                style={[styles.actionBtnText, { color: "#7C3AED" }]}
              >
                Rebook
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  MAIN COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const LabHistory = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState(0);
  const [bookings, setBookings] = useState([]);
  const notchAnim = useRef(new Animated.Value(3)).current;
  const [indexState, setIndexState] = useState(3);

  // ── Sample Collection Tray (simple overlay, no Modal) ──
  const [sampleTrayData, setSampleTrayData] = useState(null);

  const openSampleTray = useCallback((booking) => {
    const key = booking?.testTitle || "_default";
    const data = SAMPLE_DATA[key] || SAMPLE_DATA._default;
    setSampleTrayData(data);
  }, []);

  const closeSampleTray = useCallback(() => {
    setSampleTrayData(null);
  }, []);

  useEffect(() => {
    const id = notchAnim.addListener(({ value }) => setIndexState(value));
    return () => notchAnim.removeListener(id);
  }, []);

  // Reload bookings every time this screen is focused
  const loadBookings = useCallback(async () => {
    const data = await getBookings();
    setBookings(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadBookings();
    }, [loadBookings]),
  );

  const handleCancel = (id) => {
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this booking?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            await updateBookingStatus(id, "cancelled");
            loadBookings();
          },
        },
      ],
    );
  };

  const handleComplete = async (id) => {
    await updateBookingStatus(id, "completed");
    loadBookings();
  };

  const handleNavigation = (routeName, idx) => {
    Animated.timing(notchAnim, {
      toValue: idx,
      duration: 350,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();

    try {
      if (routeName !== "LabHistory") {
        navigation.navigate(routeName);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const filteredBookings = bookings.filter(
    (b) => b.status === STATUS_MAP[activeTab],
  );

  return (
    <View style={styles.page}>
      {/* ── Header with Tabs at bottom border ── */}
      <View style={styles.headerWrapper}>
        <LinearGradient
          colors={["#E4CCF7", "#F2DAEA", "#FFE9CF"]}
          locations={[0, 0.5, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0.4 }}
          style={styles.header}
        >
          <View style={styles.navRow}>
            <TouchableOpacity
              style={styles.backBtn}
              activeOpacity={0.7}
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="arrow-back" size={26} color="#6D28D9" />
            </TouchableOpacity>
            <Text weight="700" style={styles.headerTitle}>
              Lab Test History
            </Text>
          </View>
        </LinearGradient>

        {/* ── Tab Pills – centered on header bottom border ── */}
        <View style={styles.tabRow}>
          {TABS.map((tab, idx) => {
            const isActive = idx === activeTab;
            const tabColors =
              idx === 2 ? ["#DC2626", "#B91C1C"] : ["#7C3AED", "#6D28D9"];
            return isActive ? (
              <LinearGradient
                key={tab}
                colors={tabColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.tabPill}
              >
                <Text weight="700" style={styles.tabTextActive}>
                  {tab}
                </Text>
              </LinearGradient>
            ) : (
              <TouchableOpacity
                key={tab}
                style={styles.tabPillInactive}
                activeOpacity={0.7}
                onPress={() => setActiveTab(idx)}
              >
                <Text weight="500" style={styles.tabTextInactive}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ── Content ── */}
      {filteredBookings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image
            source={require("../assets/Lab_History.webp")}
            style={styles.emptyImage}
            resizeMode="contain"
          />
          <Text weight="700" style={styles.emptyTitle}>
            Sorry, No Bookings Found
          </Text>
          <Text weight="400" style={styles.emptySubtitle}>
            You can start Booking a new Lab Test with our{"\n"}HyperLabs!
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.bookNowWrap}
            onPress={() => navigation.navigate("HyperTask")}
          >
            <LinearGradient
              colors={["#B148FF", "#F6339B", "#9914F9"]}
              locations={[0, 0.5, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.bookNowBtn}
            >
              <Text weight="700" style={styles.bookNowText}>
                Book Now
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={handleCancel}
              onComplete={handleComplete}
              onSamplePress={openSampleTray}
              navigation={navigation}
            />
          ))}
        </ScrollView>
      )}

      {/* ── Sample Collection Bottom Tray (absolute overlay) ── */}
      {sampleTrayData && (
        <View style={styles.trayOverlayWrap}>
          <TouchableOpacity
            style={styles.sheetOverlay}
            activeOpacity={1}
            onPress={closeSampleTray}
          />
          <View style={styles.infoSheetContainer}>
            <LinearGradient
              colors={["#E4CCF7", "#FFE9CF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.infoSheetGradient}
            >
              <View style={styles.trayHandle}>
                <View style={styles.trayHandleBar} />
              </View>

              <ScrollView
                style={styles.infoSheetScroll}
                showsVerticalScrollIndicator={false}
                bounces={true}
              >
                <View style={styles.infoHeaderRow}>
                  <View
                    style={[
                      styles.infoIconWrap,
                      { backgroundColor: sampleTrayData.bg },
                    ]}
                  >
                    <Ionicons
                      name={sampleTrayData.icon}
                      size={24}
                      color={sampleTrayData.color}
                    />
                  </View>
                  <Text weight="700" style={styles.infoTitle}>
                    {sampleTrayData.title}
                  </Text>
                </View>

                {sampleTrayData.sections.map((section, idx) => (
                  <View key={idx} style={styles.infoSectionCard}>
                    <View style={styles.infoSectionRow}>
                      <View
                        style={[
                          styles.infoSectionDot,
                          { backgroundColor: sampleTrayData.color },
                        ]}
                      />
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
                  onPress={closeSampleTray}
                >
                  <LinearGradient
                    colors={["#B148FF", "#F6339B", "#9914F9"]}
                    locations={[0, 0.5, 1]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.infoCloseBtn}
                  >
                    <Text weight="700" style={styles.infoCloseBtnText}>
                      Got It
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </ScrollView>
            </LinearGradient>
          </View>
        </View>
      )}

      {/* ── Bottom Navbar ── */}
      <View style={styles.navContainer}>
        <Svg width={width} height={NAV_HEIGHT} style={styles.svgWrap}>
          <Path
            d={getPath(indexState)}
            fill="#ffffff"
            stroke="#e2e2e2"
            strokeWidth={1}
          />
        </Svg>
        <View style={styles.navBar}>
          {NAV_ITEMS.map((item, idx) => (
            <NavItem
              key={item.route}
              item={item}
              isFocused={idx === 3}
              onPress={() => handleNavigation(item.route, idx)}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  STYLES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#FAFBFF",
  },

  /* Header wrapper to allow tabs to overlap */
  headerWrapper: {
    position: "relative",
    zIndex: 10,
    marginBottom: 20,
  },
  /* Header */
  header: {
    paddingTop: Platform.OS === "android" ? 44 : 54,
    paddingBottom: 30,
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
  headerTitle: {
    fontSize: 20,
    color: "#1f2937",
  },

  /* Tabs – positioned at the center of header bottom border */
  tabRow: {
    flexDirection: "row",
    marginHorizontal: 24,
    backgroundColor: "#F3F4F6",
    borderRadius: 30,
    padding: 4,
    position: "absolute",
    bottom: -18,
    left: 0,
    right: 0,
    elevation: 4,
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  tabPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  tabPillInactive: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  tabTextActive: {
    fontSize: 13,
    color: "#FFFFFF",
  },
  tabTextInactive: {
    fontSize: 13,
    color: "#6B7280",
  },

  /* Scroll area */
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: NAV_HEIGHT + 30,
  },

  /* Booking Card */
  bookingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F3E8FF",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  dateBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },
  dateBadgeText: {
    fontSize: 11,
    color: "#FFFFFF",
  },
  statusChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusChipText: {
    fontSize: 11,
  },
  testTitle: {
    fontSize: 15,
    color: "#1F2937",
    marginBottom: 12,
  },

  /* Detail lines */
  detailsBlock: {
    backgroundColor: "#FAFBFF",
    borderRadius: 10,
    padding: 10,
    gap: 8,
    marginBottom: 12,
  },
  detailLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailLabel: {
    fontSize: 12,
    color: "#6B7280",
    width: 60,
  },
  detailValue: {
    fontSize: 12,
    color: "#374151",
    flex: 1,
  },

  /* Status row */
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  statusItem: {
    gap: 4,
  },
  statusLabel: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  paidBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  paidText: {
    fontSize: 12,
    color: "#16A34A",
  },
  reportBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  reportText: {
    fontSize: 12,
  },

  /* Sample Collection Row */
  sampleCollectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F3FF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E9D5FF",
  },
  sampleCollectionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sampleIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
  },
  sampleCollectionTitle: {
    fontSize: 13,
    color: "#1F2937",
  },
  sampleCollectionSub: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 1,
  },

  /* Action buttons */
  cardActions: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  actionBtnOutline: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#FECACA",
  },
  actionBtnGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  actionBtnText: {
    fontSize: 12,
  },
  actionBtnTextWhite: {
    fontSize: 12,
    color: "#FFFFFF",
  },

  /* Cancelled row */
  cancelledRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  refundBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  refundText: {
    fontSize: 12,
    color: "#DC2626",
  },

  /* Empty State */
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingBottom: NAV_HEIGHT + 20,
  },
  emptyImage: {
    width: 220,
    height: 220,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    color: "#6D28D9",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  bookNowWrap: {
    borderRadius: 10,
    overflow: "hidden",
  },
  bookNowBtn: {
    paddingVertical: 12,
    paddingHorizontal: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  bookNowText: {
    color: "#FFFFFF",
    fontSize: 14,
  },

  /* ── Sample Tray (absolute overlay) ── */
  trayOverlayWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    elevation: 1000,
  },
  sheetOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  infoSheetContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  infoSheetGradient: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 0,
    paddingBottom: Platform.OS === "ios" ? 40 : 28,
    maxHeight: Dimensions.get("window").height * 0.72,
    shadowColor: "#a78bfa",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 12,
  },
  trayHandle: {
    alignItems: "center",
    paddingTop: 14,
    paddingBottom: 12,
  },
  trayHandleBar: {
    width: 48,
    height: 5,
    backgroundColor: "rgba(109,40,217,0.25)",
    borderRadius: 999,
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
    shadowOpacity: 0.1,
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

  /* ── Bottom Navbar ── */
  navContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: NAV_HEIGHT,
    elevation: 10,
    zIndex: 999,
  },
  svgWrap: {
    position: "absolute",
    top: 0,
  },
  navBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    height: NAV_HEIGHT,
    paddingBottom: 10,
  },
  tabContainer: {
    width: TAB_WIDTH,
    alignItems: "center",
  },
  iconHolder: {
    height: ACTIVE_ICON_SIZE + 20,
    width: ACTIVE_ICON_SIZE + 20,
    justifyContent: "center",
    alignItems: "center",
    top: ICON_FLOAT,
    backgroundColor: "transparent",
  },
  activeCircle: {
    height: ACTIVE_ICON_SIZE,
    width: ACTIVE_ICON_SIZE,
    borderRadius: ACTIVE_ICON_SIZE / 2,
    borderWidth: 3,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  inactiveCircle: {
    height: INACTIVE_ICON_SIZE,
    width: INACTIVE_ICON_SIZE,
    borderRadius: INACTIVE_ICON_SIZE / 2,
    justifyContent: "center",
    marginTop: 35,
    alignItems: "center",
  },
  activeOuterBuffer: {
    height: ACTIVE_ICON_SIZE + 12,
    width: ACTIVE_ICON_SIZE + 12,
    borderRadius: (ACTIVE_ICON_SIZE + 12) / 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  label: {
    fontSize: 13,
    marginTop: -35,
  },
  activeLabel: {
    color: "#3498db",
  },
  inactiveLabel: {
    color: "#535353ff",
  },
});

export default LabHistory;
