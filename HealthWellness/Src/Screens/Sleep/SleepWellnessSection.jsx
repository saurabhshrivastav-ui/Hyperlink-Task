import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  FlatList,
  ScrollView,
  Dimensions,
  ImageBackground,
  Image,
  Animated,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '../../../components/TextWrapper';
import PressableCard from '../../components/PressableCard';
import useParallaxHeader from '../../hooks/useParallaxHeader';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_PADDING = 10;
const CHIP_GAP = 6;
const TOTAL_GAPS_WIDTH = CHIP_GAP * 5;
const AVAILABLE_WIDTH = SCREEN_WIDTH - (HORIZONTAL_PADDING * 2) - TOTAL_GAPS_WIDTH;
const CHIP_WIDTH = Math.floor(AVAILABLE_WIDTH / 6);
const CHIP_ITEM_WIDTH = CHIP_WIDTH + CHIP_GAP;
const CHIP_HEIGHT = 36;
const SLEEP_LAYER_TOP = '#E4CCF7';
const SLEEP_LAYER_MID = '#CFE1FF';
const SLEEP_STARS = [
  { top: '10%', left: '8%', size: 2, opacity: 0.32 },
  { top: '14%', left: '18%', size: 3, opacity: 0.45 },
  { top: '8%', left: '30%', size: 2, opacity: 0.38 },
  { top: '16%', left: '43%', size: 2, opacity: 0.34 },
  { top: '11%', left: '56%', size: 3, opacity: 0.4 },
  { top: '7%', left: '69%', size: 2, opacity: 0.36 },
  { top: '17%', left: '80%', size: 2, opacity: 0.35 },
  { top: '22%', left: '12%', size: 2, opacity: 0.33 },
  { top: '28%', left: '24%', size: 3, opacity: 0.42 },
  { top: '24%', left: '36%', size: 2, opacity: 0.3 },
  { top: '30%', left: '48%', size: 2, opacity: 0.4 },
  { top: '27%', left: '61%', size: 3, opacity: 0.44 },
  { top: '23%', left: '73%', size: 2, opacity: 0.37 },
  { top: '29%', left: '86%', size: 2, opacity: 0.35 },
  { top: '36%', left: '9%', size: 2, opacity: 0.31 },
  { top: '40%', left: '21%', size: 2, opacity: 0.36 },
  { top: '34%', left: '33%', size: 3, opacity: 0.43 },
  { top: '41%', left: '45%', size: 2, opacity: 0.35 },
  { top: '37%', left: '58%', size: 2, opacity: 0.33 },
  { top: '42%', left: '71%', size: 3, opacity: 0.41 },
  { top: '39%', left: '83%', size: 2, opacity: 0.34 },
];
const SLEEP_TREES = [
  { left: '5%', scale: 1.2, opacity: 0.55 },
  { left: '10%', scale: 0.9, opacity: 0.5 },
  { left: '15%', scale: 1.1, opacity: 0.56 },
  { left: '23%', scale: 0.85, opacity: 0.48 },
  { left: '29%', scale: 1, opacity: 0.52 },
  { left: '36%', scale: 1.15, opacity: 0.57 },
  { left: '44%', scale: 0.92, opacity: 0.49 },
  { left: '52%', scale: 1.05, opacity: 0.54 },
  { left: '61%', scale: 0.88, opacity: 0.47 },
  { left: '69%', scale: 1.08, opacity: 0.55 },
  { left: '77%', scale: 0.9, opacity: 0.5 },
  { left: '85%', scale: 1.18, opacity: 0.58 },
  { left: '92%', scale: 0.82, opacity: 0.45 },
];

const CATEGORIES = [
  { label: 'All', color: '#CD8CFF' },
  { label: 'Sleep', color: '#5B3DBA' },
  { label: 'Nutrition', color: '#16A34A' },
  { label: 'Fitness', color: '#EA580C' },
  { label: 'Medicine', color: '#1D4ED8' },
  { label: 'Menstrual', color: '#DB2777' },
];

const ActiveChip = ({ label, color }) => {
  const isSleep = label === 'Sleep';

  return (
    <View style={styles.activeChipContainer}>
      {isSleep ? (
        <View style={[styles.activeChipSurface, { backgroundColor: '#E4CCF7' }]} />
      ) : (
        <View style={[styles.activeChipSurface, { backgroundColor: color }]} />
      )}
      <View style={styles.activeChipLabel}>
        <Text weight="600" style={[styles.activeChipText, isSleep && styles.activeChipTextSleep]}>{label}</Text>
      </View>
    </View>
  );
};

const SetSleepIcon = () => (
  <View style={styles.setSleepIconWrap}>
    <View style={styles.setSleepMoon}>
      <View style={styles.setSleepMoonCutout} />
    </View>
    <Text weight="700" style={styles.setSleepZz}>zZ</Text>
  </View>
);

const ReminderTileIcon = () => (
  <Ionicons name="alarm-outline" size={20} color="#C84E65" style={styles.reminderIcon} />
);

const DeviceTileIcon = () => (
  <Feather name="link" size={14} color="#2563EB" />
);

const ActionTile = ({ icon, title, color, bg, border, gradientColors }) => (
  <PressableCard style={styles.actionTileTouch}>
    {gradientColors ? (
      <View style={styles.actionTileShadowA}>
        <View style={styles.actionTileShadowB}>
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={[styles.actionTile, styles.actionTileSetSleep]}
          >
            <View style={styles.actionIconWrap}>{icon}</View>
            <Text weight="600" style={[styles.actionText, { color }]}>{title}</Text>
          </LinearGradient>
        </View>
      </View>
    ) : (
      <View style={[styles.actionTile, { backgroundColor: bg, borderColor: border }]}> 
        <View style={styles.actionIconWrap}>{icon}</View>
        <Text weight="600" style={[styles.actionText, { color }]}>{title}</Text>
      </View>
    )}
  </PressableCard>
);

function SleepWellnessSection({ onBack, onNavigateAll, onNavigateNutrition, onNavigateFitness, onNavigateMedicine, onNavigateMenstrual, hideHeader = false }) {
  const CURRENT_CATEGORY = 'Sleep';
  const topOffset = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 18;
  const [active, setActive] = useState('Sleep');
  const flatListRef = useRef(null);
  const { scrollHandler, heroAnimatedStyle } = useParallaxHeader();

  // Content transition animation - opacity and slide for hero card - start hidden
  const contentOpacityAnim = useRef(new Animated.Value(0)).current;
  const contentSlideAnim = useRef(new Animated.Value(30)).current;

  // Separate animations for action tiles and insights card - start hidden
  const actionOpacityAnim = useRef(new Animated.Value(0)).current;
  const actionSlideAnim = useRef(new Animated.Value(30)).current;

  // Content transition animation when active tab changes
  useEffect(() => {
    // Delay animation by 500ms before components become visible
    const animationTimeout = setTimeout(() => {
      // All components animate together at the same time
      Animated.parallel([
        // Hero card animation
        Animated.spring(contentOpacityAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 65,
          friction: 10,
        }),
        Animated.spring(contentSlideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 10,
        }),
        // Action tiles and insights card animation
        Animated.spring(actionOpacityAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 65,
          friction: 10,
        }),
        Animated.spring(actionSlideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 10,
        }),
      ]).start();
    }, 500);

    return () => clearTimeout(animationTimeout);
  }, [active]);

  const handleChipPress = (label, index) => {
    flatListRef.current?.scrollToIndex({
      index,
      animated: false,
      viewPosition: 0.5,
    });

    if (label !== CURRENT_CATEGORY) {
      if (label === 'All' && typeof onNavigateAll === 'function') {
        onNavigateAll();
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

      if (label === 'Menstrual' && typeof onNavigateMenstrual === 'function') {
        onNavigateMenstrual();
      }
      return;
    }

    setActive(CURRENT_CATEGORY);
  };

  const getItemLayout = (_, index) => ({
    length: CHIP_ITEM_WIDTH,
    offset: CHIP_ITEM_WIDTH * index,
    index,
  });

  const renderChipItem = ({ item: chip, index }) => {
    const isActive = active === chip.label;

    return (
      <View
        style={[
          styles.chipTouch,
          index === CATEGORIES.length - 1 && { marginRight: 0 },
        ]}
      >
        <TouchableOpacity activeOpacity={1} onPress={() => handleChipPress(chip.label, index)} style={{ width: '100%' }}>
          {isActive ? (
            <ActiveChip label={chip.label} color={chip.color} />
          ) : (
            <View style={[styles.inactiveChip, { borderColor: chip.color }]}>
              <Text weight="500" style={[styles.inactiveChipText, { color: chip.color }]}>
                {chip.label}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
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
          <FlatList
            ref={flatListRef}
            horizontal
            data={CATEGORIES}
            keyExtractor={(item) => item.label}
            renderItem={renderChipItem}
            getItemLayout={getItemLayout}
            showsHorizontalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={styles.chipRow}
            onScrollToIndexFailed={({ index }) => {
              setTimeout(() => {
                flatListRef.current?.scrollToIndex({
                  index,
                  animated: false,
                  viewPosition: 0.5,
                });
              }, 120);
            }}
          />
        </View>

        <View style={heroAnimatedStyle}>
        <LinearGradient
          colors={[
            SLEEP_LAYER_TOP,
            'rgba(207, 225, 255, 0.85)',
            'rgba(207, 225, 255, 0.42)',
            'rgba(207, 225, 255, 0.00)'
          ]}
          locations={[0, 0.34, 0.7, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.topSection}
        >

          <Animated.View
            style={[
              styles.heroWrap,
              {
                opacity: contentOpacityAnim,
                transform: [{ translateY: contentSlideAnim }],
              },
            ]}
          >
            <LinearGradient
              colors={['#4c3c92', '#3a2c7a', '#2c1f5c']}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.heroCard}
            >
              <View style={styles.heroBackgroundScene} pointerEvents="none">
                {SLEEP_STARS.map((star, index) => (
                  <View
                    key={`star-${index}`}
                    style={[
                      styles.heroStar,
                      {
                        top: star.top,
                        left: star.left,
                        width: star.size,
                        height: star.size,
                        opacity: star.opacity,
                      },
                    ]}
                  />
                ))}

                <View style={styles.heroMoonGlow}>
                  <View style={[styles.moonCrater, styles.moonCraterOne]} />
                  <View style={[styles.moonCrater, styles.moonCraterTwo]} />
                  <View style={[styles.moonCrater, styles.moonCraterThree]} />
                </View>

                <LinearGradient
                  colors={['rgba(42,29,85,0.95)', 'rgba(37,25,78,0.98)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.hillBack}
                />
                <LinearGradient
                  colors={['rgba(34,22,74,0.98)', 'rgba(31,20,66,1)']}
                  start={{ x: 0.1, y: 0 }}
                  end={{ x: 0.9, y: 1 }}
                  style={styles.hillMid}
                />

                <View style={styles.treeLayer}>
                  {SLEEP_TREES.map((tree, index) => (
                    <View
                      key={`tree-${index}`}
                      style={[
                        styles.tree,
                        {
                          left: tree.left,
                          opacity: tree.opacity,
                          transform: [{ scale: tree.scale }],
                        },
                      ]}
                    >
                      <View style={styles.treeCanopy} />
                      <View style={styles.treeTrunk} />
                    </View>
                  ))}
                </View>

                <LinearGradient
                  colors={['rgba(26,15,58,1)', 'rgba(22,12,50,1)']}
                  start={{ x: 0.2, y: 0 }}
                  end={{ x: 0.8, y: 1 }}
                  style={styles.hillFront}
                />

                <Image
                  source={require('../../../assets/birds.webp')}
                  style={styles.heroBirds}
                  resizeMode="contain"
                  resizeMethod="resize"
                  fadeDuration={0}
                />
              </View>

              <Text weight="700" style={styles.heroTitle}>Your Sleep Score will appear here</Text>
              <Text weight="400" style={styles.heroSubtitle}>Start logging your sleep to track patterns, recovery, and energy levels.</Text>
              <PressableCard style={styles.logBtnWrap}>
                <LinearGradient
                  colors={['#B148FF', '#F6339B', '#9914F9']}
                  locations={[0, 0.5, 1]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.logBtn}
                >
                  <Text weight="600" style={styles.logBtnText}>Log Sleep</Text>
                </LinearGradient>
              </PressableCard>
            </LinearGradient>
          </Animated.View>
        </LinearGradient>
        </View>

        <Animated.View
          style={[
            styles.actionsRow,
            {
              opacity: actionOpacityAnim,
              transform: [{ translateY: actionSlideAnim }],
            },
          ]}
        >
          <ActionTile
            title="Set Sleep"
            color="#6D36D1"
            gradientColors={['#F8F4FF', '#EFE2FF']}
            icon={<SetSleepIcon />}
          />
          <ActionTile
            title="Reminders"
            color="#DF5A69"
            gradientColors={['#F8F4FF', '#FFDEE0']}
            icon={<ReminderTileIcon />}
          />
          <ActionTile
            title="Devices"
            color="#2D5FA8"
            gradientColors={['#F8F4FF', '#E7EDFC']}
            icon={<DeviceTileIcon />}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.insightsCardWrap,
            {
              opacity: actionOpacityAnim,
              transform: [{ translateY: actionSlideAnim }],
            },
          ]}
        >
          <View style={styles.insightsCardShadowLayer}>
            <ImageBackground
              source={require('../../../assets/bg.webp')}
              style={styles.insightsCard}
              imageStyle={styles.insightsCardImage}
              resizeMode="cover"
            >
              <Text weight="700" style={styles.insightsTitle}>Helix Wellness Insights</Text>
              <Text weight="500" style={styles.insightsSubtitle}>Insights unlock after 5 days of tracking.</Text>
              <PressableCard style={styles.insightsBtnWrap}>
                <LinearGradient
                  colors={['#B148FF', '#F6339B', '#9914F9']}
                  locations={[0, 0.5, 1]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.insightsBtn}
                >
                  <Text weight="600" style={styles.insightsBtnText}>Learn How it Works</Text>
                </LinearGradient>
              </PressableCard>
            </ImageBackground>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

export default React.memo(SleepWellnessSection);

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
  topSection: {
    marginTop: -2,
    paddingTop: 0,
    paddingBottom: 12,
  },
  chipRowContainer: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 2,
    paddingBottom: 0,
    backgroundColor: 'transparent',
    zIndex: 12,
    overflow: 'visible',
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
  activeChipTextSleep: {
    color: '#4F3AAC',
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
  heroWrap: {
    marginTop: 0,
    paddingTop: 28,
    paddingHorizontal: 20,
  },
  heroCard: {
    borderRadius: 20,
    minHeight: 148,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 14,
    overflow: 'hidden',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  heroBackgroundScene: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  heroStar: {
    position: 'absolute',
    borderRadius: 99,
    backgroundColor: '#FFFFFF',
  },
  heroMoonGlow: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#E6E6E6',
    shadowColor: '#F2F2FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 6,
  },
  moonCrater: {
    position: 'absolute',
    borderRadius: 99,
    backgroundColor: 'rgba(205, 205, 220, 0.55)',
  },
  moonCraterOne: {
    width: 5,
    height: 5,
    top: 7,
    left: 8,
  },
  moonCraterTwo: {
    width: 4,
    height: 4,
    top: 13,
    left: 14,
  },
  moonCraterThree: {
    width: 3,
    height: 3,
    top: 5,
    left: 16,
  },
  hillBack: {
    position: 'absolute',
    bottom: 0,
    left: '-10%',
    width: '76%',
    height: 52,
    borderTopRightRadius: 120,
    borderTopLeftRadius: 90,
  },
  hillMid: {
    position: 'absolute',
    bottom: 0,
    right: '-14%',
    width: '82%',
    height: 62,
    borderTopLeftRadius: 140,
    borderTopRightRadius: 85,
  },
  treeLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 25,
    height: 34,
  },
  tree: {
    position: 'absolute',
    bottom: 0,
    width: 9,
    height: 24,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  treeCanopy: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 14,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#10072A',
    marginBottom: -1,
  },
  treeTrunk: {
    width: 2,
    height: 6,
    backgroundColor: '#0C041D',
  },
  hillFront: {
    position: 'absolute',
    bottom: -2,
    left: '-4%',
    width: '112%',
    height: 42,
    borderTopLeftRadius: 170,
    borderTopRightRadius: 170,
  },
  heroTitle: {
    fontSize: 19,
    lineHeight: 22,
    color: '#FFFFFF',
    maxWidth: '64%',
  },
  heroSubtitle: {
    marginTop: 6,
    fontSize: 10,
    lineHeight: 13,
    color: '#D6D9F7',
    maxWidth: '68%',
  },
  logBtnWrap: {
    marginTop: 0,
    alignSelf: 'center',
    borderRadius: 8,
    overflow: 'hidden',
  },
  logBtn: {
    minWidth: 92,
    height: 31,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  logBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    lineHeight: 14,
  },
  heroBirds: {
    position: 'absolute',
    right: 0,
    bottom: 36,
    width: 88,
    height: 63,
    zIndex: 5,
    shadowColor: '#0A031A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
    elevation: 4,
  },
  actionsRow: {
    marginTop: 10,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  actionTileTouch: {
    flex: 1,
    borderRadius: 12,
  },
  actionTileShadowA: {
    borderRadius: 12,
    shadowColor: '#BF7BB9',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 1,
  },
  actionTileShadowB: {
    borderRadius: 12,
    shadowColor: '#F3E6F2',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 1,
  },
  actionTile: {
    minHeight: 52,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  actionTileSetSleep: {
    borderColor: '#FFFFFF',
  },
  actionIconWrap: {
    marginBottom: 4,
  },
  setSleepIconWrap: {
    width: 22,
    height: 16,
    justifyContent: 'center',
  },
  setSleepMoon: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: '#7B2AF8',
  },
  setSleepMoonCutout: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EFE2FF',
    top: -1,
    right: -1,
  },
  setSleepZz: {
    position: 'absolute',
    top: -2,
    right: 0,
    fontSize: 7,
    lineHeight: 8,
    color: '#7B2AF8',
  },
  reminderIcon: {
    marginLeft: -1,
  },
  actionText: {
    fontSize: 16,
    lineHeight: 18,
  },
  spacer: {
    height: 220,
  },
  insightsCardWrap: {
    width: 323,
    height: 129,
    alignSelf: 'center',
    marginTop: 8,
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
