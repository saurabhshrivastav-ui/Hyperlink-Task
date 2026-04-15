import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  Animated,
  ScrollView,
  Dimensions,
  Image,
  ImageBackground,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '../../components/TextWrapper';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_PADDING = 10;
const CHIP_GAP = 6;
const TOTAL_GAPS_WIDTH = CHIP_GAP * 5;
const AVAILABLE_WIDTH = SCREEN_WIDTH - (HORIZONTAL_PADDING * 2) - TOTAL_GAPS_WIDTH;
const CHIP_WIDTH = Math.floor(AVAILABLE_WIDTH / 6);
const CHIP_HEIGHT = 36;

const CATEGORIES = [
  { label: 'All', color: '#CD8CFF' },
  { label: 'Sleep', color: '#5B3DBA' },
  { label: 'Nutrition', color: '#16A34A' },
  { label: 'Fitness', color: '#EA580C' },
  { label: 'Medicine', color: '#1D4ED8' },
  { label: 'Mentrual', color: '#DB2777' },
];

const ActiveChip = ({ label, color }) => {
  const isMentrual = label === 'Mentrual';

  return (
    <View style={styles.activeChipContainer}>
      <View style={[styles.activeChipSurface, { backgroundColor: isMentrual ? '#F8D4EA' : color }]} />
      <View style={styles.activeChipLabel}>
        <Text weight="600" style={[styles.activeChipText, isMentrual && styles.activeMentrualText]}>{label}</Text>
      </View>
    </View>
  );
};

export default function MentrualWellnessSection({
  onBack,
  onNavigateAll,
  onNavigateSleep,
  onNavigateNutrition,
  onNavigateFitness,
  onNavigateMedicine,
  hideHeader = false,
}) {
  const topOffset = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 18;
  const [active, setActive] = useState('Mentrual');

  const chipAnimMap = useRef(
    CATEGORIES.reduce((acc, item) => {
      acc[item.label] = new Animated.Value(item.label === 'Mentrual' ? 1 : 0);
      return acc;
    }, {})
  ).current;

  const handleChipPress = (label) => {
    setActive(label);

    CATEGORIES.forEach((item) => {
      Animated.timing(chipAnimMap[item.label], {
        toValue: item.label === label ? 1 : 0,
        duration: 180,
        useNativeDriver: true,
      }).start();
    });

    if (label === 'All' && typeof onNavigateAll === 'function') onNavigateAll();
    if (label === 'Sleep' && typeof onNavigateSleep === 'function') onNavigateSleep();
    if (label === 'Nutrition' && typeof onNavigateNutrition === 'function') onNavigateNutrition();
    if (label === 'Fitness' && typeof onNavigateFitness === 'function') onNavigateFitness();
    if (label === 'Medicine' && typeof onNavigateMedicine === 'function') onNavigateMedicine();
  };

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {!hideHeader && (
          <View style={[styles.headerBlock, { paddingTop: topOffset }]}> 
            <View style={styles.headerRow}>
              <TouchableOpacity activeOpacity={0.8} style={styles.backBtn} onPress={onBack}>
                <Ionicons name="arrow-back" size={25} color="#5A3FB8" />
              </TouchableOpacity>
              <View style={styles.titleWrap}>
                <Text weight="700" style={styles.headerTitle}>Health Wellness</Text>
                <Text weight="400" style={styles.headerSubtitle}>Build healthy habits, one day at a time.</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.chipRowContainer}>
          <View style={styles.chipRow}>
            {CATEGORIES.map((chip, index) => {
              const isActive = active === chip.label;
              const anim = chipAnimMap[chip.label];
              const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.02] });

              return (
                <TouchableOpacity
                  key={chip.label}
                  activeOpacity={0.85}
                  onPress={() => handleChipPress(chip.label)}
                  style={[styles.chipTouch, index === CATEGORIES.length - 1 && { marginRight: 0 }]}
                >
                  <Animated.View style={{ transform: [{ scale }], width: '100%' }}>
                    {isActive ? (
                      <ActiveChip label={chip.label} color={chip.color} />
                    ) : (
                      <View style={[styles.inactiveChip, { borderColor: chip.color }]}>
                        <Text weight="500" style={[styles.inactiveChipText, { color: chip.color }]}>{chip.label}</Text>
                      </View>
                    )}
                  </Animated.View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <LinearGradient
          colors={['#F7D6EE', '#FCEAF6', 'rgba(252, 234, 246, 0.0)']}
          locations={[0, 0.58, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.topSection}
        >
          <Image
            source={require('../../assets/medicinebg.webp')}
            style={styles.topLayerFrontImage}
            resizeMode="cover"
          />

          <View style={styles.periodCard}>
            <View style={styles.phoneBlock}>
              <Image
                source={require('../../assets/menturalphone.webp')}
                style={styles.phoneImage}
                resizeMode="contain"
              />
            </View>

            <View style={styles.periodTextWrap}>
              <Text weight="700" style={styles.greetText}>Hi Sakshi!</Text>
              <Text weight="600" style={styles.periodPrompt}>Add Your Period Details</Text>
              <TouchableOpacity activeOpacity={0.85} style={styles.addBtnWrap}>
                <LinearGradient
                  colors={['#B148FF', '#F6339B', '#9914F9']}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.addBtn}
                >
                  <Text weight="600" style={styles.addBtnText}>Add Details</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.insightsCardWrap}>
          <View style={styles.insightsCardShadowLayer}>
            <ImageBackground
              source={require('../../assets/bg.webp')}
              style={styles.insightsCard}
              imageStyle={styles.insightsCardImage}
              resizeMode="cover"
            >
              <Text weight="700" style={styles.insightsTitle}>Helix Wellness Insights</Text>
              <Text weight="500" style={styles.insightsParagraph}>
                You are most active between 6 PM and 8 PM.{`\n`}
                Your longest workouts occur on weekends.{`\n`}
                Your current activity supports cardiovascular health.
              </Text>
              <TouchableOpacity activeOpacity={0.85} style={styles.insightsBtnWrap}>
                <LinearGradient
                  colors={['#B148FF', '#F6339B', '#9914F9']}
                  locations={[0, 0.5, 1]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.insightsBtn}
                >
                  <Text weight="600" style={styles.insightsBtnText}>View More</Text>
                </LinearGradient>
              </TouchableOpacity>
            </ImageBackground>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F3EFEB',
  },
  scrollContent: {
    paddingBottom: 16,
  },
  headerBlock: {
    paddingHorizontal: 16,
    paddingBottom: 4,
    backgroundColor: '#F3EFEB',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  titleWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 19,
    lineHeight: 23,
    color: '#5C43BF',
  },
  headerSubtitle: {
    marginTop: 1,
    fontSize: 12,
    lineHeight: 15,
    color: '#1A1A1A',
  },
  chipRowContainer: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 2,
    paddingBottom: 0,
    backgroundColor: 'transparent',
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    height: CHIP_HEIGHT + 10,
    paddingBottom: 0,
  },
  chipTouch: {
    width: CHIP_WIDTH,
    height: CHIP_HEIGHT + 10,
    marginRight: CHIP_GAP,
    justifyContent: 'flex-start',
  },
  activeChipContainer: {
    width: CHIP_WIDTH,
    height: CHIP_HEIGHT + 10,
    position: 'relative',
    zIndex: 10,
  },
  activeChipSurface: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  activeChipLabel: {
    position: 'absolute',
    top: 8,
    left: 0,
    right: 0,
    height: CHIP_HEIGHT - 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeChipText: {
    fontSize: 11,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  activeMentrualText: {
    color: '#D63A9A',
  },
  inactiveChip: {
    width: '100%',
    height: CHIP_HEIGHT,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactiveChipText: {
    fontSize: 11,
    textAlign: 'center',
  },
  topSection: {
    marginTop: -2,
    paddingTop: 22,
    paddingBottom: 18,
    position: 'relative',
    overflow: 'hidden',
  },
  topLayerFrontImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.35,
    zIndex: 1,
  },
  periodCard: {
    marginHorizontal: 16,
    minHeight: 124,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    zIndex: 2,
  },
  phoneBlock: {
    width: 86,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneImage: {
    width: 90,
    height: 120,
  },
  phoneOuter: {
    width: 56,
    height: 98,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E5A1CA',
    backgroundColor: '#FFEAF7',
    padding: 4,
  },
  phoneInner: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingTop: 4,
  },
  monthText: {
    fontSize: 8,
    color: '#3C7E7B',
  },
  dotRow: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 3,
  },
  cycleDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4BC6B8',
  },
  cycleBadge: {
    marginTop: 8,
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: '#5DC8C0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8EE4DF',
  },
  cycleBadgeText: {
    fontSize: 6,
    color: '#1E6863',
  },
  dayText: {
    fontSize: 10,
    color: '#1E6863',
  },
  periodTextWrap: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 8,
  },
  greetText: {
    fontSize: 26,
    lineHeight: 20,
    color: '#1F2937',
  },
  periodPrompt: {
    marginTop: 4,
    fontSize: 15,
    lineHeight: 19,
    color: '#1F2937',
  },
  addBtnWrap: {
    marginTop: 10,
    borderRadius: 6,
    overflow: 'hidden',
  },
  addBtn: {
    minWidth: 68,
    height: 30,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  addBtnText: {
    fontSize: 11,
    color: '#FFFFFF',
  },
  insightsCardWrap: {
    width: 323,
    minHeight: 129,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#BF7BB9',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  insightsCardShadowLayer: {
    width: '100%',
    minHeight: 129,
    borderRadius: 10,
    backgroundColor: 'transparent',
    shadowColor: '#F3E6F2',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 1,
    overflow: 'hidden',
  },
  insightsCard: {
    minHeight: 129,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  insightsCardImage: {
    borderRadius: 10,
    opacity: 0.65,
  },
  insightsTitle: {
    fontSize: 18,
    lineHeight: 24,
    color: '#111111',
    textAlign: 'center',
  },
  insightsParagraph: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  insightsBtnWrap: {
    marginTop: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  insightsBtn: {
    minHeight: 30,
    minWidth: 92,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightsBtnText: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
