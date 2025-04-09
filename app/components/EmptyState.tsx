import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../context/ThemeContext";

interface EmptyStateProps {
  message?: string;
  icon?: string;
  iconSize?: number;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  message = "No Entries yet",
  icon = "images-outline",
  iconSize = 70,
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Ionicons
        name={icon as any}
        size={iconSize}
        color={theme.colors.text}
        style={styles.icon}
      />
      <Text style={[styles.message, { color: theme.colors.text }]}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  icon: {
    marginBottom: 16,
    opacity: 0.7,
  },
  message: {
    fontSize: 18,
    textAlign: "center",
    lineHeight: 24,
  },
});

export default EmptyState;
