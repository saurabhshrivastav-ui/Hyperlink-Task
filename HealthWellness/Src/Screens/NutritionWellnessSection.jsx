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
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
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
  const isNutrition = label === 'Nutrition';

  return (
    <View style={styles.activeChipContainer}>
      <View style={[styles.activeChipSurface, { backgroundColor: isNutrition ? '#97D96D' : color }]} />
      <View style={styles.activeChipLabel}>
        <Text weight="600" style={[styles.activeChipText, isNutrition && styles.activeNutritionText]}>{label}</Text>
      </View>
    </View>
  );
};

const NutritionAction = ({ title, subtitle, color, icon, bg = '#F4F7F4', border = '#E2E8E2', variant = 'default', containerStyle }) => {
  if (variant === 'log') {
    return (
      <View style={[styles.logActionWrap, containerStyle]}>
        <View style={styles.logActionShadowLayer}>
          <TouchableOpacity activeOpacity={0.85} style={[styles.actionCard, styles.logActionCard]}>
            <LinearGradient
              colors={['#FFFFFF', '#E6FFE5']}
              locations={[0, 1]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.logActionGradient}
            >
              <View style={styles.actionTopRow}>
                <View style={styles.actionIcon}>{icon}</View>
              </View>
              <Text weight="600" style={[styles.actionTitle, { color }]}>{title}</Text>
              <Text weight="400" style={[styles.actionSub, { color }]}>{subtitle}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (variant === 'scanFood') {
    return (
      <View style={[styles.actionItem, containerStyle]}>
        <TouchableOpacity activeOpacity={0.85} style={[styles.actionCard, styles.logActionCard]}>
          <LinearGradient
            colors={['#FFFFFF', '#FFE7F4']}
            locations={[0, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.logActionGradient}
          >
            <View style={styles.actionTopRow}>
              <View style={styles.actionIcon}>{icon}</View>
            </View>
            <Text weight="600" style={[styles.actionTitle, { color }]}>{title}</Text>
            <Text weight="400" style={[styles.actionSub, { color }]}>{subtitle}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  if (variant === 'barcode') {
    return (
      <View style={[styles.logActionWrap, containerStyle]}>
        <View style={styles.logActionShadowLayer}>
          <TouchableOpacity activeOpacity={0.85} style={[styles.actionCard, styles.logActionCard]}>
            <LinearGradient
              colors={['#FFFFFF', '#FFFBE7']}
              locations={[0, 1]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.logActionGradient}
            >
              <View style={styles.actionTopRow}>
                <View style={styles.actionIcon}>{icon}</View>
              </View>
              <Text weight="600" style={[styles.actionTitle, { color }]}>{title}</Text>
              <Text weight="400" style={[styles.actionSub, { color }]}>{subtitle}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity activeOpacity={0.85} style={[styles.actionCard, { backgroundColor: bg, borderColor: border }]}> 
      <View style={styles.actionTopRow}>
        <View style={styles.actionIcon}>{icon}</View>
      </View>
      <Text weight="600" style={[styles.actionTitle, { color }]}>{title}</Text>
      <Text weight="400" style={[styles.actionSub, { color }]}>{subtitle}</Text>
    </TouchableOpacity>
  );
};

export default function NutritionWellnessSection({ onBack, onNavigateAll, onNavigateSleep, onNavigateFitness, onNavigateMedicine, onNavigateMentrual, hideHeader = false }) {
  const topOffset = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 18;
  const [active, setActive] = useState('Nutrition');

  const chipAnimMap = useRef(
    CATEGORIES.reduce((acc, item) => {
      acc[item.label] = new Animated.Value(item.label === 'Nutrition' ? 1 : 0);
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

    if (label === 'All' && typeof onNavigateAll === 'function') {
      onNavigateAll();
    }

    if (label === 'Sleep' && typeof onNavigateSleep === 'function') {
      onNavigateSleep();
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
                  style={[
                    styles.chipTouch,
                    index === CATEGORIES.length - 1 && { marginRight: 0 },
                  ]}
                >
                  <Animated.View style={{ transform: [{ scale }], width: '100%' }}>
                    {isActive ? (
                      <ActiveChip label={chip.label} color={chip.color} />
                    ) : (
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

        <LinearGradient
          colors={['#98D96D', 'rgba(186, 233, 160, 0.65)', 'rgba(222, 243, 210, 0.15)', 'rgba(243, 239, 235, 0)']}
          locations={[0, 0.35, 0.72, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.topSection}
        >
          <Image
            source={require('../../assets/fruits.webp')}
            style={styles.fruitOverlay}
            resizeMode="contain"
          />

          <View style={styles.goalHero}>
            <Text weight="700" style={styles.goalTitle}>Track your meals to maintain{`\n`}a balanced diet.</Text>
            <TouchableOpacity activeOpacity={0.85} style={styles.goalButtonWrap}>
              <LinearGradient
                colors={['#8BD25B', '#4DBA36', '#3AA72A']}
                locations={[0, 0.5, 1]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.goalButton}
              >
                <Text weight="600" style={styles.goalButtonText}>Set Goal</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.actionsRow}>
            <NutritionAction
              title="Log Meal"
              subtitle="Today: 2 meals logged"
              color="#18933B"
              icon={<MaterialCommunityIcons name="silverware-fork-knife" size={16} color="#18933B" />}
              variant="log"
              containerStyle={styles.actionItemSpacing}
            />
            <NutritionAction
              title="Scan Food"
              subtitle="Today: 3 scanned"
              color="#D63DAA"
              icon={<MaterialCommunityIcons name="food-apple-outline" size={16} color="#D63DAA" />}
              variant="scanFood"
              containerStyle={styles.actionItemSpacing}
            />
            <NutritionAction
              title="Scan Barcode"
              subtitle="Last: Protein Bar"
              color="#C67A06"
              icon={<MaterialCommunityIcons name="barcode-scan" size={16} color="#C67A06" />}
              variant="barcode"
            />
          </View>
        </LinearGradient>

        <View style={styles.dailyBlock}>
          <Text weight="700" style={styles.dailyTitle}>Your Daily Calorie Target</Text>
          <LinearGradient
            colors={['#EEF9FF', '#C3EAFF', '#DBF3FF']}
            locations={[0.0016, 0.5, 0.9984]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.dailyCard}
          >
            <View style={styles.dailyIconWrap}>
              <Image
                source={require('../../assets/foodplate.webp')}
                style={styles.dailyPlateImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.dailyContent}>
              <Text weight="700" style={styles.dailyCardTitle}>Know your daily calorie needs</Text>
              <Text weight="400" style={styles.dailyCardSub}>Get personalized calorie intake based on your body & lifestyle</Text>
              <View style={styles.chipHintRow}>
                <View style={styles.hintChip}><Text weight="500" style={styles.hintChipText}>Maintain weight</Text></View>
                <View style={styles.hintChip}><Text weight="500" style={styles.hintChipText}>Lose fat</Text></View>
                <View style={styles.hintChip}><Text weight="500" style={styles.hintChipText}>Build muscle</Text></View>
              </View>
              <TouchableOpacity style={styles.calcBtnWrap} activeOpacity={0.85}>
                <LinearGradient
                  colors={['#B148FF', '#F6339B', '#9914F9']}
                  locations={[0, 0.5, 1]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.calcBtn}
                >
                  <Text weight="600" style={styles.calcBtnText}>Calculate Now</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
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
  activeNutritionText: {
    color: '#197C2E',
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
    paddingTop: 10,
    paddingBottom: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  goalHero: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 160,
    paddingHorizontal: 20,
    zIndex: 2,
  },
  fruitOverlay: {
    position: 'absolute',
    left: -21,
    top: 0,
    width: 400.2942199707031,
    height: 215.2324676513672,
    opacity: 0.6,
    zIndex: 1,
  },
  goalTitle: {
    fontSize: 16,
    lineHeight: 22,
    color: '#1D8B31',
    textAlign: 'center',
  },
  goalButtonWrap: {
    marginTop: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  goalButton: {
    minWidth: 88,
    minHeight: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  goalButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
  },
  actionsRow: {
    marginTop: 6,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    zIndex: 2,
  },
  actionItem: {
    flex: 1,
  },
  actionItemSpacing: {
    marginRight: 8,
  },
  actionCard: {
    flex: 1,
    minHeight: 66,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  logActionWrap: {
    flex: 1,
    borderRadius: 12,
    shadowColor: '#BF7BB9',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  logActionShadowLayer: {
    flex: 1,
    borderRadius: 12,
    shadowColor: '#F3E6F2',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 1,
  },
  logActionCard: {
    backgroundColor: 'transparent',
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  logActionGradient: {
    flex: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  actionTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    marginBottom: 2,
  },
  actionTitle: {
    marginTop: 2,
    fontSize: 14,
    lineHeight: 18,
  },
  actionSub: {
    marginTop: 2,
    fontSize: 10,
    lineHeight: 12,
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
    width: 356,
    minHeight: 120,
    alignSelf: 'center',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#C7E5FC',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  dailyIconWrap: {
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dailyPlateImage: {
    width: 112,
    height: 112,
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
    marginBottom: 6,
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
    borderRadius: 4,
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  calcBtn: {
    minWidth: 88,
    height: 24,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  calcBtnText: {
    fontSize: 10,
    lineHeight: 11,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
