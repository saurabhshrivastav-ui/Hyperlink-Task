import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { Text } from "../components/TextWrapper";
import HealthRecord from "../assets/healthrecord.png";

const { width } = Dimensions.get("window");

const ReportBanner = () => {
  const navigation = useNavigation();

  return (
    <LinearGradient colors={["#f0f4ff", "#e9dfff"]} style={styles.reportBanner}>
      {/* ===== Text Section ===== */}
      <View style={styles.reportText}>
        <Text style={styles.reportTitle}>
          <Text style={styles.highlight} weight="900">
            YOUR REPORT
          </Text>
          {"\n"}
          <Text style={styles.highlight} weight="900">
            IS SECURE
          </Text>
        </Text>

        <Text style={styles.reportDescription} weight="400">
          Your results and insights have been saved in your Locker. Access
          anytime from your Profile tab.
        </Text>

        <TouchableOpacity
          style={styles.viewRecordsButton}
          onPress={() => navigation.navigate("HealthRecords")}
          activeOpacity={0.8}
        >
          <Text style={styles.viewRecordsText} weight="600">
            View Records
          </Text>
        </TouchableOpacity>
      </View>

      {/* ===== Image Section ===== */}
      <View style={styles.reportImage}>
        <Image source={HealthRecord} style={styles.healthRecordImage} />
      </View>
    </LinearGradient>
  );
};

export default ReportBanner;

/* =============== Styles =============== */
const styles = StyleSheet.create({
  reportBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 20,
    shadowColor: "#553fb5",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  reportText: {
    flex: 1,
    paddingRight: 10,
  },

  reportTitle: {
    fontSize: 25,
    lineHeight: 30,
    marginBottom: 10,
  },
  highlight: {
    color: "#e11d48",
  },
  reportDescription: {
    fontSize: 15,
    color: "#374151",
    marginBottom: 16,
    lineHeight: 19,
    maxWidth: width * 0.5,
  },
  viewRecordsButton: {
    backgroundColor: "#553fb5",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  viewRecordsText: {
    color: "#fff",
    fontSize: 17,
  },

  reportImage: {
    width: "40%",
    alignItems: "center",
    justifyContent: "center",
  },
  healthRecordImage: {
    width: 160,
    height: 140,
    resizeMode: "contain",
  },
});
