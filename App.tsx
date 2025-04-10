import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef } from "react";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "./app/context/ThemeContext";
import { TravelEntryProvider } from "./app/context/TravelEntryContext";
import AddEntryScreen from "./app/screens/AddEntryScreen";
import HomeScreen from "./app/screens/HomeScreen";
import { RootStackParamList } from "./app/types/navigation";
import {
  requestNotificationPermission,
  setupNotifications,
} from "./app/utils/permissions";

const Stack = createNativeStackNavigator<RootStackParamList>();

// Set up notification handler at the top level
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

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
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    // Request notification permissions on app startup
    requestNotificationPermission();

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notification received in foreground:", notification);
      });

    // This listener is fired whenever a user taps on or interacts with a notification
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification response received:", response);
        // Here you could navigate to specific screens based on notification data
      });

    // Cleanup listeners on unmount
    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

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
