import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Text } from "../Components/TextWrapper";

const { width } = Dimensions.get("window");

const MOCK_VOICES = [
  {
    id: 1,
    name: "Sakshi Nishad",
    relation: "Daughter",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
    active: true,
  },
  {
    id: 2,
    name: "Aditya Sharma",
    relation: "Son",
    image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12",
    active: false,
  },
];

export default function ManageAddedVoices() {
  const navigation = useNavigation();
  const [voices, setVoices] = useState(MOCK_VOICES);

  const toggleActive = (id) => {
    setVoices((prev) =>
      prev.map((v) => (v.id === id ? { ...v, active: !v.active } : v))
    );
  };

  return (
    <View style={styles.root}>
      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#4B2B7F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Added Voices</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ===== VOICE CARDS ===== */}
        {voices.map((item) => (
          <View key={item.id} style={styles.voiceCard}>
            <View style={styles.cardTop}>
              <Image
                source={{ uri: item.image }}
                style={styles.avatar}
                resizeMode="cover"
              />

              <View style={{ flex: 1 }}>
                <Text style={styles.voiceName}>{item.name}</Text>
                <Text style={styles.voiceRelation}>{item.relation}</Text>
              </View>

              <View style={styles.statusWrap}>
                <Switch
                  // FIXED: Added !! to ensure boolean type and prevent native crash
                  value={!!item.active}
                  onValueChange={() => toggleActive(item.id)}
                  thumbColor="#FFFFFF"
                  trackColor={{
                    false: "#E2D9FF",
                    true: "#8E5CFF",
                  }}
                />
                <Text
                  style={[
                    styles.statusText,
                    { color: item.active ? "#6B2FD6" : "#9B8CCB" },
                  ]}
                >
                  {item.active ? "Currently Active" : "Voice Added"}
                </Text>
              </View>
            </View>

            {/* ===== ACTION BUTTONS ===== */}
            <View style={styles.actionsRow}>
              <ActionButton label="Listen Again" />
              <ActionButton label="View Reminders" />
              <ActionButton label="Edit Voice" />
            </View>
          </View>
        ))}

        {/* ===== ADD NEW VOICE CTA ===== */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate("HelixAddVoice")}
        >
          <LinearGradient
            colors={["#8E2DE2", "#E94057"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>Add New Voice</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* ===== ACTION BUTTON ===== */

const ActionButton = ({ label }) => (
  <TouchableOpacity activeOpacity={0.85} style={styles.actionBtn}>
    <Text style={styles.actionText}>{label}</Text>
  </TouchableOpacity>
);

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    marginTop: 54,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4B2B7F",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  voiceCard: {
    backgroundColor: "#F6EEFF",
    borderRadius: 20,
    padding: 14,
    marginBottom: 16,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 12,
  },
  voiceName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2C1A4D",
  },
  voiceRelation: {
    fontSize: 12,
    color: "#7B6AA8",
    marginTop: 2,
  },
  statusWrap: {
    alignItems: "flex-end",
  },
  statusText: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: "600",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  actionBtn: {
    backgroundColor: "#E9DCFF",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  actionText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6B2FD6",
  },
  addButton: {
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 22,
    alignItems: "center",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});