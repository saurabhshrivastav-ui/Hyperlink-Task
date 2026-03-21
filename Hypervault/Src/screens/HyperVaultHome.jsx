import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../components/TextWrapper';

const { width } = Dimensions.get('window');
const isMini = width <= 360;
const isSmall = width <= 390;

const AddRepoImg = require('../../assets/AddRepo.webp');
const PrivacyImg = require('../../assets/PrivacyandAccess.webp');
const Health360Img = require('../../assets/Health360.webp');
const FilesFrontImg = require('../../assets/files.webp');
const FilesBackImg = require('../../assets/files2.webp');

const CATEGORIES = [
  { label: 'Test Reports', color: '#06B6D4' },
  { label: 'Genomic Reports', color: '#7C3AED' },
  { label: 'Vaccine Certificates', color: '#EC4899' },
  { label: 'Prescriptions', color: '#F59E0B' },
  { label: 'Other Reports', color: '#DC2626' },
];

export default function HyperVaultHome({ navigation }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F3FF" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <ImageBackground
          source={require('../../assets/HeaderTestReports.webp')}
          style={styles.headerBackground}
          imageStyle={styles.headerImage}
          resizeMode="cover"
        >
          <View style={styles.headerTopRow}>
            <TouchableOpacity style={styles.backBtn}>
              <Text style={styles.backArrow} weight="600">←</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secureVaultBtn}>
              <View style={styles.lockBox}>
                <Ionicons name="lock-closed" size={26} color="#6D28D9" />
              </View>
              <Text style={styles.secureVaultText} weight="600">Secure Vault</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.headerTextBlock}>
            <Text style={styles.headerTitle} weight="700">HyperVault</Text>
            <Text style={styles.headerSubtitle} weight="400">
              Securely store and manage your health documents.
            </Text>
          </View>

          <LinearGradient
            colors={['transparent', 'rgba(200, 226, 245, 0.6)', '#FFFFFF']}
            locations={[0, 0.5, 1]}
            style={styles.headerFade}
          />
        </ImageBackground>

        <View style={styles.body}>

          {/* Profile Card */}
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
                      <Text style={styles.profileTagText} weight="500">Female</Text>
                    </View>
                    <View style={styles.profileTag}>
                      <Text style={styles.profileTagText} weight="500">22 yrs</Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.profileDropdown}
                  onPress={() => setExpanded(!expanded)}
                >
                  <Ionicons name="chevron-down" size={24} color="#7C3AED" />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue} weight="800">20</Text>
              <Text style={styles.statLabel} weight="400">Total Files</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue} weight="800">1.5 GB</Text>
              <Text style={styles.statLabel} weight="400">Storage</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue} weight="800">12</Text>
              <Text style={styles.statLabel} weight="400">Shared</Text>
            </View>
          </View>

          {/* Quick Actions */}
          <Text style={styles.sectionTitle} weight="700">Quick Actions</Text>
          <View style={styles.quickActionsRow}>
            <TouchableOpacity style={[styles.qaCard, { backgroundColor: '#EDE9FE' }]}>
              <Image source={AddRepoImg} style={styles.qaImage} resizeMode="contain" />
              <Text style={styles.qaTitle} weight="700">Add Reports</Text>
              <Text style={styles.qaSubtitle} weight="400">Download and store certificates & records</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.qaCard, { backgroundColor: '#FEF3C7' }]}>
              <Image source={PrivacyImg} style={styles.qaImage} resizeMode="contain" />
              <Text style={styles.qaTitle} weight="700">Privacy & Access</Text>
              <Text style={styles.qaSubtitle} weight="400">View upcoming docs and remedies.</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.qaCard, { backgroundColor: '#DBEAFE' }]}>
              <Image source={Health360Img} style={styles.qaImage} resizeMode="contain" />
              <Text style={styles.qaTitle} weight="700">Health 360</Text>
              <Text style={styles.qaSubtitle} weight="400">Share vaccination proof for travel, school, or work.</Text>
            </TouchableOpacity>
          </View>

          {/* Categories */}
          <Text style={styles.sectionTitle} weight="700">Categories</Text>
          <View style={styles.categoriesContainer}>

            {/* Back folder image */}
            <Image
              source={FilesBackImg}
              style={styles.filesBack}
              resizeMode="stretch"
            />

            {/* Category tabs — scrollable files inside folder */}
            <ScrollView
              style={styles.categoriesStack}
              contentContainerStyle={{ paddingBottom: 70 }}
              showsVerticalScrollIndicator={false}
              scrollEventThrottle={16}
              nestedScrollEnabled={true}
            >
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.label}
                  style={[styles.categoryTab, { borderTopColor: cat.color }]}
                  onPress={() => cat.label === 'Test Reports' && navigation && navigation.navigate('TestReports')}
                >
                  <Text style={styles.categoryTabText} weight="700">{cat.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Front folder image */}
            <View style={styles.filesFrontWrap}>
              <Image
                source={FilesFrontImg}
                style={styles.filesFront}
                resizeMode="stretch"
              />
              <View style={styles.filesFrontText}>
                <Text style={styles.recordsTitle} weight="800">Records</Text>
                <View style={styles.recordsCountRow}>
                  <Text style={styles.recordsCountNumber} weight="900">12</Text>
                  <Text style={styles.recordsCountLabel} weight="600"> Files</Text>
                </View>
              </View>
            </View>

          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 28,
  },

  /* Header */
  headerBackground: {
    width: '100%',
    height: 220,
    backgroundColor: '#C8E2F5',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    opacity: 0.9,
  },
  headerFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
  },
  headerTopRow: {
    position: 'absolute',
    top: 46,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  headerTextBlock: {
    position: 'absolute',
    top: 42,
    left: 50,
    right: 90,
    zIndex: 2,
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  backBtn: {
    width: 28, 
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 22,
    color: '#6D28D9',
  },
  headerTitle: {
    fontSize: 28,
    color: '#4C1D95',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#5B21B6',
    marginTop: 4,
    maxWidth: 260,
  },
  secureVaultBtn: {
    alignItems: 'center',
    marginTop: 0,
  },
  lockBox: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  lockIcon: {
    fontSize: 18,
  },
  secureVaultText: {
    fontSize: 11,
    color: '#6D28D9',
    marginTop: 4,
  },

  /* Profile Card */
  profileCardWrapper: {
    width: 313,
    height: 108,
    marginTop: -50,
    alignSelf: 'center',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
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
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: isMini ? 16 : isSmall ? 18 : 20,
    color: '#7C3AED',
    marginBottom: 5,
    letterSpacing: 0.2,
  },
  profileTags: {
    flexDirection: 'row',
    gap: 6,
  },
  profileTag: {
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  profileTagText: {
    fontSize: isMini ? 11 : isSmall ? 12 : 13,
    color: '#7C3AED',
  },
  profileDropdown: {
    padding: 8,
    backgroundColor: '#F1E7FE',
    borderRadius: 20,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Stats */
  statsRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    color: '#1F1F1F',
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#E9D5FF',
  },

  /* Quick Actions */
  sectionTitle: {
    fontSize: 16,
    color: '#1F1F1F',
    marginBottom: 12,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  qaCard: {
    flex: 1,
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  qaImage: {
    width: 64,
    height: 64,
    marginBottom: 6,
  },
  qaTitle: {
    fontSize: 11,
    color: '#1F1F1F',
    textAlign: 'center',
    marginBottom: 3,
  },
  qaSubtitle: {
    fontSize: 9,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 13,
  },

  /* Categories */
  categoriesContainer: {
    position: 'relative',
    height: 260,
    marginBottom: 24,
    marginHorizontal: -16,
  },
  filesBack: {
    position: 'absolute',
    top: 38,
    left: 64,
    width: 233,
    height: 211,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
    opacity: 0.8,
    zIndex: 1,
  },
  categoriesStack: {
    position: 'absolute',
    top: 0,
    left: 82,
    width: 199,
    height: 158,
    zIndex: 2,
    overflow: 'hidden',
  },
  categoryTab: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderTopWidth: 3,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 4,
    opacity: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryTabText: {
    fontSize: 12,
    color: '#5B21B6',
  },
  filesFrontWrap: {
    position: 'absolute',
    top: 101,
    left: 58,
    width: 247,
    height: 148,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
    overflow: 'hidden',
    opacity: 1,
    zIndex: 3,
  },
  filesFront: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  filesFrontText: {
    position: 'absolute',
    left: 20,
    bottom: 20,
  },
  recordsTitle: {
    fontSize: 22,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  recordsCountRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  recordsCountNumber: {
    fontSize: 28,
    color: '#FFFFFF',
    lineHeight: 30,
  },
  recordsCountLabel: {
    fontSize: 14,
    color: '#DDD6FE',
    lineHeight: 22,
    marginLeft: 4,
  },
});
