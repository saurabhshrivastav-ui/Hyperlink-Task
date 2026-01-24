import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Alert,
  Image,
  Dimensions,
} from "react-native";
import {
  useNavigation,
  useRoute,
  useIsFocused,
} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import {
  Feather,
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Text } from "../../../components/TextWrapper";

const { width } = Dimensions.get("window");

const PersonalDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused(); // Check if screen is active

  const { conditionId, conditionName } = route.params || {
    conditionId: "diabetes",
    conditionName: "Diabetes",
  };


  const INITIAL_USERS = [
    {
      id: 1,
      name: "Sakshi Nishad",
      age: "22",
      gender: "Female",
      email: "sakshi@example.com",
      phone: "+91 9876543210",
      history: [],
    },
  ];

  // Helper function to get initials
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const [users, setUsers] = useState(INITIAL_USERS);
  const [activeUserId, setActiveUserId] = useState(1);
  const activeUser = users.find((user) => user.id === activeUserId) || users[0];

  // UI State
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "female",
    phone: "",
  });

  // 🔥 LOAD DATA FROM STORAGE
  const loadUsersFromStorage = async () => {
    try {
      const storedUsers = await AsyncStorage.getItem("users");
      const storedActiveId = await AsyncStorage.getItem("activeUserId");

      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      }
      if (storedActiveId) {
        setActiveUserId(JSON.parse(storedActiveId));
      }
    } catch (error) {
      console.error("Failed to load users", error);
    }
  };

  // 🔥 RELOAD WHEN SCREEN IS FOCUSED (Updates History)
  useEffect(() => {
    if (isFocused) {
      loadUsersFromStorage();
    }
  }, [isFocused]);

  // 🔥 SAVE DATA TO STORAGE HELPER
  const saveUsersToStorage = async (updatedUsers) => {
    try {
      setUsers(updatedUsers); // Update UI immediately
      await AsyncStorage.setItem("users", JSON.stringify(updatedUsers));
    } catch (error) {
      console.error("Failed to save users", error);
    }
  };

  const handleFormChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const openAddUserModal = () => {
    setFormData({ name: "", age: "", gender: "female", phone: "" });
    setIsEditingMode(false);
    setModalVisible(true);
  };

  const openEditUserModal = () => {
    setFormData({
      name: activeUser.name,
      age: activeUser.age,
      gender: activeUser.gender,
      phone: activeUser.phone || "",
    });
    setIsEditingMode(true);
    setModalVisible(true);
  };

  // 🔥 SAVE USER (ADD/EDIT) + PERSISTENCE
  const handleSaveUser = async () => {
    if (!formData.name || !formData.age) {
      Alert.alert("Missing Info", "Please enter a Name and Age.");
      return;
    }

    let updatedUsers;
    if (isEditingMode) {
      updatedUsers = users.map((user) =>
        user.id === activeUserId ? { ...user, ...formData } : user
      );
    } else {
      const newId =
        users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
      const newUser = {
        id: newId,
        ...formData,
        email: "",
        history: [],
      };
      updatedUsers = [...users, newUser];
      setActiveUserId(newId);
      await AsyncStorage.setItem("activeUserId", JSON.stringify(newId));
    }

    saveUsersToStorage(updatedUsers);
    setModalVisible(false);
  };

  // 🔥 DELETE USER + PERSISTENCE
  const confirmRemoveUser = (id) => {
    if (users.length <= 1) {
      Alert.alert("Action Denied", "You must have at least one user profile.");
      return;
    }

    Alert.alert("Delete Profile", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const updatedUsers = users.filter((u) => u.id !== id);
          saveUsersToStorage(updatedUsers);
          if (activeUserId === id) {
            const nextId = updatedUsers[0].id;
            setActiveUserId(nextId);
            await AsyncStorage.setItem("activeUserId", JSON.stringify(nextId));
          }
        },
      },
    ]);
  };

  const getRiskColor = (risk) => {
    if (!risk) return "#aaa";
    if (risk.includes("High")) return "#dc3545";
    if (risk.includes("Moderate")) return "#ffc107";
    return "#28a745";
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Header Section */}
      <View style={styles.heroContainer}>
        {/* Background Image */}
        <Image
          source={require("../../../assets/Head.png")}
          style={styles.headerBgImage}
          resizeMode="cover"
        />
        
        {/* Top Bar */}
        <View style={styles.heroTopBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={22} color="#7C3AED" />
          </TouchableOpacity>

          <Text style={styles.heroTitle} weight="700">
            {conditionName}
          </Text>
        </View>

        {/* Description */}
        <Text style={styles.heroSubtitle} weight="400">
          This self-check helps you understand patterns related to{"\n"}
          lifestyle, symptoms, and known risk indicators.
        </Text>

        {/* Warning Badge */}
        <View style={styles.warningBadge}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <Text style={styles.warningText} weight="500">
            This check does not provide a diagnosis.
          </Text>
        </View>

        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <Image
            source={require("../../../assets/MobHands.png")}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        {/* Info Cards Row */}
        <View style={styles.infoCardsRow}>
          <View style={styles.infoCard}>
            <View style={styles.infoIconContainer}>
              <MaterialCommunityIcons
                name="puzzle-outline"
                size={24}
                color="#7C3AED"
              />
            </View>
            <Text style={styles.infoValue} weight="700">6</Text>
            <Text style={styles.infoLabel} weight="400">Questions</Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoIconContainer}>
              <Feather name="clock" size={22} color="#7C3AED" />
            </View>
            <Text style={styles.infoValue} weight="700">2 min</Text>
            <Text style={styles.infoLabel} weight="400">Duration</Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoIconContainer}>
              <MaterialCommunityIcons
                name="shield-check-outline"
                size={24}
                color="#E91E63"
              />
            </View>
            <Text style={[styles.infoValue, { color: "#E91E63" }]} weight="700">
              Private
            </Text>
            <Text style={[styles.infoLabel, { color: "#E91E63" }]} weight="400">
              Anonymous
            </Text>
          </View>
        </View>
      </View>

      {/* Personal Details Section */}
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsHeading} weight="600">
          Lets Start with your personal details
        </Text>

        {/* Profile Card */}
        <View style={styles.profileWrapper}>
          <TouchableOpacity
            style={styles.profileCardMain}
            onPress={() => setIsProfileExpanded(!isProfileExpanded)}
            activeOpacity={0.9}
          >
            <View style={styles.profileCardContent}>
              {/* Avatar */}
              <LinearGradient
                colors={["#9333EA", "#7C3AED"]}
                style={styles.avatarGradient}
              >
                <Text style={styles.avatarText} weight="700">
                  {getInitials(activeUser?.name)}
                </Text>
              </LinearGradient>

              {/* User Info */}
              <View style={styles.profileInfo}>
                <Text style={styles.profileName} weight="700">
                  {activeUser?.name || "User"}
                </Text>
                <View style={styles.profileTagsRow}>
                  <View style={styles.profileTag}>
                    <Text style={styles.profileTagText} weight="500">
                      {activeUser?.gender || "Female"}
                    </Text>
                  </View>
                  <View style={styles.profileTag}>
                    <Text style={styles.profileTagText} weight="500">
                      {activeUser?.age || "--"} yrs
                    </Text>
                  </View>
                </View>
              </View>

              {/* Dropdown Icon */}
              <View style={styles.dropdownIcon}>
                <Ionicons
                  name={isProfileExpanded ? "chevron-up" : "chevron-down"}
                  size={24}
                  color="#9CA3AF"
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* EXPANDED USER LIST */}
        {isProfileExpanded && (
          <View style={styles.userList}>
            <Text style={styles.switchUserLabel}>Switch or Manage Users:</Text>
            {users.map((u) => (
              <TouchableOpacity
                key={u.id}
                style={[
                  styles.userItem,
                  u.id === activeUserId && styles.userActive,
                ]}
                onPress={async () => {
                  setActiveUserId(u.id);
                  await AsyncStorage.setItem(
                    "activeUserId",
                    JSON.stringify(u.id)
                  );
                  setIsProfileExpanded(false);
                }}
              >
                <FontAwesome name="user-circle" size={22} color="#553fb5" />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text weight="600">{u.name}</Text>
                  <Text weight="400" style={{ color: "#718096" }}>
                    {u.age} yrs, {u.gender}
                  </Text>
                </View>
                {users.length > 1 && (
                  <TouchableOpacity
                    style={styles.deleteIconArea}
                    onPress={() => confirmRemoveUser(u.id)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#e53e3e" />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.addUserButton}
              onPress={openAddUserModal}
            >
              <FontAwesome5 name="plus" size={14} color="#4a5568" />
              <Text weight="600" style={{ marginLeft: 6 }}>
                Add New User
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 🔥 HISTORY SECTION - DISPLAYS STORED RESPONSES */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle} weight="600">
            Past Assessment History
          </Text>
          {!activeUser?.history || activeUser.history.length === 0 ? (
            <View style={styles.noHistory}>
              <Text style={{ color: "#aaa", fontStyle: "italic" }}>
                No past assessments found for {activeUser?.name}.
              </Text>
            </View>
          ) : (
            // Show recent first
            [...activeUser.history].reverse().map((item, index) => (
              <View key={index} style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <FontAwesome5
                      name="notes-medical"
                      size={14}
                      color="#4a5568"
                    />
                    <Text weight="700" style={styles.historyCondition}>
                      {item.conditionName}
                    </Text>
                  </View>
                  <Text style={styles.historyDate}>{item.date}</Text>
                </View>

                <View style={styles.historyFooter}>
                  <View
                    style={[
                      styles.riskBadge,
                      { backgroundColor: getRiskColor(item.riskLevel) + "20" },
                    ]}
                  >
                    <Text
                      weight="700"
                      style={{
                        color: getRiskColor(item.riskLevel),
                        fontSize: 12,
                      }}
                    >
                      {item.riskLevel}
                    </Text>
                  </View>
                  <Text style={styles.historyScore}>
                    Risk Score: {item.totalScore}/{item.maxScore}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* 🔹 UNIFIED MODAL (ADD & EDIT) */}
        <Modal visible={modalVisible} animationType="fade" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalCard}>
              <Text weight="700" style={styles.modalTitle}>
                {isEditingMode ? "Update Details" : "Add New User"}
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={formData.name}
                onChangeText={(t) => handleFormChange("name", t)}
              />
              <TextInput
                style={styles.input}
                placeholder="Age"
                keyboardType="numeric"
                value={formData.age}
                onChangeText={(t) => handleFormChange("age", t)}
              />

              <View style={styles.genderContainer}>
                {["female", "male", "other"].map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={[
                      styles.genderOption,
                      formData.gender === g && styles.genderOptionSelected,
                    ]}
                    onPress={() => handleFormChange("gender", g)}
                  >
                    <Text
                      weight="600"
                      style={[
                        styles.genderText,
                        formData.gender === g && styles.genderTextSelected,
                      ]}
                    >
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                style={styles.input}
                placeholder="Phone (optional)"
                keyboardType="phone-pad"
                value={formData.phone}
                onChangeText={(t) => handleFormChange("phone", t)}
              />

              <View style={styles.formActions}>
                <TouchableOpacity
                  style={[styles.btn, styles.saveBtn]}
                  onPress={handleSaveUser}
                >
                  <Text weight="700" style={{ color: "#fff" }}>
                    {isEditingMode ? "Update" : "Save"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, styles.cancelBtn]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text weight="700">Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Begin Assessment Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => {
            navigation.navigate("QuestionnairesScreen", {
              conditionId: conditionId,
              conditionName: conditionName,
              activeUserId: activeUserId,
            });
          }}
        >
          <LinearGradient
            colors={["#EC4899", "#8B5CF6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.beginButton}
          >
            <Text style={styles.beginButtonText} weight="700">
              Begin Assessment
            </Text>
            <Feather name="arrow-right" size={20} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Bottom Badges */}
        <View style={styles.bottomBadgesRow}>
          <View style={styles.bottomBadge}>
            <MaterialIcons name="star-outline" size={18} color="#6B7280" />
            <Text style={styles.bottomBadgeText} weight="500">
              Evidence Based
            </Text>
          </View>
          <View style={[styles.bottomBadge, styles.bottomBadgePink]}>
            <MaterialCommunityIcons
              name="shield-outline"
              size={18}
              color="#E91E63"
            />
            <Text style={[styles.bottomBadgeText, { color: "#E91E63" }]} weight="500">
              Confidential
            </Text>
          </View>
        </View>

      </View>
    </ScrollView>
  );
};

export default PersonalDetails;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FBF8FF" },
  heroContainer: {
    paddingTop: 45,
    paddingHorizontal: 18,
    paddingBottom: 24,
    position: "relative",
    overflow: "hidden",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    // 🔥 Added Background Color here to match "border radius behind it" (Profile Card Border)
    backgroundColor: "#E9D5FF", 
  },
  headerBgImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: width,
    height: "100%",
    resizeMode: "cover",
  },
  heroTopBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  backButton: {
    marginRight: 8,
  },
  heroTitle: { fontSize: 18, color: "#7C3AED", letterSpacing: 0.2 },
  heroSubtitle: { 
    fontSize: 13, 
    color: "#4B5563", 
    lineHeight: 19,
    marginBottom: 10,
  },
  warningBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  warningIcon: {
    fontSize: 13,
    marginRight: 5,
  },
  warningText: {
    fontSize: 12,
    color: "#1F2937",
    fontWeight: "500",
  },
  illustrationContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  illustration: {
    width: width * 0.45,
    height: 120,
  },
  infoCardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 10,
    marginBottom: 8,
  },
  infoCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: "center",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F3E8FF",
  },
  infoIconContainer: {
    marginBottom: 6,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  infoValue: {
    fontSize: 15,
    color: "#1F2937",
    marginBottom: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: "#6B7280",
  },
  detailsContainer: { 
    paddingHorizontal: 18, 
    paddingTop: 24,
    backgroundColor: "#FFFFFF",
    marginTop: -8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  detailsHeading: { 
    fontSize: 16, 
    color: "#1F2937", 
    marginBottom: 14,
    letterSpacing: 0.1,
  },
  profileWrapper: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#E9D5FF",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  profileCardMain: { 
    borderRadius: 14,
  },
  profileCardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
  },
  avatarGradient: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  profileInfo: { 
    flex: 1,
  },
  profileName: { 
    fontSize: 17, 
    color: "#7C3AED",
    marginBottom: 5,
    letterSpacing: 0.2,
  },
  profileTagsRow: {
    flexDirection: "row",
    gap: 6,
  },
  profileTag: {
    backgroundColor: "#F5F3FF",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E9D5FF",
  },
  profileTagText: {
    fontSize: 11,
    color: "#7C3AED",
  },
  dropdownIcon: {
    padding: 4,
    backgroundColor: "#F9FAFB",
    borderRadius: 20,
  },
  userList: { marginTop: 5, marginBottom: 15 },
  switchUserLabel: {
    fontSize: 12,
    color: "#718096",
    marginBottom: 8,
    marginLeft: 4,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  userActive: { 
    backgroundColor: "#FAF5FF", 
    borderColor: "#7C3AED",
  },
  deleteIconArea: { padding: 8 },
  addUserButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAF5FF",
    borderStyle: "dashed",
    borderWidth: 1.5,
    borderColor: "#E9D5FF",
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
  },

  // HISTORY STYLES
  historySection: { marginTop: 15, marginBottom: 15 },
  historyTitle: {
    fontSize: 15,
    color: "#4a5568",
    marginBottom: 8,
    marginLeft: 4,
  },
  noHistory: {
    padding: 15,
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    alignItems: "center",
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  historyCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    alignItems: "center",
  },
  historyCondition: { fontSize: 15, color: "#2d3748" },
  historyDate: { fontSize: 12, color: "#a0aec0" },
  historyFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#f7fafc",
  },
  riskBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  historyScore: { fontSize: 13, color: "#718096", fontWeight: "600" },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 24,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    elevation: 10,
  },
  modalTitle: { fontSize: 20, marginBottom: 20, color: "#1F2937", textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    marginBottom: 14,
    backgroundColor: "#F9FAFB",
    color: "#1F2937",
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
    gap: 10,
  },
  genderOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  genderOptionSelected: {
    backgroundColor: "#7C3AED",
    borderColor: "#7C3AED",
  },
  genderText: { color: "#4B5563", fontSize: 14 },
  genderTextSelected: { color: "#fff" },
  formActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    gap: 12,
  },
  btn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 12,
  },
  saveBtn: { backgroundColor: "#7C3AED" },
  cancelBtn: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  beginButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 12,
    gap: 6,
    shadowColor: "#EC4899",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  beginButtonText: {
    fontSize: 15,
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  bottomBadgesRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginTop: 20,
    marginBottom: 20,
  },
  bottomBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 5,
  },
  bottomBadgePink: {
    borderColor: "#FBCFE8",
    backgroundColor: "#FDF2F8",
  },
  bottomBadgeText: {
    fontSize: 12,
    color: "#6B7280",
  },
});
