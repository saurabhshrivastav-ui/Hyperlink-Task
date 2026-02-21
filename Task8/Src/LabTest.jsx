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
const CARD_WIDTH = (width - 48) / 2;

const labTests = [
  {
    title: "Blood Test",
    image: require("../assets/blood test.webp"),
  },
  {
    title: "Diabetes Monitoring",
    image: require("../assets/diabaties monitoring.webp"),
  },
  {
    title: "Urine & Stool Test",
    image: require("../assets/urine stool test.webp"),
  },
  {
    title: "Genetic Tests",
    image: require("../assets/genetic tests.webp"),
  },
  {
    title: "Hormonal Tests",
    image: require("../assets/Harmonal tests.webp"),
  },
  {
    title: "Imaging & Scans",
    image: require("../assets/imaging scans.webp"),
  },
];

const LabTest = () => {
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
              <MaterialIcons
                name="arrow-back"
                size={26}
                color="#6D28D9"
              />
            </TouchableOpacity>
            <Text weight="700" style={styles.navTitle}>
              Lab Tests
            </Text>
          </View>
          <Text weight="400" style={styles.headerDesc}>
            Choose from a wide range of diagnostic tests. Understand your body better and make informed health decisions.
          </Text>
        </LinearGradient>

        {/* Lab Test Cards Grid */}
        <View style={styles.content}>
          <View style={styles.grid}>
            {labTests.map((test) => (
              <View key={test.title} style={styles.card}>
                <View style={styles.cardImgWrap}>
                  <Image source={test.image} style={styles.cardImg} resizeMode="cover" />
                  {/* View Tests Button overlaid on image */}
                  <TouchableOpacity
                    style={styles.viewBtnWrap}
                    activeOpacity={0.8}
                    onPress={() => {
                      if (test.title === "Diabetes Monitoring") {
                        navigation.navigate("DiabetesMonitoring");
                      }
                    }}
                  >
                    <LinearGradient
                      colors={["#B148FF", "#F6339B", "#9914F9"]}
                      locations={[0, 0.5, 1]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.viewBtn}
                    >
                      <Text weight="600" style={styles.viewBtnText}>View Tests</Text>
                      <MaterialIcons name="arrow-forward" size={14} color="#fff" />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
                <Text weight="600" style={styles.cardTitle}>{test.title}</Text>
              </View>
            ))}
          </View>
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
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  navTitle: {
    fontSize: 20,
    color: "#6D28D9",
    letterSpacing: 0.2,
  },
  headerDesc: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 8,
    marginLeft: 4,
    marginRight: 8,
    lineHeight: 19,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 30,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: CARD_WIDTH,
    marginBottom: 20,
    alignItems: "center",
  },
  cardImgWrap: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 0.72,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#f3f4f6",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
    }),
  },
  cardImg: {
    width: "100%",
    height: "100%",
  },
  viewBtnWrap: {
    position: "absolute",
    bottom: 10,
    right: 8,
  },
  viewBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 4,
  },
  viewBtnText: {
    color: "#fff",
    fontSize: 11,
  },
  cardTitle: {
    fontSize: 13,
    color: "#1f2937",
    marginTop: 8,
    textAlign: "center",
  },
});

export default LabTest;
