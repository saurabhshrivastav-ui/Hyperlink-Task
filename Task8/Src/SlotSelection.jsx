import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { Text } from "../Components/TextWrapper";

const { width } = Dimensions.get("window");

const days = [
  { label: "Today", slots: "6 slots" },
  { label: "Tomorrow", slots: "10 slots" },
  { label: "Sun, 29 jun", slots: "12 slots" },
];

const timePeriods = ["Morning", "Afternoon", "Evening"];

const timeSlots = [
  "09.00 am - 10.00 am",
  "10.00 am - 11.00 am",
  "11.00 am - 12.00 pm",
];

const SlotSelection = () => {
  const navigation = useNavigation();
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={["#E4CCF7", "#FFE9CF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0.4 }}
          style={styles.headerGradient}
        >
          <View style={styles.navRow}>
            <TouchableOpacity
              style={styles.backBtn}
              activeOpacity={0.7}
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="arrow-back" size={24} color="#6D28D9" />
            </TouchableOpacity>
            <Text weight="700" style={styles.navTitle}>
              Slot Selection
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.profileRow}>
              <LinearGradient
                colors={["#FDBEA5", "#F695CF", "#8E66EB"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.avatarOuterRing}
              >
                <View style={styles.avatarWhiteRing}>
                  <LinearGradient
                    colors={["#EEA6C8", "#996EEB"]}
                    start={{ x: 0.13, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.avatarGradient}
                  >
                    <Text weight="700" style={styles.avatarText}>SN</Text>
                  </LinearGradient>
                </View>
              </LinearGradient>

              <View style={styles.profileInfo}>
                <Text weight="700" style={styles.profileName}>Sakshi Nishad</Text>
                <View style={styles.tagsRow}>
                  <View style={styles.tag}>
                    <Text weight="500" style={styles.tagText}>Female</Text>
                  </View>
                  <View style={styles.tag}>
                    <Text weight="500" style={styles.tagText}>22 yrs</Text>
                  </View>
                </View>
              </View>

              <View style={styles.dropdownIcon}>
                <Ionicons name="chevron-down" size={22} color="#7C3AED" />
              </View>
            </View>
          </View>

          {/* Select Address */}
          <View style={styles.addressCard}>
            <View style={styles.addressHeader}>
              <Text weight="600" style={styles.addressTitle}>Select Address</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text weight="600" style={styles.changeText}>Change</Text>
              </TouchableOpacity>
            </View>
            <Text weight="700" style={styles.addressLine1}>
              473, Torana Chs, Ramnagar, Ghatkopar West
            </Text>
            <Text weight="400" style={styles.addressLine2}>
              Mumbai, Maharashtra – 400086
            </Text>
          </View>

          {/* Select A Slot */}
          <View style={styles.slotCard}>
            <Text weight="600" style={styles.slotTitle}>Select A Slot</Text>

            {/* Day Pills */}
            <View style={styles.dayRow}>
              {days.map((day, index) => (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.8}
                  onPress={() => setSelectedDay(index)}
                  style={[
                    styles.dayPill,
                    selectedDay === index && styles.dayPillActive,
                  ]}
                >
                  <Text
                    weight="600"
                    style={[
                      styles.dayPillLabel,
                      selectedDay === index && styles.dayPillLabelActive,
                    ]}
                  >
                    {day.label}
                  </Text>
                  <Text
                    weight="400"
                    style={[
                      styles.dayPillSlots,
                      selectedDay === index && styles.dayPillSlotsActive,
                    ]}
                  >
                    {day.slots}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Time Period Pills */}
            <View style={styles.periodRow}>
              {timePeriods.map((period, index) => (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.8}
                  onPress={() => setSelectedPeriod(index)}
                  style={[
                    styles.periodPill,
                    selectedPeriod === index && styles.periodPillActive,
                  ]}
                >
                  <Text
                    weight="500"
                    style={[
                      styles.periodPillText,
                      selectedPeriod === index && styles.periodPillTextActive,
                    ]}
                  >
                    {period}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Time Slots */}
            <View style={styles.timeSlotsContainer}>
              {timeSlots.map((slot, index) => (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.8}
                  onPress={() => setSelectedSlot(index)}
                  style={styles.timeSlotRow}
                >
                  <View style={styles.radioOuter}>
                    {selectedSlot === index && <View style={styles.radioInner} />}
                  </View>
                  <Text
                    weight={selectedSlot === index ? "600" : "400"}
                    style={styles.timeSlotText}
                  >
                    {slot}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity activeOpacity={0.8} style={styles.continueBtnWrap}>
          <LinearGradient
            colors={["#B148FF", "#F6339B", "#9914F9"]}
            locations={[0, 0.5, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.continueBtn}
          >
            <Text weight="700" style={styles.continueBtnText}>Continue</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFBFF",
  },
  scrollView: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: Platform.OS === "android" ? 44 : 54,
    paddingBottom: 18,
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
  navTitle: {
    fontSize: 18,
    color: "#553FB5",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 20,
  },

  // Profile Card
  profileCard: {
    backgroundColor: "#F8F4FC",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
    padding: 14,
    marginBottom: 14,
    shadowColor: "#BF7BB9",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarOuterRing: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    padding: 2,
  },
  avatarWhiteRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
  },
  avatarGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 18,
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 17,
    color: "#1F2937",
    marginBottom: 5,
  },
  tagsRow: {
    flexDirection: "row",
    gap: 6,
  },
  tag: {
    backgroundColor: "#F5F3FF",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E9D5FF",
  },
  tagText: {
    fontSize: 11,
    color: "#7C3AED",
  },
  dropdownIcon: {
    padding: 8,
    backgroundColor: "#F1E7FE",
    borderRadius: 20,
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  // Address Card
  addressCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#F3E8FF",
    shadowColor: "#BF7BB9",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  addressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  addressTitle: {
    fontSize: 15,
    color: "#1F2937",
  },
  changeText: {
    fontSize: 13,
    color: "#6D28D9",
  },
  addressLine1: {
    fontSize: 13,
    color: "#1F2937",
    marginBottom: 2,
  },
  addressLine2: {
    fontSize: 12,
    color: "#6B7280",
  },

  // Slot Card
  slotCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F3E8FF",
    shadowColor: "#BF7BB9",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  slotTitle: {
    fontSize: 15,
    color: "#1F2937",
    marginBottom: 14,
  },

  // Day Pills
  dayRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  dayPill: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  dayPillActive: {
    backgroundColor: "#F5F3FF",
    borderColor: "#7C3AED",
  },
  dayPillLabel: {
    fontSize: 12,
    color: "#374151",
  },
  dayPillLabelActive: {
    color: "#7C3AED",
  },
  dayPillSlots: {
    fontSize: 10,
    color: "#9CA3AF",
    marginTop: 2,
  },
  dayPillSlotsActive: {
    color: "#7C3AED",
  },

  // Period Pills
  periodRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },
  periodPill: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  periodPillActive: {
    backgroundColor: "#F5F3FF",
    borderColor: "#7C3AED",
  },
  periodPillText: {
    fontSize: 12,
    color: "#374151",
  },
  periodPillTextActive: {
    color: "#7C3AED",
  },

  // Time Slots
  timeSlotsContainer: {
    gap: 16,
  },
  timeSlotRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#7C3AED",
  },
  timeSlotText: {
    fontSize: 14,
    color: "#1F2937",
  },

  // Bottom Bar
  bottomBar: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    paddingBottom: Platform.OS === "ios" ? 30 : 14,
  },
  continueBtnWrap: {
    borderRadius: 14,
    overflow: "hidden",
  },
  continueBtn: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  continueBtnText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default SlotSelection;
