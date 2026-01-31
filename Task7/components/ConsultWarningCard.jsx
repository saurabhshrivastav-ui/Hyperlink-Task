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
      {/* Warning Banner */}
      <View style={styles.warningBanner}>
        <View style={styles.warningIconContainer}>
          <MaterialIcons name="warning" size={18} color="#FF9F43" />
        </View>
        <Text weight="500" style={styles.warningText}>
          This is not a diagnostic tool. For urgent concerns,{"\n"}please consult
        </Text>
      </View>

      {/* Consultation Options Row */}
      {showConsultOptions && (
        <View style={styles.consultationRow}>
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
                <FontAwesome5 name="user-friends" size={14} color="#4A8FE7" />
              </View>
              <Text weight="500" style={styles.consultOptionText}>
                One to One{"\n"}Consultation
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.consultOptionItem}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons name="message-text-outline" size={16} color="#4A8FE7" />
              </View>
              <Text weight="500" style={styles.consultOptionText}>
                Chat with{"\n"}specialist
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.consultOptionItem}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons name="clipboard-text-outline" size={16} color="#4A8FE7" />
              </View>
              <Text weight="500" style={styles.consultOptionText}>
                Prescription and{"\n"}lab referrals
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
    backgroundColor: "#FBF1FE",
    borderRadius: moderateScale(16),
    paddingVertical: isTablet ? 16 : moderateScale(14),
    paddingHorizontal: isTablet ? 16 : moderateScale(14),
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  warningBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFAF5",
    borderRadius: moderateScale(10),
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(12),
    borderWidth: 1,
    borderColor: "#FFE0C7",
  },
  warningIconContainer: {
    marginRight: moderateScale(8),
    backgroundColor: "#FFF3E0",
    borderRadius: moderateScale(14),
    width: moderateScale(28),
    height: moderateScale(28),
    alignItems: "center",
    justifyContent: "center",
  },
  warningText: {
    fontSize: isTablet ? 12 : moderateScale(11),
    color: "#2D2D2D",
    flex: 1,
    lineHeight: isTablet ? 18 : moderateScale(16),
    fontWeight: "500",
  },
  consultationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: moderateScale(14),
    paddingHorizontal: moderateScale(4),
  },
  consultButtonWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: moderateScale(12),
  },
  consultButton: {
    // Uses default GradientButton styling
  },
  optionsWrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  consultOptionItem: {
    alignItems: "center",
    flex: 1,
  },
  iconCircle: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: moderateScale(4),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  consultOptionText: {
    fontSize: isTablet ? 8 : moderateScale(7),
    color: "#2D2D2D",
    textAlign: "center",
    lineHeight: isTablet ? 11 : moderateScale(10),
    fontWeight: "500",
  },
});

export default ConsultWarningCard;
