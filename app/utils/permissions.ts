import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export const requestCameraPermission = async (): Promise<boolean> => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  return status === "granted";
};

export const requestMediaLibraryPermission = async (): Promise<boolean> => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return status === "granted";
};

export const requestLocationPermission = async (): Promise<boolean> => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === "granted";
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    // Check if permission is needed (iOS always needs permission, Android depends on OS version)
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    // Only ask if permissions have not already been determined
    if (existingStatus !== "granted") {
      // Request permission
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // Log permission status to help with debugging
    console.log(`Notification permission status: ${finalStatus}`);

    return finalStatus === "granted";
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return false;
  }
};

export const setupNotifications = async () => {
  try {
    // Configure how the notifications appear
    await Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    // Set up foreground behavior - this is critical for seeing notifications while app is open
    Notifications.setNotificationChannelAsync("default", {
      name: "Default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });

    console.log("Notification setup completed successfully");
  } catch (error) {
    console.error("Error setting up notifications:", error);
  }
};
