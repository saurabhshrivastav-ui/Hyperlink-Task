import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from "react-native";
import {
  ArrowLeft,
  Camera,
  Upload,
  Smartphone,
  Monitor,
  UserCheck,
} from "lucide-react-native";

const { width } = Dimensions.get("window");

const KnowYourMedicineScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Background Decorative Image (Top) */}
      <Image
        source={require("../../assets/Know.png")}
        style={styles.topBackgroundImage}
        resizeMode="cover"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ArrowLeft color="#000" size={24} />
          </TouchableOpacity>

          <Text style={styles.pageTitle}>Know Your Medicine</Text>

          <View style={{ width: 24 }} />
        </View>

        {/* How It Works Section */}
        <View style={styles.howItWorksContainer}>
          <Text style={styles.sectionHeader}>How it works</Text>
          <View style={styles.stepsRow}>
            {/* Step 1 */}
            <View style={styles.stepItem}>
              <View style={styles.stepIconCircle}>
                <Text style={styles.stepNumber}>1</Text>
              </View>
              <Smartphone size={20} color="#333" style={{ marginBottom: 4 }} />
              <Text style={styles.stepText}>
                Upload / Scan{"\n"}medicine packet
              </Text>
            </View>

            {/* Separator */}
            <View style={styles.stepSeparator} />

            {/* Step 2 */}
            <View style={styles.stepItem}>
              <View style={styles.stepIconCircle}>
                <Text style={styles.stepNumber}>2</Text>
              </View>
              <Monitor size={20} color="#333" style={{ marginBottom: 4 }} />
              <Text style={styles.stepText}>Process the{"\n"}image</Text>
            </View>

            {/* Separator */}
            <View style={styles.stepSeparator} />

            {/* Step 3 */}
            <View style={styles.stepItem}>
              <View style={styles.stepIconCircle}>
                <Text style={styles.stepNumber}>3</Text>
              </View>
              <UserCheck size={20} color="#333" style={{ marginBottom: 4 }} />
              <Text style={styles.stepText}>Information{"\n"}Presented</Text>
            </View>
          </View>
        </View>

        {/* Action Cards */}
        <View style={styles.actionsContainer}>
          
          {/* Scan Card */}
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('MedicineScanner')}
          >
            <View style={styles.actionIconContainer}>
              <Camera size={32} color="#333" />
            </View>
            <Text style={styles.actionTitle}>Scan a Medicine</Text>
            <Text style={styles.actionSubtitle}>
              Scan your medicine packet properly
            </Text>
          </TouchableOpacity>

          {/* Upload Card - MODIFIED HERE */}
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('MedicineUpload')}
          >
            <View style={styles.actionIconContainer}>
              <Upload size={32} color="#333" />
            </View>
            <Text style={styles.actionTitle}>Upload Image</Text>
            <Text style={styles.actionSubtitle}>
              Upload a clear picture of medicine packet
            </Text>
          </TouchableOpacity>
        </View>

        {/* Central Graphic Section */}
        <View style={styles.demoSection}>
          <Image
            source={require("../../assets/Phone.png")}
            style={styles.centerPhoneImage}
            resizeMode="contain"
          />

          {/* Arrows and text */}
          <View style={styles.leftInstruction}>
            <Text style={styles.instructionText}>
              Scan the medicine packet{"\n"}properly
            </Text>
            <Text style={styles.arrowText}>→</Text>
          </View>
          <View style={styles.rightInstruction}>
            <Text style={styles.arrowText}>←</Text>
            <Text style={styles.instructionText}>Upload a clear image</Text>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Footer Image */}
      <Image
        source={require("../../assets/Medi.png")}
        style={styles.footerImage}
        resizeMode="cover"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
  },
  scrollContent: {
    paddingBottom: 20,
    zIndex: 10,
  },
  topBackgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width,
    height: 250,
  },

  /* Header Styles */
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 60,
    marginBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#004D40",
    flex: 1,
  },

  /* How It Works Styles */
  howItWorksContainer: {
    backgroundColor: "#98D6DC",
    marginHorizontal: 20,
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
    color: "#004D40",
  },
  stepsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  stepItem: {
    alignItems: "center",
    flex: 1,
  },
  stepIconCircle: {
    position: "absolute",
    top: -5,
    right: 15,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 10,
    width: 14,
    height: 14,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  stepNumber: {
    fontSize: 8,
    fontWeight: "bold",
  },
  stepText: {
    fontSize: 9,
    textAlign: "center",
    color: "#000",
    marginTop: 2,
  },
  stepSeparator: {
    width: 1,
    height: "60%",
    backgroundColor: "rgba(0,0,0,0.1)",
    marginTop: 10,
  },

  /* Action Buttons Styles */
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  actionCard: {
    backgroundColor: "white",
    width: "47%",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  actionIconContainer: {
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
    textAlign: "center",
  },
  actionSubtitle: {
    fontSize: 10,
    color: "#666",
    textAlign: "center",
    lineHeight: 14,
  },

  /* Demo / Graphic Section */
  demoSection: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    height: 250,
    position: "relative",
  },
  centerPhoneImage: {
    width: 110,
    height: 200,
    zIndex: 2,
  },

  /* Instruction Text */
  leftInstruction: {
    position: "absolute",
    left: 20,
    top: 100,
    flexDirection: "row",
    alignItems: "center",
  },
  rightInstruction: {
    position: "absolute",
    right: 20,
    top: 100,
    flexDirection: "row",
    alignItems: "center",
  },
  instructionText: {
    fontSize: 10,
    fontWeight: "bold",
    width: 80,
    textAlign: "center",
  },
  arrowText: {
    fontSize: 20,
    fontWeight: "200",
    marginHorizontal: 5,
    color: "#333",
  },

  /* Footer Style */
  footerImage: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: width,
    height: 120,
  },
});

export default KnowYourMedicineScreen;