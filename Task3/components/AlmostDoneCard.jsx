import React, { useEffect, useMemo, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle } from "react-native-svg";
import { Text } from "./TextWrapper";

const { width } = Dimensions.get("window");
const clamp = (n, min, max) => Math.max(min, Math.min(n, max));
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function AlmostDoneCard({
  title = "You're almost done!",
  assessmentText = "Diabetes Assessment . 2 hours ago",
  buttonText = "Resume Check",
  percent = 80,
  onPress,
  style,
}) {
  const p = useMemo(() => clamp(Number(percent) || 0, 0, 100), [percent]);

  const RING_SIZE = useMemo(() => clamp(width * 0.18, 58, 78), []);
  const STROKE = useMemo(() => clamp(RING_SIZE * 0.14, 7, 10), [RING_SIZE]);
  const R = (RING_SIZE - STROKE) / 2;
  const C = 2 * Math.PI * R;

  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    anim.stopAnimation();
    anim.setValue(0);
    Animated.timing(anim, {
      toValue: p,
      duration: 650,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [p, anim]);

  const dashOffset = anim.interpolate({
    inputRange: [0, 100],
    outputRange: [C, 0],
  });

  return (
    <View style={[styles.card, style]}>
      <View style={styles.left}>
        <Text weight="800" style={styles.title}>
          {title}
        </Text>

        <Text weight="600" style={styles.subtitle}>
          {assessmentText}
        </Text>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onPress}
          style={styles.btnWrap}
        >
          <LinearGradient
            colors={["#7C3AED", "#A855F7"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.btn}
          >
            <Text weight="800" style={styles.btnText}>
              {buttonText}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.right}>
        <View
          style={[
            styles.ringShell,
            {
              width: RING_SIZE,
              height: RING_SIZE,
              borderRadius: RING_SIZE / 2,
            },
          ]}
        >
          <Svg width={RING_SIZE} height={RING_SIZE} style={styles.svg}>
            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={R}
              stroke="rgba(99,102,241,0.18)"
              strokeWidth={STROKE}
              fill="none"
            />
            <AnimatedCircle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={R}
              stroke="#4F46E5"
              strokeWidth={STROKE}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={`${C} ${C}`}
              strokeDashoffset={dashOffset}
              rotation={-90}
              originX={RING_SIZE / 2}
              originY={RING_SIZE / 2}
            />
          </Svg>

          <View style={styles.ringCenter}>
            <Text weight="900" style={styles.percentText}>
              {p}%
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: "stretch",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: "#FBF1FE",
    borderWidth: 1,
    borderColor: "#fff",
  },

  left: {
    flex: 1,
    paddingRight: 12,
  },

  title: {
    fontSize: 18,
    color: "#D97706",
    letterSpacing: 0.2,
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 13.5,
    color: "#0F172A",
    opacity: 0.85,
    marginBottom: 10,
  },

  btnWrap: {
    alignSelf: "flex-start",
    borderRadius: 10,
    overflow: "hidden",
  },

  btn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },

  btnText: {
    fontSize: 13,
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },

  right: {
    alignItems: "center",
    justifyContent: "center",
  },

  ringShell: {
    backgroundColor: "rgba(255,255,255,0.75)",
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.06)",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
  },

  svg: {
    position: "absolute",
  },

  ringCenter: {
    alignItems: "center",
    justifyContent: "center",
  },

  percentText: {
    fontSize: 16,
    color: "#0F172A",
    letterSpacing: 0.2,
  },
});
