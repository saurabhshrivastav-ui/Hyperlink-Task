import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// --- IMPORT YOUR SCREENS ---
import KnowYourMedicineScreen from './Src/Screens/KnowYourMedicineScreen';
import MedicineScanner from './Src/Screens/MedicineScanner'; 
import MedicineUpload from './Src/Screens/MedicineUpload'; 
// 1. Import the new Details Screen
import MedicineDetails from './Src/Screens/MedicineDetails'; 

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />

      <Stack.Navigator 
        initialRouteName="KnowYourMedicine"
        screenOptions={{
          headerShown: false, 
          animation: 'slide_from_right'
        }}
      >
        {/* Screen 1: The Dashboard */}
        <Stack.Screen 
          name="KnowYourMedicine" 
          component={KnowYourMedicineScreen} 
        />

        {/* Screen 2: The Camera Scanner */}
        <Stack.Screen 
          name="MedicineScanner" 
          component={MedicineScanner} 
        />

        {/* Screen 3: The Gallery Upload */}
        <Stack.Screen 
          name="MedicineUpload" 
          component={MedicineUpload} 
        />

        {/* Screen 4: The Results/Details Page (NEW) */}
        <Stack.Screen 
          name="MedicineDetails" 
          component={MedicineDetails} 
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}