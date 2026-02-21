import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
  StatusBar,
  Platform,
  Animated,
  Easing,
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
import {
  useNavigation,
  useRoute,
  getFocusedRouteNameFromRoute,
} from "@react-navigation/native";
import { Text } from "../Components/TextWrapper"; // Adjust path if needed

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GLOBAL CONSTANTS & DIMENSIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const { width } = Dimensions.get("window");
const isTablet = width >= 768;
const moderateScale = (size, factor = 0.5) =>
  size + ((width / 375) * size - size) * factor;

const TAB_COUNT = 5;
const TAB_WIDTH = width / TAB_COUNT;
const ACTIVE_ICON_SIZE = 66;
const INACTIVE_ICON_SIZE = 40;
const NOTCH_RADIUS = ACTIVE_ICON_SIZE / 2 + 25;
const NOTCH_DEPTH = 40;
const NAV_HEIGHT = 70;
const ICON_FLOAT = -32;

// --- NAV PATH GENERATOR ---
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

// --- NAV ITEMS ---
const NAV_ITEMS = [
  { label: "HOME", route: "Home", icon: "home", lib: Entypo },
  {
    label: "SERVICES",
    route: "Services",
    icon: "dots-grid",
    lib: MaterialCommunityIcons,
  },
  {
    label: "360",
    route: "Health360",
    icon: "google-circles-extended",
    lib: MaterialCommunityIcons,
  },
  { label: "RECORDS", route: "Records", icon: "folder", lib: Entypo },
  { label: "PROFILE", route: "Profile", icon: "user-alt", lib: FontAwesome5 },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COMPONENT: GRADIENT BUTTON
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const GRADIENT_PRESETS = {
  pink: { colors: ["#B148FF", "#F6339B", "#9914F9"], locations: [0, 0.5, 1] },
  blue: { colors: ["#486DFF", "#0FABF8", "#486DFF"], locations: [0, 0.5, 1] },
};

const GradientButton = ({
  title,
  onPress,
  variant = "pink",
  style,
  textStyle,
  disabled = false,
  icon,
  iconPosition = "right",
  size = "medium",
}) => {
  const gradientConfig = GRADIENT_PRESETS[variant] || GRADIENT_PRESETS.pink;
  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return { paddingVertical: 8, paddingHorizontal: 14, fontSize: 11 };
      case "large":
        return { paddingVertical: 16, paddingHorizontal: 24, fontSize: 16 };
      default:
        return {
          paddingVertical: 12,
          paddingHorizontal: 18,
          fontSize: isTablet ? 14 : 13,
        };
    }
  };
  const sz = getSizeStyles();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
      style={[btnStyles.container, style, disabled && { opacity: 0.6 }]}
    >
      <LinearGradient
        colors={gradientConfig.colors}
        locations={gradientConfig.locations}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          btnStyles.gradient,
          {
            paddingVertical: sz.paddingVertical,
            paddingHorizontal: sz.paddingHorizontal,
          },
        ]}
      >
        {icon && iconPosition === "left" && icon}
        <Text
          weight="700"
          style={[btnStyles.text, { fontSize: sz.fontSize }, textStyle]}
          numberOfLines={1}
        >
          {title}
        </Text>
        {icon && iconPosition === "right" && icon}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const btnStyles = StyleSheet.create({
  container: { borderRadius: 10, overflow: "hidden" },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  text: { color: "#FFFFFF", fontWeight: "700", letterSpacing: 0.3 },
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// IMAGE ASSETS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const IMAGES = {
  bloodTest: require("../assets/1.webp"),
  diabetes: require("../assets/4.webp"),
  genetic: require("../assets/6.webp"),
  mobRep: require("../assets/MobRep.webp"),
  viewInsight: require("../assets/ViewInsight.webp"),
  shareRepo: require("../assets/ShareRepo.webp"),
  doctors: require("../assets/Doctors.webp"),
  labsFeatures: require("../assets/Labs Features.png"),
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DASHBOARD SECTIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const HeaderSection = () => {
  const navigation = useNavigation();
  return (
  <View style={s.headerWrap}>
    <LinearGradient
      colors={["#E4CCF7", "#F2DAEA", "#FFE9CF"]}
      locations={[0, 0.5, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.92, y: 0.39 }}
      style={StyleSheet.absoluteFillObject}
    />
    <LinearGradient
      colors={["transparent", "transparent", "#FAFBFF"]}
      locations={[0, 0.65, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={StyleSheet.absoluteFillObject}
    />
    <View style={s.headerRow}>
      <TouchableOpacity style={s.backBtn} activeOpacity={0.7}>
        <MaterialIcons
          name="arrow-back"
          size={26}
          color="#553FB5"
          style={{ fontWeight: "900" }}
        />
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <Text weight="700" style={s.brandName}>
          HyperLabs
        </Text>
        <Text weight="400" style={s.brandTag}>
          Smart diagnostics, made effortless.
        </Text>
      </View>
    </View>
    <View style={s.heroRow}>
      <View style={s.heroLeft}>
        <Text weight="700" style={s.heroHeading}>
          <Text weight="700" style={{ color: "#6D28D9" }}>
            Fast, safe &
          </Text>
          {"\n"}
          <Text weight="700" style={{ color: "#6D28D9" }}>
            verified{" "}
          </Text>
          {/* Diagnostics text color changed to match #6D28D9 */}
          <Text weight="700" style={{ color: "#6D28D9" }}>
            diagnostics.
          </Text>
        </Text>
        <Text weight="400" style={s.heroPara}>
          Book verified lab tests and receive{"\n"}digital reports securely
          without hassle.
        </Text>
        <GradientButton
          title="View Lab Test"
          variant="pink"
          onPress={() => navigation.navigate("LabTest")}
          size="medium"
          style={s.heroBtn}
        />
      </View>
      <View style={s.heroRight}>
        <Image source={IMAGES.doctors} style={s.heroImg} resizeMode="contain" />
      </View>
    </View>
  </View>
);
};

const QUICK_TESTS = [
  {
    id: "1",
    title: "Blood Test",
    image: IMAGES.bloodTest,
    titleColor: "#1a1a2e",
  },
  {
    id: "2",
    title: "Diabetes Monitoring",
    image: IMAGES.diabetes,
    titleColor: "#DC2626",
  },
  {
    id: "3",
    title: "Genetic Tests",
    image: IMAGES.genetic,
    titleColor: "#1a1a2e",
  },
];

const QuickTestSection = () => (
  <View style={s.section}>
    <Text weight="700" style={s.sectionTitle}>
      Quick Test
    </Text>
    <View style={s.quickTestRow}>
      {QUICK_TESTS.map((t) => (
        <TouchableOpacity key={t.id} style={s.qtCard} activeOpacity={0.7}>
          <View style={s.qtImgWrap}>
            <Image source={t.image} style={s.qtImg} resizeMode="cover" />
          </View>
          <Text weight="600" style={[s.qtLabel, { color: t.titleColor }]}>
            {t.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const QUICK_ACTIONS = [
  {
    id: "1",
    title: "View Lab Reports",
    desc: "Open test reports, download PDFs.",
    image: IMAGES.mobRep,
    gradient: {
      colors: ["#CDE8FF", "#FFF8EF", "#CDE8FF"],
      locations: [0.1392, 0.5067, 0.8743],
      start: { x: 0.3, y: 0 },
      end: { x: 0.7, y: 1 },
    },
  },
  {
    id: "2",
    title: "View Insights",
    desc: "Understand your report with trends.",
    image: IMAGES.viewInsight,
    gradient: {
      colors: ["#FFE9CA", "#FFF8EF", "#FFE9CA"],
      locations: [0.1392, 0.5067, 0.8743],
      start: { x: 0.3, y: 0 },
      end: { x: 0.7, y: 1 },
    },
  },
  {
    id: "3",
    title: "Share Reports",
    desc: "Send lab reports directly.",
    image: IMAGES.shareRepo,
    gradient: {
      colors: ["#FFD3CA", "#FFF8EF", "#FFD3CA"],
      locations: [0.1392, 0.5067, 0.8743],
      start: { x: 0.3, y: 0 },
      end: { x: 0.7, y: 1 },
    },
  },
];

const QuickActionsSection = () => (
  <View style={s.section}>
    <Text weight="700" style={s.sectionTitleLight}>
      Quick Actions
    </Text>
    <View style={s.qaRow}>
      {QUICK_ACTIONS.map((a) => (
        <TouchableOpacity
          key={a.id}
          style={[s.qaCard, !a.gradient && { backgroundColor: a.bg }]}
          activeOpacity={0.7}
        >
          {a.gradient && (
            <LinearGradient
              colors={a.gradient.colors}
              locations={a.gradient.locations}
              start={a.gradient.start}
              end={a.gradient.end}
              style={StyleSheet.absoluteFillObject}
            />
          )}

          <View
            style={[
              s.qaImgWrap,
              a.id === "1" && s.qaImgWrapLabReport,
              a.id === "2" && s.qaImgWrapSpecial,
              a.id === "3" && s.qaImgWrapShareRepo,
            ]}
          >
            <Image
              source={a.image}
              style={[
                s.qaImg,
                a.id === "1" && s.qaImgLabReport,
                a.id === "2" && s.qaImgSpecial,
                a.id === "3" && s.qaImgShareRepo,
              ]}
              resizeMode="contain"
            />
          </View>

          <Text weight="700" style={s.qaTitle}>
            {a.title}
          </Text>
          <Text weight="400" style={s.qaDesc}>
            {a.desc}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const UploadPrescriptionSection = () => {
  const navigation = useNavigation();
  return (
  <View style={s.uploadOuter}>
    <LinearGradient
      colors={["#CDE8FF", "#FFF8EF", "#CDE8FF"]}
      locations={[0.1392, 0.5067, 0.8743]}
      start={{ x: 0.34, y: 0.03 }}
      end={{ x: 0.66, y: 0.97 }}
      style={s.uploadGrad}
    >
      <View style={s.uploadLeft}>
        <Text weight="700" style={s.uploadHeading}>
          Upload Your Prescription
        </Text>
        <Text weight="400" style={s.uploadPara}>
          Share your doctor's prescription for{"\n"}personalized test
          suggestions.
        </Text>
        <GradientButton
          title="Upload Now"
          variant="blue"
          onPress={() => navigation.navigate("UploadImage")}
          size="medium"
          style={s.uploadBtn}
        />
        <Text weight="600" style={s.uploadFormats}>
          PDF / JPG / PNG Supported
        </Text>
      </View>
      <View style={s.uploadRight}>
        <View style={s.uploadPrescImgWrap}>
          <Image
            source={IMAGES.mobRep}
            style={s.uploadPrescImg}
            resizeMode="contain"
          />
        </View>
        <View style={s.uploadBadgeCol}>
          <View style={s.uploadBadge}>
            <View style={s.uploadBadgeIcon}>
              <FontAwesome5 name="user-friends" size={10} color="#3B82F6" />
            </View>
            <Text weight="600" style={s.uploadBadgeText}>
              One to One{"\n"}Conversation
            </Text>
          </View>
          <View style={s.uploadBadge}>
            <View style={s.uploadBadgeIcon}>
              <Ionicons name="home" size={12} color="#3B82F6" />
            </View>
            <Text weight="600" style={s.uploadBadgeText}>
              Your Data{"\n"}will be Private
            </Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  </View>
  );
};

const PACKAGES = [
  {
    id: "1",
    name: "Full Body Checkup",
    desc: "A complete yearly health\nscreen",
    price: "1599/-",
  },
  {
    id: "2",
    name: "Full Body Checkup",
    desc: "A complete yearly health\nscreen",
    price: "1599/-",
  },
  {
    id: "3",
    name: "Full Body Checkup",
    desc: "A complete yearly health\nscreen",
    price: "1599/-",
  },
];

// --- CONTINUOUS AUTO-SCROLLING PACKAGES ---
const PopularPackagesSection = () => {
  const scrollViewRef = useRef(null);
  const scrollX = useRef(0);
  const animationFrameId = useRef(null);
  const isInteracting = useRef(false);

  // Duplicating the array multiple times creates an infinite looping effect
  const DISPLAY_PACKAGES = [...PACKAGES, ...PACKAGES, ...PACKAGES, ...PACKAGES];

  // Calculate exact width of one full original set to know when to seamlessly reset
  const ITEM_WIDTH = moderateScale(126) + moderateScale(20); // card width + gap
  const RESET_POSITION = PACKAGES.length * ITEM_WIDTH;

  const animateScroll = () => {
    if (!isInteracting.current && scrollViewRef.current) {
      scrollX.current += 1; // Animation speed (1px per frame)

      // Loop seamlessly when we reach the end of the original set
      if (scrollX.current >= RESET_POSITION) {
        scrollX.current -= RESET_POSITION;
      }

      scrollViewRef.current.scrollTo({
        x: scrollX.current,
        animated: false, // Set to false to allow smooth frame-by-frame updates
      });
    }
    animationFrameId.current = requestAnimationFrame(animateScroll);
  };

  useEffect(() => {
    animationFrameId.current = requestAnimationFrame(animateScroll);
    return () => {
      if (animationFrameId.current)
        cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  return (
    <View style={s.ppSection}>
      <View style={s.ppHeader}>
        <Text weight="700" style={s.ppSectionTitle}>
          Popular Packages
        </Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text weight="600" style={s.ppViewAll}>
            View All
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.ppScrollContent}
        scrollEventThrottle={16}
        // Pause animation when the user is interacting with it manually
        onScrollBeginDrag={() => {
          isInteracting.current = true;
        }}
        onScrollEndDrag={(e) => {
          isInteracting.current = false;
          scrollX.current = e.nativeEvent.contentOffset.x;
        }}
        onMomentumScrollEnd={(e) => {
          isInteracting.current = false;
          scrollX.current = e.nativeEvent.contentOffset.x;
        }}
      >
        {DISPLAY_PACKAGES.map((pkg, index) => (
          <TouchableOpacity
            key={`${pkg.id}-${index}`}
            style={s.ppCard}
            activeOpacity={0.9}
          >
            <Text weight="700" style={s.ppCardName} numberOfLines={1}>
              {pkg.name}
            </Text>
            <Text weight="600" style={s.ppCardDesc}>
              {pkg.desc}
            </Text>
            <Text weight="800" style={s.ppCardPrice}>
              {pkg.price}
            </Text>
            <View style={s.ppRightArrowBtn}>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={14}
                color="#5C3EAB"
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NAV SUB-COMPONENTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const IconWrapper = ({ isFocused, children }) => (
  <View style={[s.iconHolder, isFocused && s.iconHolderActive]}>
    {isFocused ? (
      <View style={s.activeOuterBuffer}>
        <LinearGradient
          colors={["#6ea6e7", "#daeffe", "#e0d3ff"]}
          style={s.activeCircle}
        >
          {children}
        </LinearGradient>
      </View>
    ) : (
      <View style={s.inactiveCircle}>{children}</View>
    )}
  </View>
);

const CustomTabIcon = ({ item, isFocused }) => {
  const color = isFocused ? "#5b3cc4" : "#7f8c8d";
  const IconLib = item.lib;

  if (typeof item.icon === "number") {
    return (
      <IconWrapper isFocused={isFocused}>
        <Image
          source={item.icon}
          style={{
            width: 24,
            height: 24,
            tintColor: isFocused ? null : "#7f8c8d",
          }}
          resizeMode="contain"
        />
      </IconWrapper>
    );
  }

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
    style={s.tabContainer}
    activeOpacity={0.8}
    onPress={onPress}
  >
    <CustomTabIcon item={item} isFocused={isFocused} />
    <Text
      weight={isFocused ? "900" : "500"}
      style={[s.label, isFocused ? s.activeLabel : s.inactiveLabel]}
    >
      {item.label}
    </Text>
  </TouchableOpacity>
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN PAGE COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const HyperTask = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const notchAnim = useRef(new Animated.Value(0)).current;
  const [indexState, setIndexState] = useState(0);

  useEffect(() => {
    const id = notchAnim.addListener(({ value }) => setIndexState(value));
    return () => notchAnim.removeListener(id);
  }, []);

  useEffect(() => {
    const unsub = navigation.addListener("state", () => {
      const screen = getFocusedRouteNameFromRoute(route) || "Home";
      const newIndex = NAV_ITEMS.findIndex((i) => i.route === screen);
      const targetIndex = newIndex !== -1 ? newIndex : 0;

      Animated.timing(notchAnim, {
        toValue: targetIndex,
        duration: 350,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();
    });
    return unsub;
  }, [navigation, route]);

  const handleNavigation = (routeName) => {
    try {
      navigation.navigate(routeName);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={s.page}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <ScrollView
        style={s.scroll}
        contentContainerStyle={[
          s.scrollContent,
          { paddingBottom: NAV_HEIGHT + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <HeaderSection />
        <QuickTestSection />
        <QuickActionsSection />
        <UploadPrescriptionSection />
        <PopularPackagesSection />

        <View style={s.featuresContainer}>
          <Image
            source={IMAGES.labsFeatures}
            style={s.featuresImage}
            resizeMode="contain"
          />
        </View>
        <View style={{ height: moderateScale(30) }} />
      </ScrollView>
      <View style={s.navContainer}>
        <Svg width={width} height={NAV_HEIGHT} style={s.svgWrap}>
          <Path
            d={getPath(indexState)}
            fill="#ffffff"
            stroke="#e2e2e2"
            strokeWidth={1}
          />
        </Svg>
        <View style={s.navBar}>
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.route}
              item={item}
              isFocused={
                (getFocusedRouteNameFromRoute(route) || "Home") === item.route
              }
              onPress={() => handleNavigation(item.route)}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STYLES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#FAFBFF" },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: moderateScale(20) },
  headerWrap: {
    position: "relative",
    paddingTop: moderateScale(47),
    paddingBottom: moderateScale(16),
    overflow: "hidden",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: moderateScale(18),
    paddingRight: moderateScale(16),
    marginBottom: moderateScale(14),
  },
  backBtn: {
    width: moderateScale(30),
    height: moderateScale(30),
    opacity: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: moderateScale(10),
  },
  brandName: {
    fontSize: isTablet ? 22 : moderateScale(19),
    color: "#553FB5",
    letterSpacing: 0.2,
  },
  brandTag: {
    fontSize: isTablet ? 13 : moderateScale(11),
    color: "#6B7280",
    marginTop: 2,
  },
  heroRow: {
    flexDirection: "row",
    paddingHorizontal: moderateScale(16),
    alignItems: "center",
  },
  heroLeft: { flex: 1, paddingRight: moderateScale(4) },
  heroHeading: {
    fontSize: isTablet ? 24 : moderateScale(20),
    lineHeight: isTablet ? 32 : moderateScale(28),
    marginBottom: moderateScale(6),
    color: "#553FB5",
  },
  heroPara: {
    fontSize: isTablet ? 11 : moderateScale(10),
    color: "#6B7280",
    lineHeight: isTablet ? 16 : moderateScale(15),
    marginBottom: moderateScale(12),
  },
  heroBtn: {
    borderRadius: moderateScale(10),
    overflow: "hidden",
    alignSelf: "flex-start",
  },
  heroRight: {
    width: moderateScale(140),
    height: moderateScale(155),
    alignItems: "center",
    justifyContent: "center",
  },
  heroImg: { width: "100%", height: "100%" },
  section: {
    paddingHorizontal: moderateScale(16),
    marginTop: moderateScale(18),
  },
  sectionTitle: {
    fontSize: isTablet ? 17 : moderateScale(15),
    color: "#553FB5",
    marginBottom: moderateScale(10),
  },
  sectionTitleLight: {
    fontSize: isTablet ? 17 : moderateScale(15),
    color: "#553FB5",
    marginBottom: moderateScale(10),
  },
  quickTestRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: moderateScale(10),
  },
  qtCard: { flex: 1, alignItems: "center" },
  qtImgWrap: {
    width: "100%",
    height: moderateScale(82),
    borderRadius: moderateScale(14),
    overflow: "hidden",
    backgroundColor: "#F3F4F6",
    marginBottom: moderateScale(6),
    ...Platform.select({
      ios: {
        shadowColor: "rgba(37,0,84,0.12)",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: { elevation: 3 },
    }),
  },
  qtImg: { width: "100%", height: "100%" },
  qtLabel: { fontSize: isTablet ? 11 : moderateScale(10), textAlign: "center" },

  // --- QUICK ACTIONS STYLES ---
  qaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: moderateScale(17),
  },
  qaCard: {
    width: moderateScale(99),
    height: moderateScale(106),
    opacity: 1,
    borderRadius: moderateScale(14),
    borderWidth: 1,
    borderColor: "#FFFFFF",
    overflow: "hidden",
    position: "relative",
    ...Platform.select({
      ios: {
        shadowColor: "rgba(37,0,84,0.08)",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
      },
      android: { elevation: 2 },
    }),
  },
  qaImgWrap: {
    width: moderateScale(38),
    height: moderateScale(38),
    alignItems: "center",
    justifyContent: "center",
  },
  qaImg: {
    width: "100%",
    height: "100%",
  },

  qaImgWrapLabReport: {
    position: "absolute",
    top: moderateScale(8),
    left: moderateScale(37),
    width: moderateScale(31.2),
    height: moderateScale(57.2),
    marginBottom: 0,
  },
  qaImgLabReport: {
    width: "100%",
    height: "100%",
    opacity: 1,
  },

  qaImgWrapSpecial: {
    position: "absolute",
    top: moderateScale(3),
    left: moderateScale(3),
    width: moderateScale(96),
    height: moderateScale(66),
    marginBottom: 0,
  },
  qaImgSpecial: {
    width: moderateScale(96),
    height: moderateScale(66),
    opacity: 1,
  },

  qaImgWrapShareRepo: {
    position: "absolute",
    top: moderateScale(9),
    left: moderateScale(33),
    width: moderateScale(45.4),
    height: moderateScale(57),
    marginBottom: 0,
  },
  qaImgShareRepo: {
    width: "100%",
    height: "100%",
    opacity: 1,
  },

  qaTitle: {
    position: "absolute",
    top: moderateScale(66),
    left: moderateScale(10),
    width: moderateScale(79),
    height: moderateScale(13),
    opacity: 1,
    fontSize: isTablet ? 10 : moderateScale(9),
    color: "#1a1a2e",
    textAlign: "center",
  },
  qaDesc: {
    position: "absolute",
    top: moderateScale(81),
    left: moderateScale(8),
    width: moderateScale(84),
    height: moderateScale(14),
    opacity: 1,
    fontSize: isTablet ? 7 : moderateScale(6.5),
    color: "#6B7280",
    textAlign: "center",
    lineHeight: isTablet ? 10 : moderateScale(8.5),
  },

  uploadOuter: {
    paddingHorizontal: moderateScale(16),
    marginTop: moderateScale(20),
  },
  uploadGrad: {
    borderRadius: moderateScale(18),
    padding: moderateScale(16),
    flexDirection: "row",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  uploadLeft: { flex: 1, paddingRight: moderateScale(6) },
  uploadHeading: {
    fontSize: isTablet ? 18 : moderateScale(16),
    color: "#1e3a8a",
    marginBottom: moderateScale(5),
    lineHeight: isTablet ? 24 : moderateScale(21),
  },
  uploadPara: {
    fontSize: isTablet ? 10 : moderateScale(9.5),
    color: "#4B5563",
    lineHeight: isTablet ? 15 : moderateScale(14),
    marginBottom: moderateScale(12),
  },
  uploadBtn: {
    borderRadius: moderateScale(10),
    overflow: "hidden",
    alignSelf: "flex-start",
    marginBottom: moderateScale(8),
  },
  uploadFormats: {
    fontSize: isTablet ? 8 : moderateScale(7.5),
    color: "#6B7280",
    marginTop: moderateScale(2),
  },
  uploadRight: {
    width: moderateScale(120),
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(5),
  },
  uploadPrescImgWrap: {
    width: moderateScale(50),
    height: moderateScale(80),
    alignItems: "center",
    justifyContent: "center",
  },
  uploadPrescImg: { width: "100%", height: "100%" },
  uploadBadgeCol: { flex: 1, gap: moderateScale(7) },
  uploadBadge: {
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(10),
    paddingVertical: moderateScale(6),
    paddingHorizontal: moderateScale(4),
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
    }),
  },
  uploadBadgeIcon: {
    width: moderateScale(20),
    height: moderateScale(20),
    borderRadius: moderateScale(6),
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: moderateScale(2),
  },
  uploadBadgeText: {
    fontSize: isTablet ? 7 : moderateScale(6),
    color: "#374151",
    textAlign: "center",
    lineHeight: isTablet ? 10 : moderateScale(8.5),
  },

  // --- STYLES FOR POPULAR PACKAGES ---
  ppSection: {
    marginTop: moderateScale(24),
    backgroundColor: "#FFFFFF",
    paddingVertical: moderateScale(22),
  },
  ppHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: moderateScale(16),
    marginBottom: moderateScale(18),
  },
  ppSectionTitle: {
    fontSize: isTablet ? 17 : moderateScale(16),
    color: "#6D28D9",
  },
  ppViewAll: {
    fontSize: isTablet ? 13 : moderateScale(12),
    color: "#6D28D9",
  },
  ppScrollContent: {
    gap: moderateScale(20),
    paddingHorizontal: moderateScale(16),
    paddingRight: moderateScale(35),
    paddingBottom: moderateScale(15),
  },
  ppCard: {
    width: moderateScale(126),
    height: moderateScale(85),
    opacity: 1,
    backgroundColor: "#FCF6FF",
    borderRadius: moderateScale(16),
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(10),
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
  ppCardName: {
    fontSize: isTablet ? 13 : moderateScale(11),
    color: "#1A1A1A",
    marginBottom: moderateScale(4),
    textAlign: "center",
  },
  ppCardDesc: {
    fontSize: isTablet ? 9 : moderateScale(8),
    color: "#6D28D9",
    textAlign: "center",
    lineHeight: moderateScale(10),
    marginBottom: moderateScale(8),
  },
  ppCardPrice: {
    fontSize: isTablet ? 16 : moderateScale(14),
    color: "#000000",
  },
  ppRightArrowBtn: {
    position: "absolute",
    top: moderateScale(32),
    right: moderateScale(-10.5),
    width: moderateScale(21),
    height: moderateScale(21),
    borderRadius: moderateScale(10.5),
    borderWidth: 1,
    borderColor: "#E2D3FE",
    backgroundColor: "#F1E7FE",
    opacity: 1,
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
  ppDotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: moderateScale(10),
    gap: moderateScale(6),
  },
  ppDot: {
    width: moderateScale(6),
    height: moderateScale(6),
    borderRadius: moderateScale(3),
  },
  ppDotActive: { backgroundColor: "#6D28D9" },
  ppDotInactive: { backgroundColor: "#D1D5DB" },

  // --- STYLES FOR NEW LABS FEATURES SECTION ---
  featuresContainer: {
    marginTop: moderateScale(20),
    paddingHorizontal: moderateScale(16),
    alignItems: "center",
    justifyContent: "center",
  },
  featuresImage: {
    width: "100%",
    height: moderateScale(90),
  },

  // --- NAV STYLES ---
  navContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: NAV_HEIGHT,
    elevation: 10,
    zIndex: 999,
  },
  svgWrap: { position: "absolute", top: 0 },
  navBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    height: NAV_HEIGHT,
    paddingBottom: 10,
  },
  tabContainer: { width: TAB_WIDTH, alignItems: "center" },
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
  label: { fontSize: 13, marginTop: -35 },
  activeLabel: { color: "#3498db" },
  inactiveLabel: { color: "#535353ff" },
});

export default HyperTask;
