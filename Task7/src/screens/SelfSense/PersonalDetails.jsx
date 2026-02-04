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
  ImageBackground,
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
import GradientButton from "../../../components/GradientButton";

const { width } = Dimensions.get("window");

const PersonalDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();

  const { conditionId, conditionName } = route.params || {
    conditionId: "diabetes",
    conditionName: "Diabetes",
  };

  // --- 🚀 1. CLEARED INITIAL DATA (Starts Empty) ---
  const [users, setUsers] = useState([]);
  const [activeUserId, setActiveUserId] = useState(null);

  // Derived state for the currently active user
  const activeUser = users.find((user) => user.id === activeUserId) || null;

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

  // --- 🔥 LOAD DATA (AsyncStorage) ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedUsers = await AsyncStorage.getItem("users");
        const storedActiveId = await AsyncStorage.getItem("activeUserId");

        if (storedUsers) {
          const parsedUsers = JSON.parse(storedUsers);
          setUsers(parsedUsers);

          if (parsedUsers.length > 0) {
            // If we have users, set the active ID
            if (storedActiveId) {
              setActiveUserId(JSON.parse(storedActiveId));
            } else {
              setActiveUserId(parsedUsers[0].id);
            }
          }
        }
      } catch (error) {
        console.error("Failed to load data", error);
      }
    };

    if (isFocused) {
      loadData();
    }
  }, [isFocused]);

  // --- 🔥 SAVE DATA HELPER ---
  const saveUsersToStorage = async (updatedUsers) => {
    try {
      setUsers(updatedUsers);
      await AsyncStorage.setItem("users", JSON.stringify(updatedUsers));
    } catch (error) {
      console.error("Failed to save data", error);
    }
  };

  // --- 🔥 CLEAR ALL DATA (Debug Button Logic) ---
  const handleResetData = async () => {
    Alert.alert(
      "Reset All Data",
      "This will wipe all profiles and history. Start fresh?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              setUsers([]);
              setActiveUserId(null);
            } catch (e) {
              console.error(e);
            }
          },
        },
      ],
    );
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleFormChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const openAddUserModal = () => {
    setFormData({ name: "", age: "", gender: "female", phone: "" });
    setIsEditingMode(false);
    setModalVisible(true);
  };

  const openEditUserModal = () => {
    if (!activeUser) return;
    setFormData({
      name: activeUser.name,
      age: activeUser.age,
      gender: activeUser.gender,
      phone: activeUser.phone || "",
    });
    setIsEditingMode(true);
    setModalVisible(true);
  };

  // --- 🔥 ADD NEW FRESH DATA ---
  const handleSaveUser = async () => {
    if (!formData.name || !formData.age) {
      Alert.alert("Missing Info", "Please enter a Name and Age.");
      return;
    }

    let updatedUsers;
    if (isEditingMode && activeUser) {
      // Edit existing
      updatedUsers = users.map((user) =>
        user.id === activeUserId ? { ...user, ...formData } : user,
      );
    } else {
      // Add new fresh user
      const newId =
        users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;

      const newUser = {
        id: newId,
        ...formData,
        email: "",
        history: [],
      };
      updatedUsers = [...users, newUser];

      // Automatically switch to the new user
      setActiveUserId(newId);
      await AsyncStorage.setItem("activeUserId", JSON.stringify(newId));
    }

    await saveUsersToStorage(updatedUsers);
    setModalVisible(false);
  };

  const confirmRemoveUser = (id) => {
    Alert.alert("Delete Profile", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const updatedUsers = users.filter((u) => u.id !== id);
          await saveUsersToStorage(updatedUsers);

          if (updatedUsers.length === 0) {
            setActiveUserId(null);
            await AsyncStorage.removeItem("activeUserId");
          } else if (activeUserId === id) {
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
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      {/* Header Section */}
      <ImageBackground
        source={require("../../../assets/Head.png")}
        style={styles.heroContainer}
        imageStyle={styles.headerBgImage}
      >
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

        <Text style={styles.heroSubtitle} weight="400">
          This self-check helps you understand patterns related to{"\n"}
          lifestyle, symptoms, and known risk indicators.
        </Text>

        <View style={styles.warningBadge}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <Text style={styles.warningText} weight="500">
            This check does not provide a diagnosis.
          </Text>
        </View>

        <View style={styles.illustrationContainer}>
          <Image
            source={require("../../../assets/MobHands.png")}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        <View style={styles.infoCardsRow}>
          <View style={styles.infoCard}>
            <MaterialCommunityIcons
              name="puzzle-outline"
              size={24}
              color="#7C3AED"
            />
            <Text style={styles.infoValue} weight="700">
              6
            </Text>
            <Text style={styles.infoLabel} weight="400">
              Questions
            </Text>
          </View>
          <View style={styles.infoCard}>
            <Feather name="clock" size={22} color="#7C3AED" />
            <Text style={styles.infoValue} weight="700">
              2 min
            </Text>
            <Text style={styles.infoLabel} weight="400">
              Duration
            </Text>
          </View>
          <View style={styles.infoCard}>
            <MaterialCommunityIcons
              name="shield-check-outline"
              size={24}
              color="#E91E63"
            />
            <Text style={[styles.infoValue, { color: "#E91E63" }]} weight="700">
              Private
            </Text>
            <Text style={[styles.infoLabel, { color: "#E91E63" }]} weight="400">
              Anonymous
            </Text>
          </View>
        </View>
      </ImageBackground>

      {/* Personal Details Section */}
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsHeading} weight="600">
          Lets Start with your personal details
        </Text>

        {/* --- 🚀 EMPTY STATE: IF NO USERS EXIST --- */}
        {!users || users.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <FontAwesome5 name="user-plus" size={40} color="#CBD5E1" />
            <Text style={styles.emptyStateText} weight="500">
              No profiles found. Create one to begin.
            </Text>
            <TouchableOpacity
              style={styles.createProfileBtn}
              onPress={openAddUserModal}
            >
              <Text style={styles.createProfileBtnText} weight="700">
                Create First Profile
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* --- ACTIVE PROFILE CARD --- */
          <>
            <View style={styles.profileWrapper}>
              <View style={styles.profileCardOuter}>
                <TouchableOpacity
                  style={styles.profileCardMain}
                  onPress={() => setIsProfileExpanded(!isProfileExpanded)}
                  activeOpacity={0.9}
                >
                  <View style={styles.profileCardContent}>
                    {/* Avatar with outer gradient ring */}
                    <LinearGradient
                      colors={["#FDBEA5", "#F695CF", "#8E66EB"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.avatarOuterRing}
                    >
                      <View style={styles.avatarWhiteRing}>
                        <LinearGradient
                          colors={["#EEA6C8", "#996EEB"]}
                          start={{ x: 0.13, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.avatarGradient}
                        >
                          <Text style={styles.avatarText} weight="700">
                            {getInitials(activeUser?.name)}
                          </Text>
                        </LinearGradient>
                      </View>
                    </LinearGradient>

                    <View style={styles.profileInfo}>
                      <Text style={styles.profileName} weight="700">
                        {activeUser?.name}
                      </Text>
                      <View style={styles.profileTagsRow}>
                        <View style={styles.profileTag}>
                          <Text style={styles.profileTagText} weight="500">
                            {activeUser?.gender}
                          </Text>
                        </View>
                        <View style={styles.profileTag}>
                          <Text style={styles.profileTagText} weight="500">
                            {activeUser?.age} yrs
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.dropdownIcon}>
                      <Ionicons
                        name={isProfileExpanded ? "chevron-up" : "chevron-down"}
                        size={24}
                        color="#7C3AED"
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* EXPANDED LIST */}
            {isProfileExpanded && (
              <View style={styles.userList}>
                <Text style={styles.switchUserLabel}>Switch User:</Text>
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
                        JSON.stringify(u.id),
                      );
                      setIsProfileExpanded(false);
                    }}
                  >
                    <FontAwesome name="user-circle" size={22} color="#553fb5" />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text weight="600">{u.name}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.deleteIconArea}
                      onPress={() => confirmRemoveUser(u.id)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color="#e53e3e"
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.addUserButton}
                  onPress={openAddUserModal}
                >
                  <FontAwesome5 name="plus" size={14} color="#4a5568" />
                  <Text weight="600" style={{ marginLeft: 6 }}>
                    Add Another User
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* HISTORY SECTION */}
            <View style={styles.historySection}>
              <Text style={styles.historyTitle} weight="600">
                Past Assessment History
              </Text>
              {!activeUser?.history || activeUser.history.length === 0 ? (
                <View style={styles.noHistory}>
                  <Text style={{ color: "#aaa", fontStyle: "italic" }}>
                    No history yet. Start your first assessment!
                  </Text>
                </View>
              ) : (
                [...activeUser.history].reverse().map((item, index) => (
                  <View key={index} style={styles.historyCard}>
                    <View style={styles.historyHeader}>
                      <View
                        style={{
                          flexDirection: "row",
                          gap: 6,
                          alignItems: "center",
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
                          {
                            backgroundColor:
                              getRiskColor(item.riskLevel) + "20",
                          },
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
                        Score: {item.totalScore}/{item.maxScore}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </View>

            {/* Begin Assessment Button */}
            <GradientButton
              title="Begin Assessment"
              variant="pink"
              onPress={() => {
                navigation.navigate("QuestionnairesScreen", {
                  conditionId: conditionId,
                  conditionName: conditionName,
                  activeUserId: activeUserId,
                });
              }}
              icon={<Feather name="arrow-right" size={20} color="#FFFFFF" />}
              iconPosition="right"
              style={styles.beginButton}
            />
          </>
        )}

        {/* 🔹 MODAL (ADD & EDIT) */}
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
                    {isEditingMode ? "Update" : "Save Profile"}
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
            <Text
              style={[styles.bottomBadgeText, { color: "#E91E63" }]}
              weight="500"
            >
              Confidential
            </Text>
          </View>
        </View>

        {/* RESET DATA BUTTON (Debug) */}
        <TouchableOpacity style={styles.resetButton} onPress={handleResetData}>
          <Text style={styles.resetButtonText}>Reset All Data (Debug)</Text>
        </TouchableOpacity>
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
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: "hidden", // Important for ImageBackground radius
  },
  headerBgImage: {
    resizeMode: "cover",
  },
  heroTopBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  backButton: { marginRight: 8 },
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
  warningIcon: { fontSize: 13, marginRight: 5 },
  warningText: { fontSize: 12, color: "#1F2937", fontWeight: "500" },
  illustrationContainer: { alignItems: "center", marginBottom: 16 },
  illustration: { width: width * 0.45, height: 120 },
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
  infoValue: { fontSize: 15, color: "#1F2937", marginBottom: 1 },
  infoLabel: { fontSize: 11, color: "#6B7280" },

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

  // --- EMPTY STATE STYLES ---
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderStyle: "dashed",
    marginBottom: 20,
  },
  emptyStateText: {
    color: "#64748B",
    marginTop: 10,
    marginBottom: 15,
    fontSize: 14,
  },
  createProfileBtn: {
    backgroundColor: "#7C3AED",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  createProfileBtnText: { color: "#fff", fontSize: 14 },

  // --- PROFILE STYLES ---
  profileWrapper: {
    marginBottom: 18,
    borderRadius: 16,
    overflow: "hidden",
  },
  profileCardOuter: {
    backgroundColor: "#F8F4FC",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  profileGradientBorder: {
    padding: 2,
    borderRadius: 16,
  },
  profileCardMain: {
    backgroundColor: "transparent",
    borderRadius: 14,
  },
  profileCardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
  },
  avatarOuterRing: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    padding: 2,
  },
  avatarWhiteRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
  },
  avatarGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 18, color: "#FFFFFF", letterSpacing: 0.5 },
  profileInfo: { flex: 1 },
  profileName: {
    fontSize: 17,
    color: "#7C3AED",
    marginBottom: 5,
    letterSpacing: 0.2,
  },
  profileTagsRow: { flexDirection: "row", gap: 6 },
  profileTag: {
    backgroundColor: "#F5F3FF",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E9D5FF",
  },
  profileTagText: { fontSize: 11, color: "#7C3AED" },
  dropdownIcon: {
    padding: 8,
    backgroundColor: "#F1E7FE",
    borderRadius: 20,
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
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

  // MODAL & INPUTS
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
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    color: "#1F2937",
    textAlign: "center",
  },
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
    marginTop: 10,
    borderRadius: 12,
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
  resetButton: {
    alignSelf: "center",
    marginTop: 10,
    padding: 10,
  },
  resetButtonText: {
    color: "#EF4444",
    fontSize: 12,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
}); 
