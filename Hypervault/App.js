import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import HyperVaultHome from './Src/screens/HyperVaultHome';
import TestReports from './Src/screens/TestReports';

export default function App() {
  const [screen, setScreen] = useState('home');

  const navigation = {
    navigate: (name) => setScreen(name),
    goBack: () => setScreen('home'),
  };

  if (screen === 'TestReports') {
    return <TestReports navigation={navigation} />;
  }

  return (
    <>
      <HyperVaultHome navigation={navigation} />
      <StatusBar style="dark" />
    </>
  );
}
