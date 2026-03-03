import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

import ServiceBottomNav from "../../Components/ServiceBottomNav";

// SCREENS
import Home from "../Home/Home";
import SelfSense from "./SelfSense";
import Speciality from "./SelfSenseHealthArea";
import History from "./AssessmentHistory";

import {
  Entypo,
  SimpleLineIcons,
  Feather,
  FontAwesome5,
} from "@expo/vector-icons";

import HyperlinkLogoIcon from "../../assets/hyperlinklogoicon.svg";

/* --------------------------------------
   SERVICE NAV ITEMS
----------------------------------------- */
const serviceNavItems = [
  { label: "Home", route: "Home", icon: "arrow-up-left", lib: Feather },
  { label: "SelfSense", route: "SelfSense", icon: "grid", lib: Entypo },
  {
    label: "Speciality",
    route: "Speciality",
    customIcon: HyperlinkLogoIcon,
  },
  {
    label: "History",
    route: "History",
    icon: "notebook",
    lib: SimpleLineIcons,
  },
  { label: "Profile", route: "Profile", icon: "user-alt", lib: FontAwesome5 },
];

const TrackMyCycleTabs = () => {
  const navigation = useNavigation();

  // Default tab
  const [activeTab, setActiveTab] = useState("SelfSense");

  /* --------------------------------------
     SCREEN RENDERER
  ----------------------------------------- */
  const renderScreen = () => {
    switch (activeTab) {
      case "SelfSense":
        return <SelfSense />;

      case "Speciality":
        return <Speciality />;

      case "History":
        return <History />;

      default:
        return <SelfSense />;
    }
  };

  /* --------------------------------------
     TAB HANDLER
  ----------------------------------------- */
  const handleTabPress = (route) => {
    // ✅ GLOBAL ESCAPE TO WELLNESS
    if (route === "Home") {
      navigation.navigate("Home");
      return;
    }

    setActiveTab(route);
  };

  return (
    <View style={styles.container}>
      <View style={styles.screen}>{renderScreen()}</View>

      {/* ✅ HIDE SERVICE BOTTOM NAV ON WELLNESS */}

      <ServiceBottomNav
        items={serviceNavItems}
        activeGroup={activeTab}
        onTabChange={handleTabPress}
      />
    </View>
  );
};

export default TrackMyCycleTabs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  screen: {
    flex: 1,
    marginBottom: 74, // space for ServiceBottomNav
  },
  fullScreen: {
    marginBottom: 0, // ✅ Wellness is true full screen
  },
});
