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
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons, Ionicons, Feather } from "@expo/vector-icons";

// --- GLOBAL FLAG TO PREVENT POPUPS REAPPEARING ON NAVIGATION ---
let arePermissionsHandled = false;

export default function DevicePage({ navigation }) {
  // --- STATE MANAGEMENT ---
  // Only show initial request if we haven't handled permissions yet
  const [showPermissionRequest, setShowPermissionRequest] = useState(
    !arePermissionsHandled
  );
  const [showPermissionDenied, setShowPermissionDenied] = useState(false);
  const [showDeviceAdded, setShowDeviceAdded] = useState(false);

  // --- FLOW LOGIC ---

  // 1. ALLOW -> Open Success Popup
  const handleAllow = () => {
    setShowPermissionRequest(false);
    setTimeout(() => setShowDeviceAdded(true), 200);
  };

  // 2. DENY -> Open Denied Explanation
  const handleDeny = () => {
    setShowPermissionRequest(false);
    setTimeout(() => setShowPermissionDenied(true), 200);
  };

  // 3. OK (on denied screen) -> Open Success Popup
  const handleDeniedOK = () => {
    setShowPermissionDenied(false);
    setTimeout(() => setShowDeviceAdded(true), 200);
  };

  // 4. PAIRED / BACK (Final Step) -> Close everything & Set Flag
  const handleFinalize = () => {
    setShowDeviceAdded(false);
    arePermissionsHandled = true; // Prevents popups from showing again this session
  };

  const myDevices = [
    {
      id: 1,
      name: "H Watch",
      status: "Connected",
      icon: "watch",
      color: "#FF9F43",
    },
    {
      id: 2,
      name: "Thinkplus-GM Pro",
      status: "Connected",
      icon: "headphones",
      color: "#8E44AD",
    },
  ];

  const otherDevices = [
    { id: 3, name: "LAPTOP-ADLMAF", icon: "laptop", color: "#7f8c8d" },
    {
      id: 4,
      name: "Sniper Smartwatch",
      icon: "watch-variant",
      color: "#7f8c8d",
    },
    { id: 5, name: "Headphone M5", icon: "headset", color: "#7f8c8d" },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* ======================================================== */}
      {/* 1. INITIAL PERMISSION REQUEST                            */}
      {/* ======================================================== */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showPermissionRequest}
        onRequestClose={() => {}}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Permissions Required</Text>
            <Text style={styles.modalDescription}>
              Blueringer to access this device’s location and turn on the
              Bluetooth
            </Text>

            <TouchableOpacity style={styles.modalButton} onPress={handleAllow}>
              <Text style={styles.allowText}>
                ALLOW ONLY WHILE USING THE APP
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalButton} onPress={handleDeny}>
              <Text style={styles.denyText}>DENY</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalButton} onPress={handleDeny}>
              <Text style={styles.denyText}>DENY & DON'T ASK AGAIN</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ======================================================== */}
      {/* 2. PERMISSION DENIED EXPLANATION                         */}
      {/* ======================================================== */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showPermissionDenied}
        onRequestClose={() => setShowPermissionDenied(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingVertical: 30 }]}>
            <Text style={styles.modalTitle}>Permissions Required</Text>
            <Text style={styles.modalDescription}>
              Please allow Bluetooth and location permission so you can search
              devices!
            </Text>

            <TouchableOpacity
              style={[styles.modalButton, { marginTop: 10 }]}
              onPress={handleDeniedOK}
            >
              <Text style={styles.okText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ======================================================== */}
      {/* 3. DEVICE ADDED SUCCESS POPUP                            */}
      {/* ======================================================== */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showDeviceAdded}
        onRequestClose={() => setShowDeviceAdded(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { paddingVertical: 40, paddingHorizontal: 30 },
            ]}
          >
            {/* Green Ring Icon */}
            <View style={styles.successRing}>
              <Feather name="check" size={50} color="#20C997" />
            </View>

            {/* Device Info */}
            <View style={styles.addedDeviceContainer}>
              <View style={styles.blueDeviceIcon}>
                <MaterialCommunityIcons
                  name="headphones"
                  size={32}
                  color="white"
                />
              </View>
              <View style={styles.addedDeviceInfoText}>
                <Text style={styles.addedDeviceName}>Thinkplus-GM Pro</Text>
                <Text style={styles.addedDeviceStatus}>Device Added</Text>
              </View>
            </View>

            {/* Buttons Row */}
            <View style={styles.popupBtnRow}>
              <TouchableOpacity
                style={styles.backPopupBtn}
                onPress={handleFinalize} // Closes popup permanently
              >
                <Text style={styles.backPopupText}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.pairedPopupBtn}
                onPress={handleFinalize} // Closes popup permanently
              >
                <Text style={styles.pairedPopupText}>Paired</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* --- MAIN PAGE CONTENT --- */}
      <LinearGradient
        colors={["#6DD5FA", "#2980B9"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.headerContent}>
            <TouchableOpacity>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.greetingText}>Hi Sakshi</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, styles.transparentCard]}>
          <Text style={styles.sectionTitle}>My Device</Text>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => navigation.navigate("AddDevicePage")}
            >
              <Ionicons
                name="add-circle"
                size={20}
                color="white"
                style={{ marginRight: 5 }}
              />
              <Text style={styles.addBtnText}>Add Device</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.findBtn}
              onPress={() => navigation.navigate("FindDeviceResultPage")}
            >
              <Text style={styles.findBtnText}>Find Device</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {myDevices.map((device, index) => (
            <View key={device.id} style={styles.deviceRow}>
              <View style={styles.deviceLeft}>
                <View
                  style={[styles.iconCircle, { backgroundColor: device.color }]}
                >
                  <MaterialCommunityIcons
                    name={
                      device.icon === "watch" ? "watch-variant" : "headphones"
                    }
                    size={28}
                    color="white"
                  />
                </View>
                <View style={styles.deviceInfo}>
                  <Text style={styles.deviceName}>{device.name}</Text>
                  <Text style={styles.deviceStatus}>{device.status}</Text>
                </View>
              </View>

              <View style={styles.deviceActions}>
                <View style={styles.verticalSeparator} />
                <TouchableOpacity style={{ marginRight: 5 }}>
                  <Ionicons name="settings-outline" size={22} color="#4fa3f7" />
                </TouchableOpacity>
                {index === 0 && (
                  <TouchableOpacity>
                    <MaterialCommunityIcons
                      name="trash-can"
                      size={22}
                      color="#ff4d4d"
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Other Device</Text>
          {otherDevices.map((device) => (
            <View key={device.id} style={styles.deviceRow}>
              <View style={styles.deviceLeft}>
                <View
                  style={[styles.iconCircle, { backgroundColor: "#7f8c8d" }]}
                >
                  <MaterialCommunityIcons
                    name={device.icon}
                    size={24}
                    color="white"
                  />
                </View>
                <Text style={[styles.deviceName, { marginTop: 10 }]}>
                  {device.name}
                </Text>
              </View>
              <View style={styles.deviceActions}>
                <View style={styles.verticalSeparator} />
                <TouchableOpacity>
                  <MaterialCommunityIcons
                    name="dots-vertical"
                    size={24}
                    color="#555"
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
        <View style={{ height: 80 }} />
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItemActive}>
          <Ionicons name="home" size={20} color="white" />
          <Text style={styles.navTextActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("MyDevicePage")}
        >
          <Feather name="monitor" size={24} color="#777" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person-outline" size={24} color="#777" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },

  // --- MODAL STYLES ---
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#000",
  },
  modalDescription: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  modalButton: {
    marginVertical: 8,
    width: "100%",
    alignItems: "center",
    paddingVertical: 5,
  },
  allowText: {
    color: "#4fa3f7",
    fontWeight: "700",
    fontSize: 14,
    textAlign: "center",
  },
  denyText: { color: "#4fa3f7", fontWeight: "600", fontSize: 14 },
  okText: { color: "#4fa3f7", fontWeight: "700", fontSize: 16 },

  // --- SUCCESS POPUP STYLES ---
  successRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 6,
    borderColor: "#20C997",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  addedDeviceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  blueDeviceIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4fa3f7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    shadowColor: "#4fa3f7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  addedDeviceInfoText: {
    justifyContent: "center",
  },
  addedDeviceName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  addedDeviceStatus: {
    fontSize: 14,
    color: "#888",
  },
  popupBtnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  backPopupBtn: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pairedPopupBtn: {
    flex: 1,
    backgroundColor: "#4fa3f7",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginLeft: 10,
    elevation: 3,
  },
  backPopupText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 15,
  },
  pairedPopupText: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
  },

  // --- MAIN SCREEN STYLES ---
  headerGradient: {
    height: 220,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 20,
  },
  safeArea: { marginTop: Platform.OS === "android" ? 30 : 0 },
  headerContent: { marginTop: 20 },
  greetingText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#000",
    marginTop: 15,
  },
  scrollView: { flex: 1, marginTop: -80 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 20 },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  transparentCard: { backgroundColor: "rgba(255, 255, 255, 0.85)" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 15,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
    marginVertical: 15,
  },
  actionRow: { flexDirection: "row", justifyContent: "space-between" },
  addBtn: {
    flex: 1,
    backgroundColor: "#4fa3f7",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 10,
  },
  addBtnText: { color: "white", fontWeight: "600", fontSize: 14 },
  findBtn: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderWidth: 1,
    borderColor: "#4fa3f7",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    marginLeft: 10,
  },
  findBtnText: { color: "#4fa3f7", fontWeight: "600", fontSize: 14 },
  deviceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  deviceLeft: { flexDirection: "row", alignItems: "center" },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  deviceInfo: { justifyContent: "center" },
  deviceName: { fontSize: 16, fontWeight: "600", color: "#333" },
  deviceStatus: { fontSize: 12, color: "#555", marginTop: 2 },
  deviceActions: { flexDirection: "row", alignItems: "center" },
  verticalSeparator: {
    width: 1,
    height: 24,
    backgroundColor: "#EEEEEE",
    marginRight: 12,
  },
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
  navItem: { alignItems: "center", justifyContent: "center" },
  navItemActive: {
    flexDirection: "row",
    backgroundColor: "#4fa3f7",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  navTextActive: { color: "white", marginLeft: 5, fontWeight: "600" },
});
