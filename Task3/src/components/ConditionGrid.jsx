import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const conditions = [
  { name: "Diabetes", icon: "diabetes" },
  { name: "Hypertension", icon: "heart-pulse" },
  { name: "PCOS", icon: "human-female" },
  { name: "Thyroid", icon: "butterfly" },
  { name: "Heart", icon: "heart" },
  { name: "Obesity", icon: "scale-bathroom" },
];

const ConditionGrid = () => {
  return (
    <View style={styles.grid}>
      {conditions.map((item, index) => (
        <View key={index} style={styles.box}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons
              name={item.icon}
              size={26}
              color="#6A4DF4"
            />
          </View>
          <Text style={styles.text}>{item.name}</Text>
        </View>
      ))}
    </View>
  );
};

export default ConditionGrid;

const styles = StyleSheet.create({
  grid: {
    backgroundColor: "#EFE7FF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  box: {
    width: "30%",
    alignItems: "center",
    marginBottom: 18,
  },
  iconCircle: {
    backgroundColor: "#fff",
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2D1B69",
    textAlign: "center",
  },
});
