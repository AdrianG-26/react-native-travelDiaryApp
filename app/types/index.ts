export interface TravelEntry {
  id: string;
  imageUri: string;
  address: string;
  latitude: number;
  longitude: number;
  timestamp: number;
}

export type ThemeMode = "light" | "dark";

export interface ThemeColors {
  primary: string;
  background: string;
  card: string;
  text: string;
  border: string;
  notification: string;
}

export interface AppTheme {
  dark: boolean;
  colors: ThemeColors;
}
