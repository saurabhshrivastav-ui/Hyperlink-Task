import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { LoaderProvider, useLoader } from "./Components/LoaderContext";
import LoaderScreen from "./Components/Loader";

// Screens
import Home from "./Pages/Home/Home";

// SelfSense Screens
import SelfsenseTabs from "./Pages/SelfSense/SelfSenseTabs";
import SelfSenseHealthArea from "./Pages/SelfSense/SelfSenseHealthArea";
import SelfSensePersonalDetails from "./Pages/SelfSense/PersonalDetails";
import SelfSenseQuestionnaires from "./Pages/SelfSense/Questionnaires";
import AssessmentHistory from "./Pages/SelfSense/AssessmentHistory";

import LowRisk from "./Pages/SelfSense/LowRisk";
import ModerateRisk from "./Pages/SelfSense/ModerateRisk";
import HighRisk from "./Pages/SelfSense/HighRisk";

const Stack = createNativeStackNavigator();

function AppRoot() {
  const { visible } = useLoader();

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="Home"
        >
          <Stack.Screen name="Home" component={Home} />

          <Stack.Screen name="SelfSense" component={SelfsenseTabs} />
          <Stack.Screen
            name="SelfSenseHealthArea"
            component={SelfSenseHealthArea}
          />
          <Stack.Screen
            name="SelfSensePersonalDetails"
            component={SelfSensePersonalDetails}
          />
          <Stack.Screen
            name="QuestionnairesScreen"
            component={SelfSenseQuestionnaires}
          />

          <Stack.Screen name="LowRisk" component={LowRisk} />
          <Stack.Screen name="ModerateRisk" component={ModerateRisk} />
          <Stack.Screen name="HighRisk" component={HighRisk} />

          <Stack.Screen
            name="AssessmentHistory"
            component={AssessmentHistory}
          />
        </Stack.Navigator>
      </NavigationContainer>

      {/* ✅ ONLY ONE PLACE FOR LOADER */}
      {visible && <LoaderScreen />}
    </>
  );
}

export default function App() {
  return (
    <LoaderProvider>
      <AppRoot />
    </LoaderProvider>
  );
}
