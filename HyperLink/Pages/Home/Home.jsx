import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const isSmallScreen = width < 360;

const isMini = width <= 360; // iPhone 12 mini
const isSmall = width <= 390; // iPhone 12 / 13
// ✅ Gradient Text with weight support

const Home = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.fabContainer}
        onPress={() => navigation.navigate("SelfSense")}
      >
        <LinearGradient
          colors={["rgb(31, 154, 255)", "rgb(74, 183, 255)", "#5a00c7ff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fab}
        >
          <MaterialCommunityIcons name="dna" size={34} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  fabContainer: {
    position: "absolute",
    bottom: 90,
    right: 25,
    zIndex: 999,
  },
  fab: {
    width: 70,
    height: 70,
    borderRadius: 70 / 2,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
});

export default Home;
