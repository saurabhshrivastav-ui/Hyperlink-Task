import React from "react";
import { TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "./TextWrapper";

const { width } = Dimensions.get("window");
const isTablet = width >= 768;

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
      style={[styles.container, style, disabled && { opacity: 0.6 }]}
    >
      <LinearGradient
        colors={gradientConfig.colors}
        locations={gradientConfig.locations}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.gradient,
          {
            paddingVertical: sz.paddingVertical,
            paddingHorizontal: sz.paddingHorizontal,
          },
        ]}
      >
        {icon && iconPosition === "left" && icon}
        <Text
          weight="700"
          style={[styles.text, { fontSize: sz.fontSize }, textStyle]}
          numberOfLines={1}
        >
          {title}
        </Text>
        {icon && iconPosition === "right" && icon}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { borderRadius: 10, overflow: "hidden" },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  text: { color: "#FFFFFF", fontWeight: "700", letterSpacing: 0.3 },
});

export default GradientButton;
