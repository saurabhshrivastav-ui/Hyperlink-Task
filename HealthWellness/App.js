import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import WellnessHeaderSection from './Src/Screens/WellnessHeaderSection';
import SleepWellnessSection from './Src/Screens/SleepWellnessSection';
import NutritionWellnessSection from './Src/Screens/NutritionWellnessSection';
import FitnessWellnessSection from './Src/Screens/FitnessWellnessSection';
import MedicineWellnessSection from './Src/Screens/MedicineWellnessSection';
import MentrualWellnessSection from './Src/Screens/MentrualWellnessSection';
import { Text } from './components/TextWrapper';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('wellness');
  const topOffset = Platform.OS === 'android' ? (RNStatusBar.currentHeight || 0) + 10 : 18;

  return (
    <>
      <StatusBar style="dark" translucent={false} backgroundColor="#F3EFEB" />
      <View style={[styles.headerBlock, { paddingTop: topOffset }]}> 
        <View style={styles.headerRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.backBtn}
            onPress={() => {
              if (currentScreen !== 'wellness') {
                setCurrentScreen('wellness');
              }
            }}
          >
            <Ionicons name="arrow-back" size={25} color="#5A3FB8" />
          </TouchableOpacity>
          <View style={styles.titleWrap}>
            <Text weight="700" style={styles.headerTitle}>Health Wellness</Text>
            <Text weight="400" style={styles.headerSubtitle}>Build healthy habits, one day at a time.</Text>
          </View>
        </View>
      </View>

      {currentScreen === 'wellness' ? (
        <WellnessHeaderSection
          hideHeader
          onNavigateSleep={() => setCurrentScreen('sleep')}
          onNavigateNutrition={() => setCurrentScreen('nutrition')}
          onNavigateFitness={() => setCurrentScreen('fitness')}
          onNavigateMedicine={() => setCurrentScreen('medicine')}
          onNavigateMentrual={() => setCurrentScreen('mentrual')}
        />
      ) : currentScreen === 'sleep' ? (
        <SleepWellnessSection
          hideHeader
          onBack={() => setCurrentScreen('wellness')}
          onNavigateAll={() => setCurrentScreen('wellness')}
          onNavigateNutrition={() => setCurrentScreen('nutrition')}
          onNavigateFitness={() => setCurrentScreen('fitness')}
          onNavigateMedicine={() => setCurrentScreen('medicine')}
          onNavigateMentrual={() => setCurrentScreen('mentrual')}
        />
      ) : currentScreen === 'nutrition' ? (
        <NutritionWellnessSection
          hideHeader
          onBack={() => setCurrentScreen('wellness')}
          onNavigateAll={() => setCurrentScreen('wellness')}
          onNavigateSleep={() => setCurrentScreen('sleep')}
          onNavigateFitness={() => setCurrentScreen('fitness')}
          onNavigateMedicine={() => setCurrentScreen('medicine')}
          onNavigateMentrual={() => setCurrentScreen('mentrual')}
        />
      ) : currentScreen === 'fitness' ? (
        <FitnessWellnessSection
          hideHeader
          onBack={() => setCurrentScreen('wellness')}
          onNavigateAll={() => setCurrentScreen('wellness')}
          onNavigateSleep={() => setCurrentScreen('sleep')}
          onNavigateNutrition={() => setCurrentScreen('nutrition')}
          onNavigateMedicine={() => setCurrentScreen('medicine')}
          onNavigateMentrual={() => setCurrentScreen('mentrual')}
        />
      ) : currentScreen === 'medicine' ? (
        <MedicineWellnessSection
          hideHeader
          onBack={() => setCurrentScreen('wellness')}
          onNavigateAll={() => setCurrentScreen('wellness')}
          onNavigateSleep={() => setCurrentScreen('sleep')}
          onNavigateNutrition={() => setCurrentScreen('nutrition')}
          onNavigateFitness={() => setCurrentScreen('fitness')}
          onNavigateMentrual={() => setCurrentScreen('mentrual')}
        />
      ) : (
        <MentrualWellnessSection
          hideHeader
          onBack={() => setCurrentScreen('wellness')}
          onNavigateAll={() => setCurrentScreen('wellness')}
          onNavigateSleep={() => setCurrentScreen('sleep')}
          onNavigateNutrition={() => setCurrentScreen('nutrition')}
          onNavigateFitness={() => setCurrentScreen('fitness')}
          onNavigateMedicine={() => setCurrentScreen('medicine')}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
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
});
