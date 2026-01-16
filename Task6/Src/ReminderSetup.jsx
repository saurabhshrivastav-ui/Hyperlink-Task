import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ScrollView,
  Modal,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { Text } from "../Components/TextWrapper";

const { width } = Dimensions.get("window");

const HEADER_BG = require("../assets/Header.png");
const DNA_PATTERN = require("../assets/bgdna.png");

const ReminderSetup = ({ navigation }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const options = [
    "Morning (Medicines, Physical Activity)",
    "Afternoon (Lunch/Nutrition Check)",
    "Evening (Dinner/Sleep)",
    "Custom Time",
  ];

  const toggleOption = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const handleContinue = () => {
    setModalVisible(true);
  };

  const handleViewNow = () => {
    setModalVisible(false);
    navigation.navigate("HelixVoice");
  };

  const currentStep = 4;

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      <LinearGradient
        colors={["#FFF0F5", "#F9EAF4", "#F3E5F5"]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.headerBgContainer} pointerEvents="none">
        <Image
          source={HEADER_BG}
          style={styles.gradientBg}
          resizeMode="cover"
        />
        <Image
          source={DNA_PATTERN}
          style={styles.patternBg}
          resizeMode="contain"
        />
      </View>

      <View style={styles.footerBgContainer} pointerEvents="none">
        <Image
          source={HEADER_BG}
          style={styles.gradientBgFooter}
          resizeMode="cover"
        />
        <Image
          source={DNA_PATTERN}
          style={styles.patternBgFooter}
          resizeMode="contain"
        />
      </View>

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>

        <View style={styles.progressContainer}>
          {[1, 2, 3, 4].map((i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                styles.activeDot,
              ]}
            />
          ))}
        </View>

        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.mainQuestion} weight="700">
          When should your Sakshi connect with you?
        </Text>

        <Text style={styles.subHeader} weight="600">
          Choose Reminder Times:
        </Text>

        <View style={styles.optionsContainer}>
          {options.map((option, index) => {
            const isSelected = selectedOptions.includes(option);
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionRow,
                  isSelected && styles.optionRowSelected,
                ]}
                onPress={() => toggleOption(option)}
                activeOpacity={0.7}
              >
                <View style={styles.bullet} />

                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                  ]}
                  weight={isSelected ? "700" : "500"}
                >
                  {option}
                </Text>

                {isSelected && (
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color="#7B1FA2"
                    style={{ marginLeft: "auto" }}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueButtonWrapper}
          onPress={handleContinue}
        >
          <LinearGradient
            colors={["#845EC2", "#6A4BC9"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.continueButton}
          >
            <Text style={styles.continueText} weight="700">
              Continue
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark" size={40} color="#FFF" />
            </View>

            <Text style={styles.modalTitle} weight="700">
              Voice Added! 🎉
            </Text>

            <Text style={styles.modalDescription} weight="400">
              Hyperlink AI will speak to you in your loved one's voice
            </Text>

            <TouchableOpacity
              style={styles.modalButtonWrapper}
              onPress={handleViewNow}
            >
              <LinearGradient
                colors={["#D542F5", "#A020F0"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText} weight="600">
                  View Now
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFF0F5",
  },
  headerBgContainer: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: 250,
  },
  footerBgContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 250,
  },
  gradientBg: { width: "100%", height: "100%", position: "absolute" },
  patternBg: {
    width: "100%",
    height: "100%",
    position: "absolute",
    opacity: 0.6,
    top: -20,
  },
  gradientBgFooter: {
    width: "100%",
    height: "100%",
    position: "absolute",
    transform: [{ rotate: "180deg" }],
  },
  patternBgFooter: {
    width: "100%",
    height: "100%",
    position: "absolute",
    opacity: 0.6,
    top: 50,
  },
  header: {
    marginTop: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 5,
  },
  progressContainer: {
    flexDirection: "row",
    gap: 6,
  },
  progressDot: {
    width: 40,
    height: 5,
    borderRadius: 3,
  },
  activeDot: {
    backgroundColor: "#7B1FA2",
  },
  inactiveDot: {
    backgroundColor: "#D1C4E9",
  },
  contentContainer: {
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: 100,
  },
  mainQuestion: {
    fontSize: 22,
    color: "#4A148C",
    textAlign: "center",
    lineHeight: 32,
    marginBottom: 30,
  },
  subHeader: {
    fontSize: 16,
    color: "#000",
    marginBottom: 15,
  },
  optionsContainer: {
    marginTop: 5,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 8,
  },
  optionRowSelected: {
    backgroundColor: "rgba(123, 31, 162, 0.05)",
    borderRadius: 8,
    paddingHorizontal: 5,
    marginHorizontal: -5,
  },
  bullet: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#000",
    marginTop: 2,
    marginRight: 12,
  },
  optionText: {
    fontSize: 15,
    color: "#000",
    flex: 1,
    lineHeight: 22,
  },
  optionTextSelected: {
    color: "#7B1FA2",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 20,
    paddingBottom: 40,
  },
  continueButtonWrapper: {
    width: "100%",
    shadowColor: "#845EC2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  continueButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  continueText: {
    color: "#FFF",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#FFF",
    borderRadius: 25,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  successIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#23E078",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#23E078",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    color: "#4A148C",
    marginBottom: 10,
    textAlign: "center",
  },
  modalDescription: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  modalButtonWrapper: {
    width: "100%",
    shadowColor: "#D542F5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modalButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
  },
  modalButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
});

export default ReminderSetup;
