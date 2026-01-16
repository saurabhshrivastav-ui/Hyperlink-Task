import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ScrollView,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

import { Text } from "../Components/TextWrapper";

const { width, height } = Dimensions.get("window");

const GENDER_OPTIONS = ["Male", "Female", "Other"];
const LANGUAGE_OPTIONS = [
  "English",
  "Hindi",
  "Marathi",
  "Tamil",
  "Telugu",
  "Kannada",
];

const AddPersonScreen = () => {
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [language, setLanguage] = useState("");
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const SelectionModal = ({ visible, options, onClose, onSelect, title }) => (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle} weight="700">
              Select {title}
            </Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    onSelect(item);
                    onClose();
                  }}
                >
                  <Text style={styles.modalItemText} weight="400">
                    {item}
                  </Text>
                  {(title === "Gender" ? gender : language) === item && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color="#7B1FA2"
                    />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      <View style={styles.headerContainer}>
        <Image
          source={require("../assets/Header.png")}
          style={styles.headerGradientBg}
          resizeMode="cover"
        />
        <Image
          source={require("../assets/bgdna.png")}
          style={styles.headerPatternBg}
          resizeMode="contain"
        />
      </View>

      <View style={styles.footerContainer}>
        <Image
          source={require("../assets/Header.png")}
          style={styles.footerGradientBg}
          resizeMode="cover"
        />
        <Image
          source={require("../assets/bgdna.png")}
          style={styles.footerPatternBg}
          resizeMode="contain"
        />
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => navigation.navigate("HelixAddVoice")}
        >
          <Text style={styles.continueButtonText} weight="700">
            Continue
          </Text>
          <MaterialCommunityIcons
            name="arrow-right"
            size={20}
            color="#fff"
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topNavRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>

          <View style={styles.progressContainer}>
            <View style={[styles.progressPlate, styles.activePlate]} />
            <View style={styles.progressPlate} />
            <View style={styles.progressPlate} />
            <View style={styles.progressPlate} />
          </View>
          <View style={{ width: 28 }} />
        </View>

        <Text style={styles.screenTitle} weight="700">
          Add Person
        </Text>

        <View style={styles.profilePictureSection}>
          <Image
            source={require("../assets/doc.webp")}
            style={styles.profilePicture}
            resizeMode="cover"
          />
          <TouchableOpacity style={styles.cameraButton}>
            <MaterialCommunityIcons name="camera-plus" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputRowFullWidth}>
            <MaterialCommunityIcons
              name="account"
              size={24}
              color="#7B1FA2"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.inputField}
              placeholder="Name"
              placeholderTextColor="#7B1FA2"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputRowHalfWidthContainer}>
            <View style={styles.inputRowHalfWidth}>
              <MaterialCommunityIcons
                name="calendar-clock"
                size={22}
                color="#7B1FA2"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.inputField}
                placeholder="Age"
                placeholderTextColor="#7B1FA2"
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
              />
            </View>

            <TouchableOpacity
              style={styles.inputRowHalfWidth}
              onPress={() => setGenderModalVisible(true)}
            >
              <MaterialCommunityIcons
                name="gender-male-female"
                size={22}
                color="#7B1FA2"
                style={styles.inputIcon}
              />
              <Text
                style={[styles.inputFieldText, !gender && { color: "#7B1FA2" }]}
                weight="400"
              >
                {gender || "Gender"}
              </Text>
              <MaterialCommunityIcons
                name="chevron-down"
                size={20}
                color="#7B1FA2"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.inputRowFullWidth}
            onPress={() => setLanguageModalVisible(true)}
          >
            <MaterialCommunityIcons
              name="translate"
              size={24}
              color="#7B1FA2"
              style={styles.inputIcon}
            />
            <Text
              style={[styles.inputFieldText, !language && { color: "#7B1FA2" }]}
              weight="400"
            >
              {language || "Select Language"}
            </Text>
            <MaterialCommunityIcons
              name="chevron-down"
              size={24}
              color="#7B1FA2"
            />
          </TouchableOpacity>

          <Image
            source={require("../assets/bgdna.png")}
            style={styles.bgdnaBelowLanguage}
            resizeMode="contain"
          />
        </View>
      </ScrollView>

      <SelectionModal
        visible={genderModalVisible}
        title="Gender"
        options={GENDER_OPTIONS}
        onClose={() => setGenderModalVisible(false)}
        onSelect={setGender}
      />
      <SelectionModal
        visible={languageModalVisible}
        title="Language"
        options={LANGUAGE_OPTIONS}
        onClose={() => setLanguageModalVisible(false)}
        onSelect={setLanguage}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9EAF4" },
  headerContainer: { position: "absolute", top: 0, width: "100%", height: 200 },
  headerGradientBg: { width: "100%", height: "100%" },
  headerPatternBg: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0.6,
    top: -20,
  },
  footerContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  footerGradientBg: {
    width: "100%",
    height: "100%",
    transform: [{ rotate: "180deg" }],
    position: "absolute",
  },
  footerPatternBg: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0.6,
    top: height * 0.05,
  },
  bgdnaBelowLanguage: {
    width: "100%",
    height: 250,
    opacity: 0.7,
    marginTop: 20,
  },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 160 },
  topNavRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 50,
    marginBottom: 10,
  },
  backButton: { padding: 5 },
  progressContainer: { flexDirection: "row", gap: 6 },
  progressPlate: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#D1C4E9",
  },
  activePlate: { backgroundColor: "#7B1FA2" },
  screenTitle: {
    fontSize: 24,
    color: "#330066",
    textAlign: "center",
    marginBottom: 20,
  },
  profilePictureSection: {
    alignItems: "center",
    marginBottom: 30,
    position: "relative",
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#fff",
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: width / 2 - 50,
    backgroundColor: "#7B1FA2",
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  inputContainer: { marginBottom: 30 },
  inputRowFullWidth: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3E5F5",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
  },
  inputRowHalfWidthContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  inputRowHalfWidth: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3E5F5",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 12,
    width: "48%",
  },
  inputIcon: { marginRight: 10 },
  inputField: {
    flex: 1,
    fontSize: 16,
    color: "#4A148C",
    fontFamily: "Outfit_400Regular",
  },
  inputFieldText: {
    flex: 1,
    fontSize: 16,
    color: "#4A148C",
  },
  continueButton: {
    backgroundColor: "#9062df",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    width: "85%",
    flexDirection: "row",
    marginBottom: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  continueButtonText: {
    fontSize: 18,
    color: "#fff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    maxHeight: "50%",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    color: "#330066",
    marginBottom: 15,
    textAlign: "center",
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F3E5F5",
  },
  modalItemText: { fontSize: 16, color: "#4A148C" },
});

export default AddPersonScreen;
