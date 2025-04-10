import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useTheme } from "../context/ThemeContext";

interface ThemeToggleProps {
  size?: number;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ size = 24 }) => {
  const { themeMode, toggleTheme, theme } = useTheme();
  const isDark = themeMode === "dark";

  // Animation values
  const switchAnim = useRef(new Animated.Value(isDark ? 1 : 0)).current;
  const rotateAnim = useRef(new Animated.Value(isDark ? 1 : 0)).current;

  // Update animation when theme changes
  useEffect(() => {
    Animated.parallel([
      Animated.timing(switchAnim, {
        toValue: isDark ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(rotateAnim, {
        toValue: isDark ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isDark, switchAnim, rotateAnim]);

  // Interpolate values for animations
  const switchTranslateX = switchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [4, styles.track.width - styles.thumb.width - 4],
  });

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const trackBgColor = switchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      theme.dark ? "#481E14" : "#B3C8CF",
      theme.dark ? "#9B3922" : "#89A8B2",
    ],
  });

  return (
    <TouchableWithoutFeedback onPress={toggleTheme}>
      <View style={styles.container}>
        <Animated.View
          style={[styles.track, { backgroundColor: trackBgColor }]}
        >
          <Animated.View
            style={[
              styles.thumb,
              {
                transform: [{ translateX: switchTranslateX }],
                backgroundColor: isDark ? "#1E1E1E" : "#F1F0E8",
              },
            ]}
          >
            <Animated.View style={{ transform: [{ rotate: rotation }] }}>
              <Ionicons
                name={isDark ? "moon" : "sunny"}
                size={size - 8}
                color={isDark ? "#F2613F" : "#89A8B2"}
              />
            </Animated.View>
          </Animated.View>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
  track: {
    width: 58,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
  },
  thumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
});

export default ThemeToggle;
