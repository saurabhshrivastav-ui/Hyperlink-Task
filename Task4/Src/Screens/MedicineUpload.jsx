import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  StatusBar,
  Dimensions,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const { width } = Dimensions.get("window");

const MedicineUpload = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 1. Function to Pick Image from Gallery
  const pickImage = async () => {
    // Request Permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Sorry, we need camera roll permissions to upload images!"
      );
      return;
    }

    // Launch Gallery
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // Allows user to crop/center the medicine
      aspect: [3, 4], // Matches the portrait aspect ratio roughly
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // 2. Handle Process Action - MODIFIED
  const handleProcess = () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);

    // Simulate a short delay for UX, then navigate
    setTimeout(() => {
      setIsAnalyzing(false);
      
      // Navigate to the Details screen and pass the image
      navigation.navigate("MedicineDetails", { imageUri: selectedImage });
      
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {/* --- LAYER 1: BACKGROUND (Image or Black) --- */}
      {selectedImage ? (
        <Image
          source={{ uri: selectedImage }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
      ) : (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: "black" }]} />
      )}

      {/* --- LAYER 2: UI OVERLAY --- */}
      <View style={styles.overlayContainer}>
        {/* HEADER SECTION */}
        <View style={styles.headerContainer}>
          {/* Background Image */}
          <Image
            source={require("../../assets/Know.png")}
            style={StyleSheet.absoluteFillObject}
            resizeMode="cover"
          />

          {/* Header Content */}
          <SafeAreaView style={styles.headerSafeArea}>
            <View style={styles.headerContent}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation?.goBack()}
              >
                <Text style={styles.backArrow}>←</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Upload Medicine</Text>
            </View>
          </SafeAreaView>
        </View>

        {/* CENTER SCANNER BOX (Visual Guide) */}
        <View style={styles.scannerRegion}>
          {/* Only show the 'frosted' guide if no image is selected, 
               OR keep it to show user which part is being analyzed. */}
          <View style={styles.scanBoxBackground}>
            <View style={styles.scanHighlighter} />
          </View>

          {/* Cyan Corner Brackets */}
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />

          {/* Optional: Text Instruction if no image */}
          {!selectedImage && (
            <Text style={styles.placeholderText}>No image selected</Text>
          )}
        </View>

        {/* FOOTER AREA */}
        <View style={styles.footerContainer}>
          {/* ACTION BUTTON */}
          {selectedImage ? (
            // State: Image Selected -> Show "Process" Button
            <TouchableOpacity
              style={styles.scanButton}
              onPress={handleProcess}
              activeOpacity={0.8}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <ActivityIndicator color="black" />
              ) : (
                <Text style={styles.scanButtonText}>Process Image</Text>
              )}
            </TouchableOpacity>
          ) : (
            // State: No Image -> Show "Select" Button
            <TouchableOpacity
              style={styles.scanButton}
              onPress={pickImage}
              activeOpacity={0.8}
            >
              <Text style={styles.scanButtonText}>Select form Gallery</Text>
            </TouchableOpacity>
          )}

          {/* FOOTER IMAGE */}
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

// --- STYLES (Identical to Scanner) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  overlayContainer: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "transparent",
  },

  // Header
  headerContainer: {
    width: width,
    height: 140,
    position: "relative",
    backgroundColor: "transparent",
  },
  headerSafeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 30 : 0,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  backButton: {
    padding: 5,
    marginRight: 15,
  },
  backArrow: {
    fontSize: 30,
    color: "#004D40",
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#004D40",
  },

  // Scanner Box
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
  placeholderText: {
    position: "absolute",
    color: "rgba(255,255,255,0.7)",
    fontWeight: "bold",
    marginTop: 10,
  },

  // Corners
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

  // Footer & Button
  footerContainer: {
    width: "100%",
    alignItems: "center",
  },
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  scanButtonText: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
  },
  footerImage: {
    width: width,
    height: 150,
    marginTop: 0,
  },
});

export default MedicineUpload;