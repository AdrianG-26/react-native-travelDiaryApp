import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "./app/context/ThemeContext";
import { TravelEntryProvider } from "./app/context/TravelEntryContext";
import AddEntryScreen from "./app/screens/AddEntryScreen";
import HomeScreen from "./app/screens/HomeScreen";
import { RootStackParamList } from "./app/types/navigation";
import { setupNotifications } from "./app/utils/permissions";

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { theme } = useTheme();

  useEffect(() => {
    // Setup notifications when the app loads
    setupNotifications();
  }, []);

  return (
    <NavigationContainer
      theme={{
        dark: theme.dark,
        colors: theme.colors,
        fonts: DefaultTheme.fonts,
      }}
    >
      <StatusBar style={theme.dark ? "light" : "dark"} />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="AddEntry"
          component={AddEntryScreen}
          options={{
            presentation: "modal",
            animation: "slide_from_bottom",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <TravelEntryProvider>
          <AppNavigator />
        </TravelEntryProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
