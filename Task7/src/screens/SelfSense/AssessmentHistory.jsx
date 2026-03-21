import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "../../../components/TextWrapper";

const { width, height } = Dimensions.get("window");

const s = (size) => (width / 375) * size;

const COLORS = {
  brandPurple: "#5B3DF5",
  white: "#FFFFFF",
  textPrimary: "#2D2D2D",
  textSecondary: "#666666",
  bgLight: "#FAF3FD",
};

export default function AssessmentHistory({ navigation }) {
  const [users, setUsers] = useState([]);
  const [activeUserId, setActiveUserId] = useState(null);

  const activeUser = users.find((user) => user.id === activeUserId) || null;

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedUsers = await AsyncStorage.getItem("users");
        const storedActiveId = await AsyncStorage.getItem("activeUserId");

        if (storedUsers) {
          const parsedUsers = JSON.parse(storedUsers);
          setUsers(parsedUsers);

          if (parsedUsers.length > 0) {
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bgLight} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <SafeAreaView style={styles.header}>
          <View style={styles.headerTopRow}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Feather name="arrow-left" size={24} color="#5B3DF5" />
            </TouchableOpacity>
            <Text weight="600" style={styles.headerTitle}>
              Assessment History
            </Text>
          </View>
          <Text weight="400" style={styles.headerSubtitle}>
            View your past health assessments and results.
          </Text>
        </SafeAreaView>

        <View style={styles.content}>
          {/* User Info Card */}
          {activeUser && (
            <View style={styles.userCard}>
              <LinearGradient
                colors={["#EEA6C8", "#996EEB"]}
                start={{ x: 0.13, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.avatarGradient}
              >
                <Text style={styles.avatarText} weight="700">
                  {activeUser.name ? activeUser.name.substring(0, 2).toUpperCase() : "U"}
                </Text>
              </LinearGradient>
              <View style={styles.userInfo}>
                <Text weight="700" style={styles.userName}>{activeUser.name}</Text>
                <Text weight="400" style={styles.userDetails}>
                  {activeUser.gender} • {activeUser.age} years
                </Text>
              </View>
            </View>
          )}

          {/* History Section */}
          <Text weight="700" style={styles.sectionTitle}>
            Past Assessments
          </Text>

          {!users || users.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="clipboard-text-outline" size={60} color="#CBD5E1" />
              <Text weight="500" style={styles.emptyStateText}>
                No profiles found.
              </Text>
              <Text weight="400" style={styles.emptyStateSubtext}>
                Create a profile and complete an assessment to see history.
              </Text>
            </View>
          ) : !activeUser?.history || activeUser.history.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="clipboard-text-outline" size={60} color="#CBD5E1" />
              <Text weight="500" style={styles.emptyStateText}>
                No assessments yet.
              </Text>
              <Text weight="400" style={styles.emptyStateSubtext}>
                Start your first self-check to see your history here.
              </Text>
              <TouchableOpacity 
                style={styles.startButton}
                onPress={() => navigation.navigate('SelfSenseHealthArea')}
              >
                <Text weight="600" style={styles.startButtonText}>Start Self Check</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.historyList}>
              {[...activeUser.history].reverse().map((item, index) => (
                <View key={index} style={styles.historyCard}>
                  <View style={styles.historyHeader}>
                    <View style={styles.historyConditionRow}>
                      <View style={[styles.riskIconCircle, { backgroundColor: getRiskColor(item.riskLevel) + "20" }]}>
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
                        <Text weight="400" style={styles.historyStatLabel}>Risk Level</Text>
                        <View style={[styles.riskBadge, { backgroundColor: getRiskColor(item.riskLevel) + "20" }]}>
                          <Text weight="700" style={{ color: getRiskColor(item.riskLevel), fontSize: 12 }}>
                            {item.riskLevel}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.historyStat}>
                        <Text weight="400" style={styles.historyStatLabel}>Score</Text>
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

          {/* All Users History */}
          {users.length > 1 && (
            <>
              <Text weight="700" style={[styles.sectionTitle, { marginTop: 24 }]}>
                All Users
              </Text>
              {users.map((user) => (
                <TouchableOpacity 
                  key={user.id}
                  style={[styles.userListItem, user.id === activeUserId && styles.userListItemActive]}
                  onPress={async () => {
                    setActiveUserId(user.id);
                    await AsyncStorage.setItem("activeUserId", JSON.stringify(user.id));
                  }}
                >
                  <View style={styles.userListAvatar}>
                    <Text weight="600" style={styles.userListAvatarText}>
                      {user.name ? user.name.substring(0, 2).toUpperCase() : "U"}
                    </Text>
                  </View>
                  <View style={styles.userListInfo}>
                    <Text weight="600" style={styles.userListName}>{user.name}</Text>
                    <Text weight="400" style={styles.userListDetails}>
                      {user.history?.length || 0} assessments
                    </Text>
                  </View>
                  {user.id === activeUserId && (
                    <MaterialCommunityIcons name="check-circle" size={22} color="#5B3DF5" />
                  )}
                </TouchableOpacity>
              ))}
            </>
          )}
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <View style={styles.navbarBackground} />
        
        <View style={styles.navbarContent}>
          <TouchableOpacity style={styles.tabContainer} onPress={() => navigation.navigate('Home')}>
            <View style={styles.iconHolder}>
              <View style={styles.inactiveCircle}>
                <MaterialCommunityIcons name="undo-variant" size={22} color="#7f8c8d" />
              </View>
            </View>
            <Text weight="500" style={[styles.navLabel, styles.inactiveLabel]}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabContainer} onPress={() => navigation.navigate('SelfSense')}>
            <View style={styles.iconHolder}>
              <View style={styles.inactiveCircle}>
                <View style={styles.dotsGrid}>
                  <View style={styles.dotRow}>
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                  </View>
                  <View style={styles.dotRow}>
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                  </View>
                </View>
              </View>
            </View>
            <Text weight="500" style={[styles.navLabel, styles.inactiveLabel]}>Self Checks</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabContainer}>
            <View style={styles.iconHolder}>
              <View style={styles.inactiveCircle}>
                <View style={styles.specialityIcon}>
                  <View style={styles.specialityRow}>
                    <View style={[styles.specialityDot, styles.dotPink]} />
                    <View style={[styles.specialityDot, styles.dotPurple]} />
                    <View style={[styles.specialityDot, styles.dotPink]} />
                  </View>
                  <View style={styles.specialityRow}>
                    <View style={[styles.specialityDot, styles.dotPurple]} />
                    <View style={[styles.specialityDot, styles.dotPink]} />
                    <View style={[styles.specialityDot, styles.dotPurple]} />
                  </View>
                  <View style={styles.specialityRow}>
                    <View style={[styles.specialityDot, styles.dotPink]} />
                    <View style={[styles.specialityDot, styles.dotPurple]} />
                    <View style={[styles.specialityDot, styles.dotPink]} />
                  </View>
                </View>
              </View>
            </View>
            <Text weight="500" style={[styles.navLabel, styles.inactiveLabel]}>Speciality</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabContainer}>
            <View style={styles.iconHolder}>
              <View style={styles.activeOuterBuffer}>
                <LinearGradient
                  colors={["#6ea6e7", "#daeffe", "#e0d3ff"]}
                  style={styles.activeCircle}
                >
                  <MaterialCommunityIcons name="clipboard-text-outline" size={22} color="#5b3cc4" />
                </LinearGradient>
              </View>
            </View>
            <Text weight="900" style={[styles.navLabel, styles.activeLabel]}>History</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabContainer}>
            <View style={styles.iconHolder}>
              <View style={styles.inactiveCircle}>
                <MaterialCommunityIcons name="comment-account-outline" size={22} color="#7f8c8d" />
              </View>
            </View>
            <Text weight="500" style={[styles.navLabel, styles.inactiveLabel]}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgLight,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: s(16),
    backgroundColor: COLORS.bgLight,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: s(4),
  },
  backButton: {
    width: s(32),
    height: s(32),
    borderRadius: s(8),
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    marginRight: s(8),
  },
  headerTitle: {
    fontSize: s(20),
    color: COLORS.brandPurple,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    fontSize: s(13),
    color: COLORS.textSecondary,
    lineHeight: s(18),
    marginLeft: s(40),
  },
  content: {
    padding: 20,
  },
  userCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 18,
    color: "#FFFFFF",
  },
  userInfo: {
    marginLeft: 14,
    flex: 1,
  },
  userName: {
    fontSize: 17,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  userDetails: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textTransform: "capitalize",
  },
  sectionTitle: {
    fontSize: 17,
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
    fontSize: 15,
  },
  emptyStateSubtext: {
    color: "#94A3B8",
    marginTop: 6,
    fontSize: 13,
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
    fontSize: 14,
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
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  historyDate: {
    fontSize: 12,
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
    fontSize: 11,
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
    fontSize: 16,
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
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  userListDetails: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  // Bottom Navigation Styles
  bottomNav: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 70,
    elevation: 10,
    zIndex: 999,
  },
  navbarBackground: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: 70,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e2e2e2",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  navbarContent: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    height: 70,
    paddingBottom: 10,
  },
  tabContainer: {
    width: width / 5,
    alignItems: "center",
  },
  iconHolder: {
    height: 86,
    width: 86,
    justifyContent: "center",
    alignItems: "center",
    top: -32,
    backgroundColor: "transparent",
  },
  activeOuterBuffer: {
    height: 78,
    width: 78,
    borderRadius: 39,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  activeCircle: {
    height: 66,
    width: 66,
    borderRadius: 33,
    borderWidth: 3,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  inactiveCircle: {
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 35,
  },
  dotsGrid: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  dotRow: {
    flexDirection: "row",
    gap: 4,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#7f8c8d",
  },
  specialityIcon: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  specialityRow: {
    flexDirection: "row",
    gap: 4,
  },
  specialityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotPink: {
    backgroundColor: "#E91E63",
  },
  dotPurple: {
    backgroundColor: "#7C4DFF",
  },
  navLabel: {
    fontSize: 13,
    marginTop: -35,
  },
  activeLabel: {
    color: "#3498db",
  },
  inactiveLabel: {
    color: "#535353ff",
  },
});
