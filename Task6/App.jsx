import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
// Double check that your folder is named 'Src' (capital S) or 'src' (lowercase s)
import HelixVoice from './Src/HelixVoice'; 
import AddPerson from './Src/AddPerson';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="HelixVoice"
        screenOptions={{ 
          headerShown: false,
          animation: 'slide_from_right' // Adds a nice transition animation
        }}
      >
        {/* Home Screen */}
        <Stack.Screen name="HelixVoice" component={HelixVoice} />
        
        {/* Add Person Form */}
        <Stack.Screen name="AddPerson" component={AddPerson} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}