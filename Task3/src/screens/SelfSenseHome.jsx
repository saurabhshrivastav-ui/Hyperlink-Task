import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import HealthCard from "../components/HealthCard";
import ConditionGrid from "../components/ConditionGrid";

export default function SelfSenseHome() {
  const scrollRef = useRef(null);
  const [showChronic, setShowChronic] = useState(false);

  const toggleChronic = () => {
    setShowChronic((prev) => !prev);
    setTimeout(() => {
      scrollRef.current?.scrollTo({ y: 520, animated: true });
    }, 200);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#E9F2FF" />

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* ================= HERO + HEADER ================= */}
        <View style={styles.heroWrap}>
          {/* HEADER INSIDE HERO */}
          <View style={styles.heroHeader}>
            <TouchableOpacity>
              <Ionicons name="arrow-back" size={20} color="#1F3C88" />
            </TouchableOpacity>

            <View style={{ marginLeft: 10 }}>
              <Text style={styles.appTitle}>SELF SENSE</Text>
              <Text style={styles.appSubtitle}>
                Early awareness. Guided self-checks. Clear next steps.
              </Text>
            </View>
          </View>

          {/* HERO CARD */}
          <View style={styles.heroCard}>
            <View style={styles.heroTextWrap}>
              <Text style={styles.heroHeadline}>
                Early{"\n"}Awareness{"\n"}Starts Here.
              </Text>
            </View>

            <Image
              source={require("../../assets/doctors.png")}
              style={styles.heroImage}
            />
          </View>
        </View>

        {/* ================= SECTION ================= */}
        <View style={styles.sectionWrap}>
          <Text style={styles.sectionTitle}>Choose a Health Area</Text>
          <Text style={styles.sectionSub}>
            Tap a category to start a guided self-check.
          </Text>
        </View>

        {/* ================= CHRONIC CARD ================= */}
        <HealthCard
          title="Chronic Conditions"
          description="Long-term lifestyle-linked conditions"
          subText="Understand risks linked to diabetes, PCOS, blood pressure, and more."
          expanded={showChronic}
          onPress={toggleChronic}
        />

        {/* ================= EXPANDED GRID ================= */}
        {showChronic && (
          <View style={styles.expandAttached}>
            <ConditionGrid
              conditions={[
                { name: "Diabetes", icon: "medkit-outline" },
                { name: "Hypertension", icon: "heart-outline" },
                { name: "PCOS", icon: "female-outline" },
                { name: "Thyroid", icon: "thermometer-outline" },
                { name: "Heart", icon: "pulse-outline" },
                { name: "Obesity", icon: "body-outline" },
              ]}
            />

            <Text style={styles.exploreText}>Explore Checks ⌃</Text>
          </View>
        )}

        {/* ================= OTHER CARDS ================= */}
        <HealthCard
          title="Cancer Awareness"
          description="Early warning signs & risk factors"
          subText="Self-checks for common cancer related symptoms and lifestyle risks."
        />

        <HealthCard
          title="Mental Wellbeing"
          description="Emotional & mental health awareness"
          subText="Check stress levels, emotional patterns, and burnout indicators."
        />

        <HealthCard
          title="Hearing & Sensory Health"
          description="Hearing health & exposure awareness"
          subText="Understand hearing loss risks and ear health concerns."
        />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#E9F2FF",
  },

  scroll: {
    backgroundColor: "#F8F9FF",
    paddingBottom: 32,
  },

  /* HERO WRAP */
  heroWrap: {
    backgroundColor: "#E9F2FF",
    paddingTop: Platform.OS === "android" ? 24 : 16,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    paddingBottom: 12,
  },

  heroHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  appTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1F3C88",
    letterSpacing: 0.6,
  },

  appSubtitle: {
    fontSize: 11,
    color: "#4B5563",
    marginTop: 2,
  },

  heroCard: {
    marginHorizontal: 16,
    backgroundColor: "#EFE7FF",
    borderRadius: 22,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
  },

  heroTextWrap: {
    flex: 1,
  },

  heroHeadline: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FF3D8D",
    lineHeight: 28,
  },

  heroImage: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },

  /* SECTION */
  sectionWrap: {
    marginTop: 12,
    marginBottom: 8,
  },

  sectionTitle: {
    marginHorizontal: 16,
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },

  sectionSub: {
    marginHorizontal: 16,
    fontSize: 11,
    color: "#6B7280",
    marginTop: 2,
  },

  /* EXPAND ATTACHED */
  expandAttached: {
    backgroundColor: "#EEE9FF",
    marginHorizontal: 12,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingVertical: 12,
    marginTop: -10, // 🔥 attaches to card
    marginBottom: 8,
  },

  exploreText: {
    textAlign: "center",
    fontSize: 11,
    fontWeight: "600",
    color: "#5B4BFF",
    marginTop: 10,
  },
});
