import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// 1. Import Assessment Flow Screens
// (Make sure these paths point to where your files actually are)
import SelfSense from "./src/screens/SelfSense/SelfSense";
import SelfSensePersonalDetails from "./src/screens/SelfSense/PersonalDetails"; 
import QuestionnairesScreen from "./src/screens/SelfSense/Questionnaires"; 

// 2. Import Result Screens
import LowRisk from "./Pages/Result/LowRisk";
import ModerateRisk from "./Pages/Result/ModerateRisk";
import HighRisk from "./Pages/Result/HighRisk";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />

      <Stack.Navigator screenOptions={{ headerShown: false }}>
        
        {/* --- STEP 1: Disease Selection --- */}
        <Stack.Screen name="SelfSense" component={SelfSense} />

        {/* --- STEP 2: Personal Details --- 
            (Navigated to from SelfSense) */}
        <Stack.Screen name="SelfSensePersonalDetails" component={SelfSensePersonalDetails} />

        {/* --- STEP 3: The Quiz --- 
            (Navigated to from PersonalDetails) */}
        <Stack.Screen name="QuestionnairesScreen" component={QuestionnairesScreen} />

        {/* --- STEP 4: The Results --- 
            (Navigated to from QuestionnairesScreen based on score) */}
        <Stack.Screen name="LowRisk" component={LowRisk} />
        <Stack.Screen name="ModerateRisk" component={ModerateRisk} />
        <Stack.Screen name="HighRisk" component={HighRisk} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}