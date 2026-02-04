import React from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { MaterialIcons, MaterialCommunityIcons, Feather, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "./TextWrapper";
import GradientButton from "./GradientButton";

const { width } = Dimensions.get("window");
const isTablet = width >= 768;
const moderateScale = (size, factor = 0.5) => size + ((width / 375) * size - size) * factor;

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
          This is not a diagnostic tool. For urgent concerns,{"\n"}please consult
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
              size="small"
              style={styles.consultButton}
            />
          </View>

          <View style={styles.optionsWrapper}>
            <TouchableOpacity style={styles.consultOptionItem}>
              <View style={styles.iconCircle}>
                <FontAwesome5 name="user-friends" size={12} color="#4A8FE7" />
              </View>
              <Text weight="500" style={styles.consultOptionText}>
                One to One{"\n"}Consultation
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.consultOptionItem}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons name="message-text-outline" size={14} color="#4A8FE7" />
              </View>
              <Text weight="500" style={styles.consultOptionText}>
                Chat with{"\n"}specialist
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.consultOptionItem}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons name="clipboard-text-outline" size={14} color="#4A8FE7" />
              </View>
              <Text weight="500" style={styles.consultOptionText}>
                Prescription{"\n"}and lab{"\n"}referrals
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
    borderRadius: moderateScale(12),
    paddingVertical: isTablet ? 12 : moderateScale(10),
    paddingHorizontal: isTablet ? 14 : moderateScale(12),
    borderWidth: 1,
    borderColor: "rgba(74,143,231,0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: moderateScale(10),
  },
  warningIconContainer: {
    marginRight: moderateScale(8),
    backgroundColor: "#FFF3E0",
    borderRadius: moderateScale(6),
    width: moderateScale(24),
    height: moderateScale(24),
    alignItems: "center",
    justifyContent: "center",
  },
  warningText: {
    fontSize: isTablet ? 11 : moderateScale(10),
    color: "#1f2937",
    flex: 1,
    lineHeight: isTablet ? 16 : moderateScale(14),
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  consultButtonWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: moderateScale(10),
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
    paddingVertical: moderateScale(4),
    paddingHorizontal: moderateScale(2),
  },
  iconCircle: {
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: moderateScale(8),
    backgroundColor: "#F0F4FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: moderateScale(4),
    borderWidth: 1,
    borderColor: "rgba(74,143,231,0.1)",
  },
  consultOptionText: {
    fontSize: isTablet ? 8 : moderateScale(7.5),
    color: "#0f172a",
    textAlign: "center",
    lineHeight: isTablet ? 11 : moderateScale(10),
  },
});

export default ConsultWarningCard;
