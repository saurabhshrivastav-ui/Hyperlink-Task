// ===============================
// SERVICE BOTTOM NAV — OLD UI RESTORED + FIXED ANIMATION
// ===============================

import React, { useEffect, useState, useRef } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import { Text } from "./TextWrapper";
import { useNavigation } from "@react-navigation/native";
import Svg, { Path } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

// OLD UI VALUES RESTORED
const ACTIVE_ICON_SIZE = 66;
const INACTIVE_ICON_SIZE = 40;
const NAV_HEIGHT = 70; // OLD VALUE
const ICON_FLOAT = -32; // OLD VALUE

const NOTCH_RADIUS = ACTIVE_ICON_SIZE / 2 + 25;
const NOTCH_DEPTH = 40;

/* --------------------------------------
   NOTCH PATH — same as old UI
----------------------------------------- */
const getPath = (indexValue, tabWidth) => {
  const center = indexValue * tabWidth + tabWidth / 2;

  return `
    M0,0
    L${center - NOTCH_RADIUS},0
    C${center - NOTCH_RADIUS + 18},0 
      ${center - NOTCH_RADIUS / 2},${NOTCH_DEPTH} 
      ${center},${NOTCH_DEPTH}
    C${center + NOTCH_RADIUS / 2},${NOTCH_DEPTH} 
      ${center + NOTCH_RADIUS - 18},0 
      ${center + NOTCH_RADIUS},0
    L${width},0
    L${width},${NAV_HEIGHT}
    L0,${NAV_HEIGHT}
    Z
  `;
};

/* --------------------------------------
   ICON WRAPPER — OLD UI RETURNED
----------------------------------------- */
const IconWrapper = ({ isFocused, isHome, children }) => {
  if (isHome) {
    return (
      <View style={styles.iconHolder}>
        <View style={styles.homeCircle}>{children}</View>
      </View>
    );
  }

  return (
    <View style={styles.iconHolder}>
      {isFocused ? (
        <LinearGradient
          colors={["#6ea6e7", "#daeffe", "#e0d3ff"]}
          style={styles.activeCircle}
        >
          {children}
        </LinearGradient>
      ) : (
        <View style={styles.inactiveCircle}>{children}</View>
      )}
    </View>
  );
};

/* --------------------------------------
   ICON COMPONENT
----------------------------------------- */
const CustomTabIcon = ({ item, isFocused, isHome }) => {
  const color = isFocused && !isHome ? "#5b3cc4" : "#7f8c8d";

  if (item.customIcon) {
    const CustomIcon = item.customIcon;
    return (
      <IconWrapper isFocused={isFocused} isHome={isHome}>
        <CustomIcon width={26} height={26} fill={color} />
      </IconWrapper>
    );
  }

  const Lib = item.lib;
  return (
    <IconWrapper isFocused={isFocused} isHome={isHome}>
      <Lib name={item.icon} size={24} color={color} />
    </IconWrapper>
  );
};

/* --------------------------------------
   TAB COMPONENT — OLD UI RESTORED
----------------------------------------- */
const NavItem = ({ item, isFocused, isHome, onPress }) => (
  <TouchableOpacity
    style={styles.tabContainer}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <CustomTabIcon item={item} isFocused={isFocused} isHome={isHome} />
    <Text
      weight={isFocused && !isHome ? "900" : "500"}
      style={[
        styles.label,
        isFocused && !isHome ? styles.activeLabel : styles.inactiveLabel,
      ]}
    >
      {item.label}
    </Text>
  </TouchableOpacity>
);

/* --------------------------------------
   MAIN COMPONENT
----------------------------------------- */
export default function ServiceBottomNav({ items, activeGroup, onTabChange }) {
  const navigation = useNavigation();
  const TAB_WIDTH = width / items.length;

  const getIndex = () => {
    const idx = items.findIndex((x) => x.route === activeGroup);
    return idx !== -1 ? idx : 1;
  };

  const [activeIndex, setActiveIndex] = useState(getIndex());
  const notchAnim = useRef(new Animated.Value(activeIndex)).current;

  // Animate notch
  useEffect(() => {
    const newIdx = getIndex();
    setActiveIndex(newIdx);

    Animated.timing(notchAnim, {
      toValue: newIdx,
      duration: 380,
      easing: Easing.out(Easing.exp),
      useNativeDriver: false,
    }).start();
  }, [activeGroup]);

  const handleNavigation = (item, index) => {
    setActiveIndex(index);

    Animated.timing(notchAnim, {
      toValue: index,
      duration: 380,
      easing: Easing.out(Easing.exp),
      useNativeDriver: false,
    }).start();

    if (onTabChange) return onTabChange(item.route);

    navigation.navigate(item.route);
  };

  // FIXED INTERPOLATION
  const animatedPath = notchAnim.interpolate({
    inputRange: items.map((_, i) => i),
    outputRange: items.map((_, i) => getPath(i, TAB_WIDTH)),
  });

  return (
    <View style={styles.container}>
      <Svg width={width} height={NAV_HEIGHT} style={styles.svgWrap}>
        <AnimatedPath
          d={animatedPath}
          fill="transparent"
          stroke="rgba(0,0,0,0.08)"
          strokeWidth={1}
        />
      </Svg>

      <View style={styles.navBar}>
        {items.map((item, index) => (
          <NavItem
            key={item.route}
            item={item}
            isFocused={index === activeIndex}
            isHome={index === 0}
            onPress={() => handleNavigation(item, index)}
          />
        ))}
      </View>
    </View>
  );
}

/* Animated Path Component */
const AnimatedPath = Animated.createAnimatedComponent(Path);

/* ---------------------------------------------------------
   STYLES — OLD UI RESTORED
---------------------------------------------------------*/
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: NAV_HEIGHT,
    backgroundColor: "transparent",
  },

  svgWrap: {
    position: "absolute",
    bottom: 0,
  },

  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    backgroundColor: "transparent",
    height: NAV_HEIGHT,
    paddingBottom: 10, // OLD UI
  },

  tabContainer: {
    width: width / 5,
    alignItems: "center",
  },

  iconHolder: {
    height: ACTIVE_ICON_SIZE + 20,
    width: ACTIVE_ICON_SIZE + 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    top: ICON_FLOAT,
  },

  homeCircle: {
    height: INACTIVE_ICON_SIZE,
    width: INACTIVE_ICON_SIZE,
    marginTop: 35,
    borderRadius: INACTIVE_ICON_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
  },

  activeCircle: {
    height: ACTIVE_ICON_SIZE,
    width: ACTIVE_ICON_SIZE,
    borderRadius: ACTIVE_ICON_SIZE / 2,
    borderWidth: 3,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  inactiveCircle: {
    height: INACTIVE_ICON_SIZE,
    width: INACTIVE_ICON_SIZE,
    borderRadius: INACTIVE_ICON_SIZE / 2,
    marginTop: 35,
    justifyContent: "center",
    alignItems: "center",
  },

  label: {
    fontSize: 13,
    marginTop: -35, // OLD UI RESTORED
  },

  activeLabel: {
    color: "#3498db",
  },

  inactiveLabel: {
    color: "#535353",
  },
});
