import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
  Image,
  Alert,
  Modal,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Text } from "../Components/TextWrapper";
import ConsultWarningCard from "../Components/ConsultWarningCard";

const { width } = Dimensions.get("window");

const shieldImg = require("../assets/shield.webp");

// Helper to format date like "20th Jan, 2026"
const formatPrescriptionDate = (date) => {
  const day = date.getDate();
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  // Ordinal suffix
  let suffix = "th";
  if (day === 1 || day === 21 || day === 31) suffix = "st";
  else if (day === 2 || day === 22) suffix = "nd";
  else if (day === 3 || day === 23) suffix = "rd";

  return `${day}${suffix} ${month}, ${year}`;
};

const UploadImage = () => {
  const navigation = useNavigation();
  const [prescription, setPrescription] = useState(null); // { uri, fileName, date }
  const [previewVisible, setPreviewVisible] = useState(false);

  // Request camera permission and launch camera
  const handleCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Camera permission is needed to take a photo."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const fileName =
        asset.fileName ||
        asset.uri.split("/").pop() ||
        "Prescription.jpg";
      setPrescription({
        uri: asset.uri,
        fileName,
        date: formatPrescriptionDate(new Date()),
      });
    }
  };

  // Request gallery permission and launch image picker
  const handleGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Gallery permission is needed to select a photo."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const fileName =
        asset.fileName ||
        asset.uri.split("/").pop() ||
        "Prescription.jpg";
      setPrescription({
        uri: asset.uri,
        fileName,
        date: formatPrescriptionDate(new Date()),
      });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Gradient Header */}
        <LinearGradient
          colors={["#EFE0FA", "#FFF2E2"]}
          start={{ x: 0.02, y: 0 }}
          end={{ x: 0.98, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.navRow}>
            <TouchableOpacity
              style={styles.backBtn}
              activeOpacity={0.7}
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons
                name="arrow-back"
                size={28}
                color="#553FB5"
                style={{ fontWeight: "900" }}
              />
            </TouchableOpacity>
            <Text weight="700" style={styles.navTitle}>
              Upload Prescription
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* Upload Section */}
          <Text weight="600" style={styles.sectionTitle}>
            Have a prescription? Upload here
          </Text>

          {/* Upload Card */}
          <LinearGradient
            colors={["#F9D9EA", "#E9DEF7"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.uploadContainer}
          >
            {/* Camera Button */}
            <TouchableOpacity
              style={styles.uploadBtn}
              activeOpacity={0.7}
              onPress={handleCamera}
            >
              <Ionicons name="camera-outline" size={24} color="#6b7280" />
              <Text weight="400" style={styles.uploadBtnText}>
                Camera
              </Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Gallery Button */}
            <TouchableOpacity
              style={styles.uploadBtn}
              activeOpacity={0.7}
              onPress={handleGallery}
            >
              <Ionicons name="images-outline" size={24} color="#6b7280" />
              <Text weight="400" style={styles.uploadBtnText}>
                Gallery
              </Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* My Prescription Button */}
            <TouchableOpacity style={styles.uploadBtn} activeOpacity={0.7}>
              <Ionicons
                name="document-text-outline"
                size={24}
                color="#6b7280"
              />
              <Text weight="400" style={styles.uploadBtnText}>
                My Prescription
              </Text>
            </TouchableOpacity>
          </LinearGradient>

          {/* Security Note with Custom Image */}
          <View style={styles.secureBox}>
            <Image
              source={shieldImg}
              style={styles.shieldIcon}
              resizeMode="contain"
            />
            <Text weight="400" style={styles.secureText}>
              Your prescription will be secure and private.
            </Text>
          </View>

          {/* Your Last Prescription Card */}
          {prescription && (
            <>
              <Text weight="600" style={styles.purpleTitle}>
                Your Last Prescription
              </Text>
              <View style={styles.prescriptionCard}>
                <View style={styles.prescriptionCardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text weight="600" style={styles.prescriptionSuccessText}>
                      Prescription Uploaded Successfully
                    </Text>
                    <Text weight="400" style={styles.prescriptionFileName}>
                      {prescription.fileName}
                    </Text>
                  </View>
                  <View style={styles.dateBadge}>
                    <Text weight="500" style={styles.dateBadgeText}>
                      {prescription.date}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setPreviewVisible(true)}
                  style={styles.viewPrescriptionBtnWrapper}
                >
                  <LinearGradient
                    colors={["#B148FF", "#F6339B", "#9914F9"]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.viewPrescriptionBtn}
                  >
                    <Text weight="600" style={styles.viewPrescriptionBtnText}>
                      View Prescription
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* Image Preview Modal */}
              <Modal
                visible={previewVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setPreviewVisible(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <TouchableOpacity
                      style={styles.modalCloseBtn}
                      onPress={() => setPreviewVisible(false)}
                    >
                      <Ionicons name="close-circle" size={32} color="#553FB5" />
                    </TouchableOpacity>
                    <Image
                      source={{ uri: prescription.uri }}
                      style={styles.previewImage}
                      resizeMode="contain"
                    />
                    <Text weight="500" style={styles.previewFileName}>
                      {prescription.fileName}
                    </Text>
                  </View>
                </View>
              </Modal>
            </>
          )}

          {/* Why Upload Section */}
          <Text weight="600" style={styles.purpleTitle}>
            Why upload a prescription?
          </Text>

          <View style={styles.infoBlock}>
            <Text weight="500" style={styles.infoText}>
              Our team will verify your prescription and call back to confirm
              your lab test order.
            </Text>
            <Text weight="500" style={styles.infoText}>
              Your prescription will always available in your account so that
              you can access it anytime anywhere.
            </Text>
            <Text weight="500" style={styles.infoText}>
              Details from your prescription are only visible to our team of
              specialists.
            </Text>
          </View>

          {/* Don't have Prescription Section */}
          <Text weight="600" style={styles.purpleTitle}>
            Don't have Prescription?
          </Text>

          {/* CONSULT CARD SHADOW CONTAINER */}
          <View style={styles.shadowContainer}>
            {/* GRADIENT CARD with BORDER */}
            <LinearGradient
              colors={["#FBF1FE", "#FBF1FE"]}
              style={styles.gradientCard}
            >
              <ConsultWarningCard
                onConsultPress={() => {}}
                style={{
                  backgroundColor: "transparent",
                  margin: 0,
                  padding: 0,
                  borderWidth: 0,
                  elevation: 0,
                }}
              />
            </LinearGradient>
          </View>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  headerGradient: {
    paddingTop: Platform.OS === "android" ? 40 : 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      },
      android: { elevation: 4 },
    }),
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  navTitle: {
    fontSize: 18,
    color: "#553FB5",
    letterSpacing: 0.2,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: "#1a1a1a",
    marginBottom: 15,
  },
  uploadContainer: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    paddingVertical: 15,
    paddingHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
    }),
  },
  uploadBtn: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  uploadBtnText: {
    fontSize: 11,
    color: "#707070",
    textAlign: "center",
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: "#FFFFFF",
    opacity: 0.5,
  },
  secureBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 30,
  },
  shieldIcon: {
    width: 42.75,
    height: 57,
  },
  secureText: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
    flex: 1,
  },
  purpleTitle: {
    color: "#5B4DBC",
    fontSize: 18,
    marginBottom: 15,
  },
  infoBlock: {
    marginBottom: 30,
  },
  infoText: {
    fontSize: 14,
    color: "#333333",
    marginBottom: 12,
    lineHeight: 21,
  },

  // Prescription Card Styles
  prescriptionCard: {
    width: 323,
    height: 95,
    backgroundColor: "#FBF1FE",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 30,
    alignSelf: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#BF7BB9",
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
        shadowColor: "#BF7BB9",
      },
    }),
  },
  prescriptionCardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  prescriptionSuccessText: {
    fontSize: 11,
    color: "#4F831A",
    marginBottom: 2,
  },
  prescriptionFileName: {
    fontSize: 9,
    color: "#666666",
  },
  dateBadge: {
    width: 65,
    height: 18,
    backgroundColor: "#C4FFDA",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#BF7BB9",
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
        shadowColor: "#BF7BB9",
      },
    }),
  },
  dateBadgeText: {
    fontSize: 8,
    color: "#1a1a1a",
  },
  viewPrescriptionBtnWrapper: {
    alignSelf: "flex-start",
    ...Platform.select({
      ios: {
        shadowColor: "#BF7BB9",
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
        shadowColor: "#BF7BB9",
      },
    }),
  },
  viewPrescriptionBtn: {
    width: 95,
    height: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  viewPrescriptionBtnText: {
    color: "#FFFFFF",
    fontSize: 8,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: width * 0.9,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  modalCloseBtn: {
    alignSelf: "flex-end",
    marginBottom: 8,
  },
  previewImage: {
    width: width * 0.8,
    height: width * 1.0,
    borderRadius: 8,
  },
  previewFileName: {
    marginTop: 12,
    fontSize: 14,
    color: "#333333",
  },

  shadowContainer: {
    marginTop: 10,
    backgroundColor: "transparent",
    // Shadow matching uploadContainer
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },

  // UPDATED: Added Border to the Card
  gradientCard: {
    borderRadius: 12,
    borderWidth: 1, // Added
    borderColor: "#FFFFFF", // Added
    overflow: "hidden",
  },
});

export default UploadImage;
