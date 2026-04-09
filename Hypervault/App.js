import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import HyperVaultHome from './Src/screens/HyperVaultHome';
import TestReports from './Src/screens/TestReports';
import VaultLock from './Src/screens/VaultLock';
import ResetVaultPin from './Src/screens/ResetVaultPin';
import SharedRecords from './Src/screens/SharedRecords';

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [screen, setScreen] = useState('home');
  const [prevScreen, setPrevScreen] = useState('home');

  const handleUnlock = () => {
    setIsUnlocked(true);
    setScreen('home');
  };

  const navigation = {
    navigate: (name) => {
      if (name === 'VaultLock') {
        setIsUnlocked(false);
        setPrevScreen(screen);
        setScreen('VaultLock');
        return;
      }
      setPrevScreen(screen);
      setScreen(name);
    },
    goBack: () => setScreen(prevScreen || 'home'),
  };

  const lockNavigation = {
    navigate: (name) => {
      setPrevScreen('VaultLock');
      setScreen(name);
    },
    goBack: () => setScreen('VaultLock'),
  };

  if (!isUnlocked) {
    if (screen === 'ResetVaultPin') {
      return <ResetVaultPin navigation={lockNavigation} />;
    }
    return (
      <>
        <VaultLock navigation={lockNavigation} onUnlock={handleUnlock} />
        <StatusBar style="dark" />
      </>
    );
  }

  if (screen === 'ResetVaultPin') {
    return <ResetVaultPin navigation={navigation} />;
  }

  if (screen === 'TestReports') {
    return <TestReports navigation={navigation} />;
  }

  if (screen === 'SharedRecords') {
    return <SharedRecords navigation={navigation} />;
  }

  if (screen === 'VaultLock') {
    return <VaultLock navigation={navigation} onUnlock={handleUnlock} />;
  }

  return (
    <>
      <HyperVaultHome navigation={navigation} />
      <StatusBar style="dark" />
    </>
  );
}
