import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Text } from "./TextWrapper";

const ResultBottomMenu = ({ active }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <MenuButton
        title="Sakshi"
        active={active === "sakshi"}
        onPress={() => navigation.navigate("Result")}
      />
      <MenuButton
        title="Aditya"
        active={active === "aditya"}
        onPress={() => navigation.navigate("ResultAditya")}
      />
      <MenuButton
        title="Saurabh"
        active={active === "saurabh"}
        onPress={() => navigation.navigate("ResultSaurabh")}
      />
    </View>
  );
};

const MenuButton = ({ title, onPress, active }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.button, active && styles.activeButton]}
    activeOpacity={0.8}
  >
    <Text style={[styles.text, active && styles.activeText]} weight="700">
      {title}
    </Text>
  </TouchableOpacity>
);

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
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  activeButton: {
    backgroundColor: "#553fb5",
  },
  text: {
    fontSize: 14,
    color: "#444",
  },
  activeText: {
    color: "#fff",
  },
});
