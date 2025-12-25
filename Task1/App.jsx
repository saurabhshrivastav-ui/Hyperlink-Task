import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ResultScreen from "./Pages/Result/Result"; // Sakshi
import ResultScreenAditya from "./Pages/Result/ResultScreenAditya";
import ResultScreenSaurabh from "./Pages/Result/ResultScreenSaurabh";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />

      {/* ✅ ONLY ONE STACK NAVIGATOR */}
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Result" component={ResultScreen} />
        <Stack.Screen name="ResultAditya" component={ResultScreenAditya} />
        <Stack.Screen name="ResultSaurabh" component={ResultScreenSaurabh} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
