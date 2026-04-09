import { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Modal,
  Pressable,
  Animated,
  PanResponder,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { Text } from "../../components/TextWrapper";

const { width, height } = Dimensions.get("window");
const isMini = width <= 360;
const isSmall = width <= 390;
const TRAY_HEIGHT = Math.min(540, Math.max(480, Math.round(height * 0.60)));

const REPORTS = [
  { id: 1, title: "Full Body Checkup 05Feb", date: "Feb 05, 2026" },
  { id: 2, title: "Full Body Checkup 16Dec", date: "Dec 16, 2025" },
];

const MENU_ITEMS = [
  { key: "share",   label: "Share",         icon: "account-plus-outline" },
  { key: "manage",  label: "Manage Access", icon: "account-multiple-outline" },
  { key: "download",label: "Download",      icon: "tray-arrow-down" },
  { key: "rename",  label: "Rename",        icon: "pencil-outline" },
  { key: "delete",  label: "Delete",        icon: "delete-outline" },
];

const TestReports = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("test");
  const [search, setSearch] = useState("");
  const [menuReport, setMenuReport] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("1 day");

  const slideAnim = useRef(new Animated.Value(300)).current;

  const openMenu = (report) => {
    setMenuReport(report);
    slideAnim.setValue(300);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      damping: 20,
      stiffness: 180,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 220,
      useNativeDriver: true,
    }).start(() => setMenuReport(null));
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) {
          slideAnim.setValue(gesture.dy);
        } else {
          slideAnim.setValue(gesture.dy * 0.15);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > 80 || gesture.vy > 0.8) {
          Animated.timing(slideAnim, {
            toValue: 300,
            duration: 200,
            useNativeDriver: true,
          }).start(() => setMenuReport(null));
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            damping: 20,
            stiffness: 200,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground
          source={require("../../assets/HeaderTestReports.webp")}
          style={styles.headerBackground}
          imageStyle={styles.headerImage}
          resizeMode="cover"
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation && navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color="#5B21B6" />
          </TouchableOpacity>

          <Text weight="700" style={styles.headerTitle}>
            Test Reports
          </Text>
          <Text weight="400" style={styles.headerSubtitle}>
            Securely store and manage your health documents.
          </Text>

          <TouchableOpacity style={styles.secureVaultBtn}>
            <View style={styles.lockBox}>
              <Ionicons name="lock-closed" size={22} color="#6D28D9" />
            </View>
            <Text style={styles.secureVaultText} weight="600">
              Secure Vault
            </Text>
          </TouchableOpacity>

          <LinearGradient
            colors={["transparent", "rgba(200, 226, 245, 0.6)", "#F7F8FA"]}
            locations={[0, 0.5, 1]}
            style={styles.headerFade}
          />
        </ImageBackground>

        <View style={styles.profileCardWrapper}>
          <LinearGradient
            colors={["#FDEFFB", "#FBF1FE", "#FBF1FE"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0.4 }}
            style={styles.profileCardOuter}
          >
            <View style={styles.profileCardContent}>
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
                    <Text style={styles.profileInitials} weight="700">
                      SN
                    </Text>
                  </LinearGradient>
                </View>
              </LinearGradient>

              <View style={styles.profileInfo}>
                <Text style={styles.profileName} weight="700">
                  Sakshi Nishad
                </Text>
                <View style={styles.profileTags}>
                  <View style={styles.profileTag}>
                    <Text weight="500" style={styles.profileTagText}>
                      Female
                    </Text>
                  </View>
                  <View style={styles.profileTag}>
                    <Text weight="500" style={styles.profileTagText}>
                      22 yrs
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.profileDropdown}>
                <Ionicons name="chevron-down" size={24} color="#7C3AED" />
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.contentPadding}>
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "test" && styles.tabActive]}
              onPress={() => setActiveTab("test")}
            >
              <Text
                weight="700"
                style={[
                  styles.tabText,
                  activeTab === "test" && styles.tabTextActive,
                ]}
              >
                Test Reports
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === "uploaded" && styles.tabActive,
              ]}
              onPress={() => setActiveTab("uploaded")}
            >
              <Text
                weight="700"
                style={[
                  styles.tabText,
                  activeTab === "uploaded" && styles.tabTextActive,
                ]}
              >
                Uploaded Reports
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <View style={styles.searchInputWrap}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search here"
                placeholderTextColor="#9CA3AF"
                value={search}
                onChangeText={setSearch}
              />
              <TouchableOpacity style={styles.searchFilterBtn}>
                <Feather name="sliders" size={16} color="#6B7280" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.searchIconBtn}>
                <Ionicons name="search" size={18} color="#7C3AED" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.reportsGrid}>
            {REPORTS.map((report) => (
              <View key={report.id} style={styles.reportCard}>
                <View style={styles.reportCardHeader}>
                  <View style={styles.reportCardTitleRow}>
                    <MaterialCommunityIcons
                      name="file-pdf-box"
                      size={20}
                      color="#E53935"
                    />
                    <Text
                      weight="600"
                      style={styles.reportCardTitle}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {report.title}
                    </Text>
                  </View>
                  <TouchableOpacity
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    onPress={() => openMenu(report)}
                  >
                    <MaterialCommunityIcons
                      name="dots-vertical"
                      size={18}
                      color="#9CA3AF"
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.pdfPreview} activeOpacity={0.8}>
                  <View style={styles.pdfDocWrap}>
                    <LinearGradient
                      colors={["#FF8A65", "#EF5350"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0.8, y: 1 }}
                      style={styles.pdfDocBody}
                    >
                      <Text weight="700" style={styles.pdfIconText}>Pdf</Text>
                    </LinearGradient>
                    <View style={styles.pdfFoldCover} />
                    <View style={styles.pdfFoldTriangle} />
                  </View>
                </TouchableOpacity>

                <View style={styles.reportCardFooter}>
                  <View style={styles.reportDateRow}>
                    <View style={styles.dateDot}>
                      <MaterialCommunityIcons name="play" size={8} color="#7C3AED" />
                    </View>
                    <Text weight="400" style={styles.reportDate}>
                      {report.date}
                    </Text>
                  </View>
                  <TouchableOpacity activeOpacity={0.85}>
                    <LinearGradient
                      colors={["#A855F7", "#EC4899"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.viewIn360Btn}
                    >
                      <Text weight="700" style={styles.viewIn360Text}>
                        View In 360
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={!!menuReport}
        transparent
        animationType="none"
        onRequestClose={closeMenu}
      >
        <Pressable style={styles.modalOverlay} onPress={closeMenu}>
          <Animated.View
            style={[
              styles.modalSheet,
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            <Pressable onPress={() => {}}>
              <LinearGradient
                colors={["#E4CCF7", "#FFE9CF"]}
                locations={[0.0207, 0.9793]}
                start={{ x: 0.04, y: 0.31 }}
                end={{ x: 0.96, y: 0.69 }}
                style={styles.modalGradient}
              >
                <View style={styles.insetShadowDark} pointerEvents="none" />
                <View style={styles.insetShadowLight} pointerEvents="none" />
                <View style={styles.dragHandleRow} {...panResponder.panHandlers}>
                  <View style={styles.dragHandle} />
                </View>

                <View style={styles.shareHeader}>
                  <TouchableOpacity onPress={closeMenu} style={styles.backArrow}>
                    <Ionicons name="chevron-back" size={24} color="#0056D2" />
                  </TouchableOpacity>
                  <Text weight="700" style={styles.modalTitle}>
                    Share report
                  </Text>
                </View>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  bounces={true}
                  alwaysBounceVertical={false}
                  nestedScrollEnabled
                  contentContainerStyle={styles.menuScroll}
                >
                  <View style={styles.shareGrid}>
                    <TouchableOpacity style={styles.shareItem}>
                      <View style={styles.iconCircle}>
                        <Image source={require('../../assets/hyperlink.webp')} style={styles.hyperlinkImage} resizeMode="contain" />
                      </View>
                      <Text style={styles.shareItemText}>Hyperlink</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.shareItem}>
                      <View style={styles.iconCircle}>
                        <MaterialCommunityIcons name="cellphone" size={24} color="#7C3AED" />
                      </View>
                      <Text style={styles.shareItemText}>Mobile Number</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.shareItem}>
                      <View style={styles.iconCircle}>
                        <MaterialCommunityIcons name="whatsapp" size={24} color="#7C3AED" />
                      </View>
                      <Text style={styles.shareItemText}>Whatsapp</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.shareItem}>
                      <View style={styles.iconCircle}>
                        <MaterialCommunityIcons name="email-outline" size={24} color="#7C3AED" />
                      </View>
                      <Text style={styles.shareItemText}>Email</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.shareItem}>
                      <View style={styles.iconCircle}>
                        <Ionicons name="apps" size={24} color="#7C3AED" />
                      </View>
                      <Text style={styles.shareItemText}>Other apps</Text>
                    </TouchableOpacity>
                  </View>

                  <Text weight="700" style={styles.periodTitle}>
                    I am sharing report for following period
                  </Text>

                  <View style={styles.radioGroup}>
                    {['1 Hr', '1 day', '7 days', 'Custom'].map((period) => (
                      <TouchableOpacity 
                        key={period} 
                        style={styles.radioItem}
                        onPress={() => setSelectedPeriod(period)}
                        activeOpacity={0.7}
                      >
                        <View style={[styles.radioOuter, selectedPeriod === period && styles.radioOuterActive]}>
                          {selectedPeriod === period && <View style={styles.radioInner} />}
                        </View>
                        <Text style={styles.radioText}>{period}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.cancelBtn} onPress={closeMenu}>
                      <Text weight="700" style={styles.cancelBtnText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.shareBtn}>
                      <Text weight="700" style={styles.shareBtnText}>Share</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </LinearGradient>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },

  headerBackground: {
    width: "100%",
    height: 190,
    backgroundColor: "#C8E2F5",
  },
  headerImage: {
    width: "100%",
    height: "100%",
    opacity: 0.85,
  },
  headerFade: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  backButton: {
    position: "absolute",
    top: 52,
    left: 18,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  headerTitle: {
    position: "absolute",
    top: 50,
    left: 52,
    right: 80,
    fontSize: isMini ? 22 : isSmall ? 24 : 26,
    color: "#4C1D95",
    lineHeight: 30,
  },
  headerSubtitle: {
    position: "absolute",
    top: isMini ? 76 : isSmall ? 78 : 80,
    left: 52,
    right: 80,
    fontSize: isMini ? 11 : isSmall ? 12 : 13,
    color: "#4B5563",
    lineHeight: isMini ? 16 : 18,
  },
  secureVaultBtn: {
    position: "absolute",
    top: 40,
    right: 14,
    alignItems: "center",
    zIndex: 1,
  },
  lockBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#DDD6FE",
  },
  secureVaultText: {
    fontSize: 10,
    color: "#6D28D9",
    marginTop: 4,
  },

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  contentPadding: {
    paddingHorizontal: 18,
  },

  profileCardWrapper: {
    width: width - 32,
    marginTop: -44,
    alignSelf: "center",
    borderRadius: 16,
    overflow: "hidden",
    zIndex: 10,
    elevation: 10,
  },
  profileCardOuter: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    width: "100%",
    paddingVertical: 14,
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
  profileInitials: {
    fontSize: isMini ? 18 : isSmall ? 20 : 22,
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: isMini ? 16 : isSmall ? 18 : 20,
    color: "#7C3AED",
    marginBottom: 5,
    letterSpacing: 0.2,
  },
  profileTags: {
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
    fontSize: isMini ? 11 : isSmall ? 12 : 13,
    color: "#7C3AED",
  },
  profileDropdown: {
    padding: 8,
    backgroundColor: "#F1E7FE",
    borderRadius: 20,
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  tabsContainer: {
    flexDirection: "row",
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 12,
  },
  tabActive: {
    backgroundColor: "#7C3AED",
  },
  tabText: {
    fontSize: isMini ? 12 : isSmall ? 13 : 14,
    color: "#6B7280",
  },
  tabTextActive: {
    color: "#fff",
  },

  searchContainer: {
    marginTop: 16,
  },
  searchInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingLeft: 14,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: isMini ? 12 : isSmall ? 13 : 14,
    color: "#1F2937",
    height: 44,
    paddingVertical: 0,
  },
  searchFilterBtn: {
    paddingHorizontal: 10,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  searchIconBtn: {
    width: 48,
    height: 44,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: "rgba(148, 93, 220, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  reportsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
    rowGap: 14,
  },

  reportCard: {
    width: 155,
    height: 145,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 9,
    paddingTop: 8,
    paddingBottom: 8,
    opacity: 1,
    shadowColor: "#0000001A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 4,
  },

  reportCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  reportCardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 4,
    marginRight: 2,
  },
  reportCardTitle: {
    fontSize: 9,
    lineHeight: 9,
    width: 97,
    color: "#111827",
    opacity: 1,
  },

  pdfPreview: {
    height: 76,
    backgroundColor: "#F8F8FB",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  pdfDocWrap: {
    width: 44,
    height: 54,
    position: "relative",
  },
  pdfDocBody: {
    width: 44,
    height: 54,
    borderRadius: 8,
    borderTopRightRadius: 0,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#EF5350",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6,
  },
  pdfIconText: {
    fontSize: 13,
    color: "#FFFFFF",
    letterSpacing: 0.4,
    marginTop: 4,
  },
  pdfFoldCover: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    backgroundColor: "#F8F8FB",
    borderBottomLeftRadius: 3,
  },
  pdfFoldTriangle: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderRightWidth: 12,
    borderBottomWidth: 12,
    borderRightColor: "transparent",
    borderBottomColor: "rgba(180,40,30,0.4)",
  },

  reportCardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 7,
  },
  reportDateRow: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 0,
    gap: 4,
  },
  dateDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#EDE9FE",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  reportDate: {
    fontSize: 9,
    lineHeight: 12,
    color: "#9CA3AF",
    flexShrink: 0,
  },
  viewIn360Btn: {
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 20,
    flexShrink: 0,
  },
  viewIn360Text: {
    fontSize: 8,
    color: "#FFFFFF",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.28)",
    justifyContent: "flex-end",
    alignItems: "stretch",
  },
  modalSheet: {
    width: "100%",
    height: TRAY_HEIGHT,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: "hidden",
    opacity: 1,
  },
  modalGradient: {
    width: "100%",
    height: "100%",
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 12,
    position: "relative",
  },
  insetShadowDark: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderBottomColor: "rgba(191,123,185,0.25)",
    borderRightColor: "rgba(191,123,185,0.25)",
    borderTopWidth: 0,
    borderLeftWidth: 0,
    pointerEvents: "none",
  },
  insetShadowLight: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: "rgba(239,223,238,0.4)",
    borderLeftColor: "rgba(239,223,238,0.4)",
    borderBottomWidth: 0,
    borderRightWidth: 0,
    pointerEvents: "none",
  },
  menuScroll: {
    paddingBottom: 40,
  },
  dragHandleRow: {
    alignItems: "center",
    paddingVertical: 8,
    marginTop: 0,
    marginBottom: 6,
  },
  dragHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(0,0,0,0.18)",
  },
  modalTitle: {
    fontSize: isMini ? 16 : 17,
    lineHeight: isMini ? 22 : 24,
    color: "#111111",
    marginBottom: 12,
    marginTop: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 8,
    gap: 14,
  },
  menuItemText: {
    fontSize: isMini ? 14 : 15,
    lineHeight: isMini ? 20 : 22,
    color: "#111111",
  },
  shareHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 4,
  },
  backArrow: {
    marginRight: 10,
  },
  shareGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 24,
  },
  shareItem: {
    alignItems: "center",
    width: "21%",
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#EBF3FE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  hyperlinkImage: {
    width: 26,
    height: 26,
  },
  shareItemText: {
    fontSize: 11,
    color: "#4B5563",
    textAlign: "center",
  },
  periodTitle: {
    fontSize: 16,
    color: "#111827",
    marginBottom: 16,
  },
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 26,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#9CA3AF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  radioOuterActive: {
    borderColor: "#0056D2",
    borderWidth: 2,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#0056D2",
  },
  radioText: {
    fontSize: 12,
    color: "#4B5563",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  cancelBtnText: {
    color: "#0056D2",
    fontSize: 14,
  },
  shareBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#0056D2",
    alignItems: "center",
  },
  shareBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
});

export default TestReports;
