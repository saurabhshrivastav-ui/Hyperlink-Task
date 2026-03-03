import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Image,
  Dimensions,
  Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "./TextWrapper"; // ✅ adjust path if needed

const { width, height } = Dimensions.get("window");

const ICONS = [
  require("../assets/loadericon1.webp"),
  require("../assets/loadericon2.webp"),
  require("../assets/loadericon3.webp"),
  require("../assets/loadericon4.webp"),
  require("../assets/loadericon5.webp"),
  require("../assets/loadericon6.webp"),
];

const clamp = (n, min, max) => Math.max(min, Math.min(n, max));

export default function LoaderScreen({
  title = "Hyperlink",
  subtitle = "Preparing your experience…",
  showText = true,
}) {
  const [index, setIndex] = useState(0);

  // ✅ Responsive icon size
  const ICON_SIZE = useMemo(() => clamp(width * 0.18, 58, 92), []);

  // ✅ Animated values
  const scale = useRef(new Animated.Value(0.94)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0.15)).current;
  const spin = useRef(new Animated.Value(0)).current;

  const mountedRef = useRef(true);
  const cycleTimerRef = useRef(null);

  useEffect(() => {
    mountedRef.current = true;

    // ✅ Smooth pulse (scale + opacity)
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1.04,
            duration: 650,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 650,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(glow, {
            toValue: 0.45,
            duration: 650,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 0.94,
            duration: 650,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.85,
            duration: 650,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(glow, {
            toValue: 0.15,
            duration: 650,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ]),
    );

    // ✅ Gentle slow rotate for premium feel
    const rotateLoop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 2400,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    pulse.start();
    rotateLoop.start();

    // ✅ Cycle icon every ~1.3s (syncs nicely with pulse)
    cycleTimerRef.current = setInterval(() => {
      if (!mountedRef.current) return;
      setIndex((prev) => (prev + 1) % ICONS.length);
    }, 1300);

    return () => {
      mountedRef.current = false;
      if (cycleTimerRef.current) clearInterval(cycleTimerRef.current);

      // Stop native animations to avoid setState warnings
      scale.stopAnimation();
      opacity.stopAnimation();
      glow.stopAnimation();
      spin.stopAnimation();
    };
  }, [scale, opacity, glow, spin]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.root} pointerEvents="auto">
      {/* ✅ Premium gradient background */}
      <LinearGradient
        colors={["#F7F7FF", "#FFFFFF", "#FFF4FA"]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* ✅ Soft vignette */}
      <View style={styles.vignette} />

      {/* ✅ Center content */}
      <View style={styles.center}>
        {/* ✅ Glow halo */}
        <Animated.View
          style={[
            styles.halo,
            {
              width: ICON_SIZE * 1.5,
              height: ICON_SIZE * 1.5,
              opacity: glow,
              transform: [{ rotate }],
            },
          ]}
        />

        {/* ✅ Icon wrapper */}
        <Animated.View
          style={[styles.iconWrapper, { transform: [{ scale }], opacity }]}
        >
          <Image
            source={ICONS[index]}
            style={{
              width: ICON_SIZE,
              height: ICON_SIZE,
              resizeMode: "contain",
            }}
            fadeDuration={180}
          />
        </Animated.View>
      </View>

      {/* ✅ Text (optional) */}
      {showText && (
        <View style={styles.textWrap}>
          <Text weight="800" style={styles.title}>
            {title}
          </Text>
          <Text weight="400" style={styles.subtitle}>
            {subtitle}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },

  vignette: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.03)",
  },

  center: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  halo: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "rgba(91,61,245,0.10)",
    borderWidth: 1,
    borderColor: "rgba(217,70,239,0.12)",
  },

  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },

  textWrap: {
    marginTop: 18,
    alignItems: "center",
  },

  title: {
    fontSize: 20,
    color: "#1F2937",
    letterSpacing: 0.5,
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    maxWidth: 280,
    lineHeight: 20,
  },
});
