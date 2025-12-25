import React from "react";
import { StatusBar } from "expo-status-bar";
import SelfSenseHome from "./src/screens/SelfSenseHome";

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <SelfSenseHome />
    </>
  );
}
