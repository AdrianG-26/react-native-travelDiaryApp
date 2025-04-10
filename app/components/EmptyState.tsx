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
  iconSize = 80,
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Ionicons
          name={icon as any}
          size={iconSize}
          color={theme.colors.primary}
        />
      </View>
      <Text style={[styles.message, { color: theme.colors.text }]}>
        {message}
      </Text>
      <Text style={[styles.subMessage, { color: theme.colors.text }]}>
        Tap the + button to add your travel memories
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  message: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 12,
  },
  subMessage: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.7,
    lineHeight: 24,
  },
});

export default EmptyState;
