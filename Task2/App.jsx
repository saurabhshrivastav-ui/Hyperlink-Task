import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LowRisk from "./Pages/Result/LowRisk";
import ModerateRisk from "./Pages/Result/ModerateRisk";
import HighRisk from "./Pages/Result/HighRisk";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />

      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LowRisk" component={LowRisk} />
        <Stack.Screen name="ModerateRisk" component={ModerateRisk} />
        <Stack.Screen name="HighRisk" component={HighRisk} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
