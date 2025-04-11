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
      theme.dark ? "#522546" : "#FFD63A",
      theme.dark ? "#88304E" : "#FFA955",
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
                backgroundColor: isDark ? "#1A1A1A" : "#FFFFFF",
              },
            ]}
          >
            <Animated.View style={{ transform: [{ rotate: rotation }] }}>
              <Ionicons
                name={isDark ? "moon" : "sunny"}
                size={size - 8}
                color={isDark ? "#CF2861" : "#F75A5A"}
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
