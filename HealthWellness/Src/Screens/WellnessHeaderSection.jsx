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
  ImageBackground
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
const BOTTOM_NOTCH_SIZE = 18;
const CALORIES_CONSUMED = 1600;
const CALORIE_TARGET = 2000;
const TARGET_BADGE_WIDTH = 50;
const ENERGY_IMAGE_SIZE = Math.max(128, Math.min(160, SCREEN_WIDTH * 0.44));
const CALORIE_PROGRESS = Math.min((CALORIES_CONSUMED / CALORIE_TARGET) * 100, 100);

const CATEGORIES = [
  { label: 'All', color: '#CD8CFF' }, 
  { label: 'Sleep', color: '#5B3DBA' },
  { label: 'Nutrition', color: '#16A34A' },
  { label: 'Fitness', color: '#EA580C' },
  { label: 'Medicine', color: '#1D4ED8' },
  { label: 'Mentrual', color: '#DB2777' },
];

const MACROS = [
  { label: 'Protein', value: '0g', color: '#3B82F6' },
  { label: 'Carbs', value: '0g', color: '#EF4444' },
  { label: 'Fats', value: '0g', color: '#F59E0B' },
  { label: 'Fibres', value: '0g', color: '#84CC16' },
];

// Active chip with pseudo-element style corner notches (RN equivalent)
const ActiveChip = ({ label, color }) => (
  <View style={styles.activeChipContainer}>
    <View style={[styles.activeChipSurface, { backgroundColor: color }]} />
    <View style={styles.activeChipLabel}>
      <Text weight="600" style={styles.activeChipText}>{label}</Text>
    </View>
  </View>
);

export default function WellnessHeaderSection({ onNavigateSleep, onNavigateNutrition, onNavigateFitness, onNavigateMedicine, onNavigateMentrual, hideHeader = false }) {
  const topOffset = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 18;
  const [active, setActive] = useState('All');
  const [progressTrackWidth, setProgressTrackWidth] = useState(0);

  const calorieFillWidth = (CALORIE_PROGRESS / 100) * progressTrackWidth;
  const targetBadgeLeft = Math.min(
    Math.max(calorieFillWidth - (TARGET_BADGE_WIDTH / 2), 0),
    Math.max(progressTrackWidth - TARGET_BADGE_WIDTH, 0)
  );

  const chipAnimMap = useRef(
    CATEGORIES.reduce((acc, item) => {
      acc[item.label] = new Animated.Value(item.label === 'All' ? 1 : 0);
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

    if (label === 'Sleep' && typeof onNavigateSleep === 'function') {
      onNavigateSleep();
    }

    if (label === 'Nutrition' && typeof onNavigateNutrition === 'function') {
      onNavigateNutrition();
    }

    if (label === 'Fitness' && typeof onNavigateFitness === 'function') {
      onNavigateFitness();
    }

    if (label === 'Medicine' && typeof onNavigateMedicine === 'function') {
      onNavigateMedicine();
    }

    if (label === 'Mentrual' && typeof onNavigateMentrual === 'function') {
      onNavigateMentrual();
    }
  };

  const activeIndex = CATEGORIES.findIndex(c => c.label === active);
  const blobLeft = HORIZONTAL_PADDING + (activeIndex * (CHIP_WIDTH + CHIP_GAP));

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {!hideHeader && (
          <View style={[styles.headerBlock, { paddingTop: topOffset }]}> 
            <View style={styles.headerRow}>
              <TouchableOpacity activeOpacity={0.8} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={25} color="#5A3FB8" />
              </TouchableOpacity>
              <View style={styles.titleWrap}>
                <Text weight="700" style={styles.headerTitle}>Health Wellness</Text>
                <Text weight="400" style={styles.headerSubtitle}>Build healthy habits, one day at a time.</Text>
              </View>
            </View>
          </View>
        )}

        {/* ============ CHIP ROW (OUTSIDE MAIN SECTION) ============ */}
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
                  style={[
                    styles.chipTouch,
                    index === CATEGORIES.length - 1 && { marginRight: 0 },
                  ]}
                >
                  <Animated.View style={{ transform: [{ scale }], width: '100%' }}>
                    {isActive ? (
                      // ACTIVE: white tab with bottom corner cutouts
                      <ActiveChip label={chip.label} color={chip.color} />
                    ) : (
                      // INACTIVE: White chip with colored border
                      <View style={[styles.inactiveChip, { borderColor: chip.color }]}>
                        <Text weight="500" style={[styles.inactiveChipText, { color: chip.color }]}>
                          {chip.label}
                        </Text>
                      </View>
                    )}
                  </Animated.View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ============ MAIN SECTION ============ */}
        <View style={styles.mainSection}>
          {/* 
            LAYER 1: DIAGONAL GRADIENT BACKGROUND
            Purple (top-left) → Pink (center) → Peach (bottom-right)
          */}
          <LinearGradient
            colors={['#CD8CFF', '#E5A8D0', '#F5CBA4', '#F3EFEB']}
            locations={[0, 0.35, 0.7, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.diagonalGradient}
          />

          {/* LAYER 4: SCORE CARD */}
          <View style={styles.scoreCardContainer}>
            <View style={styles.scoreCard}>
              <View style={styles.scoreContent}>
                <Text weight="700" style={styles.scoreValue}>0%</Text>
                <Text weight="600" style={styles.scoreTitle}>Your Wellness Score will appear here</Text>
                <Text weight="400" style={styles.scoreSubtitle}>Start tracking your habits to generate your score.</Text>

                <TouchableOpacity activeOpacity={0.85} style={styles.trackBtnWrap}>
                  <View style={styles.trackBtnShadowLayer}>
                    <LinearGradient
                      colors={['#B148FF', '#F6339B', '#9914F9']}
                      locations={[0, 0.5, 1]}
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                      style={styles.trackBtn}
                    >
                      <Text weight="500" style={styles.trackBtnText}>Start Tracking</Text>
                    </LinearGradient>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.plainSection}>
          <View style={styles.energyBlock}>
            <Text weight="700" style={styles.energyTitle}>Today's Energy Status</Text>
            <Text weight="400" style={styles.energySub}>Track your meals and activity to see your calorie balance.</Text>
          </View>

          <View style={styles.calorieCard}>
            <View style={styles.calorieTopRow}>
              <View style={styles.plateCircle}>
                <Image 
                  source={require('../../assets/food.webp')} 
                  style={styles.foodImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.calorieRight}>
                <View style={styles.progressBlock}>
                  <Text weight="500" style={styles.calorieLabel}>Calories Consumed</Text>
                  <View
                    style={styles.progressTrackWrap}
                    onLayout={(event) => setProgressTrackWidth(event.nativeEvent.layout.width)}
                  >
                    <View style={styles.progressTrack}>
                      <View style={[styles.progressFill, { width: calorieFillWidth }]} />
                    </View>
                    <View
                      style={[
                        styles.targetBadge,
                        {
                          left: targetBadgeLeft,
                        },
                      ]}
                    >
                      <Text weight="600" style={styles.targetBadgeText}>{CALORIES_CONSUMED}</Text>
                    </View>
                  </View>
                  <Text weight="500" style={styles.progressTargetText}>{CALORIES_CONSUMED}/{CALORIE_TARGET}</Text>
                </View>

                <View style={styles.macroDotsRow}>
                  {MACROS.map((m) => (
                    <View key={m.label} style={styles.macroDotWrap}>
                      <View style={styles.macroDotCircleWrap}>
                        <View style={[styles.macroTopIndicator, { backgroundColor: m.color }]} />
                        <View style={styles.macroDot}>
                          <View style={styles.macroDotInner}>
                            <Text weight="500" style={styles.macroDotValue}>{m.value}</Text>
                          </View>
                        </View>
                      </View>
                      <Text weight="400" style={styles.macroLabel}>{m.label}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.actionRowSmall}>
                  <TouchableOpacity style={styles.smallBtnWrap} activeOpacity={0.85}>
                    <View style={styles.smallBtnShadowLayer}>
                      <LinearGradient
                        colors={['#A2DF71', '#F2FFEC', '#A2DF71']}
                        locations={[0, 0.5, 1]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.smallBtn}
                      >
                        <Text weight="600" style={styles.smallBtnTextGreen}>Add Meal</Text>
                      </LinearGradient>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.smallBtnWrap} activeOpacity={0.85}>
                    <View style={styles.smallBtnShadowLayer}>
                      <LinearGradient
                        colors={['#FFB348', '#FFF0D5', '#FFB348']}
                        locations={[0, 0.5, 1]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.smallBtn}
                      >
                        <Text weight="600" style={styles.smallBtnTextOrange}>Add Activity</Text>
                      </LinearGradient>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.reminderBlock}>
            <View style={styles.reminderHeader}>
              <Text weight="700" style={styles.reminderTitle}>Upcoming / Reminders</Text>
              <Text weight="500" style={styles.manageText}>Manage</Text>
            </View>
            <Text weight="600" style={styles.emptyReminder}>No Reminders Set</Text>
          </View>

          <View style={styles.dailyBlock}>
            <Text weight="700" style={styles.dailyTitle}>Your Daily Calorie Target</Text>
            <View style={styles.dailyCard}>
              <View style={styles.dailyIconWrap}>
                <Image
                  source={require('../../assets/foodplate.webp')}
                  style={styles.dailyPlateImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.dailyContent}>
                <Text weight="700" style={styles.dailyCardTitle}>Know your daily calorie needs</Text>
                <Text weight="400" style={styles.dailyCardSub}>Get personalized calorie intake based on your body's lifestyle</Text>
                <View style={styles.chipHintRow}>
                  <View style={styles.hintChip}><Text weight="500" style={styles.hintChipText}>Maintain weight</Text></View>
                  <View style={styles.hintChip}><Text weight="500" style={styles.hintChipText}>Lose fat</Text></View>
                  <View style={styles.hintChip}><Text weight="500" style={styles.hintChipText}>Build muscle</Text></View>
                </View>
                <TouchableOpacity style={styles.calcBtnWrap}>
                  <View style={styles.calcBtnShadowLayer}>
                    <LinearGradient
                      colors={['#B148FF', '#F6339B', '#9914F9']}
                      locations={[0, 0.5, 1]}
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                      style={styles.calcBtn}
                    >
                      <Text weight="600" style={styles.calcBtnText} numberOfLines={1}>Calculate Now</Text>
                    </LinearGradient>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.insightsCardWrap}>
            <View style={styles.insightsCardShadowLayer}>
              <ImageBackground
                source={require('../../assets/bg.webp')}
                style={styles.insightsCard}
                imageStyle={styles.insightsCardImage}
                resizeMode="cover"
              >
                <Text weight="700" style={styles.insightsTitle}>Helix Wellness Insights</Text>
                <Text weight="500" style={styles.insightsSubtitle}>Insights unlock after 5 days of tracking.</Text>
                <TouchableOpacity activeOpacity={0.85} style={styles.insightsBtnWrap}>
                  <LinearGradient
                    colors={['#B148FF', '#F6339B', '#9914F9']}
                    locations={[0, 0.5, 1]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.insightsBtn}
                  >
                    <Text weight="600" style={styles.insightsBtnText}>Learn How it Works</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </ImageBackground>
            </View>
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

  // ==================== MAIN SECTION ====================
  mainSection: {
    position: 'relative',
    marginTop: -2,
  },

  // DIAGONAL GRADIENT (Purple top-left → Peach bottom-right)
  diagonalGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 220,
    zIndex: 0,
  },

  // CHIP ROW CONTAINER (moved outside mainSection)
  chipRowContainer: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 2,
    paddingBottom: 0,
    marginTop: 0,
    backgroundColor: 'transparent',
    zIndex: 10,
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

  // ACTIVE CHIP - SVG curved button
  activeChipContainer: {
    width: CHIP_WIDTH,
    height: CHIP_HEIGHT + 10,
    position: 'relative',
    zIndex: 10,
    overflow: 'visible',
  },
  activeChipSurface: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  activeChipNotch: {
    position: 'absolute',
    width: BOTTOM_NOTCH_SIZE,
    height: BOTTOM_NOTCH_SIZE,
    borderRadius: BOTTOM_NOTCH_SIZE / 2,
    backgroundColor: '#F3EFEB',
    bottom: -BOTTOM_NOTCH_SIZE,
    zIndex: 12,
  },
  activeChipNotchLeft: {
    left: -BOTTOM_NOTCH_SIZE,
  },
  activeChipNotchRight: {
    right: -BOTTOM_NOTCH_SIZE,
  },
  activeChipLabel: {
    position: 'absolute',
    top: 8,
    left: 0,
    right: 0,
    height: CHIP_HEIGHT - 8,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 11,
  },
  activeChipText: {
    fontSize: 11,
    color: '#FFFFFF',
    textAlign: 'center',
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

  // SCORE CARD
  scoreCardContainer: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 35,
    zIndex: 4,
  },
  scoreCard: {
    width: '100%',
    maxWidth: 340,
    minHeight: 155,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignSelf: 'center',
    shadowColor: '#BF7BB9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  scoreContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  scoreValue: {
    fontSize: 42,
    lineHeight: 48,
    color: '#101010',
  },
  scoreTitle: {
    marginTop: 3,
    fontSize: 14,
    lineHeight: 19,
    color: '#111111',
    textAlign: 'center',
    maxWidth: '94%',
  },
  scoreSubtitle: {
    marginTop: 4,
    marginBottom: 10,
    fontSize: 11,
    lineHeight: 15,
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: '95%',
  },
  trackBtnWrap: {
    alignSelf: 'center',
    borderRadius: 5,
    shadowColor: '#BF7BB9',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  trackBtnShadowLayer: {
    borderRadius: 5,
    shadowColor: '#F3E6F2',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 1,
  },
  trackBtn: {
    width: 108,
    height: 26,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  trackBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    lineHeight: 13,
    textAlign: 'center',
  },

  // ==================== PLAIN SECTION ====================
  plainSection: {
    backgroundColor: '#F3EFEB',
    paddingHorizontal: 10,
  },
  energyBlock: {
    marginTop: 12,
    paddingHorizontal: 6,
  },
  energyTitle: {
    fontSize: 16,
    lineHeight: 22,
    color: '#111111',
  },
  energySub: {
    marginTop: 2,
    fontSize: 11,
    lineHeight: 15,
    color: '#2F2F2F',
  },
  calorieCard: {
    marginTop: 12,
    backgroundColor: 'transparent',
    borderRadius: 0,
    paddingHorizontal: 2,
    paddingVertical: 6,
  },
  calorieTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  plateCircle: {
    width: ENERGY_IMAGE_SIZE,
    height: ENERGY_IMAGE_SIZE,
    borderRadius: ENERGY_IMAGE_SIZE / 2,
    backgroundColor: '#EEF2F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  foodImage: {
    width: ENERGY_IMAGE_SIZE - 4,
    height: ENERGY_IMAGE_SIZE - 4,
  },
  calorieRight: {
    flex: 1,
    paddingTop: 8,
    minWidth: 0,
  },
  progressBlock: {
    marginBottom: 14,
  },
  calorieLabel: {
    fontSize: 14,
    lineHeight: 18,
    color: '#565656',
    marginBottom: 10,
  },
  progressTrack: {
    width: '100%',
    height: 10,
    borderRadius: 999,
    backgroundColor: '#D3D3D6',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  progressTrackWrap: {
    width: '100%',
    position: 'relative',
    paddingTop: 2,
    paddingBottom: 8,
    maxWidth: '100%',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#97D36B',
  },
  targetBadge: {
    position: 'absolute',
    top: -5,
    width: TARGET_BADGE_WIDTH,
    height: 22,
    borderRadius: 999,
    backgroundColor: '#F2F2F2',
    borderWidth: 2,
    borderColor: '#66B828',
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetBadgeText: {
    fontSize: 12,
    lineHeight: 14,
    color: '#585858',
  },
  progressTargetText: {
    marginTop: 4,
    fontSize: 12,
    color: '#5F6368',
    textAlign: 'right',
  },
  macroDotsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    width: '100%',
  },
  macroDotWrap: {
    flex: 1,
    alignItems: 'center',
    minWidth: 0,
  },
  macroDotCircleWrap: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  macroTopIndicator: {
    position: 'absolute',
    top: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
    zIndex: 2,
  },
  macroDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EDEDED',
    borderWidth: 1,
    borderColor: '#E2E2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  macroDotInner: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECECEC',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  macroDotValue: {
    fontSize: 8,
    lineHeight: 10,
    color: '#111111',
  },
  macroLabel: {
    marginTop: 5,
    fontSize: 8,
    lineHeight: 10,
    color: '#0F0F0F',
  },
  actionRowSmall: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  smallBtnWrap: {
    flex: 1,
    borderRadius: 12,
    shadowColor: '#BF7BB9',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  smallBtnShadowLayer: {
    borderRadius: 12,
    shadowColor: '#F3E6F2',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 1,
    overflow: 'hidden',
  },
  smallBtn: {
    width: '100%',
    minHeight: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallBtnTextGreen: {
    fontSize: 11,
    color: '#5B3DBA',
  },
  smallBtnTextOrange: {
    fontSize: 11,
    color: '#5B3DBA',
  },
  reminderBlock: {
    marginTop: 14,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  reminderTitle: {
    fontSize: 16,
    color: '#111111',
  },
  manageText: {
    fontSize: 12,
    color: '#5B3DBA',
  },
  emptyReminder: {
    fontSize: 16,
    lineHeight: 22,
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 6,
  },
  dailyBlock: {
    marginTop: 18,
  },
  dailyTitle: {
    fontSize: 16,
    lineHeight: 22,
    color: '#111111',
    marginBottom: 12,
    textAlign: 'center',
  },
  dailyCard: {
    backgroundColor: '#EAF4FB',
    width: 344,
    height: 130,
    alignSelf: 'center',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#D5E8F8',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  dailyIconWrap: {
    width: 116,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dailyPlateImage: {
    width: 108,
    height: 108,
  },
  dailyContent: {
    flex: 1,
    paddingTop: 2,
    paddingRight: 4,
  },
  dailyCardTitle: {
    fontSize: 11,
    lineHeight: 14,
    color: '#111827',
    marginBottom: 2,
  },
  dailyCardSub: {
    fontSize: 9,
    lineHeight: 12,
    color: '#4B5563',
    marginBottom: 5,
  },
  chipHintRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 5,
    flexWrap: 'wrap',
  },
  hintChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  hintChipText: {
    fontSize: 8,
    color: '#4B5563',
  },
  calcBtnWrap: {
    borderRadius: 3,
    alignSelf: 'flex-start',
    shadowColor: '#BF7BB9',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  calcBtnShadowLayer: {
    borderRadius: 3,
    shadowColor: '#F3E6F2',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 1,
    overflow: 'hidden',
  },
  calcBtn: {
    width: 88,
    height: 22,
    borderRadius: 3,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calcBtnText: {
    fontSize: 9,
    lineHeight: 11,
    color: '#FFFFFF',
    textAlign: 'center',
  },

  insightsCardWrap: {
    width: 323,
    height: 129,
    alignSelf: 'center',
    marginTop: 16,
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
    height: '100%',
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
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
  insightsSubtitle: {
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
    minHeight: 36,
    minWidth: 152,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightsBtnText: {
    fontSize: 13,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});