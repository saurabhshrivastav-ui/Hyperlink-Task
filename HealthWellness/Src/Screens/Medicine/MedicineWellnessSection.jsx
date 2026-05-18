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
  Image,
  ImageBackground,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '../../../components/TextWrapper';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_PADDING = 10;
const CHIP_GAP = 6;
const TOTAL_GAPS_WIDTH = CHIP_GAP * 5;
const AVAILABLE_WIDTH = SCREEN_WIDTH - (HORIZONTAL_PADDING * 2) - TOTAL_GAPS_WIDTH;
const CHIP_WIDTH = Math.floor(AVAILABLE_WIDTH / 6);
const CHIP_ITEM_WIDTH = CHIP_WIDTH + CHIP_GAP;
const CHIP_HEIGHT = 36;

const CATEGORIES = [
  { label: 'All', color: '#CD8CFF' },
  { label: 'Sleep', color: '#5B3DBA' },
  { label: 'Nutrition', color: '#16A34A' },
  { label: 'Fitness', color: '#EA580C' },
  { label: 'Medicine', color: '#1D4ED8' },
  { label: 'Menstrual', color: '#DB2777' },
];

const ActiveChip = ({ label, color }) => {
  const isMedicine = label === 'Medicine';

  return (
    <View style={styles.activeChipContainer}>
      {isMedicine ? (
        <ImageBackground
          source={require('../../../assets/medicines.webp')}
          style={styles.activeChipSurface}
          imageStyle={styles.activeMedicineChipImage}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['rgba(220, 234, 255, 0.28)', 'rgba(220, 234, 255, 0.28)']}
            style={styles.activeMedicineChipOverlay}
          />
        </ImageBackground>
      ) : (
        <View style={[styles.activeChipSurface, { backgroundColor: color }]} />
      )}
      <View style={styles.activeChipLabel}>
        <Text weight="600" style={[styles.activeChipText, isMedicine && styles.activeMedicineText]}>{label}</Text>
      </View>
    </View>
  );
};

export default function MedicineWellnessSection({
  onBack,
  onNavigateAll,
  onNavigateSleep,
  onNavigateNutrition,
  onNavigateFitness,
  onNavigateMenstrual,
  hideHeader = false,
}) {
  const CURRENT_CATEGORY = 'Medicine';
  const topOffset = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 18;
  const [active, setActive] = useState('Medicine');
  const flatListRef = useRef(null);

  // Content transition animation - opacity and slide
  const contentOpacityAnim = useRef(new Animated.Value(1)).current;
  const contentSlideAnim = useRef(new Animated.Value(0)).current;

  // Content transition animation when active tab changes
  useEffect(() => {
    // Delay animation by 500ms before components become visible
    const animationTimeout = setTimeout(() => {
      // First: Drop opacity to 0 and slide down
      Animated.parallel([
        Animated.timing(contentOpacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(contentSlideAnim, {
          toValue: 30,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Then: Fade in and slide up to normal position
        Animated.parallel([
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
        ]).start();
      });
    }, 500);

    return () => clearTimeout(animationTimeout);
  }, [active]);

  const handleChipPress = (label, index) => {
    flatListRef.current?.scrollToIndex({
      index,
      animated: false,
      viewPosition: 0.5,
    });

    setActive(label);

    if (label !== CURRENT_CATEGORY) {
      if (label === 'All' && typeof onNavigateAll === 'function') onNavigateAll();
      if (label === 'Sleep' && typeof onNavigateSleep === 'function') onNavigateSleep();
      if (label === 'Nutrition' && typeof onNavigateNutrition === 'function') onNavigateNutrition();
      if (label === 'Fitness' && typeof onNavigateFitness === 'function') onNavigateFitness();
      if (label === 'Menstrual' && typeof onNavigateMenstrual === 'function') onNavigateMenstrual();
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
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => handleChipPress(chip.label, index)}
        style={[styles.chipTouch, index === CATEGORIES.length - 1 && { marginRight: 0 }]}
      >
        {isActive ? (
          <ActiveChip label={chip.label} color={chip.color} />
        ) : (
          <View style={[styles.inactiveChip, { borderColor: chip.color }]}>
            <Text weight="500" style={[styles.inactiveChipText, { color: chip.color }]}>{chip.label}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
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

        <View style={styles.canvas}>
          <Image
            source={require('../../../assets/medicines.webp')}
            style={styles.topFloatingImage}
            resizeMode="cover"
          />

          <View style={styles.insightsCardWrap}>
            <View style={styles.insightsCardShadowLayer}>
              <ImageBackground
                source={require('../../../assets/bg.webp')}
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
                  <ImageBackground
                    source={require('../../../assets/medicines.webp')}
                    style={styles.insightsBtn}
                    imageStyle={styles.insightsBtnImage}
                    resizeMode="cover"
                  >
                    <LinearGradient
                      colors={['rgba(177, 72, 255, 0.82)', 'rgba(246, 51, 155, 0.82)', 'rgba(153, 20, 249, 0.82)']}
                      locations={[0, 0.5, 1]}
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                      style={styles.insightsBtnOverlay}
                    >
                      <Text weight="600" style={styles.insightsBtnText}>View More</Text>
                    </LinearGradient>
                  </ImageBackground>
                </TouchableOpacity>
              </ImageBackground>
            </View>
          </View>

          <Image
            source={require('../../../assets/medicines2.webp')}
            style={styles.bottomFooterImage}
            resizeMode="cover"
          />
        </View>

        <Animated.View
          style={[
            {
              opacity: contentOpacityAnim,
              transform: [{ translateY: contentSlideAnim }],
            },
          ]}
        >
        </Animated.View>
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
    paddingBottom: 0,
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
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    overflow: 'hidden',
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
    overflow: 'hidden',
  },
  activeMedicineChipImage: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  activeMedicineChipOverlay: {
    ...StyleSheet.absoluteFillObject,
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
    zIndex: 2,
  },
  activeChipText: {
    fontSize: 11,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  activeMedicineText: {
    color: '#1D4ED8',
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
  canvas: {
    marginTop: -2,
    minHeight: 650,
    position: 'relative',
    backgroundColor: '#F3EFEB',
    overflow: 'hidden',
  },
  topFloatingImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    opacity: 0.5,
  },
  insightsCardWrap: {
    width: 323,
    minHeight: 129,
    alignSelf: 'center',
    marginTop: 265,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#BF7BB9',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 2,
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
    paddingHorizontal: 0,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  insightsBtnImage: {
    borderRadius: 8,
  },
  insightsBtnOverlay: {
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
  bottomFooterImage: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 105,
  },
});
