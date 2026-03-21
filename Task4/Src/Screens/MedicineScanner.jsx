import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  StatusBar,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  Platform,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

// Ensure this path is correct
import { analyzeMedicineImage } from "../Services/MedicineService";

const { width } = Dimensions.get("window");

const MedicineScanner = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);

  // 1. Loading Permissions
  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#81C7D4" />
      </View>
    );
  }

  // 2. Permission Denied
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={{ marginBottom: 20, fontSize: 16 }}>
          Camera access is required.
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          style={styles.grantButton}
        >
          <Text style={styles.grantButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 3. MAIN LOGIC
  const handleScan = async () => {
    if (cameraRef.current && !isScanning) {
      try {
        setIsScanning(true);

        // A. Capture
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
          skipProcessing: true,
        });

        console.log("Image captured:", photo.uri);

        // B. Analyze
        // Note: If you hit the API rate limit, this returns NULL
        const extractedData = await analyzeMedicineImage(photo.uri);

        // C. Navigate or Error
        if (extractedData) {
          console.log("Success! Navigating to Details...");

          // ✅ NAVIGATION STEP
          // This sends the data to the next page so it doesn't have to load again
          navigation.navigate("MedicineDetails", {
            data: extractedData,
            imageUri: photo.uri,
          });
        } else {
          // ⚠️ If we are here, the API failed (likely Quota Limit)
          Alert.alert(
            "Analysis Limit Reached",
            "The AI server is busy or you hit the free limit. Please wait 60 seconds and try again."
          );
        }
      } catch (error) {
        console.error("Scanner Error:", error);
        Alert.alert("Error", "Something went wrong while scanning.");
      } finally {
        setIsScanning(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {/* Camera Feed */}
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        ref={cameraRef}
      />

      {/* Overlay */}
      <View style={[styles.overlayContainer, StyleSheet.absoluteFill]}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Image
            source={require("../../assets/Know.png")}
            style={StyleSheet.absoluteFillObject}
            resizeMode="cover"
          />
          <SafeAreaView style={styles.headerSafeArea}>
            <View style={styles.headerContent}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation?.goBack()}
                disabled={isScanning}
              >
                <Text style={styles.backArrow}>←</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Know Your Medicine</Text>
            </View>
          </SafeAreaView>
        </View>

        {/* Scanner Box */}
        <View style={styles.scannerRegion}>
          <View style={styles.scanBoxBackground}>
            {isScanning ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#004D40" />
                <Text style={styles.loadingText}>Analyzing...</Text>
              </View>
            ) : (
              <View style={styles.scanHighlighter} />
            )}
          </View>
          {/* Corners */}
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>

        {/* Footer */}
        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={[styles.scanButton, isScanning && styles.disabledButton]}
            onPress={handleScan}
            activeOpacity={0.8}
            disabled={isScanning}
          >
            <Text style={styles.scanButtonText}>
              {isScanning ? "Processing..." : "Scan"}
            </Text>
          </TouchableOpacity>
          <Image
            source={require("../../assets/Medi.png")}
            style={styles.footerImage}
            resizeMode="cover"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  grantButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#81C7D4",
    borderRadius: 8,
  },
  grantButtonText: { fontWeight: "bold", color: "#000", fontSize: 16 },
  overlayContainer: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "transparent",
    zIndex: 1,
  },
  headerContainer: {
    width: width,
    height: 140,
    position: "relative",
    backgroundColor: "transparent",
  },
  headerSafeArea: { flex: 1, paddingTop: Platform.OS === "android" ? 30 : 0 },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  backButton: { padding: 5, marginRight: 15 },
  backArrow: { fontSize: 30, color: "#004D40", fontWeight: "bold" },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#004D40" },
  scannerRegion: {
    width: 300,
    height: 250,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -20,
  },
  scanBoxBackground: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.35)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  scanHighlighter: {
    width: 280,
    height: 120,
    backgroundColor: "rgba(255, 255, 255, 0.45)",
    borderRadius: 12,
  },
  loadingContainer: { alignItems: "center", justifyContent: "center" },
  loadingText: {
    marginTop: 10,
    color: "#004D40",
    fontWeight: "bold",
    fontSize: 16,
  },
  corner: {
    position: "absolute",
    width: 40,
    height: 40,
    borderColor: "#81C7D4",
    borderWidth: 5,
    borderRadius: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderTopLeftRadius: 20,
  },
  topRight: {
    top: 0,
    right: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderTopRightRadius: 20,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomLeftRadius: 20,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomRightRadius: 20,
  },
  footerContainer: { width: "100%", alignItems: "center" },
  scanButton: {
    backgroundColor: "#81C7D4",
    width: 280,
    height: 55,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: -25,
    zIndex: 10,
    elevation: 8,
  },
  disabledButton: { backgroundColor: "#B0BEC5" },
  scanButtonText: { color: "black", fontSize: 18, fontWeight: "bold" },
  footerImage: { width: width, height: 150, marginTop: 0 },
});

export default MedicineScanner;
