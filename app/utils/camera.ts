import * as ImagePicker from "expo-image-picker";
import { Alert, Platform } from "react-native";
import {
  requestCameraPermission,
  requestMediaLibraryPermission,
} from "./permissions";

export interface ImageResult {
  uri: string;
  width: number;
  height: number;
  cancelled?: boolean;
}

export const takePicture = async (): Promise<ImageResult | null> => {
  try {
    const hasPermission = await requestCameraPermission();

    if (!hasPermission) {
      Alert.alert(
        "Permission Required",
        "You need to grant camera permission to take pictures.",
        [{ text: "OK" }]
      );
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return null;
    }

    return {
      uri: result.assets[0].uri,
      width: result.assets[0].width || 0,
      height: result.assets[0].height || 0,
    };
  } catch (error) {
    console.error("Error taking picture:", error);
    Alert.alert("Error", "Failed to take picture. Please try again.");
    return null;
  }
};

export const selectPicture = async (): Promise<ImageResult | null> => {
  try {
    const hasPermission = await requestMediaLibraryPermission();

    if (!hasPermission) {
      Alert.alert(
        "Permission Required",
        "You need to grant media library permission to select pictures.",
        [{ text: "OK" }]
      );
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return null;
    }

    return {
      uri: result.assets[0].uri,
      width: result.assets[0].width || 0,
      height: result.assets[0].height || 0,
    };
  } catch (error) {
    console.error("Error selecting picture:", error);
    Alert.alert("Error", "Failed to select picture. Please try again.");
    return null;
  }
};
