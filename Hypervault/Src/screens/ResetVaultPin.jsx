import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Dimensions,
  Animated,
  Keyboard,
  Platform,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../components/TextWrapper';
import { setVaultPin, enrollBiometricProfile } from '../services/biometricSecurity';

const { height, width } = Dimensions.get('window');
const isMini = width <= 360;

const TRAY_HEIGHT = height * 0.62;
const MASKED_PHONE = '8**** **844';
const CORRECT_OTP = '123456';


export default function ResetVaultPin({ navigation }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const otpRefs = [
    useRef(null), useRef(null), useRef(null),
    useRef(null), useRef(null), useRef(null),
  ];

  const [trayMode, setTrayMode] = useState(null);
  const trayAnim = useRef(new Animated.Value(TRAY_HEIGHT)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const keyboardAnim = useRef(new Animated.Value(0)).current;

  const [newPin, setNewPin] = useState(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
  const [isSaving, setIsSaving] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const newPinRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
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

  const openTray = (mode) => {
    setTrayMode(mode);
    Animated.parallel([
      Animated.spring(trayAnim, { toValue: 0, useNativeDriver: true, bounciness: 4, speed: 14 }),
      Animated.timing(overlayAnim, { toValue: 1, duration: 280, useNativeDriver: true }),
    ]).start();
  };

  const switchTray = (mode) => {
    Animated.timing(trayAnim, { toValue: TRAY_HEIGHT, duration: 220, useNativeDriver: true }).start(() => {
      Keyboard.dismiss();
      setTrayMode(mode);
      Animated.spring(trayAnim, { toValue: 0, useNativeDriver: true, bounciness: 4, speed: 14 }).start();
    });
  };

  const closeTray = (onDone) => {
    Keyboard.dismiss();
    Animated.parallel([
      Animated.timing(trayAnim, { toValue: TRAY_HEIGHT, duration: 260, useNativeDriver: true }),
      Animated.timing(overlayAnim, { toValue: 0, duration: 240, useNativeDriver: true }),
    ]).start(() => { setTrayMode(null); onDone && onDone(); });
  };

  const handleOtpChange = (text, index) => {
    const digit = text.slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < 5) otpRefs[index + 1].current?.focus();
  };

  const handleOtpKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleVerify = () => {
    const entered = otp.join('');
    if (entered.length < 6) {
      Alert.alert('Enter OTP', 'Please enter the complete 6-digit OTP.');
      return;
    }
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      if (entered === CORRECT_OTP) {
        openTray('pin');
      } else {
        Alert.alert('Invalid OTP', 'The OTP you entered is incorrect. Please try again.');
        setOtp(['', '', '', '', '', '']);
        otpRefs[0].current?.focus();
      }
    }, 800);
  };

  const handleResend = () => {
    setOtp(['', '', '', '', '', '']);
    setTimeout(() => otpRefs[0].current?.focus(), 100);
    Alert.alert('OTP Resent', `A new OTP has been sent to ${MASKED_PHONE}.`);
  };

  const handleNewPinChange = (text, index) => {
    const digit = text.slice(-1);
    setNewPin((prev) => { const n = [...prev]; n[index] = digit; return n; });
    if (digit && index < 3) newPinRefs[index + 1].current?.focus();
  };

  const handleConfirmPinChange = (text, index) => {
    const digit = text.slice(-1);
    setConfirmPin((prev) => { const n = [...prev]; n[index] = digit; return n; });
    if (digit && index < 3) confirmRefs[index + 1].current?.focus();
  };

  const handlePinKeyPress = (e, index, arr, refs) => {
    if (e.nativeEvent.key === 'Backspace' && !arr[index] && index > 0) {
      refs[index - 1].current?.focus();
    }
  };

  const handleSetPin = async () => {
    const entered = newPin.join('');
    const confirmed = confirmPin.join('');
    if (entered.length < 4 || confirmed.length < 4) {
      Alert.alert('PIN Required', 'Please enter and confirm a full 4-digit PIN.');
      return;
    }
    if (entered !== confirmed) {
      Alert.alert('PIN Mismatch', 'Pins do not match. Please try again.');
      setConfirmPin(['', '', '', '']);
      confirmRefs[0].current?.focus();
      return;
    }
    try {
      setIsSaving(true);
      await setVaultPin(entered);
      switchTray('success');
    } catch (error) {
      Alert.alert('Error', error.message || 'Unable to save PIN. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEnrollBiometric = async () => {
    try {
      setIsEnrolling(true);
      await enrollBiometricProfile();
      switchTray('success');
    } catch (error) {
      Alert.alert('Biometric Error', error.message || 'Unable to enroll biometrics.');
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleDone = () => {
    closeTray(() => navigation && navigation.goBack());
  };

  const renderTrayContent = () => {
    if (trayMode === 'pin') {
      return (
        <>
          <Text style={styles.trayTitle} weight="700">Secure Your Health Vault</Text>
          <Text style={styles.traySubtitle} weight="400">
            Create a new 4 digit pin for your Health Vault.
          </Text>

          <Text style={styles.pinLabel} weight="400">Enter 4 digit pin here</Text>
          <View style={styles.pinRow}>
            {newPin.map((digit, index) => (
              <View key={index} style={styles.pinBox}>
                <TextInput
                  ref={newPinRefs[index]}
                  style={styles.pinInput}
                  value={digit}
                  onChangeText={(t) => handleNewPinChange(t, index)}
                  onKeyPress={(e) => handlePinKeyPress(e, index, newPin, newPinRefs)}
                  keyboardType="number-pad"
                  maxLength={1}
                  secureTextEntry
                  caretHidden
                  selectionColor="#4338CA"
                />
              </View>
            ))}
          </View>

          <Text style={styles.pinLabel} weight="400">Confirm Pin</Text>
          <View style={styles.pinRow}>
            {confirmPin.map((digit, index) => (
              <View key={index} style={styles.pinBox}>
                <TextInput
                  ref={confirmRefs[index]}
                  style={styles.pinInput}
                  value={digit}
                  onChangeText={(t) => handleConfirmPinChange(t, index)}
                  onKeyPress={(e) => handlePinKeyPress(e, index, confirmPin, confirmRefs)}
                  keyboardType="number-pad"
                  maxLength={1}
                  secureTextEntry
                  caretHidden
                  selectionColor="#4338CA"
                />
              </View>
            ))}
          </View>

          <TouchableOpacity onPress={handleSetPin} disabled={isSaving} activeOpacity={0.85} style={styles.actionBtnWrap}>
            <LinearGradient colors={['#B148FF', '#F6339B', '#9914F9']} locations={[0, 0.5, 1]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.actionBtn}>
              <Text style={styles.actionBtnText} weight="700">{isSaving ? 'Saving...' : 'Set Pin & Lock'}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.orText} weight="400">or</Text>
          <TouchableOpacity onPress={() => switchTray('bio')} activeOpacity={0.7}>
            <Text style={styles.linkText} weight="700">Use Biometrics</Text>
          </TouchableOpacity>
        </>
      );
    }

    if (trayMode === 'bio') {
      return (
        <>
          <Text style={styles.trayTitle} weight="700">Secure Your Health Vault</Text>
          <Text style={styles.traySubtitle} weight="400">
            Add biometrics to keep your health data private.
          </Text>

          <TouchableOpacity
            style={styles.fingerprintWrap}
            onPress={handleEnrollBiometric}
            disabled={isEnrolling}
            activeOpacity={0.75}
          >
            <Ionicons name="finger-print" size={90} color="#4338CA" />
          </TouchableOpacity>

          <Text style={styles.touchHint} weight="400">
            {isEnrolling ? 'Scanning...' : 'Touch the fingerprint sensor'}
          </Text>

          <Text style={styles.orText} weight="400">or</Text>
          <TouchableOpacity onPress={() => switchTray('pin')} activeOpacity={0.7}>
            <Text style={styles.linkText} weight="700">Use Pin</Text>
          </TouchableOpacity>
        </>
      );
    }

    if (trayMode === 'success') {
      return (
        <>
          <Image
            source={require('../../assets/SecureFolder.webp')}
            style={styles.successImage}
            resizeMode="contain"
          />
          <Text style={styles.successTitle} weight="700">PIN reset sucessfull!</Text>
          <Text style={styles.successSubtitle} weight="400">
            Your health vault has been sucessfully protected{'\n'}with a new PIN
          </Text>
          <TouchableOpacity onPress={handleDone} activeOpacity={0.85} style={styles.actionBtnWrap}>
            <LinearGradient colors={['#B148FF', '#F6339B', '#9914F9']} locations={[0, 0.5, 1]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.actionBtn}>
              <Text style={styles.actionBtnText} weight="700">Done</Text>
            </LinearGradient>
          </TouchableOpacity>
        </>
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.bg}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation && navigation.goBack()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={22} color="#4C1D95" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} weight="700">Reset Vault PIN</Text>
        </View>

        <LinearGradient colors={['#E4CCF7', '#FFE9CF']} start={{ x: 0.12, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
          <Text style={styles.cardHeading} weight="600">
            To reset your PIN, verify your identity
          </Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoText} weight="400">
              A 6 digit OTP has been sent to your{'\n'}registered mobile number{' '}
              <Text style={styles.infoPhone} weight="700">{MASKED_PHONE}</Text>
            </Text>
          </View>

          <Text style={styles.otpLabel} weight="500">Enter OTP</Text>

          <View style={styles.otpRow}>
            {otp.map((digit, index) => (
              <View key={index} style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}>
                <TextInput
                  ref={otpRefs[index]}
                  style={styles.otpInput}
                  value={digit}
                  onChangeText={(t) => handleOtpChange(t, index)}
                  onKeyPress={(e) => handleOtpKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  caretHidden
                  selectionColor="#7C3AED"
                />
              </View>
            ))}
          </View>

          <TouchableOpacity onPress={handleVerify} disabled={isVerifying} activeOpacity={0.85} style={styles.actionBtnWrap}>
            <LinearGradient colors={['#B148FF', '#F6339B', '#9914F9']} locations={[0, 0.5, 1]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.actionBtn}>
              <Text style={styles.actionBtnText} weight="700">
                {isVerifying ? 'Verifying...' : 'Verify'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.resendRow}>
            <Text style={styles.resendNote} weight="400">Didn't recieve OTP?, </Text>
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendLink} weight="700">Resend</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      {trayMode !== null && (
        <Animated.View style={[styles.overlay, { opacity: overlayAnim }]}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => trayMode !== 'success' && closeTray()} />
        </Animated.View>
      )}

      {trayMode !== null && (
        <Animated.View
          style={[
            styles.tray,
            { transform: [{ translateY: Animated.subtract(trayAnim, trayMode === 'pin' ? keyboardAnim : new Animated.Value(0)) }] },
          ]}
        >
          <LinearGradient colors={['#E4CCF7', '#FFE9CF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.trayGradient}>
            {renderTrayContent()}
          </LinearGradient>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  bg: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingTop: 16 },

  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 32, gap: 10 },
  backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: isMini ? 18 : 20, color: '#3B0764' },

  card: {
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 32,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  cardHeading: { fontSize: isMini ? 15 : 16, color: '#1F2937', textAlign: 'center', marginBottom: 20, lineHeight: 24 },
  infoBox: { backgroundColor: '#FFFFFF', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 16, marginBottom: 28 },
  infoText: { fontSize: 13, color: '#374151', textAlign: 'center', lineHeight: 20 },
  infoPhone: { color: '#1F2937' },
  otpLabel: { fontSize: 14, color: '#4B5563', marginBottom: 12 },
  otpRow: { flexDirection: 'row', gap: 8, marginBottom: 32 },
  otpBox: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  otpBoxFilled: { borderColor: '#A855F7', backgroundColor: 'rgba(245,240,255,0.5)' },
  otpInput: { width: '100%', height: '100%', textAlign: 'center', fontSize: 18, color: '#4C1D95' },

  actionBtnWrap: { borderRadius: 14, overflow: 'hidden', marginBottom: 18, width: '100%' },
  actionBtn: { paddingVertical: 16, alignItems: 'center', borderRadius: 14 },
  actionBtnText: { fontSize: 17, color: '#FFFFFF', letterSpacing: 0.3 },

  resendRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  resendNote: { fontSize: 13, color: '#6B7280' },
  resendLink: { fontSize: 13, color: '#7C3AED' },

  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.25)', zIndex: 5 },

  tray: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: TRAY_HEIGHT,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 16,
  },
  trayGradient: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    alignItems: 'center',
  },
  trayTitle: { fontSize: isMini ? 20 : 22, color: '#3730A3', textAlign: 'center', marginBottom: 8 },
  traySubtitle: { fontSize: isMini ? 13 : 14, color: '#111111', textAlign: 'center', marginBottom: 24, lineHeight: 21 },

  pinLabel: { fontSize: 13, color: '#6B7280', alignSelf: 'flex-start', marginBottom: 12 },
  pinRow: { flexDirection: 'row', gap: 12, marginBottom: 20, width: '100%' },
  pinBox: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#4338CA',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  pinInput: { width: '100%', height: '100%', textAlign: 'center', fontSize: 26, color: '#3730A3' },
  orText: { fontSize: 15, color: '#374151', marginBottom: 12 },
  linkText: { fontSize: 18, color: '#3730A3' },

  fingerprintWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 80, maxHeight: 130 },
  touchHint: { fontSize: 14, color: '#6B7280', marginTop: 16, marginBottom: 12 },

  successImage: { width: 140, height: 140, marginBottom: 20, marginTop: 8 },
  successTitle: { fontSize: isMini ? 20 : 22, color: '#3730A3', textAlign: 'center', marginBottom: 12 },
  successSubtitle: { fontSize: isMini ? 13 : 14, color: '#111111', textAlign: 'center', lineHeight: 22, marginBottom: 28 },
});
