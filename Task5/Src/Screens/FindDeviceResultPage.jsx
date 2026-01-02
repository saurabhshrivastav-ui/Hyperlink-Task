import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  Image, // 1. Added Image import
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
  Feather,
} from "@expo/vector-icons";

export default function FindDeviceResultPage({ navigation }) {
  const foundDevices = [
    {
      id: 1,
      name: "Thinkplus-GM Pro",
      distance: "19.2m away from you",
      location: "20.30 at Holland Mall",
      icon: "headphones",
      color: "#4fa3f7", // Blue
      isClose: false,
      actions: ["Sound", "Vibrate"],
    },
    {
      id: 2,
      name: 'Ipad pro 11"',
      distance: "0.2m away from you",
      location: "07.15 at Megaman Street No.12",
      icon: "tablet-cellphone",
      color: "#D066FF", // Purple
      isClose: true,
      actions: ["Sound", "Vibrate", "Call"],
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Header Gradient */}
      <LinearGradient
        colors={["#AEE2FF", "#3A8DFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Header Row */}
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={26} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hi Sakshi</Text>
        </View>

        {/* Main Content Container */}
        <View style={styles.contentContainer}>
          {/* Glass Card */}
          <LinearGradient
            colors={["rgba(255, 255, 255, 0.65)", "#ffffff", "#ffffff"]}
            locations={[0, 0.35, 1]}
            style={styles.glassCard}
          >
            <Text style={styles.cardTitle}>Finding completed</Text>

            {foundDevices.map((device, index) => (
              <View key={device.id} style={styles.deviceWrapper}>
                <View style={styles.deviceRow}>
                  {/* Icon */}
                  <View
                    style={[
                      styles.iconCircle,
                      { backgroundColor: device.color },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={device.icon}
                      size={28}
                      color="white"
                    />
                  </View>

                  {/* Info */}
                  <View style={styles.deviceInfo}>
                    <View style={styles.nameRow}>
                      <Text style={styles.deviceName}>{device.name}</Text>
                      <TouchableOpacity>
                        <MaterialCommunityIcons
                          name="dots-vertical"
                          size={20}
                          color="#777"
                        />
                      </TouchableOpacity>
                    </View>

                    <Text
                      style={[
                        styles.deviceDistance,
                        { color: device.isClose ? "#2ECC71" : "#FF4D4D" },
                      ]}
                    >
                      {device.distance}
                    </Text>

                    <Text style={styles.deviceLocation}>{device.location}</Text>
                  </View>
                </View>

                {/* Actions */}
                <View style={styles.actionsRow}>
                  {device.actions.includes("Sound") && (
                    <TouchableOpacity style={styles.actionBtn}>
                      <MaterialCommunityIcons
                        name="cellphone-sound"
                        size={18}
                        color="#444"
                      />
                      <Text style={styles.actionText}>Sound</Text>
                    </TouchableOpacity>
                  )}

                  {device.actions.includes("Vibrate") && (
                    <TouchableOpacity style={styles.actionBtn}>
                      <MaterialCommunityIcons
                        name="vibrate"
                        size={18}
                        color="#444"
                      />
                      <Text style={styles.actionText}>Vibrate</Text>
                    </TouchableOpacity>
                  )}

                  {device.actions.includes("Call") && (
                    <TouchableOpacity style={styles.actionBtn}>
                      <Feather name="phone" size={16} color="#444" />
                      <Text style={styles.actionText}>Call</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {index < foundDevices.length - 1 && (
                  <View style={styles.divider} />
                )}
              </View>
            ))}

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.foundItBtn}>
                <Ionicons
                  name="checkmark-sharp"
                  size={22}
                  color="white"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.foundItText}>I Found It</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.tryAgainBtn}>
                <MaterialCommunityIcons
                  name="refresh"
                  size={20}
                  color="#4fa3f7"
                />
                <Text style={styles.tryAgainText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* 3. MAP CARD WITH IMAGE */}
          <View style={styles.mapCard}>
            <View style={styles.mapContainer}>
              {/* --- REPLACED CSS LINES WITH IMAGE --- */}
              {/* Make sure 'Map.png' is in your assets folder */}
              <Image
                source={require("../../assets/Map.png")}
                style={styles.mapImage}
                resizeMode="cover"
              />

              {/* Pins (Overlay on top of image) */}
              <MaterialCommunityIcons
                name="map-marker"
                size={34}
                color="#4fa3f7"
                style={styles.pin1}
              />

              <View style={styles.pin2Container}>
                <MaterialCommunityIcons
                  name="map-marker"
                  size={34}
                  color="#D066FF"
                />
                <View style={styles.walkingBadge}>
                  <FontAwesome5 name="walking" size={10} color="white" />
                </View>
              </View>

              <TouchableOpacity style={styles.expandMapBtn}>
                <MaterialCommunityIcons
                  name="arrow-expand-all"
                  size={18}
                  color="#555"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  headerGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "55%",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  safeArea: {
    flex: 1,
    marginTop: Platform.OS === "android" ? 40 : 0,
  },
  headerContent: {
    paddingHorizontal: 20,
    marginBottom: 10,
    zIndex: 10,
  },
  backButton: {
    marginBottom: 5,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#000",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
    justifyContent: "space-between",
  },

  // --- GLASS CARD ---
  glassCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#4fa3f7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    color: "#4fa3f7",
    fontWeight: "600",
    marginBottom: 15,
    marginTop: 5,
  },
  deviceWrapper: {
    marginBottom: 8,
  },
  deviceRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  deviceInfo: {
    flex: 1,
    justifyContent: "center",
    paddingTop: 0,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deviceName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 2,
  },
  deviceDistance: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 2,
  },
  deviceLocation: {
    fontSize: 11,
    color: "#888",
    fontWeight: "600",
  },
  actionsRow: {
    flexDirection: "row",
    marginTop: 10,
    marginLeft: 56,
    marginBottom: 5,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  actionText: {
    fontSize: 12,
    color: "#444",
    marginLeft: 6,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginVertical: 12,
    marginLeft: 56,
  },
  buttonContainer: {
    marginTop: 10,
  },
  foundItBtn: {
    backgroundColor: "#3A8DFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#3A8DFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  foundItText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  tryAgainBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  tryAgainText: {
    color: "#3A8DFF",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 8,
  },

  // --- MAP CARD ---
  mapCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 24,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  mapContainer: {
    flex: 1,
    backgroundColor: "#F2F4F8",
    borderRadius: 18,
    overflow: "hidden",
    position: "relative",
  },
  // Added Style for the Map Image
  mapImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  pin1: {
    position: "absolute",
    top: "20%",
    left: "15%",
    shadowColor: "black",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5,
  },
  pin2Container: {
    position: "absolute",
    bottom: "30%",
    right: "25%",
    alignItems: "center",
  },
  walkingBadge: {
    position: "absolute",
    bottom: 0,
    right: -8,
    backgroundColor: "#2ECC71",
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "white",
  },
  expandMapBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "white",
    padding: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
