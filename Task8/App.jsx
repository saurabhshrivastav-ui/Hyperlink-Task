import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
// 1. Import SafeAreaProvider to fix the deprecation warning
import { SafeAreaProvider } from 'react-native-safe-area-context';
// 2. Import Navigation to fix the "Couldn't find navigation object" error
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HyperTask from './Src/Hyperlab';
import UploadImage from './Src/UploadImage';
import LabTest from './Src/LabTest';
import DiabetesMonitoring from './Src/DiabetesMonitoring';
import TestDetails from './Src/TestDetails';
import BookingDetails from './Src/BookingDetails';
import LabHistory from './Src/LabHistory';
import LabTestCategory from './Src/LabTestCategory';

const Stack = createStackNavigator();

export default function App() {
  return (
    // SafeAreaProvider must be the top-level wrapper
    <SafeAreaProvider style={styles.container}>
      {/* NavigationContainer provides the navigation context */}
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator 
          screenOptions={{ 
            headerShown: false // Hides the default top bar
          }}
        >
          <Stack.Screen name="HyperTask" component={HyperTask} />
          <Stack.Screen name="UploadImage" component={UploadImage} />
          <Stack.Screen name="LabTest" component={LabTest} />
          <Stack.Screen name="DiabetesMonitoring" component={DiabetesMonitoring} />
          <Stack.Screen name="TestDetails" component={TestDetails} />
          <Stack.Screen name="BookingDetails" component={BookingDetails} />
          <Stack.Screen name="LabHistory" component={LabHistory} />
          <Stack.Screen name="LabTestCategory" component={LabTestCategory} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFF',
  },
});