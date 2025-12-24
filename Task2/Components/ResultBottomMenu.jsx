import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { Text } from "./TextWrapper";

const ResultBottomMenu = ({ active }) => {
  const navigation = useNavigation();
  const [selected, setSelected] = useState(active);

  // Sync state when screen changes
  useEffect(() => {
    setSelected(active);
  }, [active]);

  const handlePress = (key, route) => {
    setSelected(key);
    navigation.navigate(route);
  };

  return (
    <View style={styles.container}>
      <MenuButton
        icon="check-circle"
        label="Low"
        isActive={selected === "low"}
        onPress={() => handlePress("low", "LowRisk")}
      />

      <MenuButton
        icon="alert-circle"
        label="Moderate"
        isActive={selected === "moderate"}
        onPress={() => handlePress("moderate", "ModerateRisk")}
      />

      <MenuButton
        icon="alert-triangle"
        label="High"
        isActive={selected === "high"}
        onPress={() => handlePress("high", "HighRisk")}
      />
    </View>
  );
};

const MenuButton = ({ icon, label, onPress, isActive }) => {
  const Content = (
    <>
      <Feather
        name={icon}
        size={18}
        color={isActive ? "#fff" : "#553fb5"}
      />
      <Text
        style={[styles.text, isActive && styles.activeText]}
        weight="700"
      >
        {label}
      </Text>
    </>
  );

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      {isActive ? (
        <LinearGradient
          colors={["#6a5af9", "#553fb5"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.activeButton}
        >
          {Content}
        </LinearGradient>
      ) : (
        <View style={styles.button}>{Content}</View>
      )}
    </TouchableOpacity>
  );
};

export default ResultBottomMenu;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 25,
    backgroundColor: "#f2f2f2",
  },
  activeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 25,
  },
  text: {
    fontSize: 14,
    color: "#553fb5",
  },
  activeText: {
    color: "#fff",
  },
});