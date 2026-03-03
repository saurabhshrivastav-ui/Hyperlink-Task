import React from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  Feather,
  FontAwesome5,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "../Components/TextWrapper";
import GradientButton from "./GradientButton";

const { width } = Dimensions.get("window");
const isTablet = width >= 768;
const moderateScale = (size, factor = 0.5) =>
  size + ((width / 375) * size - size) * factor;

const ConsultWarningCard = ({
  onConsultPress,
  showConsultOptions = true,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {/* Top Row - Warning and Text */}
      <View style={styles.topRow}>
        <View style={styles.warningIconContainer}>
          <MaterialIcons name="warning" size={16} color="#FF9F43" />
        </View>
        <Text weight="500" style={styles.warningText}>
          This is not a diagnostic tool. For urgent concerns,{"\n"}please
          consult
        </Text>
      </View>

      {/* Bottom Row - Button and Options */}
      {showConsultOptions && (
        <View style={styles.bottomRow}>
          <View style={styles.consultButtonWrapper}>
            <GradientButton
              title="Consult Now!"
              variant="pink"
              onPress={onConsultPress}
              size="medium"
              style={styles.consultButton}
            />
          </View>

          <View style={styles.optionsWrapper}>
            <TouchableOpacity style={styles.consultOptionItem}>
              <View style={styles.iconCircle}>
                <FontAwesome5 name="user-friends" size={15} color="#4A8FE7" />
              </View>
              <Text weight="500" style={styles.consultOptionText}>
                One to One{"\n"}Consultation
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.consultOptionItem}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons
                  name="message-text-outline"
                  size={15}
                  color="#4A8FE7"
                />
              </View>
              <Text weight="500" style={styles.consultOptionText}>
                Chat with{"\n"}specialist
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.consultOptionItem}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons
                  name="clipboard-text-outline"
                  size={15}
                  color="#4A8FE7"
                />
              </View>
              <Text weight="500" style={styles.consultOptionText}>
                Prescription{"\n"} and lab referrals
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: isTablet ? 12 : 10,
    paddingHorizontal: isTablet ? 14 : 12,
    borderWidth: 1,
    borderColor: "rgba(74,143,231,0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    marginBottom: 10,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  warningIconContainer: {
    marginRight: 8,
    backgroundColor: "#FFF3E0",
    borderRadius: 6,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  warningText: {
    fontSize: 18,
    color: "#1f2937",
    flex: 1,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  consultButtonWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  consultButton: {
    borderRadius: 8,
    overflow: "hidden",
  },
  optionsWrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  consultOptionItem: {
    alignItems: "center",
    flex: 1,
  },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#F0F4FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
    borderWidth: 1,
    borderColor: "rgba(74,143,231,0.1)",
  },
  consultOptionText: {
    fontSize: 12,
    color: "#0f172a",
    textAlign: "center",
  },
});

export default ConsultWarningCard;
