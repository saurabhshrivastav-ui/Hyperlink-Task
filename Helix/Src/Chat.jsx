import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Image, // Correctly Imported
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "../Components/TextWrapper";
import { useNavigation } from "@react-navigation/native";

import HelixBgLines from "../assets/Helixbglines.webp";

const MOCK_AI_RESPONSE = "Sure 😊 I can help you track your calories.";

export default function HelixChat() {
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const [mode, setMode] = useState("chat");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { id: "1", from: "ai", text: "Hi Sakshi 👋" },
  ]);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMode("chat");
    const userMsg = {
      id: Date.now().toString(),
      from: "user",
      text: input.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "_ai",
          from: "ai",
          text: MOCK_AI_RESPONSE,
        },
      ]);
    }, 700);
  };

  const renderItem = ({ item }) => (
    <View style={item.from === "ai" ? styles.aiBubble : styles.userBubble}>
      <Text style={item.from === "ai" ? styles.aiText : styles.userText}>
        {item.text}
      </Text>
    </View>
  );

  const VoiceVisual = () => (
    <View style={styles.voiceContainer}>
      <LinearGradient
        colors={["#F1E8FF", "#FFFFFF"]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.voiceOrb}>
        <MaterialCommunityIcons name="waveform" size={54} color="#6B6FD6" />
      </View>
      <Text style={styles.voiceTitle}>Listening</Text>
      <Text style={styles.voiceHint}>Tap the mic and speak naturally</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={["#EFE2FF", "#FFFFFF"]}
        style={StyleSheet.absoluteFill}
      />

      {/* FIXED: Replaced invalid <HelixBgLines /> with <Image /> */}
      <View style={styles.bgLinesTop}>
        <Image
          source={HelixBgLines}
          style={{ width: "100%", height: 180, opacity: 0.6 }}
          resizeMode="cover"
        />
      </View>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#2C2E5A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Helix AI</Text>
      </View>

      {mode === "chat" ? (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.chatContainer}
          style={{ flex: 1 }}
        />
      ) : (
        <VoiceVisual />
      )}

      <View style={styles.inputWrapper}>
        <TextInput
          value={input}
          onChangeText={(t) => {
            setInput(t);
            setMode("chat");
          }}
          placeholder="Ask anything..."
          placeholderTextColor="#9A9AB0"
          style={styles.input}
          multiline={true} // FIXED: Explicit boolean
        />
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => setMode("voice")}
        >
          <MaterialCommunityIcons name="waveform" size={20} color="#6B6FD6" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => setMode("voice")}
        >
          <Feather name="mic" size={18} color="#6B6FD6" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Ionicons name="send" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bgLinesTop: { position: "absolute", top: 0, width: "100%" },
  header: { flexDirection: "row", alignItems: "center", padding: 20 },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginLeft: 14,
    color: "#2C2E5A",
  },
  chatContainer: { paddingHorizontal: 20 },
  aiBubble: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 18,
    marginBottom: 14,
    alignSelf: "flex-start",
  },
  userBubble: {
    backgroundColor: "#6B6FD6",
    padding: 14,
    borderRadius: 18,
    marginBottom: 14,
    alignSelf: "flex-end",
  },
  aiText: { color: "#2C2E5A" },
  userText: { color: "#FFF" },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 12,
    margin: 12,
    borderRadius: 18,
  },
  input: { flex: 1, paddingHorizontal: 10, maxHeight: 100 },
  iconBtn: { padding: 8, marginRight: 4 },
  sendBtn: { backgroundColor: "#6B6FD6", padding: 10, borderRadius: 12 },
  voiceContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  voiceOrb: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#E6DAFF",
    alignItems: "center",
    justifyContent: "center",
  },
  voiceTitle: {
    marginTop: 24,
    fontSize: 18,
    fontWeight: "800",
    color: "#2C2E5A",
  },
  voiceHint: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "600",
    color: "#6B6FD6",
  },
});
