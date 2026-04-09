import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Dimensions,
  ImageBackground,
  Animated,
  Image,
  Keyboard,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../components/TextWrapper';
import { verifyBiometricUnlock, verifyVaultPin, getBiometricProfile, setVaultPin } from '../services/biometricSecurity';

const { width, height } = Dimensions.get('window');
const isMini = width <= 360;
const isSmall = width <= 390;

const TRAY_HEIGHT = height * 0.62;
const LOCK_SHIFT = (height / 2 - TRAY_HEIGHT - 107);

export default function VaultLock({ navigation, onUnlock }) {
  const [trayOpen, setTrayOpen] = useState(false);
  const [pin, setPin] = useState(['', '', '', '']);
  const [isVerifyingPin, setIsVerifyingPin] = useState(false);
  const [isVerifyingBiometric, setIsVerifyingBiometric] = useState(false);
  const [unlockHint, setUnlockHint] = useState('');

  const inputs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    getBiometricProfile().then(async (profile) => {
      if (!profile?.pinEnabled && !profile?.biometricEnabled) {
        await setVaultPin('1234');
      }
    });
  }, []);
  const trayAnim = useRef(new Animated.Value(TRAY_HEIGHT)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const lockAnim = useRef(new Animated.Value(0)).current;
  const keyboardAnim = useRef(new Animated.Value(0)).current;

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

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const openTray = () => {
    setTrayOpen(true);
    Animated.parallel([
      Animated.spring(trayAnim, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 4,
        speed: 14,
      }),
      Animated.timing(overlayAnim, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.spring(lockAnim, {
        toValue: LOCK_SHIFT,
        useNativeDriver: true,
        bounciness: 4,
        speed: 14,
      }),
    ]).start();
  };

  const closeTray = () => {
    Animated.parallel([
      Animated.timing(trayAnim, {
        toValue: TRAY_HEIGHT,
        duration: 260,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 0,
        duration: 240,
        useNativeDriver: true,
      }),
      Animated.timing(lockAnim, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }),
    ]).start(() => setTrayOpen(false));
  };

  const handleChange = (text, index) => {
    const newPin = [...pin];
    newPin[index] = text.slice(-1);
    setPin(newPin);
    if (text && index < 3) {
      inputs[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !pin[index] && index > 0) {
      inputs[index - 1].current?.focus();
    }
  };

  const handlePinUnlock = async (enteredPin) => {
    if (isVerifyingPin) return;

    try {
      setIsVerifyingPin(true);
      await verifyVaultPin(enteredPin);
      setUnlockHint('PIN verified. Unlocking...');
      setTimeout(() => onUnlock && onUnlock(), 400);
    } catch (error) {
      setUnlockHint('Incorrect PIN. Try again.');
      Alert.alert('Unlock Failed', error.message || 'Unable to verify PIN right now.');
      setPin(['', '', '', '']);
      inputs[0].current?.focus();
    } finally {
      setIsVerifyingPin(false);
    }
  };

  useEffect(() => {
    const enteredPin = pin.join('');
    if (enteredPin.length === 4) {
      handlePinUnlock(enteredPin);
    }
  }, [pin]);

  const handleBiometricUnlock = async () => {
    try {
      setIsVerifyingBiometric(true);
      await verifyBiometricUnlock();
      setUnlockHint('Fingerprint verified. Unlocking...');
      setTimeout(() => onUnlock && onUnlock(), 400);
    } catch (error) {
      setUnlockHint('Biometric verification failed.');
      Alert.alert('Unlock Failed', error.message || 'Unable to verify fingerprint right now.');
    } finally {
      setIsVerifyingBiometric(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <View style={styles.root}>

        <ImageBackground
          source={require('../../assets/HeaderTestReports.webp')}
          style={styles.headerBackground}
          imageStyle={styles.headerImage}
          resizeMode="cover"
        >
          <View style={styles.statusBarSpacer} />

          <View style={styles.headerRow}>
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
          </View>

          <LinearGradient
            colors={['transparent', 'rgba(200, 226, 245, 0.6)', '#FFFFFF']}
            locations={[0, 0.5, 1]}
            style={styles.headerFade}
          />
        </ImageBackground>

        <View style={styles.whiteBody} />

        {trayOpen && (
          <Animated.View
            style={[styles.overlay, { opacity: overlayAnim }]}
          >
            <TouchableOpacity style={StyleSheet.absoluteFill} onPress={closeTray} />
          </Animated.View>
        )}

        <Animated.View
          style={[styles.tray, { transform: [{ translateY: Animated.subtract(trayAnim, keyboardAnim) }] }]}
        >
          <LinearGradient
            colors={['#E4CCF7', '#FFE9CF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.trayGradient}
          >
          <Text style={styles.title} weight="700">Your Health Vault is Locked</Text>
          <Text style={styles.subtitle} weight="700">
            Enter your PIN or use biometrics to access your documents
          </Text>

          <Text style={styles.pinLabel} weight="400">Enter 4 digit pin here</Text>

          <View style={styles.pinRow}>
            {pin.map((digit, index) => (
              <View key={index} style={styles.pinBoxOuter}>
                <TextInput
                  ref={inputs[index]}
                  style={styles.pinInput}
                  value={digit}
                  onChangeText={(text) => handleChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  secureTextEntry={false}
                  caretHidden
                  selectionColor="#4338CA"
                />
              </View>
            ))}
          </View>

          <Text style={styles.orText} weight="400">or</Text>

          <TouchableOpacity
            style={styles.biometricsBtn}
            onPress={handleBiometricUnlock}
            disabled={isVerifyingBiometric}
          >
            <Text style={styles.biometricsText} weight="700">
              {isVerifyingBiometric ? 'Verifying fingerprint...' : 'Use Biometrics'}
            </Text>
          </TouchableOpacity>

          {!!unlockHint && (
            <Text style={styles.unlockHint} weight="500">{unlockHint}</Text>
          )}

          <TouchableOpacity
            style={styles.biometricIconWrap}
            onPress={handleBiometricUnlock}
            disabled={isVerifyingBiometric}
            activeOpacity={0.8}
          >
            <Ionicons name="finger-print" size={62} color="#4338CA" />
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerNote} weight="400">
              Your Documents are private and encrypted
            </Text>
            <TouchableOpacity onPress={() => navigation && navigation.navigate('ResetVaultPin')}>
              <Text style={styles.forgotPin} weight="700">Reset Password</Text>
            </TouchableOpacity>
          </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View style={[styles.lockCircleWrap, { transform: [{ translateY: lockAnim }] }]}>
        <TouchableOpacity
          activeOpacity={0.82}
          onPress={openTray}
        >
          <LinearGradient
            colors={['rgba(248,200,225,0.6)', 'rgba(211,182,251,0.6)']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.lockCircle}
          >
            <View style={styles.lockCircleInset}>
              <Image
                source={require('../../assets/Lock.webp')}
                style={styles.lockImage}
                resizeMode="contain"
              />
            </View>
          </LinearGradient>
        </TouchableOpacity>
        </Animated.View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  root: {
    flex: 1,
  },

  headerBackground: {
    width: '100%',
    height: 200,
    backgroundColor: '#C8E2F5',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    opacity: 0.9,
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
  headerFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
  },

  whiteBody: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  lockCircleWrap: {
    position: 'absolute',
    top: height / 2 - 83,
    left: width / 2 - 83,
  },
  lockCircle: {
    width: 166,
    height: 166,
    borderRadius: 83,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockCircleInset: {
    width: 166,
    height: 166,
    borderRadius: 83,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.502,
    shadowRadius: 10,
    elevation: 0,
  },
  lockImage: {
    width: 90,
    height: 90,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
    zIndex: 5,
  },

  tray: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: TRAY_HEIGHT,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    zIndex: 10,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 16,
  },
  trayGradient: {
    flex: 1,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
    alignItems: 'center',
  },
  trayHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1C4E9',
    marginBottom: 20,
  },
  title: {
    fontSize: isMini ? 20 : 22,
    color: '#3730A3',
    textAlign: 'center',
    marginBottom: 14,
  },
  subtitle: {
    fontSize: isMini ? 14 : 15,
    color: '#111111',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  pinLabel: {
    fontSize: 13,
    color: '#6B7280',
    alignSelf: 'flex-start',
    marginBottom: 14,
  },
  pinRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 22,
    width: '100%',
  },
  pinBoxOuter: {
    flex: 1,
    aspectRatio: 1,
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
    fontSize: 26,
    color: '#3730A3',
  },
  orText: {
    fontSize: 15,
    color: '#374151',
    marginBottom: 8,
  },
  biometricsBtn: {
    marginBottom: 20,
  },
  biometricsText: {
    fontSize: 18,
    color: '#3730A3',
  },
  unlockHint: {
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 10,
  },
  biometricIconWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
    maxHeight: 100,
  },
  footer: {
    alignItems: 'center',
    gap: 8,
    width: '100%',
    paddingBottom: 4,
  },
  footerNote: {
    fontSize: 14,
    color: '#374151',
  },
  forgotPin: {
    fontSize: 18,
    color: '#3730A3',
    marginTop: 2,
  },
});
