import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Feather,
  FontAwesome,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import { Text } from "../../../components/TextWrapper";
import CounsellingDetailsBG from "../../../assets/counsellingdetailsbg.svg";

const PersonalDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Receive data from previous screen
  const { conditionId, conditionName } = route.params || {
    conditionId: "diabetes",
    conditionName: "Diabetes",
  };

  // 1. Main User State (Removed weight/height)
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "SAKSHI NISHAD",
      age: "22",
      gender: "female",
      email: "sakshi@example.com",
      phone: "+91 9876543210",
    },
  ]);

  const [activeUserId, setActiveUserId] = useState(1);
  const activeUser = users.find((user) => user.id === activeUserId) || users[0];

  // 2. UI State
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditingMode, setIsEditingMode] = useState(false);

  // 3. Form State
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "female",
    phone: "",
  });

  // --- Handlers ---

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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

  const handleSaveUser = () => {
    if (!formData.name || !formData.age) {
      Alert.alert("Missing Info", "Please enter a Name and Age.");
      return;
    }

    if (isEditingMode) {
      // UPDATE Existing User
      setUsers(
        users.map((user) =>
          user.id === activeUserId ? { ...user, ...formData } : user
        )
      );
    } else {
      // CREATE New User
      const newId =
        users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
      const newUser = {
        id: newId,
        ...formData,
        email: "",
      };
      setUsers([...users, newUser]);
      setActiveUserId(newId);
    }

    setModalVisible(false);
  };

  const confirmRemoveUser = (id) => {
    if (users.length <= 1) {
      Alert.alert("Action Denied", "You must have at least one user profile.");
      return;
    }

    Alert.alert(
      "Delete Profile",
      "Are you sure you want to remove this user?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const updatedUsers = users.filter((u) => u.id !== id);
            setUsers(updatedUsers);
            if (activeUserId === id) {
              setActiveUserId(updatedUsers[0].id);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* 🔹 Header Gradient */}
      <LinearGradient
        colors={["#6ea6e7", "#daeffe", "#e0d3ff"]}
        style={styles.heroContainer}
      >
        <View style={styles.heroTopBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={20} color="#553fb5" />
          </TouchableOpacity>

          <View style={styles.heroTexts}>
            <Text style={styles.heroTitle} weight="800">
              {conditionName.toUpperCase()}
            </Text>
            <Text style={styles.heroSubtitle} weight="400">
              Understand Your Genetic Risk for {conditionName}
            </Text>
          </View>
        </View>

        <View style={styles.heroImage}>
          <CounsellingDetailsBG width={300} height={200} />
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle} weight="700">
            Discover Your Genetic Risk Factors
          </Text>
          <View style={styles.feature}>
            <Text weight="400">
              ⏱️ 3–5 minute assessment with simple questions
            </Text>
          </View>
          <View style={styles.feature}>
            <Text weight="400">
              🔍 Personalized {conditionName} Risk Score analysis
            </Text>
          </View>
          <View style={styles.tagsRow}>
            {["Diagnostic Tests", "Specialist Consult", "DNA-Based Plans"].map(
              (tag, index) => (
                <View key={index} style={styles.tagContainer}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              )
            )}
          </View>
        </View>
      </LinearGradient>

      {/* 🔹 Personal Details Section */}
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsHeading} weight="700">
          Personal Details
        </Text>

        {/* ACTIVE PROFILE CARD */}
        <View style={styles.profileWrapper}>
          <TouchableOpacity
            style={styles.profileCardMain}
            onPress={() => setIsProfileExpanded(!isProfileExpanded)}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={["#6e8efb", "#a777e3"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientCard}
            >
              <View style={styles.profileInfo}>
                <View style={styles.userIcon}>
                  <FontAwesome name="user" size={20} color="#fff" />
                </View>
                <View>
                  <Text style={styles.profileName} weight="700">
                    {activeUser.name}
                  </Text>
                  <Text style={styles.profileDetails} weight="400">
                    {activeUser.age} yrs, {activeUser.gender}
                  </Text>
                </View>
              </View>

              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={openEditUserModal}
                >
                  <Feather name="edit-2" size={18} color="#fff" />
                </TouchableOpacity>

                <Ionicons
                  name={isProfileExpanded ? "chevron-up" : "chevron-down"}
                  size={22}
                  color="#fff"
                  style={{ marginLeft: 10 }}
                />
              </View>
            </LinearGradient>
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
                onPress={() => {
                  setActiveUserId(u.id);
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

        {/* Start Button */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => {
            navigation.navigate("QuestionnairesScreen", {
              conditionId: conditionId,
              conditionName: conditionName,
            });
          }}
        >
          <Text weight="700" style={{ color: "#fff" }}>
            Start Assessment
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default PersonalDetails;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7fafc" },

  // HERO SECTION
  heroContainer: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    padding: 20,
  },
  heroTopBar: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
    marginTop: 25,
  },
  backButton: {
    backgroundColor: "rgba(255,255,255,0.3)",
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  heroTexts: { flex: 1, marginLeft: 10 },
  heroTitle: { fontSize: 18, color: "#553fb5" },
  heroSubtitle: { fontSize: 12, color: "#000", opacity: 0.8 },
  heroImage: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },

  // INFO CARD
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  cardTitle: { fontSize: 16, color: "#1a365d", marginBottom: 8 },
  feature: { marginBottom: 6 },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginTop: 4,
  },
  tagContainer: {
    backgroundColor: "rgba(102,126,234,0.1)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 6,
    marginTop: 4,
  },
  tagText: { color: "#553fb5", fontSize: 13, fontWeight: "500" },

  // PERSONAL DETAILS
  detailsContainer: { padding: 20 },
  detailsHeading: { fontSize: 17, color: "#1e293b", marginBottom: 10 },

  // PROFILE CARD
  profileWrapper: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#667eea",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 10,
  },
  profileCardMain: { borderRadius: 16 },
  gradientCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  profileInfo: { flexDirection: "row", alignItems: "center", flex: 1 },
  userIcon: {
    backgroundColor: "rgba(255,255,255,0.2)",
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  profileName: { fontSize: 18, color: "#fff" },
  profileDetails: { fontSize: 14, color: "#fff", opacity: 0.9 },
  cardActions: { flexDirection: "row", alignItems: "center" },
  iconBtn: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    marginLeft: 5,
  },

  // EXPANDED USER LIST
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
    borderColor: "#e2e8f0",
  },
  userActive: { backgroundColor: "#ebf4ff", borderColor: "#667eea" },
  deleteIconArea: {
    padding: 8,
  },
  addUserButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderStyle: "dashed",
    borderWidth: 1.5,
    borderColor: "#cbd5e0",
    borderRadius: 12,
    padding: 12,
    marginTop: 6,
  },

  // MODAL
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 10,
  },
  modalTitle: { fontSize: 18, marginBottom: 16, color: "#1a365d" },
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginBottom: 12,
    backgroundColor: "#f8fafc",
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  genderOption: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  genderOptionSelected: {
    backgroundColor: "#553fb5",
    borderColor: "#553fb5",
  },
  genderText: { color: "#1e293b" },
  genderTextSelected: { color: "#fff" },

  formActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  btn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  saveBtn: { backgroundColor: "#553fb5" },
  cancelBtn: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#cbd5e0",
  },

  // START BUTTON
  startButton: {
    backgroundColor: "#553fb5",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 24,
    shadowColor: "#553fb5",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
});