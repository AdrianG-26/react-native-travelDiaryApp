import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AppTheme, ThemeMode } from "../types";

// Light theme with soft blues and creams
// Palette from: https://colorhunt.co/palette/89a8b2b3c8cfe5e1daf1f0e8
const lightTheme: AppTheme = {
  dark: false,
  colors: {
    primary: "#89A8B2", // Soft blue
    background: "#F1F0E8", // Cream white
    card: "#FFFFFF",
    text: "#3A4A4D", // Dark blue-gray for text
    border: "#B3C8CF", // Light blue
    notification: "#DA7F7F", // Soft red for notifications
  },
};

// Dark theme with rich reds and deep blacks
// Palette from: https://colorhunt.co/palette/0c0c0c481e149b3922f2613f
const darkTheme: AppTheme = {
  dark: true,
  colors: {
    primary: "#F2613F", // Bright orange-red
    background: "#0C0C0C", // Deep black
    card: "#1E1E1E", // Slightly lighter black
    text: "#F8F8F8", // Off-white text
    border: "#481E14", // Dark brown
    notification: "#9B3922", // Darker red for notifications
  },
};

interface ThemeContextType {
  theme: AppTheme;
  themeMode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "travel_diary_theme_mode";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");
  const theme = themeMode === "light" ? lightTheme : darkTheme;

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (storedTheme) {
          setThemeMode(storedTheme as ThemeMode);
        }
      } catch (error) {
        console.error("Failed to load theme preference:", error);
      }
    };

    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newThemeMode = themeMode === "light" ? "dark" : "light";
    setThemeMode(newThemeMode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newThemeMode);
    } catch (error) {
      console.error("Failed to save theme preference:", error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, themeMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
