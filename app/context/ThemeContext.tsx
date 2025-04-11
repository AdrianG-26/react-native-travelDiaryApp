import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AppTheme, ThemeMode } from "../types";

// Light theme with warm reds, oranges and soft cream
// Palette from: https://colorhunt.co/palette/f75a5affa955ffd63af1efec
const lightTheme: AppTheme = {
  dark: false,
  colors: {
    primary: "#FFA955", // Orange
    background: "#F1EFEC", // Soft cream
    card: "#FFFFFF",
    text: "#333333", // Dark gray for text
    border: "#FFD63A", // Yellow
    notification: "#F75A5A", // Red
  },
};

// Dark theme with rich purples and deep black
// Palette from: https://colorhunt.co/palette/52254688304ecf2861030303
const darkTheme: AppTheme = {
  dark: true,
  colors: {
    primary: "#CF2861", // Bright pink/red
    background: "#030303", // Deep black
    card: "#1A1A1A", // Slightly lighter black
    text: "#F8F8F8", // Off-white text
    border: "#522546", // Dark purple
    notification: "#88304E", // Medium purple
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
