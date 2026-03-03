import React, { useMemo } from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";

import { Text } from "./TextWrapper";

const { width } = Dimensions.get("window");
const clamp = (n, min, max) => Math.max(min, Math.min(n, max));

/**
 * ✅ Corrected behavior (as you asked)
 * showAlmostDone = true  -> Build your Health Persona (incomplete)
 * showAlmostDone = false -> Health Persona Active (completed)
 */
export default function PersonaOrProgressBanner({
  showAlmostDone = false,

  /* -------------------- INCOMPLETE (Build Persona) -------------------- */
  buildTitle = "Build your Health Persona",
  buildDescription = `Help us to understand you better, so your self checks are more\nrelevant and accurate.`,
  durationText = "2 min",
  privacyText = "Private",
  questionsText = "20",
  buildButtonText = "Create My Persona",
  onBuildPress,

  /* -------------------- COMPLETE (Persona Active) -------------------- */
  personaActiveTitle = "Health Persona Active",
  personaActiveSubtitle = "Thanks! Your Profile is now more personalized.",
  personaButtonText = "View Persona",
  onPersonaPress,
  steps = [
    { label: "About\nyourself", done: true },
    { label: "Physical\nActivity", done: true },
    { label: "Nutrition", done: true },
    { label: "Sleep", done: true },
    { label: "Medical\nCondition", done: true },
  ],

  style,
}) {
  // ✅ TRUE -> Build Persona (incomplete)
  if (showAlmostDone) {
    return (
      <LinearGradient
        colors={["#CDE8FF", "#F3EBFF"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[styles.block, styles.buildCard, style]}
      >
        <Text weight="800" style={styles.buildTitle}>
          {buildTitle}
        </Text>

        <Text weight="500" style={styles.buildDesc}>
          {buildDescription}
        </Text>

        <View style={styles.buildBottomRow}>
          <View style={styles.buildStats}>
            <MiniStat
              icon={<Feather name="clock" size={18} color="#5B3DF5" />}
              value={durationText}
              label="Duration"
            />
            <MiniStat
              highlight
              icon={
                <MaterialCommunityIcons
                  name="shield-check"
                  size={18}
                  color="#E74C3C"
                />
              }
              value={privacyText}
              label="Anonymous"
            />
            <MiniStat
              icon={
                <MaterialCommunityIcons
                  name="file-document-outline"
                  size={18}
                  color="#4A8FE7"
                />
              }
              value={questionsText}
              label="Questions"
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={onBuildPress}
            style={styles.ctaWrap}
          >
            <LinearGradient
              colors={["#486DFF", "#0FABF8", "#486DFF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ctaBtn}
            >
              <Text weight="800" style={styles.ctaText}>
                {buildButtonText}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  // ✅ FALSE -> Persona Active (completed)
  return (
    <LinearGradient
      colors={["#CFE8FF", "#E9E3FF", "#F3EEFF"]}
      start={{ x: 0.08, y: 0 }}
      end={{ x: 0.92, y: 1 }}
      style={[styles.block, styles.personaActiveCard, style]}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={styles.greenBadge}>
            <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />
          </View>

          <View style={{ flex: 1 }}>
            <Text weight="800" style={styles.personaActiveTitle}>
              {personaActiveTitle}
            </Text>
            <Text weight="500" style={styles.personaActiveSubtitle}>
              {personaActiveSubtitle}
            </Text>
          </View>
        </View>
      </View>

      {/* Stepper + Button */}
      <View style={styles.bottomRow}>
        <PersonaStepper steps={steps} />

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onPersonaPress}
          style={styles.ctaWrap}
        >
          <LinearGradient
            colors={["#486DFF", "#0FABF8", "#486DFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaBtn}
          >
            <Text weight="800" style={styles.ctaText}>
              {personaButtonText}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

/* -------------------- Mini Stat (Build Persona) -------------------- */
function MiniStat({ icon, value, label, highlight }) {
  return (
    <View style={[styles.statCard, highlight && styles.statCardHighlight]}>
      <View
        style={[
          styles.statIconCircle,
          highlight && styles.statIconCircleHighlight,
        ]}
      >
        {icon}
      </View>
      <Text weight="800" style={styles.statValue}>
        {value}
      </Text>
      <Text weight="600" style={styles.statLabel}>
        {label}
      </Text>
    </View>
  );
}

/* -------------------- Stepper (fixed alignment) -------------------- */
// ✅ PersonaStepper (final) — labels perfectly centered under each circle
// ✅ FINAL PersonaStepper — circle + label perfectly aligned
// Fix: Put BOTH the circle+label inside a fixed-width "dot column" (DOT width)
// and render the connector separately, so the connector NEVER affects centering.

function PersonaStepper({ steps }) {
  const DOT = useMemo(() => clamp(width * 0.06, 24, 30), []);
  const CONNECTOR_W = useMemo(() => clamp(width * 0.035, 12, 18), []);
  const LINE_H = 2;

  const LABEL_W = DOT + CONNECTOR_W; // ✅ enough for 2 words without "..."

  return (
    <View style={styles.stepperWrap}>
      <View style={styles.stepsRow}>
        {steps.map((s, idx) => {
          const isLast = idx === steps.length - 1;
          const done = !!s.done;

          return (
            <React.Fragment key={`${idx}-${s.label}`}>
              <View style={[styles.stepCol, { width: DOT }]}>
                {/* ✅ circle */}
                <View
                  style={[
                    styles.dotOuter,
                    { width: DOT, height: DOT, borderRadius: DOT / 2 },
                    done ? styles.dotOuterDone : styles.dotOuterTodo,
                  ]}
                >
                  <View
                    style={[
                      styles.dotInner,
                      done ? styles.dotInnerDone : styles.dotInnerTodo,
                    ]}
                  >
                    {done && (
                      <MaterialCommunityIcons
                        name="check"
                        size={12}
                        color="#5B21B6"
                      />
                    )}
                  </View>
                </View>

                {/* ✅ label (FULL TEXT visible, 1 or 2 lines) */}
                <View style={styles.labelWrap}>
                  <Text
                    weight="600"
                    numberOfLines={2}
                    ellipsizeMode="clip" // ✅ no "..."
                    style={[styles.stepLabel, { width: LABEL_W }]}
                  >
                    {s.label}
                  </Text>
                </View>
              </View>

              {/* ✅ connector (outside; doesn't affect centering) */}
              {!isLast && (
                <View
                  style={[
                    styles.connector,
                    {
                      width: CONNECTOR_W,
                      height: LINE_H,
                      backgroundColor: done
                        ? "rgba(91,61,245,0.55)"
                        : "rgba(91,61,245,0.22)",
                      marginTop: DOT / 2 - LINE_H / 2,
                    },
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}
const CARD_W = clamp(width, 320, 560);

const styles = StyleSheet.create({
  block: {
    alignSelf: "stretch",
    width: "100%",
    maxWidth: CARD_W,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.9)",
    shadowColor: "rgba(0,0,0,0.10)",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 4,
    overflow: "visible",
  },

  /* -------------------- Build Persona Card -------------------- */
  buildCard: {
    padding: 14,
  },
  buildTitle: {
    fontSize: 20,
    color: "#0F172A",
    letterSpacing: 0.2,
    marginBottom: 6,
  },
  buildDesc: {
    fontSize: 15,
    color: "rgba(15,23,42,0.70)",
    lineHeight: 16,
    marginBottom: 12,
  },
  buildBottomRow: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: 12,
  },
  buildStats: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "space-evenly",
  },

  statCard: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: "center",
    width: 65,
    minHeight: 62,
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.06)",
    shadowColor: "rgba(0,0,0,0.06)",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  statCardHighlight: {
    borderColor: "rgba(217,70,239,0.16)",
    backgroundColor: "rgba(253,248,255,0.95)",
  },
  statIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#F5F8FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.05)",
  },
  statIconCircleHighlight: {
    backgroundColor: "#FFF5F5",
    borderColor: "rgba(231,76,60,0.10)",
  },
  statValue: {
    fontSize: 15,
    color: "#0F172A",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: "rgba(15,23,42,0.55)",
    textAlign: "center",
    lineHeight: 10,
  },

  /* -------------------- Persona Active Card -------------------- */
  personaActiveCard: {
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  headerRow: {
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  greenBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#16A34A",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(22,163,74,0.35)",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 2,
  },
  personaActiveTitle: {
    fontSize: 20,
    color: "#0F172A",
    letterSpacing: 0.2,
  },
  personaActiveSubtitle: {
    marginTop: 3,
    fontSize: 15,
    color: "rgba(15,23,42,0.70)",
    lineHeight: 16,
  },

  bottomRow: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: 12,
  },
  stepperWrap: {
    alignSelf: "center",
  },

  stepsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  // ✅ holds dot + label together
  stepCol: {
    alignItems: "center",
  },

  dotOuter: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },

  dotOuterDone: {
    borderColor: "rgba(91,61,245,0.28)",
    backgroundColor: "rgba(255,255,255,0.75)",
  },

  dotOuterTodo: {
    borderColor: "rgba(91,61,245,0.18)",
    backgroundColor: "rgba(255,255,255,0.55)",
  },

  dotInner: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },

  dotInnerDone: {
    backgroundColor: "rgba(237,233,254,1)",
  },

  dotInnerTodo: {
    backgroundColor: "rgba(237,233,254,0.55)",
  },

  connector: {
    borderRadius: 999,
    marginHorizontal: 4, // ✅ reduce spacing
  },

  labelWrap: {
    marginTop: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  stepLabel: {
    fontSize: 10,
    color: "rgba(15,23,42,0.75)",
    textAlign: "center",
  },
  /* -------------------- Button -------------------- */
  ctaWrap: {
    borderRadius: 12,
    overflow: "hidden",
    flexShrink: 0,
    alignSelf: "stretch",
  },
  ctaBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: {
    fontSize: 13,
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
});
