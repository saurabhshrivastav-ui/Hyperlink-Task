import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const HealthCard = ({ title, description, icon, expanded, onPress }) => {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={34} color="#6A4DF4" />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.desc}>{description}</Text>

        <TouchableOpacity onPress={onPress}>
          <Text style={styles.link}>
            Explore Checks {expanded ? "⌃" : "⌄"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HealthCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#EFE7FF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    alignItems: "center",
  },
  iconWrap: {
    width: 60,
    height: 60,
    backgroundColor: "#fff",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2D1B69",
  },
  desc: {
    fontSize: 12,
    color: "#555",
    marginVertical: 6,
  },
  link: {
    color: "#6A4DF4",
    fontWeight: "700",
    fontSize: 13,
  },
});
