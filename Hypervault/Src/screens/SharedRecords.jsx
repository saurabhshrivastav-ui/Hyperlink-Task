import React, { useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../components/TextWrapper';

const { width } = Dimensions.get('window');
const isMini = width <= 360;
const isSmall = width <= 390;

export default function SharedRecords({ navigation }) {
  const [activeTab, setActiveTab] = useState('active');
  const [uploadedReport, setUploadedReport] = useState(null);

  const statusConfig = useMemo(
    () => ({
      active: {
        note: 'These reports are still accessible to the recipients you shared them with.',
        badgeBg: '#C9F7CE',
        badgeText: '10th Dec, 2025',
        actionTwo: 'Revoke Access',
        actionTwoText: '#4C1D95',
        footerLine: 'Access will Expire : 10th Jan 2026',
        footerColor: '#4B5563',
      },
      expired: {
        note: 'These reports are expired. Extend access to keep sharing this report.',
        badgeBg: '#C9F7CE',
        badgeText: '10th Nov, 2025',
        actionTwo: 'Extend Access',
        actionTwoText: '#4C1D95',
        footerLine: 'Access Expired : 10th Dec, 2025',
        footerColor: '#4B5563',
      },
      revoked: {
        note: 'Access was removed by you. Recipients can no longer view this report.',
        badgeBg: '#C9F7CE',
        badgeText: '10th Dec, 2025',
        actionTwo: 'Share Again',
        actionTwoText: '#4C1D95',
        footerLine: 'Access Revoked : 20th Dec, 2025',
        footerColor: '#B91C1C',
      },
    }),
    []
  );

  const currentStatus = statusConfig[activeTab];

  const pickPdfFromDevice = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets?.length) {
        return;
      }

      const file = result.assets[0];
      const title = (file.name || 'Uploaded Report').replace(/\.pdf$/i, '');

      setUploadedReport({
        title,
        fileName: file.name || 'Uploaded Report.pdf',
      });
      setActiveTab('active');
    } catch (error) {
      Alert.alert('Upload Failed', 'Unable to pick file right now. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <LinearGradient
        colors={['rgba(228, 204, 247, 0.6)', 'rgba(255, 233, 207, 0.6)']}
        start={{ x: 0.05, y: 0.1 }}
        end={{ x: 0.95, y: 0.9 }}
        style={styles.headerBackground}
      >
        <View style={styles.statusBarSpacer} />

        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.backButton}
              activeOpacity={0.8}
              onPress={() => navigation && navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={20} color="#5B21B6" />
            </TouchableOpacity>

            <View style={styles.headerTitleBlock}>
              <Text weight="700" style={styles.headerTitle}>Shared Records</Text>
            </View>
          </View>
        </View>

        <View style={styles.profileCardWrapper}>
          <LinearGradient
            colors={['#FDEFFB', '#FBF1FE', '#FBF1FE']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0.4 }}
            style={styles.profileCardOuter}
          >
            <View style={styles.profileCardContent}>
              <LinearGradient
                colors={['#FDBEA5', '#F695CF', '#8E66EB']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.avatarOuterRing}
              >
                <View style={styles.avatarWhiteRing}>
                  <LinearGradient
                    colors={['#EEA6C8', '#996EEB']}
                    start={{ x: 0.13, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.avatarGradient}
                  >
                    <Text style={styles.profileInitials} weight="700">SN</Text>
                  </LinearGradient>
                </View>
              </LinearGradient>

              <View style={styles.profileInfo}>
                <Text style={styles.profileName} weight="700">Sakshi Nishad</Text>
                <View style={styles.profileTags}>
                  <View style={styles.profileTag}>
                    <Text weight="500" style={styles.profileTagFemale}>Female</Text>
                  </View>
                  <View style={styles.profileTagAge}>
                    <Text weight="500" style={styles.profileTagAgeText}>22 yrs</Text>
                  </View>
                </View>
              </View>

              <View style={styles.profileDropdown}>
                <Ionicons name="chevron-down" size={24} color="#7C3AED" />
              </View>
            </View>
          </LinearGradient>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        {!uploadedReport ? (
          <>
            <Image
              source={require('../../assets/shared file.webp')}
              style={styles.illustration}
              resizeMode="contain"
            />

            <Text style={styles.emptyTitle} weight="700">Sorry, No Shared Reports Found</Text>
            <Text style={styles.emptySubtitle} weight="400">
              You havenâ€™t shared any records yet. Select a report from your HealthVault to share it securely with a doctor or family member.
            </Text>

            <TouchableOpacity
              activeOpacity={0.86}
              style={styles.uploadBtnWrap}
              onPress={pickPdfFromDevice}
            >
              <LinearGradient
                colors={['#6D28D9', '#7C3AED']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.uploadBtn}
              >
                <Text style={styles.uploadBtnText} weight="700">Upload a Report</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'active' && styles.tabButtonActiveGreen]}
                onPress={() => setActiveTab('active')}
              >
                <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActiveWhite]} weight="700">
                  Active Access
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'expired' && styles.tabButtonActiveAmber]}
                onPress={() => setActiveTab('expired')}
              >
                <Text style={[styles.tabText, activeTab === 'expired' && styles.tabTextActiveBlack]} weight="700">
                  Expired
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'revoked' && styles.tabButtonActiveRed]}
                onPress={() => setActiveTab('revoked')}
              >
                <Text style={[styles.tabText, activeTab === 'revoked' && styles.tabTextActiveWhite]} weight="700">
                  Revoked
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.statusNote} weight="400">{currentStatus.note}</Text>

            <View style={styles.reportCard}>
              <View style={[styles.dateBadge, { backgroundColor: currentStatus.badgeBg }]}>
                <Text style={styles.dateBadgeText} weight="600">{currentStatus.badgeText}</Text>
              </View>

              <View style={styles.reportTopRow}>
                <View style={styles.pdfIconBox}>
                  <MaterialCommunityIcons name="file-pdf-box" size={32} color="#FF5D55" />
                </View>

                <View style={styles.reportInfo}>
                  <Text style={styles.reportTitle} weight="700" numberOfLines={1}>{uploadedReport.title}</Text>
                  <Text style={styles.reportMeta} weight="400" numberOfLines={1}>Patient Name : Sakshi Kewat</Text>
                  <Text style={styles.reportMeta} weight="400" numberOfLines={1}>Contact : 8169928844</Text>
                  <Text style={styles.reportMeta} weight="400" numberOfLines={1}>Shared with : Dr. Mehta</Text>
                  <Text style={[styles.reportMeta, { color: currentStatus.footerColor }]} weight="600" numberOfLines={1}>
                    {currentStatus.footerLine}
                  </Text>
                </View>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.primaryAction} activeOpacity={0.88}>
                  <LinearGradient
                    colors={['#C026D3', '#7C3AED']}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.primaryActionBg}
                  >
                    <Text style={styles.primaryActionText} weight="700">View Report</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={styles.secondaryAction} activeOpacity={0.88}>
                  <Text style={[styles.secondaryActionText, { color: currentStatus.actionTwoText }]} weight="600">
                    {currentStatus.actionTwo}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.secondaryAction} activeOpacity={0.88}>
                  <Text style={styles.secondaryActionText} weight="600">View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8FA',
  },
  headerBackground: {
    width: '100%',
    height: 262,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    overflow: 'hidden',
    borderWidth: 0,
    borderColor: 'transparent',
  },
  statusBarSpacer: {
    height: 44,
  },
  headerRow: {
    paddingHorizontal: 16,
    paddingTop: 6,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  backButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    marginRight: 6,
  },
  headerTitleBlock: {
    flex: 1,
  },
  headerTitle: {
    fontSize: isMini ? 22 : isSmall ? 24 : 26,
    lineHeight: 30,
    color: '#4C1D95',
  },
  profileCardWrapper: {
    width: 313,
    height: 108,
    marginTop: 16,
    alignSelf: 'center',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 10,
  },
  profileCardOuter: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    width: 313,
    height: 108,
  },
  profileCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  avatarOuterRing: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    padding: 2,
  },
  avatarWhiteRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  avatarGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitials: {
    fontSize: isMini ? 18 : isSmall ? 20 : 22,
    lineHeight: 24,
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: isMini ? 16 : isSmall ? 18 : 20,
    lineHeight: 24,
    color: '#7C3AED',
    marginBottom: 5,
  },
  profileTags: {
    flexDirection: 'row',
    gap: 8,
  },
  profileTag: {
    backgroundColor: '#EEE8FF',
    paddingHorizontal: 11,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DED6FD',
  },
  profileTagAge: {
    backgroundColor: '#FEECEE',
    paddingHorizontal: 11,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F7C8CD',
  },
  profileTagFemale: {
    fontSize: isMini ? 11 : isSmall ? 12 : 13,
    lineHeight: 16,
    color: '#6D28D9',
  },
  profileTagAgeText: {
    fontSize: isMini ? 11 : isSmall ? 12 : 13,
    lineHeight: 16,
    color: '#DC2626',
  },
  profileDropdown: {
    padding: 8,
    backgroundColor: '#EFE6FD',
    borderRadius: 20,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5B21B6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 24,
  },
  illustration: {
    width: width - 56,
    height: width * 0.66,
    maxHeight: 320,
    marginBottom: 6,
  },
  emptyTitle: {
    fontSize: isMini ? 25 : 27,
    lineHeight: isMini ? 32 : 34,
    color: '#4C1D95',
    textAlign: 'center',
  },
  emptySubtitle: {
    marginTop: 10,
    fontSize: isMini ? 16 : 17,
    lineHeight: isMini ? 24 : 25,
    color: '#161616',
    textAlign: 'center',
    maxWidth: 360,
  },
  uploadBtnWrap: {
    marginTop: 16,
    borderRadius: 11,
    overflow: 'hidden',
  },
  uploadBtn: {
    paddingHorizontal: 24,
    paddingVertical: 9,
    borderRadius: 11,
  },
  uploadBtnText: {
    fontSize: isMini ? 15 : 16,
    lineHeight: 20,
    color: '#FFFFFF',
  },
  tabContainer: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F3F4F6',
    padding: 2,
    flexDirection: 'row',
    marginTop: 2,
    marginBottom: 14,
  },
  tabButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 9,
    alignItems: 'center',
  },
  tabButtonActiveGreen: {
    backgroundColor: '#0B8F22',
  },
  tabButtonActiveAmber: {
    backgroundColor: '#F59E0B',
  },
  tabButtonActiveRed: {
    backgroundColor: '#DC2626',
  },
  tabText: {
    fontSize: isMini ? 11 : 12,
    color: '#111827',
  },
  tabTextActiveWhite: {
    color: '#FFFFFF',
  },
  tabTextActiveBlack: {
    color: '#111111',
  },
  statusNote: {
    width: '100%',
    fontSize: isMini ? 14 : 15,
    lineHeight: 22,
    color: '#1F2937',
    marginBottom: 12,
  },
  reportCard: {
    width: '100%',
    borderRadius: 14,
    backgroundColor: '#F3ECF8',
    borderWidth: 1,
    borderColor: '#E6DEED',
    padding: 12,
  },
  dateBadge: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 8,
  },
  dateBadgeText: {
    fontSize: 10,
    color: '#166534',
  },
  reportTopRow: {
    flexDirection: 'row',
  },
  pdfIconBox: {
    width: 54,
    height: 54,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  reportInfo: {
    flex: 1,
  },
  reportTitle: {
    fontSize: isMini ? 18 : 19,
    color: '#111827',
    marginBottom: 3,
  },
  reportMeta: {
    fontSize: isMini ? 11 : 12,
    color: '#4B5563',
    lineHeight: 17,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  primaryAction: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  primaryActionBg: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  primaryActionText: {
    fontSize: isMini ? 12 : 13,
    color: '#FFFFFF',
  },
  secondaryAction: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  secondaryActionText: {
    fontSize: isMini ? 11 : 12,
    color: '#4C1D95',
  },
});
