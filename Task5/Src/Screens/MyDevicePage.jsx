import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
  Switch,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons, Ionicons, Feather } from "@expo/vector-icons";

export default function MyDevicePage({ navigation }) {
  // Data for "Recently Active" list
  const [devices, setDevices] = useState([
    {
      id: 1,
      name: "H Watch",
      status: "Connected",
      isOnline: true,
      icon: "watch",
      color: "#FF9F43", // Orange
      isEnabled: true,
    },
    {
      id: 2,
      name: "Thinkplus-GM Pro",
      status: "Disconnected",
      isOnline: false,
      icon: "headphones",
      color: "#D066FF", // Purple
      isEnabled: false,
    },
  ]);

  // --- UPDATED TOGGLE LOGIC ---
  const toggleSwitch = (id) => {
    setDevices((prevDevices) =>
      prevDevices.map((device) => {
        if (device.id === id) {
          const newState = !device.isEnabled; // Determine new state first
          return {
            ...device,
            isEnabled: newState,
            // Update online status based on switch
            isOnline: newState,
            // Update text based on switch
            status: newState ? "Connected" : "Disconnected",
          };
        }
        return device;
      })
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* --- HEADER --- */}
      <LinearGradient
        colors={["#6DD5FA", "#2980B9"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.greetingText}>Hi Sakshi</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* --- MAIN SCROLL CONTENT --- */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Recently Active</Text>

          {devices.map((device) => (
            <View key={device.id} style={styles.deviceRow}>
              {/* Left Side: Icon + Text */}
              <View style={styles.deviceLeft}>
                <View
                  style={[styles.iconCircle, { backgroundColor: device.color }]}
                >
                  <MaterialCommunityIcons
                    name={
                      device.icon === "watch" ? "watch-variant" : "headphones"
                    }
                    size={24}
                    color="white"
                  />
                </View>
                <View style={styles.deviceInfo}>
                  <Text style={styles.deviceName}>{device.name}</Text>
                  <View style={styles.statusRow}>
                    {/* Status Dot */}
                    <View
                      style={[
                        styles.statusDot,
                        {
                          backgroundColor: device.isOnline
                            ? "#2ECC71"
                            : "#B0B0B0",
                        },
                      ]}
                    />
                    <Text
                      style={[
                        styles.deviceStatus,
                        { color: device.isOnline ? "#2ECC71" : "#B0B0B0" },
                      ]}
                    >
                      {device.status}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Right Side: Separator + Switch */}
              <View style={styles.deviceRight}>
                <View style={styles.verticalSeparator} />
                <Switch
                  trackColor={{ false: "#E0E0E0", true: "#4fa3f7" }}
                  thumbColor={"white"}
                  ios_backgroundColor="#E0E0E0"
                  onValueChange={() => toggleSwitch(device.id)}
                  value={device.isEnabled}
                  style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                />
              </View>
            </View>
          ))}

          {/* Add Device Button */}
          <TouchableOpacity
            style={styles.addDeviceBtn}
            onPress={() => navigation.navigate("AddDevicePage")}
          >
            <Ionicons
              name="add-circle"
              size={20}
              color="white"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.addDeviceText}>Add Device</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* --- BOTTOM NAVIGATION --- */}
      <View style={styles.bottomNav}>
        {/* Home (Inactive - Navigates back to main DevicePage) */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("DevicePage")}
        >
          <Ionicons name="home-outline" size={24} color="#888" />
        </TouchableOpacity>

        {/* My Device (Active Pill) */}
        <TouchableOpacity style={styles.navItemActive}>
          <Feather name="monitor" size={20} color="white" />
          <Text style={styles.navTextActive}>My Device</Text>
        </TouchableOpacity>

        {/* Profile (Inactive) */}
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person-outline" size={24} color="#888" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  headerGradient: {
    height: 220,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 20,
  },
  safeArea: {
    marginTop: Platform.OS === "android" ? 30 : 0,
  },
  headerContent: {
    marginTop: 20,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#000",
    marginTop: 15,
  },
  scrollView: {
    flex: 1,
    marginTop: -80,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 20,
  },
  deviceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  deviceLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  deviceInfo: {
    justifyContent: "center",
  },
  deviceName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  deviceStatus: {
    fontSize: 12,
    fontWeight: "500",
  },
  deviceRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  verticalSeparator: {
    width: 1,
    height: 24,
    backgroundColor: "#EEEEEE",
    marginRight: 10,
  },
  addDeviceBtn: {
    backgroundColor: "#3A8DFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
  },
  addDeviceText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },

  // --- BOTTOM NAV ---
  bottomNav: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  navItemActive: {
    flexDirection: "row",
    backgroundColor: "#3A8DFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  navTextActive: {
    color: "white",
    marginLeft: 8,
    fontWeight: "600",
    fontSize: 14,
  },
});
