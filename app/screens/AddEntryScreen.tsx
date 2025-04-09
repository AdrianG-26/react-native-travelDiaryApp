import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { useTravelEntries } from "../context/TravelEntryContext";
import { AddEntryScreenProps } from "../types/navigation";
import { takePicture } from "../utils/camera";
import { getCurrentLocation, reverseGeocode } from "../utils/location";
import {
  requestCameraPermission,
  requestLocationPermission,
} from "../utils/permissions";

const AddEntryScreen: React.FC<AddEntryScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { addEntry } = useTravelEntries();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Request permissions when the screen is mounted
    const requestPermissions = async () => {
      const cameraPermission = await requestCameraPermission();
      const locationPermission = await requestLocationPermission();

      if (!cameraPermission || !locationPermission) {
        Alert.alert(
          "Permissions Required",
          "This app requires camera and location permissions to function properly.",
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      }
    };

    requestPermissions();

    // Clear form when going back to Home
    return () => {
      setImageUri(null);
      setAddress(null);
      setLatitude(null);
      setLongitude(null);
    };
  }, [navigation]);

  const handleTakePicture = async () => {
    try {
      const result = await takePicture();
      if (result) {
        setImageUri(result.uri);
        await getLocationAndAddress();
      }
    } catch (error) {
      console.error("Error in takePicture:", error);
      Alert.alert("Error", "Failed to take picture. Please try again.");
    }
  };

  const getLocationAndAddress = async () => {
    setIsLoading(true);
    try {
      const location = await getCurrentLocation();
      const { latitude, longitude } = location.coords;

      setLatitude(latitude);
      setLongitude(longitude);

      const geocodeResult = await reverseGeocode(latitude, longitude);
      setAddress(geocodeResult.address);
    } catch (error) {
      console.error("Error getting location or address:", error);
      Alert.alert(
        "Location Error",
        "Unable to get your current location or address. Please make sure location services are enabled.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!imageUri || !address || latitude === null || longitude === null) {
      Alert.alert(
        "Missing Information",
        "Please take a picture to complete your travel entry."
      );
      return;
    }

    try {
      await addEntry({
        imageUri,
        address,
        latitude,
        longitude,
        timestamp: Date.now(),
      });

      navigation.goBack();
    } catch (error) {
      console.error("Error saving entry:", error);
      Alert.alert(
        "Save Error",
        "Failed to save your travel entry. Please try again."
      );
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Add Travel Entry
        </Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={[styles.saveButton, { color: theme.colors.primary }]}>
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View
          style={[styles.imageContainer, { borderColor: theme.colors.border }]}
        >
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <TouchableOpacity
              style={[
                styles.addImageButton,
                { backgroundColor: theme.colors.card },
              ]}
              onPress={handleTakePicture}
            >
              <Ionicons name="camera" size={40} color={theme.colors.primary} />
              <Text style={[styles.addImageText, { color: theme.colors.text }]}>
                Take a picture
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.text }]}>
              Getting your location...
            </Text>
          </View>
        ) : (
          address && (
            <View
              style={[
                styles.addressContainer,
                { backgroundColor: theme.colors.card },
              ]}
            >
              <Text style={[styles.addressLabel, { color: theme.colors.text }]}>
                Address:
              </Text>
              <Text style={[styles.addressText, { color: theme.colors.text }]}>
                {address}
              </Text>
            </View>
          )
        )}

        {imageUri && (
          <TouchableOpacity
            style={[
              styles.retakeButton,
              { backgroundColor: theme.colors.card },
            ]}
            onPress={handleTakePicture}
          >
            <Ionicons
              name="camera-outline"
              size={20}
              color={theme.colors.text}
            />
            <Text
              style={[styles.retakeButtonText, { color: theme.colors.text }]}
            >
              Take another picture
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  saveButton: {
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    padding: 16,
    flexGrow: 1,
  },
  imageContainer: {
    aspectRatio: 4 / 3,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  addImageButton: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  addImageText: {
    marginTop: 8,
    fontSize: 16,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  addressContainer: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  addressText: {
    fontSize: 16,
    lineHeight: 24,
  },
  retakeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  retakeButtonText: {
    fontSize: 16,
    marginLeft: 8,
  },
});

export default AddEntryScreen;
