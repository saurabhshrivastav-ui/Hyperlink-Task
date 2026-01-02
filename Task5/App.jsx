import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

// Import your screens
import DevicePage from './Src/Screens/DevicePage';
import AddDevicePage from './Src/Screens/AddDevicePage';
import FindDeviceResultPage from './Src/Screens/FindDeviceResultPage';
import MyDevicePage from './Src/Screens/MyDevicePage'; 

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="DevicePage" component={DevicePage} />
        <Stack.Screen name="AddDevicePage" component={AddDevicePage} />
        <Stack.Screen name="FindDeviceResultPage" component={FindDeviceResultPage} />
        <Stack.Screen name="MyDevicePage" component={MyDevicePage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}