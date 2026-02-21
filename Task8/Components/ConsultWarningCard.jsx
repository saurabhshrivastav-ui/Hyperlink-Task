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
          <MaterialIcons name="warning-amber" size={18} color="#F59E0B" />
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
    borderRadius: moderateScale(14),
    paddingVertical: isTablet ? 14 : moderateScale(12),
    paddingHorizontal: isTablet ? 16 : moderateScale(14),
    borderWidth: 1,
    borderColor: "rgba(245,158,11,0.12)",
    shadowColor: "rgba(37,0,84,0.10)",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: moderateScale(12),
  },
  warningIconContainer: {
    marginRight: moderateScale(10),
    backgroundColor: "#FEF3C7",
    borderRadius: moderateScale(10),
    width: moderateScale(32),
    height: moderateScale(32),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(245,158,11,0.15)",
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
