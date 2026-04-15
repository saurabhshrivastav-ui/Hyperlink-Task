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
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '../../components/TextWrapper';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_PADDING = 10;
const CHIP_GAP = 6;
const TOTAL_GAPS_WIDTH = CHIP_GAP * 5;
const AVAILABLE_WIDTH = SCREEN_WIDTH - (HORIZONTAL_PADDING * 2) - TOTAL_GAPS_WIDTH;
const CHIP_WIDTH = Math.floor(AVAILABLE_WIDTH / 6);
const CHIP_HEIGHT = 36;
const FITNESS_LAYER_TOP = '#FFD890';
const SUN_RAY_COUNT = 30;

const CATEGORIES = [
  { label: 'All', color: '#CD8CFF' },
  { label: 'Sleep', color: '#5B3DBA' },
  { label: 'Nutrition', color: '#16A34A' },
  { label: 'Fitness', color: '#EA580C' },
  { label: 'Medicine', color: '#1D4ED8' },
  { label: 'Mentrual', color: '#DB2777' },
];

const ActiveChip = ({ label, color }) => {
  const isFitness = label === 'Fitness';

  return (
    <View style={styles.activeChipContainer}>
      <View style={[styles.activeChipSurface, { backgroundColor: isFitness ? FITNESS_LAYER_TOP : color }]} />
      <View style={styles.activeChipLabel}>
        <Text weight="600" style={[styles.activeChipText, isFitness && styles.activeFitnessText]}>{label}</Text>
      </View>
    </View>
  );
};

const FitnessAction = ({ icon, title, subtitle, titleColor, variant = 'default', containerStyle }) => {
  if (variant !== 'default') {
    const gradientMap = {
      log: ['#FFFFFF', '#FDEEE2'],
      start: ['#FFFFFF', '#FDE7F1'],
      devices: ['#F8F4FF', '#E7EDFC'],
    };

    return (
      <View style={[styles.logActionWrap, containerStyle]}>
        <View style={styles.logActionShadowLayer}>
          <TouchableOpacity activeOpacity={0.85} style={[styles.actionCard, styles.logActionCard]}>
            <LinearGradient
              colors={gradientMap[variant]}
              locations={[0, 1]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.logActionGradient}
            >
              <View style={styles.actionIcon}>{icon}</View>
              <Text weight="600" style={[styles.actionTitle, { color: titleColor }]}>{title}</Text>
              <Text weight="400" style={styles.actionSub}>{subtitle}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity activeOpacity={0.85} style={[styles.actionCard, containerStyle]}>
      <View style={styles.actionIcon}>{icon}</View>
      <Text weight="600" style={[styles.actionTitle, { color: titleColor }]}>{title}</Text>
      <Text weight="400" style={styles.actionSub}>{subtitle}</Text>
    </TouchableOpacity>
  );
};

export default function FitnessWellnessSection({
  onBack,
  onNavigateAll,
  onNavigateSleep,
  onNavigateNutrition,
  onNavigateMedicine,
  onNavigateMentrual,
  hideHeader = false,
}) {
  const topOffset = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 18;
  const [active, setActive] = useState('Fitness');

  const chipAnimMap = useRef(
    CATEGORIES.reduce((acc, item) => {
      acc[item.label] = new Animated.Value(item.label === 'Fitness' ? 1 : 0);
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
    if (label === 'Nutrition' && typeof onNavigateNutrition === 'function') {
      onNavigateNutrition();
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

        <View style={styles.topSection}>
          <LinearGradient
            colors={['#FFD890', '#FFF5FF']}
            locations={[0.0207, 0.9793]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.topSectionBackdrop}
          />

          <View style={styles.heroWrap}>
            <LinearGradient
              colors={['#E48A22', '#F6AF55', '#FFE0BA']}
              locations={[0, 0.6, 1]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.heroCard}
            >
              <View style={styles.heroContentLeft}>
                <Text weight="700" style={styles.heroTitle}>Hi, Sakshi!</Text>
                <Text weight="500" style={styles.heroSub}>Set your Fitness Goal</Text>

                <View style={styles.heroBtnShadowOuter}>
                  <TouchableOpacity activeOpacity={0.85} style={styles.heroBtnWrap}>
                    <LinearGradient
                      colors={['#E99331', '#FFAF59', '#D47709']}
                      locations={[0.0003, 0.5, 0.9997]}
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                      style={styles.heroBtn}
                    >
                      <Text weight="600" style={styles.heroBtnText}>Set Goal</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.runnerIconWrap}>
                <Image
                  source={require('../../assets/running.webp')}
                  style={styles.runnerCharacter}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.sunTrackClip}>
                <View style={styles.sunBurstWrap}>
                  {Array.from({ length: SUN_RAY_COUNT }).map((_, idx) => {
                    const angle = -90 + (idx * 180) / (SUN_RAY_COUNT - 1);

                    return (
                      <View
                        key={`ray-${idx}`}
                        style={[
                          styles.sunRay,
                          {
                            transform: [{ rotate: `${angle}deg` }, { translateY: -56 }],
                          },
                        ]}
                      />
                    );
                  })}

                  <View style={styles.sunBurstOuter} />
                  <View style={styles.sunBurstInner} />
                </View>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.actionsRow}>
            <FitnessAction
              icon={<MaterialCommunityIcons name="run" size={14} color="#E67E22" />}
              title="Log Activity"
              subtitle="Lost :45min walk"
              titleColor="#E67E22"
              variant="log"
              containerStyle={styles.actionItemSpacing}
            />
            <FitnessAction
              icon={<MaterialCommunityIcons name="timer-refresh" size={14} color="#EF4444" />}
              title="Start Activity"
              subtitle="Lost :45min wk"
              titleColor="#EF4444"
              variant="start"
              containerStyle={styles.actionItemSpacing}
            />
            <FitnessAction
              icon={<Feather name="link" size={14} color="#2563EB" />}
              title="Devices"
              subtitle="1 Connected"
              titleColor="#2563EB"
              variant="devices"
            />
          </View>
        </View>

        <View style={styles.activitySection}>
          <Text weight="700" style={styles.activityTitle}>Today's Activities</Text>
          <Text weight="500" style={styles.activityEmpty}>No Activity Logged</Text>
          <TouchableOpacity activeOpacity={0.85} style={[styles.logBtnWrap, styles.activityLogBtnWrap]}>
            <LinearGradient
              colors={['#F3BA64', '#D87E18']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.logBtn}
            >
              <Text weight="600" style={styles.logBtnText}>Log Activity</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.deviceCardWrap}>
          <LinearGradient
            colors={['#EBF2FF', '#9CBBF2']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.deviceCard}
          >
            <View style={styles.deviceTextWrap}>
              <Text weight="700" style={styles.deviceTitle}>Connect Device</Text>
              <Text weight="400" style={styles.deviceSub}>Log activities through devices</Text>
              <TouchableOpacity activeOpacity={0.85} style={styles.logBtnWrap}>
                <LinearGradient
                  colors={['#F3BA64', '#D87E18']}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.logBtn}
                >
                  <Text weight="600" style={styles.logBtnText}>Log Activity</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View style={styles.watchWrap}>
              <Image
                source={require('../../assets/watch.webp')}
                style={styles.watchImage}
                resizeMode="contain"
              />
            </View>
          </LinearGradient>
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
  activeFitnessText: {
    color: '#D87E18',
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
    paddingHorizontal: 20,
    paddingTop: 28,
  },
  topSection: {
    marginTop: 0,
    paddingBottom: 12,
    backgroundColor: 'transparent',
    position: 'relative',
    overflow: 'hidden',
  },
  topSectionBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroCard: {
    borderRadius: 24,
    minHeight: 188,
    backgroundColor: '#F8AF41',
    paddingHorizontal: 18,
    paddingVertical: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  heroContentLeft: {
    width: '56%',
  },
  heroTitle: {
    fontSize: 20,
    lineHeight: 26,
    color: '#141414',
  },
  heroSub: {
    marginTop: 4,
    fontSize: 18,
    lineHeight: 22,
    color: '#141414',
  },
  heroBtnShadowOuter: {
    marginTop: 28,
    alignSelf: 'flex-start',
    borderRadius: 12,
    shadowColor: '#BF7BB9',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  heroBtnWrap: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#F3E6F2',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 1,
  },
  heroBtn: {
    minWidth: 136,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  heroBtnText: {
    fontSize: 14,
    lineHeight: 16,
    color: '#FFFFFF',
  },
  runnerIconWrap: {
    position: 'absolute',
    top: 10,
    right: 34,
  },
  runnerCharacter: {
    width: 86,
    height: 114,
  },
  sunTrackClip: {
    position: 'absolute',
    right: -11,
    bottom: -10,
    width: 208,
    height: 96,
    overflow: 'hidden',
  },
  sunBurstWrap: {
    position: 'absolute',
    left: 0,
    bottom: -104,
    width: 208,
    height: 208,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sunRay: {
    position: 'absolute',
    width: 4,
    height: 36,
    borderRadius: 2,
    backgroundColor: '#F9E3BA',
    top: '50%',
    left: '50%',
    marginLeft: -2,
    marginTop: -18,
  },
  sunBurstOuter: {
    width: 118,
    height: 118,
    borderRadius: 59,
    borderWidth: 3,
    borderColor: '#F9E3BA',
    backgroundColor: '#F8AF41',
  },
  sunBurstInner: {
    position: 'absolute',
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 2,
    borderColor: '#F9E3BA',
    borderStyle: 'dashed',
  },
  actionsRow: {
    marginTop: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  actionItemSpacing: {
    marginRight: 8,
  },
  logActionWrap: {
    flex: 1,
    borderRadius: 10,
    shadowColor: '#BF7BB9',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  logActionShadowLayer: {
    flex: 1,
    borderRadius: 10,
    shadowColor: '#F3E6F2',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 1,
  },
  actionCard: {
    flex: 1,
    height: 64,
    borderRadius: 10,
    backgroundColor: '#F3F2FB',
    borderWidth: 1,
    borderColor: '#E6E7F0',
    paddingHorizontal: 8,
    paddingVertical: 6,
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
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  actionIcon: {
    marginBottom: 2,
  },
  actionTitle: {
    fontSize: 13,
    lineHeight: 17,
  },
  actionSub: {
    fontSize: 9,
    lineHeight: 12,
    color: '#6B7280',
  },
  activitySection: {
    marginTop: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  activityTitle: {
    width: '100%',
    textAlign: 'left',
    fontSize: 19,
    lineHeight: 22,
    color: '#1F2937',
  },
  activityEmpty: {
    marginTop: 14,
    fontSize: 13,
    color: '#1F2937',
  },
  logBtnWrap: {
    marginTop: 8,
    borderRadius: 6,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  activityLogBtnWrap: {
    alignSelf: 'center',
  },
  logBtn: {
    minWidth: 86,
    height: 22,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  logBtnText: {
    fontSize: 10,
    color: '#FFFFFF',
  },
  deviceCardWrap: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  deviceCard: {
    width: 323,
    height: 105,
    alignSelf: 'center',
    position: 'relative',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  deviceTextWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 84,
  },
  deviceTitle: {
    fontSize: 23,
    lineHeight: 20,
    color: '#111827',
  },
  deviceSub: {
    marginTop: 3,
    fontSize: 11,
    lineHeight: 14,
    color: '#111827',
  },
  watchWrap: {
    position: 'absolute',
    left: 259,
    top: -1,
    width: 60.768760681152344,
    height: 107.99393463134766,
    alignItems: 'center',
    justifyContent: 'center',
  },
  watchImage: {
    width: 60.768760681152344,
    height: 107.99393463134766,
  },
  insightsCardWrap: {
    width: 323,
    height: 129,
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
