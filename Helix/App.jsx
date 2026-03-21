// 1. CRITICAL: This import must be at the very top for Android to work
import 'react-native-gesture-handler'; 

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context'; // 2. Best practice for handling safe areas

// Your Custom Screens
import HelixVoiceHome from './Src/Home';
import AddVoiceFlow from './Src/AddVoice';
import HelixChat from './Src/Chat';
import ManageAddedVoices from './Src/Voices';

// If you are using Expo, keep this. If using CLI, use { StatusBar } from 'react-native'
import { StatusBar } from 'expo-status-bar'; 

const Stack = createStackNavigator();

export default function App() {
  return (
    // 3. Wrap everything in SafeAreaProvider
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="HelixVoiceHome">
          
          <Stack.Screen 
            name="HelixVoiceHome" 
            component={HelixVoiceHome} 
            options={{ headerShown: false }} 
          />
          
          <Stack.Screen 
            name="HelixAddVoice" 
            component={AddVoiceFlow} 
            options={{ title: 'Add Voice' }} 
          />
          
          <Stack.Screen 
            name="HelixChat" 
            component={HelixChat} 
            options={{ title: 'Chat' }} 
          />
          
          <Stack.Screen 
            name="ManageAddedVoices" 
            component={ManageAddedVoices} 
            options={{ title: 'Manage Voices' }} 
          />
          
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}