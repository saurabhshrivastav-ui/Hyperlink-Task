import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Entypo,
  MaterialCommunityIcons,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts, Outfit_600SemiBold } from "@expo-google-fonts/outfit";

/* ---------------- CONSTANTS ---------------- */
const { width } = Dimensions.get("window");
const SCREEN_PADDING = 20;

/* 🔥 COLOR PALETTE */
const COLORS = {
  brandBlue: "#0B6EDC",
  heroPink: "#FF4F9A",
  heroDark: "#2D2D2D",
  subtitleDark: "#1E1E1E",
  cardTitle: "#4B3CC4",
  iconBlue: "#1F73D1",
  footerBg: "#E6DCFF",
  footerText: "#5B3DF5",
  bgLight: "#F8F9FD",
  gridBg: "#F7F9FC",
};

/* ---------------- SCREEN ---------------- */
export default function SelfSense({ navigation }) {
  const [fontsLoaded] = useFonts({
    Outfit: Outfit_600SemiBold,
  });

  const [expandedCard, setExpandedCard] = useState(null);
  const toggleCard = (id) =>
    setExpandedCard(expandedCard === id ? null : id);

  if (!fontsLoaded) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.heroPink} />
      </View>
    );
  }

  /* ---------------- GRID ITEM ---------------- */
  const GridItem = ({ icon, label, material }) => {
    const Icon = material ? MaterialCommunityIcons : FontAwesome5;

    return (
      <View style={styles.gridItem}>
        <View style={styles.gridIcon}>
          <Icon name={icon} size={26} color={COLORS.iconBlue} />
        </View>
        <Text style={styles.gridLabel}>{label}</Text>
      </View>
    );
  };

  /* ---------------- CARD ---------------- */
  const HealthCard = ({ id, title, subtitle, desc, image, items }) => {
    const open = expandedCard === id;

    return (
      <View style={styles.card}>
        <View style={styles.cardBody}>
          <View style={styles.cardTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{title}</Text>
              <Text style={styles.cardSubtitle}>{subtitle}</Text>
              <Text style={styles.cardDesc}>{desc}</Text>
            </View>
            <Image source={image} style={styles.cardImage} />
          </View>

          {open && (
            <View style={styles.gridContainer}>
              {items.map((i, idx) => (
                <GridItem key={idx} {...i} />
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.cardFooter}
          onPress={() => toggleCard(id)}
        >
          <Text style={styles.footerText}>
            {open ? "Close Checks" : "Explore Checks"}
          </Text>
          <Entypo
            name={open ? "chevron-up" : "chevron-down"}
            size={18}
            color={COLORS.footerText}
          />
        </TouchableOpacity>
      </View>
    );
  };

  /* ---------------- UI ---------------- */
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ---------- HERO ---------- */}
        <LinearGradient
          colors={["#8DBCF2", "#E6F1FF", "#E8DFFF"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.heroContainer}
        >
          <SafeAreaView>
            <View style={styles.navRow}>
              <TouchableOpacity onPress={() => navigation?.goBack()}>
                <Ionicons name="arrow-back" size={26} color={COLORS.brandBlue} />
              </TouchableOpacity>
              <View style={{ marginLeft: 14 }}>
                <Text style={styles.navTitle}>SELF SENSE</Text>
                <Text style={styles.navSubtitle}>
                  Early awareness. Guided self-checks. Clear next steps.
                </Text>
              </View>
            </View>

            <View style={styles.heroContent}>
              <Text style={styles.heroMainText}>
                Early{"\n"}
                <Text style={{ color: COLORS.heroPink }}>Awareness</Text>
                {"\n"}Starts Here.
              </Text>

              <Image
                source={require("../../assets/Hero.png")}
                style={styles.heroImage}
              />
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* ---------- CONTENT ---------- */}
        <View style={styles.content}>
          <HealthCard
            id="chronic"
            title="Chronic Conditions"
            subtitle="Long-term lifestyle-linked conditions"
            desc="Understand risks linked to diabetes, PCOS, blood pressure, and more."
            image={require("../../assets/chronic.png")}
            items={[
              { label: "Diabetes", icon: "blood-bag", material: true },
              { label: "Hypertension", icon: "heart-pulse", material: true },
              { label: "PCOS", icon: "female", material: true },
              { label: "Thyroid", icon: "butterfly", material: true },
              { label: "Heart", icon: "heart", material: true },
              { label: "Obesity", icon: "scale-bathroom", material: true },
            ]}
          />

          <HealthCard
            id="cancer"
            title="Cancer Awareness"
            subtitle="Early warning signs & risk factors"
            desc="Self-checks for common cancer related symptoms."
            image={require("../../assets/cancer.png")}
            items={[
              { label: "Breast", icon: "ribbon" },
              { label: "Lung", icon: "lungs" },
              { label: "Oral", icon: "grimace" },
            ]}
          />

          <HealthCard
            id="mental"
            title="Mental Wellbeing"
            subtitle="Emotional & mental awareness"
            desc="Check stress levels, emotional patterns and burnout indicators."
            image={require("../../assets/MentalWell.png")}
            items={[
              { label: "Stress", icon: "brain" },
              { label: "Sleep", icon: "bed" },
              { label: "Mood", icon: "smile" },
            ]}
          />

          <HealthCard
            id="sensory"
            title="Hearing & Sensory Health"
            subtitle="Hearing health & exposure awareness"
            desc="Understand hearing loss risk and ear health concerns."
            image={require("../../assets/ears.png")}
            items={[
              { label: "Hearing", icon: "deaf" },
              { label: "Tinnitus", icon: "bell-slash" },
              { label: "Vision", icon: "eye" },
            ]}
          />
        </View>
      </ScrollView>
    </View>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgLight },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },

  heroContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    overflow: "hidden",
  },

  navRow: { flexDirection: "row", alignItems: "center", marginBottom: 22 },

  navTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.brandBlue,
    letterSpacing: 0.6,
  },

  navSubtitle: {
    fontSize: 15,
    color: COLORS.subtitleDark,
    marginTop: 4,
    maxWidth: width - 90,
    lineHeight: 22,
  },

  heroContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  heroMainText: {
    fontSize: 34,
    fontWeight: "800",
    lineHeight: 44,
    color: COLORS.heroDark,
  },

  heroImage: { width: 170, height: 190, resizeMode: "contain" },

  content: { padding: SCREEN_PADDING },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 18,
    overflow: "hidden",
  },

  cardBody: { padding: 16 },
  cardTop: { flexDirection: "row" },
  cardImage: { width: 70, height: 70, resizeMode: "contain" },

  cardTitle: { fontSize: 16, fontWeight: "800", color: COLORS.cardTitle },
  cardSubtitle: { fontSize: 12, fontWeight: "600", marginTop: 2 },
  cardDesc: { fontSize: 12, color: "#666", marginTop: 6 },

  /* 🔥 SAME GRID FOR ALL SECTIONS */
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 16,
  },

  gridItem: {
    width: "30%",
    aspectRatio: 1,
    backgroundColor: COLORS.gridBg,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  gridIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  gridLabel: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },

  cardFooter: {
    backgroundColor: COLORS.footerBg,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },

  footerText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.footerText,
  },
});
