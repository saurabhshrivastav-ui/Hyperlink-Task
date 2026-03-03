import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  TextInput,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
  FontAwesome,
  FontAwesome5,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "../../Components/TextWrapper";
import GradientButton from "../../Components/GradientButton";

const { width, height } = Dimensions.get("window");

const COLORS = {
  brandPurple: "#5B3DF5",
  white: "#FFFFFF",
  textPrimary: "#2D2D2D",
  textSecondary: "#666666",
  bgLight: "#FAF3FD",
};

export default function AssessmentHistory({ navigation: navigationProp }) {
  const navigationHook = useNavigation();
  const navigation = navigationProp || navigationHook;
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "female",
    phone: "",
  });
  const [users, setUsers] = useState([]);
  const [activeUserId, setActiveUserId] = useState(null);

  const activeUser = users.find((user) => user.id === activeUserId) || null;

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedUsers = await AsyncStorage.getItem("users");
        const storedActiveId = await AsyncStorage.getItem("activeUserId");

        const parsedUsers = storedUsers ? JSON.parse(storedUsers) : [];
        setUsers(parsedUsers);

        if (parsedUsers.length === 0) {
          setActiveUserId(null);
          return;
        }

        const parsedActiveId = storedActiveId
          ? JSON.parse(storedActiveId)
          : null;
        const safeId = parsedUsers.some((u) => u.id === parsedActiveId)
          ? parsedActiveId
          : parsedUsers[0].id;

        setActiveUserId(safeId);
        await AsyncStorage.setItem("activeUserId", JSON.stringify(safeId));
      } catch (error) {
        console.error("Failed to load data", error);
      }
    };

    loadData();
  }, []);

  const getRiskColor = (risk) => {
    if (!risk) return "#aaa";
    if (risk.includes("High")) return "#dc3545";
    if (risk.includes("Moderate")) return "#ffc107";
    return "#28a745";
  };

  const getRiskIcon = (risk) => {
    if (!risk) return "help-circle-outline";
    if (risk.includes("High")) return "alert-circle";
    if (risk.includes("Moderate")) return "alert";
    return "check-circle";
  };

  const openAddUserModal = () => {
    setFormData({ name: "", age: "", gender: "female", phone: "" });
    setIsEditingMode(false);
    setModalVisible(true);
  };

  // ✅ 1) Single source of truth for saving users + syncing state
  const saveUsersToStorage = async (nextUsers, nextActiveId = activeUserId) => {
    try {
      setUsers(nextUsers);
      await AsyncStorage.setItem("users", JSON.stringify(nextUsers));

      // keep activeUserId safe + persisted
      if (nextUsers.length === 0) {
        setActiveUserId(null);
        await AsyncStorage.removeItem("activeUserId");
        return;
      }

      const safeActiveId = nextUsers.some((u) => u.id === nextActiveId)
        ? nextActiveId
        : nextUsers[0].id;

      setActiveUserId(safeActiveId);
      await AsyncStorage.setItem("activeUserId", JSON.stringify(safeActiveId));
    } catch (e) {
      console.error("Failed to save users", e);
      Alert.alert("Save failed", "Could not save profile. Please try again.");
    }
  };

  // ✅ 2) Robust ID generator (avoids Math.max issues if ids are strings)
  const generateUserId = () =>
    `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // --- 🔥 ADD NEW FRESH DATA ---
  const handleSaveUser = async () => {
    const trimmedName = (formData.name || "").trim();
    const trimmedAge = (formData.age || "").trim();

    if (!trimmedName || !trimmedAge) {
      Alert.alert("Missing Info", "Please enter a Name and Age.");
      return;
    }

    // (optional) basic validation: age must be a number
    const ageNum = Number(trimmedAge);
    if (!Number.isFinite(ageNum) || ageNum <= 0) {
      Alert.alert("Invalid Age", "Please enter a valid age (e.g., 24).");
      return;
    }

    let updatedUsers = [];

    if (isEditingMode && activeUser) {
      // ✅ Edit existing user
      updatedUsers = users.map((user) =>
        user.id === activeUserId
          ? { ...user, ...formData, name: trimmedName, age: String(ageNum) }
          : user,
      );

      await saveUsersToStorage(updatedUsers, activeUserId);
    } else {
      // ✅ Add new user
      const newId = generateUserId();

      const newUser = {
        id: newId,
        ...formData,
        name: trimmedName,
        age: String(ageNum),
        email: "",
        history: [],
      };

      updatedUsers = [...users, newUser];

      // ✅ Save both users + active user in ONE place
      await saveUsersToStorage(updatedUsers, newId);
    }

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

  const handleFormChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bgLight} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}

        <View style={styles.header}>
          <View style={styles.heroTopBar}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.85}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather name="arrow-left" size={20} color="#553fb5" />
            </TouchableOpacity>

            <View style={styles.heroTexts}>
              <Text style={styles.heroTitle} weight="800" numberOfLines={1}>
                Assessment History
              </Text>
              <Text style={styles.heroSubtitle} weight="400" numberOfLines={2}>
                View your past health assessments and results.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {/* User Info Card */}

          {/* Personal Details Section */}
          <View style={styles.detailsContainer}>
            {/* --- 🚀 EMPTY STATE: IF NO USERS EXIST --- */}
            {!users || users.length === 0 ? (
              <View style={styles.emptyStateContainer}>
                <FontAwesome5 name="user-plus" size={40} color="#CBD5E1" />
                <Text style={styles.emptyStateText} weight="500">
                  No profiles found
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
                  <LinearGradient
                    colors={["#FDEFFB", "#FBF1FE", "#FBF1FE"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0.4 }}
                    style={styles.profileCardOuter}
                  >
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
                            name={
                              isProfileExpanded ? "chevron-up" : "chevron-down"
                            }
                            size={24}
                            color="#7C3AED"
                          />
                        </View>
                      </View>
                    </TouchableOpacity>
                  </LinearGradient>
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
                        <FontAwesome
                          name="user-circle"
                          size={22}
                          color="#553fb5"
                        />
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
                  </View>
                )}
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
          </View>

          {/* History Section */}

          {!users || users.length === 0 ? (
            <Text weight="400" style={styles.emptyStateSubtext}>
              Create a profile and complete an assessment to see history.
            </Text>
          ) : !activeUser?.history || activeUser.history.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="clipboard-text-outline"
                size={60}
                color="#CBD5E1"
              />
              <Text weight="500" style={styles.emptyStateText}>
                No assessments yet.
              </Text>
              <Text weight="400" style={styles.emptyStateSubtext}>
                Start your first self-check to see your history here.
              </Text>
              <TouchableOpacity
                style={styles.startButton}
                onPress={() => navigation.navigate("SelfSenseHealthArea")}
              >
                <Text weight="600" style={styles.startButtonText}>
                  Start Self Check
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.historyList}>
              {[...activeUser.history].reverse().map((item, index) => (
                <View key={index} style={styles.historyCard}>
                  <View style={styles.historyHeader}>
                    <View style={styles.historyConditionRow}>
                      <View
                        style={[
                          styles.riskIconCircle,
                          {
                            backgroundColor:
                              getRiskColor(item.riskLevel) + "20",
                          },
                        ]}
                      >
                        <MaterialCommunityIcons
                          name={getRiskIcon(item.riskLevel)}
                          size={18}
                          color={getRiskColor(item.riskLevel)}
                        />
                      </View>
                      <View style={styles.historyConditionInfo}>
                        <Text weight="700" style={styles.historyCondition}>
                          {item.conditionName}
                        </Text>
                        <Text style={styles.historyDate}>{item.date}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.historyBody}>
                    <View style={styles.historyStatRow}>
                      <View style={styles.historyStat}>
                        <Text weight="400" style={styles.historyStatLabel}>
                          Risk Level
                        </Text>
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
                      </View>
                      <View style={styles.historyStat}>
                        <Text weight="400" style={styles.historyStatLabel}>
                          Score
                        </Text>
                        <Text weight="700" style={styles.historyScore}>
                          {item.totalScore}/{item.maxScore}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7fafc",
  },
  header: {
    paddingHorizontal: 20,
    width: "100%",
    alignSelf: "center",
  },

  heroTopBar: {
    marginTop: 40,
    flexDirection: "row",
    alignItems: "flex-start", // better vertical alignment
  },

  backButton: {
    backgroundColor: "rgba(255,255,255,0.25)",
    padding: 8,
    borderRadius: 12,
  },

  heroTexts: {
    flex: 1,
    marginLeft: 12,
  },

  heroTitle: {
    fontSize: 22,
    color: "#553fb5",
  },

  heroSubtitle: {
    fontSize: 18,
    color: "#553fb5",
    opacity: 0.8,
  },
  content: {
    padding: 20,
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

  createProfileBtn: {
    backgroundColor: "#7C3AED",
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 10,
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
    borderRadius: 16,
    borderWidth: 2,
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
  avatarText: { fontSize: 22, color: "#FFFFFF", letterSpacing: 0.5 },
  profileInfo: { flex: 1 },
  profileName: {
    fontSize: 22,
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
  profileTagText: { fontSize: 15, color: "#7C3AED" },
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
    fontSize: 15,
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

  sectionTitle: {
    fontSize: 22,
    color: COLORS.textPrimary,
    marginBottom: 14,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderStyle: "dashed",
  },
  emptyStateText: {
    color: "#64748B",
    marginTop: 14,
    fontSize: 22,
  },
  emptyStateSubtext: {
    color: "#94A3B8",
    marginTop: 6,
    fontSize: 15,
    textAlign: "center",
    paddingHorizontal: 30,
  },
  startButton: {
    backgroundColor: "#5B3DF5",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
  },
  historyList: {
    gap: 12,
  },
  historyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  historyHeader: {
    marginBottom: 12,
  },
  historyConditionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  riskIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  historyConditionInfo: {
    marginLeft: 12,
    flex: 1,
  },
  historyCondition: {
    fontSize: 22,
    color: COLORS.textPrimary,
  },
  historyDate: {
    fontSize: 15,
    color: "#94A3B8",
    marginTop: 2,
  },
  historyBody: {
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 12,
  },
  historyStatRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  historyStat: {
    alignItems: "flex-start",
  },
  historyStatLabel: {
    fontSize: 15,
    color: "#94A3B8",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  riskBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  historyScore: {
    fontSize: 22,
    color: COLORS.textPrimary,
  },
  userListItem: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  userListItemActive: {
    backgroundColor: "#FAF5FF",
    borderColor: "#5B3DF5",
  },
  userListAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E9D5FF",
    alignItems: "center",
    justifyContent: "center",
  },
  userListAvatarText: {
    fontSize: 14,
    color: "#7C3AED",
  },
  userListInfo: {
    marginLeft: 12,
    flex: 1,
  },
  userListName: {
    fontSize: 18,
    color: COLORS.textPrimary,
  },
  userListDetails: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

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
    fontSize: 22,
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
    marginBottom: 14,
    fontSize: 15,
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
  genderText: { color: "#4B5563", fontSize: 16 },
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
});
