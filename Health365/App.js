import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Health360 from "./Src/Health360";
import TestReports from "./Src/TestReports";
import ReportAnalysis from "./Src/ReportAnalysis";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Health360" component={Health360} />
        <Stack.Screen name="TestReports" component={TestReports} />
        <Stack.Screen name="ReportAnalysis" component={ReportAnalysis} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
