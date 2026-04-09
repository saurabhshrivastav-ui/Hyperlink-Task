import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Animated,
  Easing,
  TextInput,
  Keyboard,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../components/TextWrapper';
import { enrollBiometricProfile, getBiometricProfile, setVaultPin } from '../services/biometricSecurity';

const { width } = Dimensions.get('window');
const isMini = width <= 360;
const isSmall = width <= 390;

const AddRepoImg    = require('../../assets/AddRepo.webp');
const PrivacyImg    = require('../../assets/PrivacyandAccess.webp');
const Health360Img  = require('../../assets/Health360.webp');
const FolderBackImg = require('../../assets/Rectangle 3464919.webp');
const FolderFrontImg = require('../../assets/Rectangle 3464918.webp');


const CATEGORIES = [
  { label: 'Test Reports', color: '#06B6D4' },
  { label: 'Genomic Reports', color: '#7C3AED' },
  { label: 'Vaccine Certificates', color: '#EC4899' },
  { label: 'Prescriptions', color: '#F59E0B' },
  { label: 'Other Reports', color: '#DC2626' },
];

const STATS = [
  {
    key: 'files',
    value: '20',
    label: 'Total Files',
    icon: 'file-multiple-outline',
    accent: '#7C3AED',
    iconColors: ['#EEE8FF', '#DCD3FF'],
  },
  {
    key: 'storage',
    value: '1.5 GB',
    label: 'Storage',
    icon: 'cloud-outline',
    accent: '#6D28D9',
    iconColors: ['#EFE9FF', '#DDD3FF'],
  },
  {
    key: 'shared',
    value: '12',
    label: 'Shared',
    icon: 'share-variant-outline',
    accent: '#7C3AED',
    iconColors: ['#EEE8FF', '#DCD3FF'],
  },
];

export default function HyperVaultHome({ navigation }) {
  const [expanded, setExpanded] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isBiometricEnrolled, setIsBiometricEnrolled] = useState(false);
  // ── Biometric tray ──
  const [trayOpen, setTrayOpen] = useState(false);
  const trayAnim = useRef(new Animated.Value(800)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  const openTray = () => {
    setTrayOpen(true);
    Animated.parallel([
      Animated.spring(trayAnim, { toValue: 0, useNativeDriver: true, bounciness: 4, speed: 14 }),
      Animated.timing(overlayAnim, { toValue: 1, duration: 280, useNativeDriver: true }),
    ]).start();
  };

  const closeTray = () => {
    Animated.parallel([
      Animated.timing(trayAnim, { toValue: 800, duration: 260, useNativeDriver: true }),
      Animated.timing(overlayAnim, { toValue: 0, duration: 240, useNativeDriver: true }),
    ]).start(() => setTrayOpen(false));
  };

  const [showSuccess, setShowSuccess] = useState(false);

  // ── Folder open/close animation ──
  const [folderOpen, setFolderOpen] = useState(false);
  const folderAnim = useRef(new Animated.Value(0)).current;

  const toggleFolder = () => {
    const toValue = folderOpen ? 0 : 1;
    setFolderOpen((prev) => !prev);
    Animated.timing(folderAnim, {
      toValue,
      duration: folderOpen ? 380 : 640,
      easing: folderOpen
        ? Easing.bezier(0.4, 0.0, 0.2, 1)
        : Easing.bezier(0.2, 0.9, 0.25, 1),
      useNativeDriver: true,
    }).start();
  };

  // Both rectangles are ALWAYS at the same fixed position.
  // Closed = back + front visible, tabs hidden.
  // Open   = tabs slide up from inside the folder.
  const tabsOpacity      = folderAnim.interpolate({ inputRange: [0, 0.16, 0.48, 1], outputRange: [0, 0, 0.72, 1] });
  const tabsTranslateY   = folderAnim.interpolate({ inputRange: [0, 0.66, 1], outputRange: [220, -18, 0] });
  const tabsScale        = folderAnim.interpolate({ inputRange: [0, 0.7, 1], outputRange: [0.9, 1.02, 1] });
  const frontTextOpacity = folderAnim.interpolate({ inputRange: [0, 0.6, 1], outputRange: [0, 0, 1] });
  const chevronRotate    = folderAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const backScale        = folderAnim.interpolate({ inputRange: [0, 0.72, 1], outputRange: [1, 1.03, 1.018] });
  const backLift         = folderAnim.interpolate({ inputRange: [0, 0.72, 1], outputRange: [0, -7, -5] });
  const frontDrop        = folderAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 14] });
  const frontScale       = folderAnim.interpolate({ inputRange: [0, 0.56, 1], outputRange: [1, 1.05, 1] });
  const frontTilt        = folderAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-1.5deg'] });
  const focusHaloOpacity = folderAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.05, 0.12, 0.2] });
  const focusHaloScale = folderAnim.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1.06] });
  const blurVeilOpacity = folderAnim.interpolate({ inputRange: [0, 0.48, 1], outputRange: [0.14, 0.05, 0] });
  const containerExpand = folderAnim.interpolate({ inputRange: [0, 0.68, 1], outputRange: [1, 1.015, 1.01] });

  // pixel constants (folder is centred in the full-width container)
  const FOLDER_W    = 270;
  const FOLDER_LEFT = (width - FOLDER_W) / 2;
  const BACK_TOP    = 150;
  const BACK_H      = 218;
  const NOTCH_H     = 34;           // restore original folder geometry
  const FRONT_TOP   = BACK_TOP + NOTCH_H;
  const FRONT_H     = BACK_H  - NOTCH_H;
  const TABS_TOP    = 18;
  const TABS_H      = FRONT_TOP - TABS_TOP - 4;

  // ── PIN setup tray ──
  const [pinTrayOpen, setPinTrayOpen] = useState(false);
  const pinTrayAnim = useRef(new Animated.Value(800)).current;
  const keyboardAnim = useRef(new Animated.Value(0)).current;
  const [pin, setPin] = useState(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
  const pinRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const confirmRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) => {
      Animated.timing(keyboardAnim, {
        toValue: e.endCoordinates.height,
        duration: Platform.OS === 'ios' ? e.duration : 200,
        useNativeDriver: true,
      }).start();
    });

    const hideSub = Keyboard.addListener(hideEvent, (e) => {
      Animated.timing(keyboardAnim, {
        toValue: 0,
        duration: Platform.OS === 'ios' ? e.duration : 200,
        useNativeDriver: true,
      }).start();
    });

    return () => { showSub.remove(); hideSub.remove(); };
  }, []);

  useEffect(() => {
    const hydrateBiometricProfile = async () => {
      const profile = await getBiometricProfile();
      if (profile?.fingerprintId) {
        setIsBiometricEnrolled(true);
      }
    };

    hydrateBiometricProfile();
  }, []);

  const handleEnrollFingerprint = async () => {
    try {
      setIsEnrolling(true);
      await enrollBiometricProfile();
      setIsBiometricEnrolled(true);
      closeTray();
      setShowSuccess(true);
    } catch (error) {
      Alert.alert('Biometric Setup', error.message || 'Unable to enroll fingerprint right now.');
    } finally {
      setIsEnrolling(false);
    }
  };

  const openPinTray = () => {
    closeTray();
    setPinTrayOpen(true);
    Animated.spring(pinTrayAnim, { toValue: 0, useNativeDriver: true, bounciness: 4, speed: 14 }).start();
  };

  const closePinTray = (onDone) => {
    Animated.timing(pinTrayAnim, { toValue: 800, duration: 260, useNativeDriver: true })
      .start(() => { setPinTrayOpen(false); onDone && onDone(); });
  };

  const handleEnterPinChange = (text, index) => {
    const nextDigit = text.slice(-1);
    setPin((prev) => {
      const next = [...prev];
      next[index] = nextDigit;
      return next;
    });

    if (nextDigit && index < 3) {
      pinRefs[index + 1].current?.focus();
    }
  };

  const handleConfirmPinChange = (text, index) => {
    const nextDigit = text.slice(-1);
    setConfirmPin((prev) => {
      const next = [...prev];
      next[index] = nextDigit;
      return next;
    });

    if (nextDigit && index < 3) {
      confirmRefs[index + 1].current?.focus();
    }
  };

  const handlePinBack = (e, index, arr, refs) => {
    if (e.nativeEvent.key === 'Backspace' && !arr[index] && index > 0) {
      refs[index - 1].current?.focus();
    }
  };

  const handleSetPinAndLock = async () => {
    const enteredPin = pin.join('');
    const confirmedPin = confirmPin.join('');

    if (enteredPin.length !== 4 || confirmedPin.length !== 4) {
      Alert.alert('PIN Required', 'Please enter and confirm a full 4-digit PIN.');
      return;
    }

    if (enteredPin !== confirmedPin) {
      Alert.alert('PIN Mismatch', 'Confirm PIN must match the entered 4-digit PIN.');
      return;
    }

    try {
      await setVaultPin(enteredPin);
      closePinTray();
      setShowSuccess(true);
    } catch (error) {
      Alert.alert('PIN Setup', error.message || 'Unable to save PIN right now.');
    }
  };

  const handleStatPress = (key) => {
    if (key === 'files') {
      navigation && navigation.navigate('TestReports');
      return;
    }

    if (key === 'shared') {
      navigation && navigation.navigate('SharedRecords');
      return;
    }

    Alert.alert('Storage', 'You are currently using 1.5 GB in HyperVault.');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header — extends behind status bar */}
        <ImageBackground
          source={require('../../assets/HeaderTestReports.webp')}
          style={styles.headerBackground}
          imageStyle={styles.headerImage}
          resizeMode="cover"
          fadeDuration={0}
        >
          {/* Status bar spacer */}
          <View style={styles.statusBarSpacer} />

          {/* Header content row */}
          <View style={styles.headerRow}>
            {/* Left: back arrow + title block */}
            <View style={styles.headerLeft}>
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => navigation && navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={20} color="#5B21B6" />
              </TouchableOpacity>
              <View style={styles.headerTitleBlock}>
                <Text style={styles.headerTitle} weight="700">HyperVault</Text>
                <Text style={styles.headerSubtitle} weight="400">
                  Securely store and manage your health documents.
                </Text>
              </View>
            </View>

            {/* Right: Secure Vault */}
            <TouchableOpacity
              style={styles.secureVaultBtn}
              onPress={openTray}
            >
              <View style={styles.lockBox}>
                <Ionicons name="lock-closed" size={24} color="#6D28D9" />
              </View>
              <Text style={styles.secureVaultText} weight="600">Secure Vault</Text>
            </TouchableOpacity>
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
          <LinearGradient
            colors={['#FFFFFF', '#FBF9FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statsRow}
          >
            {STATS.map((stat, index) => (
              <React.Fragment key={stat.key}>
                <TouchableOpacity
                  style={styles.statItem}
                  activeOpacity={0.86}
                  onPress={() => handleStatPress(stat.key)}
                >
                  <LinearGradient
                    colors={stat.iconColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.statIconBox}
                  >
                    <MaterialCommunityIcons name={stat.icon} size={19} color={stat.accent} />
                  </LinearGradient>
                  <Text style={styles.statValue} weight="800">{stat.value}</Text>
                  <Text style={styles.statLabel} weight="500">{stat.label}</Text>
                </TouchableOpacity>
                {index < STATS.length - 1 ? <View style={styles.statDivider} /> : null}
              </React.Fragment>
            ))}
          </LinearGradient>

          {/* Quick Actions */}
          <Text style={styles.sectionTitle} weight="700">Quick Actions</Text>
          <View style={styles.quickActionsRow}>
            {/* Add Reports — blue */}
            <TouchableOpacity style={styles.qaCardWrap} activeOpacity={0.85}>
              <LinearGradient
                colors={['#CDE8FF', '#FFF8EF', '#CDE8FF']}
                locations={[0.1392, 0.5067, 0.8743]}
                start={{ x: 0.34, y: 0.03 }}
                end={{ x: 0.66, y: 0.97 }}
                style={styles.qaCard}
              >
                <Image source={AddRepoImg} style={styles.qaImage} resizeMode="contain" />
                <Text style={styles.qaTitle} weight="700">Add Reports</Text>
                <Text style={styles.qaSubtitle} weight="400">Download and store certificates & records</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Privacy & Access — warm orange */}
            <TouchableOpacity style={styles.qaCardWrap} activeOpacity={0.85}>
              <LinearGradient
                colors={['#FFE9CA', '#FFF8EF', '#FFE9CA']}
                locations={[0.1392, 0.5067, 0.8743]}
                start={{ x: 0.34, y: 0.03 }}
                end={{ x: 0.66, y: 0.97 }}
                style={styles.qaCard}
              >
                <Image source={PrivacyImg} style={styles.qaImage} resizeMode="contain" />
                <Text style={styles.qaTitle} weight="700">Privacy & Access</Text>
                <Text style={styles.qaSubtitle} weight="400">View upcoming docs and remedies.</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Health 360 — coral */}
            <TouchableOpacity style={styles.qaCardWrap} activeOpacity={0.85}>
              <LinearGradient
                colors={['#FFD3CA', '#FFF8EF', '#FFD3CA']}
                locations={[0.1392, 0.5067, 0.8743]}
                start={{ x: 0.34, y: 0.03 }}
                end={{ x: 0.66, y: 0.97 }}
                style={styles.qaCard}
              >
                <Image source={Health360Img} style={styles.qaImage} resizeMode="contain" />
                <Text style={styles.qaTitle} weight="700">Health 360</Text>
                <Text style={styles.qaSubtitle} weight="400">Share vaccination proof for travel, school, or work.</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Categories */}
          <Text style={styles.sectionTitle} weight="700">Categories</Text>
          <Animated.View style={[styles.categoriesContainer, { transform: [{ scale: containerExpand }] }]}> 

            <Animated.View
              pointerEvents="none"
              style={[
                styles.folderFocusHalo,
                {
                  top: BACK_TOP - 18,
                  left: FOLDER_LEFT - 14,
                  width: FOLDER_W + 28,
                  height: BACK_H + 42,
                  opacity: focusHaloOpacity,
                  transform: [{ scale: focusHaloScale }],
                },
              ]}
            />

            {/* ── Back rectangle image ── */}
            <Animated.View
              style={[
                styles.folderBack,
                {
                  top: BACK_TOP,
                  left: FOLDER_LEFT,
                  width: FOLDER_W,
                  height: BACK_H,
                  opacity: Animated.add(0.78, Animated.multiply(folderAnim, 0.22)),
                  transform: [{ translateY: backLift }, { scale: backScale }],
                },
              ]}
            >
              <Image
                source={FolderBackImg}
                style={styles.folderBackImage}
                resizeMode="cover"
                resizeMethod="resize"
                fadeDuration={0}
              />
              <LinearGradient
                colors={['rgba(255,255,255,0.32)', 'rgba(255,255,255,0.06)', 'rgba(48, 24, 94, 0.06)']}
                locations={[0, 0.5, 1]}
                style={styles.folderBackTint}
                pointerEvents="none"
              />
              <View pointerEvents="none" style={styles.folderBackEdge} />
            </Animated.View>

            {/* ── Tabs — slide up from inside the folder ── */}
            <Animated.View
              style={[
                styles.folderTabs,
                {
                  top: TABS_TOP,
                  left: FOLDER_LEFT + 10,
                  width: FOLDER_W - 20,
                  height: TABS_H,
                  opacity: tabsOpacity,
                  transform: [{ translateY: tabsTranslateY }, { scale: tabsScale }],
                },
              ]}
              pointerEvents={folderOpen ? 'auto' : 'none'}
            >
              <Animated.View pointerEvents="none" style={[styles.tabsBlurVeil, { opacity: blurVeilOpacity }]} />
              <View style={styles.tabsScrollContent}>
                {CATEGORIES.map((cat, index) => (
                  (() => {
                    const revealPoint = 0.18 + index * 0.08;
                    const settlePoint = Math.min(revealPoint + 0.28, 1);
                    const tabLift = folderAnim.interpolate({
                      inputRange: [0, revealPoint, settlePoint, 1],
                      outputRange: [0, 0, index * 28, index * 24],
                    });
                    const tabScale = folderAnim.interpolate({
                      inputRange: [0, revealPoint, 1],
                      outputRange: [0.94, 0.94, 1],
                    });
                    const tabOpacity = folderAnim.interpolate({
                      inputRange: [0, revealPoint + 0.03, 1],
                      outputRange: [0, 0.55, 1],
                    });

                    return (
                  <TouchableOpacity
                    key={cat.label}
                    style={[
                      styles.categoryTab,
                      index === 0 && styles.testReportsTab,
                      index === 1 && styles.genomicTab,
                      index === 2 && styles.vaccineTab,
                      index === 3 && styles.prescriptionTab,
                      index === 4 && styles.otherReportsTab,
                      {
                        zIndex: index,
                        marginTop: 0,
                        marginBottom: -42,
                        opacity: tabOpacity,
                        transform: [{ translateY: tabLift }, { scale: tabScale }],
                      },
                    ]}
                    onPress={() => cat.label === 'Test Reports' && navigation && navigation.navigate('TestReports')}
                  >
                    <View
                      style={[
                        styles.categoryTopStrip,
                        { backgroundColor: '#64D3FF' },
                        index === 1 && { backgroundColor: '#8B67F8' },
                        index === 2 && { backgroundColor: '#F857A6' },
                        index === 3 && { backgroundColor: '#FAA018' },
                        index === 4 && { backgroundColor: '#B30000' },
                      ]}
                    />
                    <Animated.View pointerEvents="none" style={[styles.categoryBlurVeil, { opacity: blurVeilOpacity }]} />
                    <Text style={styles.categoryTabText} weight="700">{cat.label}</Text>
                  </TouchableOpacity>
                    );
                  })()
                ))}
              </View>
            </Animated.View>

            {/* ── Front rectangle image (tappable) ── */}
            <Animated.View
              style={[
                styles.folderFrontWrap,
                {
                  top: FRONT_TOP,
                  left: FOLDER_LEFT,
                  width: FOLDER_W,
                  height: FRONT_H,
                  transform: [
                    { perspective: 1200 },
                    { translateY: frontDrop },
                    { scale: frontScale },
                    { rotateX: frontTilt },
                  ],
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={toggleFolder}
                style={styles.folderFront}
              >
                <Image
                  source={FolderFrontImg}
                  style={styles.folderFrontImage}
                  resizeMode="cover"
                  resizeMethod="resize"
                  fadeDuration={0}
                />
                <LinearGradient
                  colors={['rgba(255,255,255,0.44)', 'rgba(255,255,255,0.12)', 'rgba(49, 46, 129, 0.04)']}
                  locations={[0, 0.35, 1]}
                  style={styles.folderFrontGloss}
                  pointerEvents="none"
                />
                <View pointerEvents="none" style={styles.folderFrontEdge} />
                <Animated.View style={[styles.recordsOverlay, { opacity: frontTextOpacity }]}> 
                  <Text style={styles.recordsTitle} weight="800">Records</Text>
                  <View style={styles.recordsCountRow}>
                    <Text style={styles.recordsCountNumber} weight="900">12</Text>
                    <Text style={styles.recordsCountLabel} weight="600"> Files</Text>
                  </View>
                  <Animated.View style={{ transform: [{ rotate: chevronRotate }], marginTop: 4 }}>
                    <Ionicons name="chevron-up" size={18} color="#DDD6FE" />
                  </Animated.View>
                </Animated.View>
              </TouchableOpacity>
            </Animated.View>

          </Animated.View>

        </View>
      </ScrollView>

      {/* ── Dim overlay ── */}
      {trayOpen && (
        <Animated.View style={[styles.overlay, { opacity: overlayAnim }]}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={closeTray} />
        </Animated.View>
      )}

      {/* ── Biometric tray ── */}
      <Animated.View style={[styles.tray, { transform: [{ translateY: trayAnim }] }]}>
        <LinearGradient
          colors={['#E4CCF7', '#FFE9CF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.trayGradient}
        >
          <View style={styles.trayHandle} />
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.trayScroll}
          >
            <Text style={styles.trayTitle} weight="700">Secure Your Health Vault</Text>
            <Text style={styles.traySubtitle} weight="700">
              Add biometrics to keep your health data private.
            </Text>

            <TouchableOpacity
              style={styles.trayIconWrap}
              onPress={handleEnrollFingerprint}
              disabled={isEnrolling}
              activeOpacity={0.8}
            >
              <Ionicons name="finger-print" size={80} color="#4338CA" />
            </TouchableOpacity>

            <Text style={styles.traySensorText} weight="400">
              {isEnrolling
                ? 'Scanning fingerprint...'
                : isBiometricEnrolled
                  ? 'Fingerprint enrolled. Tap icon to scan again.'
                  : 'Tap fingerprint icon to scan and secure vault.'}
            </Text>

            <Text style={styles.trayOrText} weight="400">or</Text>

            <TouchableOpacity onPress={openPinTray}>
              <Text style={styles.trayUsePinText} weight="700">Use Pin</Text>
            </TouchableOpacity>
          </ScrollView>
        </LinearGradient>
      </Animated.View>

      {/* ── PIN setup tray ── */}
      {pinTrayOpen && (
        <Animated.View style={[styles.tray, styles.pinTrayZ, { transform: [{ translateY: Animated.subtract(pinTrayAnim, keyboardAnim) }] }]}>
          <LinearGradient
            colors={['#E4CCF7', '#FFE9CF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.trayGradient}
          >
            <View style={styles.trayHandle} />
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.trayScroll}
            >
              <Text style={styles.trayTitle} weight="700">Secure Your Health Vault</Text>
              <Text style={styles.traySubtitle} weight="700">
                Add a 4-digit PIN to keep your health data private.
              </Text>

              <Text style={styles.pinLabel} weight="400">Enter 4 digit pin here</Text>
              <View style={styles.pinRow}>
                {pin.map((digit, i) => (
                  <View key={i} style={styles.pinBox}>
                    <TextInput
                      ref={pinRefs[i]}
                      style={styles.pinInput}
                      value={digit}
                      onChangeText={(t) => handleEnterPinChange(t, i)}
                      onKeyPress={(e) => handlePinBack(e, i, pin, pinRefs)}
                      keyboardType="number-pad"
                      maxLength={1}
                      caretHidden
                      selectionColor="#4338CA"
                    />
                  </View>
                ))}
              </View>

              <Text style={styles.pinLabel} weight="400">Confirm Pin</Text>
              <View style={styles.pinRow}>
                {confirmPin.map((digit, i) => (
                  <View key={i} style={styles.pinBox}>
                    <TextInput
                      ref={confirmRefs[i]}
                      style={styles.pinInput}
                      value={digit}
                      onChangeText={(t) => handleConfirmPinChange(t, i)}
                      onKeyPress={(e) => handlePinBack(e, i, confirmPin, confirmRefs)}
                      keyboardType="number-pad"
                      maxLength={1}
                      caretHidden
                      selectionColor="#4338CA"
                    />
                  </View>
                ))}
              </View>

              <TouchableOpacity style={styles.setPinBtn} activeOpacity={0.85} onPress={handleSetPinAndLock}>
                <LinearGradient
                  colors={['#A855F7', '#EC4899']}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.setPinGradient}
                >
                  <Text style={styles.setPinText} weight="700">Set Pin & Lock</Text>
                </LinearGradient>
              </TouchableOpacity>

              <Text style={styles.trayOrText} weight="400">or</Text>
              <TouchableOpacity onPress={() => closePinTray(openTray)}>
                <Text style={styles.trayUsePinText} weight="700">Use Biometrics</Text>
              </TouchableOpacity>
            </ScrollView>
          </LinearGradient>
        </Animated.View>
      )}

      {/* ── Success popup ── */}
      {showSuccess && (
        <TouchableOpacity
          style={styles.successOverlay}
          activeOpacity={1}
          onPress={() => setShowSuccess(false)}
        >
          <LinearGradient
            colors={['#E4CCF7', '#FFE9CF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.successCard}
          >
            <Image
              source={require('../../assets/SecureFolder.webp')}
              style={styles.successIcon}
              resizeMode="contain"
            />
            <Text style={styles.successText} weight="700">
              Your Health Vault is now protected !
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      </View>
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
    height: 200,
    backgroundColor: '#C8E2F5',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    opacity: 1,
  },
  headerFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
  },
  statusBarSpacer: {
    height: 44,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: 12,
  },
  backBtn: {
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
    color: '#4C1D95',
    lineHeight: 30,
  },
  headerSubtitle: {
    fontSize: isMini ? 11 : 12,
    color: '#5B21B6',
    marginTop: 3,
    lineHeight: 17,
  },
  secureVaultBtn: {
    alignItems: 'center',
  },
  lockBox: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: 'rgba(237, 233, 254, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  secureVaultText: {
    fontSize: 10,
    color: '#6D28D9',
    marginTop: 4,
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 12,
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
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EDE9FE',
    shadowColor: '#6D28D9',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  statIconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E6DEFF',
  },
  statValue: {
    fontSize: isMini ? 24 : 26,
    lineHeight: isMini ? 30 : 32,
    color: '#1D1B23',
  },
  statLabel: {
    fontSize: isMini ? 11 : 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 52,
    backgroundColor: '#E3D7FB',
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
  /* Outer wrapper carries the combined box-shadows */
  qaCardWrap: {
    flex: 1,
    borderRadius: 14,
    shadowColor: '#BF7BB9',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  /* Inner gradient carries border + content */
  qaCard: {
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
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
    height: 400,
    marginBottom: 24,
    marginHorizontal: -16,
    overflow: 'visible',
  },
  folderFocusHalo: {
    position: 'absolute',
    borderRadius: 22,
    backgroundColor: '#D9CCFF',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 9,
    zIndex: 0,
  },
  /* ── Folder (fixed position for both open & closed) ── */
  folderBack: {
    position: 'absolute',
    zIndex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.32)',
  },
  folderBackImage: {
    width: '100%',
    height: '100%',
  },
  folderBackTint: {
    ...StyleSheet.absoluteFillObject,
  },
  folderTabs: {
    position: 'absolute',
    zIndex: 2,
    overflow: 'visible',
  },
  tabsBlurVeil: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    borderRadius: 10,
    zIndex: 3,
  },
  tabsScrollContent: {
    paddingBottom: 0,
    paddingHorizontal: 2,
    paddingTop: 4,
  },
  categoryTab: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#EFEFEF',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    height: 52,
    width: 240,
    alignSelf: 'center',
    justifyContent: 'flex-start',
    paddingTop: 8,
    paddingHorizontal: 16,
    shadowColor: '#5B21B6',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 3,
    overflow: 'hidden',
  },
  testReportsTab: {
    borderTopWidth: 4,
    borderTopColor: '#64D3FF',
  },
  genomicTab: {
    borderTopWidth: 4,
    borderTopColor: '#8B67F8',
  },
  vaccineTab: {
    borderTopWidth: 4,
    borderTopColor: '#F857A6',
  },
  prescriptionTab: {
    borderTopWidth: 4,
    borderTopColor: '#FAA018',
  },
  otherReportsTab: {
    borderTopWidth: 4,
    borderTopColor: '#B30000',
  },
  categoryTopStrip: {
    display: 'none', // Removed since we use borderTopColor
  },
  categoryBlurVeil: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  categoryTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B369D',
  },
  folderFrontWrap: {
    position: 'absolute',
    zIndex: 3,
    borderRadius: 12,
    shadowColor: '#2E1065',
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 16,
    elevation: 10,
  },
  folderFront: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
  },
  folderFrontImage: {
    width: '100%',
    height: '100%',
  },
  folderFrontGloss: {
    ...StyleSheet.absoluteFillObject,
  },
  folderFrontEdge: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 16,
    backgroundColor: 'rgba(255,255,255,0.38)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.50)',
  },
  folderBackEdge: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 13,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.34)',
  },
  recordsOverlay: {
    position: 'absolute',
    left: 20,
    bottom: 16,
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

  /* ── Root positioning context ── */
  root: {
    flex: 1,
  },

  /* ── Overlay ── */
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 10,
  },

  /* ── Biometric tray ── */
  tray: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
    zIndex: 11,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 16,
  },
  pinTrayZ: {
    zIndex: 12,
  },
  trayGradient: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
    alignItems: 'center',
  },
  trayScroll: {
    alignItems: 'center',
    paddingBottom: 28,
    width: width - 48,
  },
  trayHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#C4B5DC',
    marginBottom: 18,
  },
  trayTitle: {
    fontSize: isMini ? 20 : 22,
    color: '#3730A3',
    textAlign: 'center',
    marginBottom: 10,
  },
  traySubtitle: {
    fontSize: isMini ? 14 : 15,
    color: '#111111',
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 6,
  },
  trayIconWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
    maxHeight: 130,
  },
  traySensorText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 12,
  },
  trayOrText: {
    fontSize: 15,
    color: '#374151',
    marginBottom: 8,
  },
  trayUsePinText: {
    fontSize: 18,
    color: '#3730A3',
  },


  /* ── PIN inputs ── */
  pinLabel: {
    fontSize: 12,
    color: '#6B7280',
    alignSelf: 'flex-start',
    marginBottom: 8,
    marginTop: 4,
  },
  pinRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginBottom: 10,
  },
  pinBox: {
    flex: 1,
    height: 62,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#4338CA',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  pinInput: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    fontSize: 20,
    color: '#3730A3',
  },

  /* ── Set Pin & Lock button ── */
  setPinBtn: {
    width: '100%',
    borderRadius: 30,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 10,
  },
  setPinGradient: {
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 30,
  },
  setPinText: {
    fontSize: 17,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },

  /* ── Success popup ── */
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    zIndex: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  successCard: {
    width: '100%',
    borderRadius: 24,
    paddingVertical: 36,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 12,
  },
  successIconWrap: {
    position: 'relative',
    width: 150,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successLockOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  successText: {
    fontSize: isMini ? 16 : 18,
    color: '#3730A3',
    textAlign: 'center',
    lineHeight: 26,
  },
});
