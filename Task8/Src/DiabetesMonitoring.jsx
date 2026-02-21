import React from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { Text } from "../Components/TextWrapper";

const { width } = Dimensions.get("window");

const testData = [
  {
    id: 1,
    title: "Diabetes Screening\n(HbAIC & Fasting Sugar)",
    tests: 2,
    reportTime: "15 hours",
    price: 479,
    originalPrice: 625,
    discount: "25% off",
    image: require("../assets/scan.webp"),
  },
  {
    id: 2,
    title: "Diabetes Screening\n(HbAIC & Fasting Sugar)",
    tests: 2,
    reportTime: "15 hours",
    price: 479,
    originalPrice: 625,
    discount: "25% off",
    image: require("../assets/scan.webp"),
  },
  {
    id: 3,
    title: "Diabetes Screening\n(HbAIC & Fasting Sugar)",
    tests: 2,
    reportTime: "15 hours",
    price: 479,
    originalPrice: 625,
    discount: "25% off",
    image: require("../assets/scan.webp"),
  },
];

const DiabetesMonitoring = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Gradient Header */}
        <LinearGradient
          colors={["#E8D5F5", "#F5E0EC", "#FFF0E0"]}
          locations={[0, 0.5, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.navRow}>
            <TouchableOpacity
              style={styles.backBtn}
              activeOpacity={0.7}
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="arrow-back" size={26} color="#6D28D9" />
            </TouchableOpacity>
            <Text weight="700" style={styles.navTitle}>
              Diabetes Monitoring
            </Text>
          </View>
        </LinearGradient>

        {/* Book a Test Header */}
        <View style={styles.bookHeader}>
          <Text weight="600" style={styles.bookTitle}>Book a Test</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <MaterialIcons name="search" size={26} color="#1f2937" />
          </TouchableOpacity>
        </View>

        {/* Test Cards */}
        <View style={styles.cardList}>
          {testData.map((test) => (
            <View key={test.id} style={styles.card}>
              {/* Test Image */}
              <View style={styles.cardLeft}>
                <Image
                  source={test.image}
                  style={styles.testImage}
                  resizeMode="cover"
                />
              </View>

              {/* Test Details */}
              <View style={styles.cardRight}>
                {/* Chevron */}
                <TouchableOpacity style={styles.chevronBtn} activeOpacity={0.7}>
                  <MaterialIcons name="chevron-right" size={24} color="#7C3AED" />
                </TouchableOpacity>

                <Text weight="700" style={styles.testTitle}>
                  {test.title}
                </Text>

                <View style={styles.containsRow}>
                  <Text weight="500" style={styles.containsText}>
                    Contains {test.tests} tests
                  </Text>
                  <MaterialIcons name="keyboard-arrow-down" size={18} color="#22C55E" />
                </View>

                <Text weight="400" style={styles.reportText}>
                  Report within {test.reportTime}
                </Text>

                <View style={styles.priceRow}>
                  <View style={styles.priceLeft}>
                    <Text weight="700" style={styles.price}>
                      {test.price}/-
                    </Text>
                    <Text weight="400" style={styles.originalPrice}>
                      {test.originalPrice}/-
                    </Text>
                  </View>

                  <Text weight="600" style={styles.discount}>
                    {test.discount}
                  </Text>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.bookBtnWrap}
                    onPress={() => navigation.navigate("TestDetails")}
                  >
                    <LinearGradient
                      colors={["#B148FF", "#F6339B", "#9914F9"]}
                      locations={[0, 0.5, 1]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.bookBtn}
                    >
                      <Text weight="700" style={styles.bookBtnText}>Book</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFBFF",
  },
  scrollView: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: Platform.OS === "android" ? 44 : 54,
    paddingBottom: 18,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  backBtn: {
    padding: 4,
  },
  navTitle: {
    fontSize: 20,
    color: "#1f2937",
  },
  bookHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  bookTitle: {
    fontSize: 16,
    color: "#1f2937",
  },
  cardList: {
    paddingHorizontal: 16,
    paddingBottom: 30,
    gap: 14,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FBF1FE",
    borderRadius: 16,
    padding: 12,
    shadowColor: "#BF7BB9",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  cardLeft: {
    width: 74,
    height: 74,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    marginRight: 12,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#BF7BB9",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  testImage: {
    width: 50,
    height: 50,
  },
  cardRight: {
    flex: 1,
    position: "relative",
  },
  chevronBtn: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#E8D5F5",
    backgroundColor: "#F1E7FE",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#BF7BB9",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  testTitle: {
    fontSize: 14,
    color: "#1f2937",
    marginBottom: 4,
    paddingRight: 40,
  },
  containsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginBottom: 2,
  },
  containsText: {
    fontSize: 12,
    color: "#22C55E",
  },
  reportText: {
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceLeft: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  price: {
    fontSize: 16,
    color: "#1f2937",
  },
  originalPrice: {
    fontSize: 12,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
  },
  discount: {
    fontSize: 11,
    color: "#22C55E",
    marginLeft: 6,
  },
  bookBtnWrap: {
    borderRadius: 10,
    overflow: "hidden",
    marginLeft: "auto",
  },
  bookBtn: {
    paddingVertical: 8,
    paddingHorizontal: 22,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  bookBtnText: {
    color: "#fff",
    fontSize: 13,
  },
});

export default DiabetesMonitoring;
