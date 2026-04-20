import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

const PressableCard = React.memo(function PressableCard({
  children,
  style,
  onPress,
  disabled,
  fillInner = false,
}) {
  return (
    <Pressable onPress={onPress} disabled={disabled}>
      <View style={style}>
        <View style={fillInner && styles.inner}>{children}</View>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  inner: {
    flex: 1,
  },
});

export default PressableCard;
