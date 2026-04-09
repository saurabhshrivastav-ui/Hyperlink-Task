import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import { sha256 } from 'js-sha256';

const VAULT_SECURITY_KEY = 'hypervault_security_profile';

const hashValue = async (value) => {
  return sha256(value);
};

const getStoredProfile = async () => {
  const raw = await SecureStore.getItemAsync(VAULT_SECURITY_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const ensureBiometricSupport = async () => {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  if (!hasHardware) {
    throw new Error('Biometric hardware is not available on this device.');
  }

  const enrolled = await LocalAuthentication.isEnrolledAsync();
  if (!enrolled) {
    throw new Error('No fingerprint or biometric data is enrolled on this device.');
  }

  return LocalAuthentication.supportedAuthenticationTypesAsync();
};

export const getBiometricProfile = async () => {
  return getStoredProfile();
};

export const enrollBiometricProfile = async () => {
  const existingProfile = await getStoredProfile();
  const authTypes = await ensureBiometricSupport();
  const authResult = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Scan your fingerprint to secure HyperVault',
    disableDeviceFallback: true,
    cancelLabel: 'Cancel',
    biometricsSecurityLevel: 'strong',
  });

  if (!authResult.success) {
    throw new Error('Fingerprint scan was not completed. Please try again.');
  }

  const fingerprintSeed = `${Date.now()}:${Math.random()}:${authTypes.join(',')}`;
  const fingerprintId = await hashValue(fingerprintSeed);

  const profile = {
    ...(existingProfile || {}),
    fingerprintId,
    biometricEnabled: true,
    enrolledAt: new Date().toISOString(),
    authenticationTypes: authTypes,
  };

  await SecureStore.setItemAsync(VAULT_SECURITY_KEY, JSON.stringify(profile));
  return profile;
};

export const verifyBiometricUnlock = async () => {
  const profile = await getStoredProfile();
  if (!profile?.biometricEnabled || !profile?.fingerprintId) {
    throw new Error('No biometric profile found. Please enroll first.');
  }

  await ensureBiometricSupport();
  const authResult = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Verify fingerprint to unlock HyperVault',
    disableDeviceFallback: true,
    cancelLabel: 'Cancel',
    biometricsSecurityLevel: 'strong',
  });

  if (!authResult.success) {
    throw new Error('Fingerprint verification failed.');
  }

  return profile;
};

export const setVaultPin = async (pin) => {
  if (!/^\d{4}$/.test(pin || '')) {
    throw new Error('PIN must be exactly 4 digits.');
  }

  const existingProfile = await getStoredProfile();
  const pinHash = await hashValue(pin);
  const profile = {
    ...(existingProfile || {}),
    pinHash,
    pinEnabled: true,
    pinUpdatedAt: new Date().toISOString(),
  };

  await SecureStore.setItemAsync(VAULT_SECURITY_KEY, JSON.stringify(profile));
  return profile;
};

export const verifyVaultPin = async (pin) => {
  if (!/^\d{4}$/.test(pin || '')) {
    throw new Error('Enter a valid 4-digit PIN.');
  }

  const profile = await getStoredProfile();
  if (!profile?.pinEnabled || !profile?.pinHash) {
    throw new Error('No PIN is configured. Please set your PIN first.');
  }

  const enteredHash = await hashValue(pin);
  if (enteredHash !== profile.pinHash) {
    throw new Error('Incorrect PIN. Try again.');
  }

  return profile;
};
