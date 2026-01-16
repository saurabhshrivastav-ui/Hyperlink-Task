import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HelixVoice from './Src/HelixVoice'; 
import AddPerson from './Src/AddPerson';
import AddVoiceFlow from './Src/AddVoice';
import PreviewVoice from './Src/PreviewVoice'; 
import ReminderSetup from './Src/ReminderSetup'; 
import HelixChat from './Src/HelixChat'; 
import YourVoices from './Src/YourVoices'; 

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <Stack.Navigator 
        initialRouteName="HelixVoice"
        screenOptions={{ 
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: '#F9EAF4' }
        }}
      >
        <Stack.Screen name="HelixVoice" component={HelixVoice} />
        <Stack.Screen name="AddPerson" component={AddPerson} />
        <Stack.Screen name="HelixAddVoice" component={AddVoiceFlow} />
        <Stack.Screen name="PreviewVoice" component={PreviewVoice} />
        <Stack.Screen name="ReminderSetup" component={ReminderSetup} />
        <Stack.Screen name="HelixChat" component={HelixChat} />
        <Stack.Screen name="YourVoices" component={YourVoices} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}