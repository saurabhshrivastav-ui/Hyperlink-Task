import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screen Imports
import SelfSense from "./src/screens/SelfSense/SelfSense";
import SelfSenseHealthArea from "./src/screens/SelfSense/SelfSenseHealthArea";
import SelfSensePersonalDetails from "./src/screens/SelfSense/PersonalDetails"; 
import SelfSenseQuestionnaires from "./src/screens/SelfSense/Questionnaires";

// Result Screen Imports (Make sure these files exist in your folder)
// If you haven't created them yet, the app will crash when submitting the quiz.
import LowRisk from "./src/screens/SelfSense/LowRisk";       // ⚠️ Ensure path is correct
import ModerateRisk from "./src/screens/SelfSense/ModerateRisk"; // ⚠️ Ensure path is correct
import HighRisk from "./src/screens/SelfSense/HighRisk";     // ⚠️ Ensure path is correct

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        
        {/* 1. Landing Screen - Self Sense Introduction */}
        <Stack.Screen name="SelfSense" component={SelfSense} />
        
        {/* 2. Health Area Selection Screen */}
        <Stack.Screen name="SelfSenseHealthArea" component={SelfSenseHealthArea} />
        
        {/* 3. Personal Details Form */}
        <Stack.Screen name="SelfSensePersonalDetails" component={SelfSensePersonalDetails} />
        
        {/* 4. Questionnaires Screen */}
        <Stack.Screen name="QuestionnairesScreen" component={SelfSenseQuestionnaires} />

        {/* 5. Result Screens (Required for the quiz logic to work) */}
        <Stack.Screen name="LowRisk" component={LowRisk} />
        <Stack.Screen name="ModerateRisk" component={ModerateRisk} />
        <Stack.Screen name="HighRisk" component={HighRisk} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}