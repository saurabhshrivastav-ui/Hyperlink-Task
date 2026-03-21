import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Feather,
  MaterialIcons,
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome5,
  AntDesign,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "../../../components/TextWrapper";
import AlmostDoneCard from "../../../components/AlmostDoneCard";

const { width } = Dimensions.get("window");
const SCREEN_PADDING = 20;

/* ─── Consult Option Item ─── */
const ConsultOption = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.consultOption} activeOpacity={0.7} onPress={onPress}>
    <View style={styles.consultIconWrap}>
      {icon}
    </View>
    <Text weight="500" style={styles.consultOptionLabel}>
      {label}
    </Text>
  </TouchableOpacity>
);

/* ─── Persona Stat Item ─── */
const PersonaStat = ({ icon, value, label }) => (
  <View style={styles.personaStat}>
    <View style={styles.personaStatIcon}>{icon}</View>
    <Text weight="700" style={styles.personaStatValue}>
      {value}
    </Text>
    <Text weight="500" style={styles.personaStatLabel}>
      {label}
    </Text>
  </View>
);

/* ─── Persona Category Chip ─── */
const PersonaCategory = ({ label, done }) => (
  <View style={styles.personaCategory}>
    <View
      style={[
        styles.personaCategoryCheck,
        done && styles.personaCategoryCheckDone,
      ]}
    >
      {done && <AntDesign name="check" size={12} color="#fff" />}
    </View>
    <Text weight="500" style={styles.personaCategoryLabel}>
      {label}
    </Text>
  </View>
);

/* ─── Bottom Tab Item ─── */
const TabItem = ({ icon, active }) => (
  <TouchableOpacity style={styles.tabItem} activeOpacity={0.7}>
    {icon}
  </TouchableOpacity>
);

/* ══════════════════════════════════════════════════════════════
   MAIN SCREEN
   ══════════════════════════════════════════════════════════════ */
export default function SelfSense({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#E8DFFF" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 90 }}
      >
        {/* ━━━ HERO SECTION ━━━ */}
        <LinearGradient
          colors={["#E8DFFF", "#F3EAFF", "#FFFFFF"]}
          style={styles.heroGradient}
        >
          <SafeAreaView>
            {/* Nav Row */}
            <View style={styles.navRow}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              >
                <Feather name="chevron-left" size={24} color="#1E1E1E" />
              </TouchableOpacity>
              <Text weight="700" style={styles.navTitle}>
                SELF SENSE
              </Text>
              <View style={{ width: 36 }} />
            </View>

            {/* Hero Content */}
            <View style={styles.heroContent}>
              <View style={styles.heroTextSide}>
                <Text weight="800" style={styles.heroHeading}>
                  Understand Your Health.{"\n"}One Check at a Time.
                </Text>
                <Text weight="500" style={styles.heroDesc}>
                  Guided self-checks to help{"\n"}you notice early warning signs
                  {"\n"}and health patterns, without{"\n"}replacing medical
                  advice.
                </Text>

                <TouchableOpacity activeOpacity={0.85} style={styles.startBtnWrap}>
                  <LinearGradient
                    colors={["#F97316", "#EC4899"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.startBtn}
                  >
                    <Text weight="700" style={styles.startBtnText}>
                      Start Self Check
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              <Image
                source={require("../../../assets/Hero.webp")}
                style={styles.heroImage}
              />
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* ━━━ DISCLAIMER / CONSULT SECTION ━━━ */}
        <View style={styles.disclaimerCard}>
          <View style={styles.disclaimerRow}>
            <MaterialIcons
              name="warning"
              size={22}
              color="#F59E0B"
              style={{ marginRight: 8, marginTop: 2 }}
            />
            <Text weight="600" style={styles.disclaimerText}>
              This is not a diagnostic tool. For urgent concerns, please consult
            </Text>
          </View>

          <View style={styles.consultRow}>
            {/* Consult Now button */}
            <TouchableOpacity activeOpacity={0.85} style={styles.consultNowWrap}>
              <LinearGradient
                colors={["#7C3AED", "#A855F7"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.consultNowBtn}
              >
                <Text weight="700" style={styles.consultNowText}>
                  Consult Now!
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <ConsultOption
              icon={<Ionicons name="chatbubbles-outline" size={22} color="#6D28D9" />}
              label={"One to One\nConsultation"}
            />
            <ConsultOption
              icon={<MaterialCommunityIcons name="message-text-outline" size={22} color="#6D28D9" />}
              label={"Chat with\nspecialist"}
            />
            <ConsultOption
              icon={<MaterialCommunityIcons name="file-document-outline" size={22} color="#6D28D9" />}
              label={"Prescription\nand lab referrals"}
            />
          </View>
        </View>

        {/* ━━━ ALMOST DONE CARD ━━━ */}
        <AlmostDoneCard
          assessmentText="Diabetes Assessment . 2 hours ago"
          percent={80}
          style={styles.almostDoneBanner}
          onPress={() => navigation.navigate("QuestionnairesScreen")}
        />

        {/* ━━━ BUILD HEALTH PERSONA ━━━ */}
        <View style={styles.personaCard}>
          <Text weight="700" style={styles.personaTitle}>
            Build your Health Persona
          </Text>
          <Text weight="500" style={styles.personaDesc}>
            Help us to understand you better, so your self checks are more
            relevant and accurate.
          </Text>

          <View style={styles.personaStatsRow}>
            <PersonaStat
              icon={<Feather name="clock" size={18} color="#6D28D9" />}
              value="2 min"
              label="Duration"
            />
            <PersonaStat
              icon={<MaterialCommunityIcons name="shield-lock-outline" size={18} color="#6D28D9" />}
              value="Private"
              label="Anonymous"
            />
            <PersonaStat
              icon={<MaterialCommunityIcons name="file-document-outline" size={18} color="#6D28D9" />}
              value="20"
              label="Questions"
            />

            <TouchableOpacity activeOpacity={0.85} style={styles.createPersonaWrap}>
              <LinearGradient
                colors={["#7C3AED", "#A855F7"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.createPersonaBtn}
              >
                <Text weight="700" style={styles.createPersonaBtnText}>
                  Create My Persona
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* ━━━ HEALTH PERSONA ACTIVE ━━━ */}
        <View style={styles.personaActiveCard}>
          <View style={styles.personaActiveHeader}>
            <View style={styles.personaActiveCheckCircle}>
              <AntDesign name="check" size={16} color="#fff" />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text weight="700" style={styles.personaActiveTitle}>
                Health Persona Active
              </Text>
              <Text weight="500" style={styles.personaActiveSubtitle}>
                Thanks! Your Profile is now more personalized.
              </Text>
            </View>
          </View>

          <View style={styles.personaCategoriesRow}>
            <PersonaCategory label="About yourself" done />
            <PersonaCategory label={"Physical\nActivity"} done />
            <PersonaCategory label="Nutrition" done />
            <PersonaCategory label="Sleep" done />
            <PersonaCategory label={"Medical\nCondition"} done />
          </View>

          <TouchableOpacity activeOpacity={0.85} style={styles.viewPersonaWrap}>
            <LinearGradient
              colors={["#7C3AED", "#A855F7"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.viewPersonaBtn}
            >
              <Text weight="700" style={styles.viewPersonaBtnText}>
                View Persona
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ━━━ BOTTOM TAB BAR ━━━ */}
      <View style={styles.bottomBar}>
        <TabItem icon={<Feather name="home" size={24} color="#9CA3AF" />} />
        <TabItem icon={<Ionicons name="grid" size={24} color="#7C3AED" />} active />
        <TabItem icon={<Feather name="bar-chart-2" size={24} color="#9CA3AF" />} />
        <TabItem icon={<Feather name="book-open" size={24} color="#9CA3AF" />} />
        <TabItem icon={<Feather name="user" size={24} color="#9CA3AF" />} />
      </View>
    </View>
  );
}

/* ══════════════════════════════════════════════════════════════
   STYLES
   ══════════════════════════════════════════════════════════════ */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FD" },

  /* ── NAV ── */
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SCREEN_PADDING,
    paddingTop: 6,
    paddingBottom: 4,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  navTitle: {
    fontSize: 16,
    color: "#1E1E1E",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },

  /* ── HERO ── */
  heroGradient: {
    paddingBottom: 20,
  },
  heroContent: {
    flexDirection: "row",
    paddingHorizontal: SCREEN_PADDING,
    marginTop: 10,
  },
  heroTextSide: {
    flex: 1,
    paddingRight: 8,
    justifyContent: "center",
  },
  heroHeading: {
    fontSize: 22,
    lineHeight: 28,
    color: "#1E1E1E",
    marginBottom: 8,
  },
  heroDesc: {
    fontSize: 12.5,
    lineHeight: 18,
    color: "#555",
    marginBottom: 16,
  },
  startBtnWrap: {
    alignSelf: "flex-start",
    borderRadius: 12,
    overflow: "hidden",
  },
  startBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  startBtnText: {
    fontSize: 14,
    color: "#fff",
    letterSpacing: 0.3,
  },
  heroImage: {
    width: width * 0.42,
    height: width * 0.48,
    resizeMode: "contain",
  },

  /* ── DISCLAIMER ── */
  disclaimerCard: {
    marginHorizontal: SCREEN_PADDING,
    marginTop: 6,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  disclaimerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 13,
    color: "#1E1E1E",
    lineHeight: 19,
  },
  consultRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  consultNowWrap: {
    borderRadius: 10,
    overflow: "hidden",
    alignSelf: "flex-start",
  },
  consultNowBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  consultNowText: {
    fontSize: 12,
    color: "#fff",
  },
  consultOption: {
    alignItems: "center",
    width: (width - SCREEN_PADDING * 2 - 32 - 90) / 3,
  },
  consultIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#F3F0FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  consultOptionLabel: {
    fontSize: 10.5,
    color: "#444",
    textAlign: "center",
    lineHeight: 14,
  },

  /* ── ALMOST DONE ── */
  almostDoneBanner: {
    marginHorizontal: SCREEN_PADDING,
    marginTop: 16,
  },

  /* ── BUILD PERSONA ── */
  personaCard: {
    marginHorizontal: SCREEN_PADDING,
    marginTop: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(124,58,237,0.12)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  personaTitle: {
    fontSize: 17,
    color: "#1E1E1E",
    marginBottom: 4,
  },
  personaDesc: {
    fontSize: 12.5,
    color: "#666",
    lineHeight: 18,
    marginBottom: 14,
  },
  personaStatsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  personaStat: {
    alignItems: "center",
  },
  personaStatIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#F3F0FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  personaStatValue: {
    fontSize: 13,
    color: "#1E1E1E",
  },
  personaStatLabel: {
    fontSize: 10.5,
    color: "#888",
  },
  createPersonaWrap: {
    borderRadius: 12,
    overflow: "hidden",
  },
  createPersonaBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  createPersonaBtnText: {
    fontSize: 13,
    color: "#fff",
    letterSpacing: 0.2,
  },

  /* ── PERSONA ACTIVE ── */
  personaActiveCard: {
    marginHorizontal: SCREEN_PADDING,
    marginTop: 16,
    backgroundColor: "#F0FDF4",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.2)",
  },
  personaActiveHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  personaActiveCheckCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#22C55E",
    alignItems: "center",
    justifyContent: "center",
  },
  personaActiveTitle: {
    fontSize: 15,
    color: "#166534",
  },
  personaActiveSubtitle: {
    fontSize: 12,
    color: "#555",
    marginTop: 2,
  },
  personaCategoriesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  personaCategory: {
    alignItems: "center",
    width: (width - SCREEN_PADDING * 2 - 32) / 5,
  },
  personaCategoryCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  personaCategoryCheckDone: {
    backgroundColor: "#7C3AED",
  },
  personaCategoryLabel: {
    fontSize: 10,
    color: "#444",
    textAlign: "center",
    lineHeight: 13,
  },
  viewPersonaWrap: {
    alignSelf: "flex-end",
    borderRadius: 10,
    overflow: "hidden",
  },
  viewPersonaBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  viewPersonaBtnText: {
    fontSize: 13,
    color: "#fff",
    letterSpacing: 0.2,
  },

  /* ── BOTTOM BAR ── */
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.06)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 8,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
});