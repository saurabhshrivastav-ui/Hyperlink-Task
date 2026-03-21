// @ts-nocheck
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { analyzeMedicineImage } from "../Services/MedicineService";

const { width } = Dimensions.get("window");

const MedicineDetails = ({ route, navigation }) => {
  // ✅ 1. Extract BOTH imageUri and pre-calculated data
  const { imageUri, data: preLoadedData } = route.params || {};

  // ✅ 2. Initialize State: If data exists, start with it and skip loading
  const [loading, setLoading] = useState(!preLoadedData);
  const [data, setData] = useState(preLoadedData || null);

  useEffect(() => {
    let isMounted = true;

    const startAnalysis = async () => {
      // ✅ 3. OPTIMIZATION: If data was passed from Scanner, stop here.
      if (preLoadedData) {
        return;
      }

      // If no image is passed and no data exists, stop loading
      if (!imageUri) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        // Call our service (Only runs if we don't have data yet)
        const result = await analyzeMedicineImage(imageUri);

        if (isMounted) {
          if (result) {
            setData(result);
          } else {
            Alert.alert(
              "Analysis Failed",
              "Could not identify the medicine. Please try capturing a clearer image."
            );
          }
          setLoading(false);
        }
      } catch (e) {
        console.error(e);
        if (isMounted) setLoading(false);
      }
    };

    startAnalysis();

    return () => {
      isMounted = false;
    };
  }, [imageUri, preLoadedData]);

  // --- LOADING STATE ---
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00838F" />
        <Text style={styles.loadingText}>Analyzing...</Text>
        <Text style={styles.loadingSubText}>Consulting AI Database</Text>
      </View>
    );
  }

  // --- MAIN RENDER ---
  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* IMAGE SECTION */}
        <View style={styles.imageSection}>
          <Image
            source={{ uri: imageUri }}
            style={styles.scannedImage}
            resizeMode="contain"
          />
          <View style={styles.addToMedButton}>
            <Text style={styles.addToMedText}>Analysis Result</Text>
          </View>
        </View>

        {/* MEDICINE NAME */}
        <View style={styles.mainInfoCard}>
          <Text style={styles.medicineName}>
            {data?.name || "Unknown Medicine"}
          </Text>
          <Text style={styles.genericName}>{data?.genericName || "----"}</Text>
        </View>

        {/* MANUFACTURER & BATCH */}
        <View style={styles.rowContainer}>
          <View style={[styles.infoBox, { flex: 0.6, marginRight: 10 }]}>
            <Text style={styles.label}>
              Manufacturer:{" "}
              <Text style={styles.value}>{data?.manufacturer || "N/A"}</Text>
            </Text>
            <Text style={styles.label}>
              MRP: <Text style={styles.value}>{data?.mrp || "N/A"}</Text>
            </Text>
          </View>
          <View style={[styles.infoBox, { flex: 0.4 }]}>
            <Text style={styles.label}>
              Batch No:{" "}
              <Text style={styles.value}>{data?.batchNo || "N/A"}</Text>
            </Text>
          </View>
        </View>

        {/* USES */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Uses</Text>
          {(data?.uses || ["No info available"]).map((item, index) => (
            <Text key={index} style={styles.bulletPoint}>
              • {item}
            </Text>
          ))}
        </View>

        {/* BENEFITS */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Benefits</Text>
          {(data?.benefits || ["No info available"]).map((item, index) => (
            <Text key={index} style={styles.bulletPoint}>
              • {item}
            </Text>
          ))}
        </View>

        {/* HOW IT WORKS */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <Text style={styles.paragraph}>
            {data?.howItWorks || "No info available"}
          </Text>
        </View>

        {/* DOSAGE */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Dosage</Text>
          <Text style={styles.paragraph}>
            {data?.dosage || "Consult doctor."}
          </Text>
        </View>

        {/* SIDE EFFECTS */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Side Effects</Text>
          {(data?.sideEffects || ["No info available"]).map((item, index) => (
            <Text key={index} style={styles.bulletPoint}>
              • {item}
            </Text>
          ))}
        </View>

        {/* WARNINGS */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Warnings</Text>
          {(data?.warnings || ["No info available"]).map((item, index) => (
            <Text key={index} style={styles.bulletPoint}>
              • {item}
            </Text>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FOOTER */}
      <Image
        source={require("../../assets/Medi.png")}
        style={styles.footerImage}
        resizeMode="cover"
      />
    </SafeAreaView>
  );
};

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#00838F",
  },
  loadingSubText: { fontSize: 14, color: "#666" },

  header: { paddingHorizontal: 20, paddingTop: 30, paddingBottom: 10 },
  backButton: { padding: 5 },
  scrollContent: { paddingHorizontal: 15, paddingBottom: 20 },

  imageSection: {
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
    marginTop: 10,
  },
  scannedImage: {
    width: width - 40,
    height: 200,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
  },
  addToMedButton: {
    position: "absolute",
    bottom: -15,
    backgroundColor: "#81C7D4",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    elevation: 5,
  },
  addToMedText: { fontWeight: "bold", fontSize: 14, color: "#000" },

  mainInfoCard: {
    marginTop: 25,
    backgroundColor: "#E0F7FA",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#B2EBF2",
  },
  medicineName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#006064",
    textAlign: "center",
  },
  genericName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#004D40",
    marginTop: 2,
    textAlign: "center",
  },

  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  infoBox: {
    backgroundColor: "#E0F7FA",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#B2EBF2",
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#004D40",
    marginBottom: 2,
  },
  value: { fontSize: 12, fontWeight: "400", color: "#000" },

  sectionCard: {
    backgroundColor: "#E0F7FA",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#B2EBF2",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  bulletPoint: { fontSize: 13, color: "#333", marginBottom: 4, lineHeight: 18 },
  paragraph: { fontSize: 13, color: "#333", lineHeight: 18 },

  footerImage: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: width,
    height: 80,
    zIndex: -1,
  },
});

export default MedicineDetails;
