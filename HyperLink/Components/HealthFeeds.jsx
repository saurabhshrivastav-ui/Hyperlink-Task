// HealthFeeds.jsx
import React, { useRef, useState } from "react";
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { Text } from "../Components/TextWrapper";

// Assets
const HealthFeed1 = require("../assets/healthfeed1.png");
const HealthFeed2 = require("../assets/healthfeed2.png");
const HealthFeed3 = require("../assets/healthfeed2.png");

const FEEDS = [
  {
    image: HealthFeed1,
    tag: "#HealthyDiet",
    tagColor: "pink",
    title: "Understanding Your Genetic Predisposition to Diabetes",
    time: "5 min read",
    doctor: "Dr. Kavita Madhuri",
  },
  {
    image: HealthFeed2,
    tag: "#HeartHealth",
    tagColor: "green",
    title: "How Lifestyle Choices Impact Your Heart Health",
    time: "5 min read",
    doctor: "Dr. Kavita Madhuri",
  },
  {
    image: HealthFeed3,
    tag: "#HeartHealth",
    tagColor: "green",
    title: "How Lifestyle Choices Impact Your Heart Health",
    time: "5 min read",
    doctor: "Dr. Kavita Madhuri",
  },
];

// Single Feed Card
const HealthCard = ({ image, tag, tagColor, title, time, doctor }) => (
  <View style={styles.cardWrapper}>
    <Image source={image} style={styles.leftImage} />

    <View style={styles.rightContent}>
      <View
        style={[
          styles.tagBox,
          tagColor === "pink" ? styles.tagPink : styles.tagGreen,
        ]}
      >
        <Text
          style={[
            styles.tagText,
            tagColor === "pink" ? styles.tagPinkText : styles.tagGreenText,
          ]}
        >
          {tag}
        </Text>
      </View>

      <Text style={styles.cardTitle} weight="600">
        {title}
      </Text>

      <Text style={styles.metaText}>
        {time} · {doctor}
      </Text>
    </View>
  </View>
);

const HealthFeeds = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [cardWidth, setCardWidth] = useState(320);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text weight="700" style={styles.headerTitle}>
          Recent Health Feeds
        </Text>

        <TouchableOpacity>
          <Text weight="600" style={styles.seeAll}>
            See All
          </Text>
        </TouchableOpacity>
      </View>

      {/* Cards Scroll */}
      <Animated.ScrollView
        horizontal
        onLayout={(e) => setCardWidth(e.nativeEvent.layout.width)}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={cardWidth}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
      >
        {FEEDS.map((feed, index) => (
          <View key={index} style={{ width: cardWidth, paddingRight: 10 }}>
            <HealthCard {...feed} />
          </View>
        ))}
      </Animated.ScrollView>

      {/* Pagination Dots */}
      <View style={styles.dotsContainer}>
        {FEEDS.map((_, index) => {
          const opacity = scrollX.interpolate({
            inputRange: [
              (index - 1) * cardWidth,
              index * cardWidth,
              (index + 1) * cardWidth,
            ],
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });

          const scale = scrollX.interpolate({
            inputRange: [
              (index - 1) * cardWidth,
              index * cardWidth,
              (index + 1) * cardWidth,
            ],
            outputRange: [1, 1.7, 1],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  opacity: opacity,
                  transform: [{ scale }],
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

export default HealthFeeds;

// STYLES
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  headerTitle: {
    fontSize: 22,
    color: "#1A1A1A",
  },
  seeAll: {
    fontSize:20,
    color: "#27C07D",
  },

  scrollContent: {
    paddingVertical: 5,
  },

  // CARD
  cardWrapper: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 10,
    width: "100%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  leftImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },

  rightContent: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: "center",
  },

  // TAGS
  tagBox: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },

  tagPink: { backgroundColor: "#FFE5EC" },
  tagGreen: { backgroundColor: "#DFFFEF" },

  tagPinkText: { color: "#FF4F80", fontSize: 15 },
  tagGreenText: { color: "#16A34A", fontSize: 15 },

  cardTitle: {
    fontSize: 18,
    color: "#1A1A1A",
    marginBottom: 4,
  },

  metaText: {
    fontSize: 15,
    color: "#6B7280",
  },

  // DOTS
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },

  dot: {
    height: 8,
    width: 8,
    backgroundColor: "#27C07D",
    borderRadius: 50,
    marginHorizontal: 5,
  },
});
