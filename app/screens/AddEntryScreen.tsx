import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
  requestNotificationPermission,
} from "../utils/permissions";

// Array of mood options
const MOOD_OPTIONS = [
  { id: "happy", label: "Happy", emoji: "😊" },
  { id: "sad", label: "Sad", emoji: "😢" },
  { id: "exhausted", label: "Exhausted", emoji: "😫" },
  { id: "tired", label: "Tired", emoji: "😴" },
  { id: "surprised", label: "Surprised", emoji: "😲" },
  { id: "crying", label: "Crying", emoji: "😭" },
  { id: "disgusted", label: "Disgusted", emoji: "🤢" },
  { id: "cool", label: "Cool", emoji: "😎" },
  { id: "hot", label: "Hot", emoji: "🥵" },
  { id: "adventurous", label: "Adventurous", emoji: "🧗" },
  { id: "relaxed", label: "Relaxed", emoji: "😌" },
  { id: "excited", label: "Excited", emoji: "🤩" },
];

// Define the type for mood options
type MoodOption = {
  id: string;
  label: string;
  emoji: string;
};

const AddEntryScreen: React.FC<AddEntryScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { addEntry } = useTravelEntries();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [description, setDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageHeight, setImageHeight] = useState<number | null>(null);
  const [imageWidth, setImageWidth] = useState<number | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  useEffect(() => {
    // Request permissions when the screen is mounted
    const requestPermissions = async () => {
      const cameraPermission = await requestCameraPermission();
      const locationPermission = await requestLocationPermission();
      // Also ensure notification permission is granted
      const notificationPermission = await requestNotificationPermission();

      if (!cameraPermission || !locationPermission) {
        Alert.alert(
          "Permissions Required",
          "This app requires camera and location permissions to function properly.",
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      }

      if (!notificationPermission) {
        console.log("Notification permission not granted, but continuing");
      }
    };

    requestPermissions();

    // Clear form when going back to Home
    return () => {
      setImageUri(null);
      setAddress(null);
      setLatitude(null);
      setLongitude(null);
      setDescription("");
      setImageHeight(null);
      setImageWidth(null);
      setSelectedMood(null);
    };
  }, [navigation]);

  const handleTakePicture = async () => {
    try {
      const result = await takePicture();
      if (result) {
        setImageUri(result.uri);
        setImageWidth(result.width);
        setImageHeight(result.height);
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
        description: description.trim(),
        mood: selectedMood,
      });

      // Schedule a notification
      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "New Snap Added!",
            body: `You've added a new snap at ${address}`,
          },
          trigger: null, // Show immediately
        });
      } catch (error) {
        console.error("Failed to schedule notification:", error);
      }

      navigation.goBack();
    } catch (error) {
      console.error("Error saving entry:", error);
      Alert.alert(
        "Save Error",
        "Failed to save your travel entry. Please try again."
      );
    }
  };

  // Determine if the save button should be disabled
  const isSaveDisabled =
    !imageUri ||
    !address ||
    latitude === null ||
    longitude === null ||
    isLoading;

  // Calculate image container style based on image dimensions
  const getImageContainerStyle = () => {
    if (imageUri && imageWidth && imageHeight) {
      // Use the actual aspect ratio of the cropped image
      return {
        aspectRatio: imageWidth / imageHeight,
      };
    }

    // Default aspect ratio for the placeholder
    return {
      aspectRatio: 4 / 3,
    };
  };

  // Render a single mood option
  const renderMoodOption = ({ item }: { item: MoodOption }) => (
    <TouchableOpacity
      style={[
        styles.moodOption,
        selectedMood === item.id && {
          backgroundColor: theme.colors.primary + "20",
          borderColor: theme.colors.primary,
        },
      ]}
      onPress={() => setSelectedMood(item.id)}
    >
      <Text style={styles.moodEmoji}>{item.emoji}</Text>
      <Text
        style={[
          styles.moodLabel,
          { color: theme.colors.text },
          selectedMood === item.id && { color: theme.colors.primary },
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
        },
      ]}
    >
      <View
        style={[
          styles.header,
          {
            borderBottomColor: theme.colors.border,
            paddingTop: insets.top,
          },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          New Snap
        </Text>
        <TouchableOpacity
          onPress={handleSave}
          style={[
            styles.saveButton,
            {
              backgroundColor: isSaveDisabled
                ? theme.colors.border
                : theme.colors.primary,
            },
            isSaveDisabled && styles.saveButtonDisabled,
          ]}
          disabled={isSaveDisabled}
        >
          <Text
            style={[
              styles.saveButtonText,
              { color: theme.dark ? "#F1F0E8" : "#FFFFFF" },
              isSaveDisabled && { opacity: 0.5 },
            ]}
          >
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.imageContainer,
            {
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.card,
            },
            getImageContainerStyle(),
          ]}
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
              <View style={styles.addressHeader}>
                <Ionicons
                  name="location"
                  size={16}
                  color={theme.colors.primary}
                />
                <Text
                  style={[styles.addressLabel, { color: theme.colors.text }]}
                >
                  Location
                </Text>
              </View>
              <Text style={[styles.addressText, { color: theme.colors.text }]}>
                {address}
              </Text>
            </View>
          )
        )}

        {imageUri && (
          <>
            {/* Mood Selection */}
            <View
              style={[
                styles.moodContainer,
                { backgroundColor: theme.colors.card },
              ]}
            >
              <View style={styles.moodHeader}>
                <Text style={styles.moodHeaderEmoji}>😀</Text>
                <Text style={[styles.moodTitle, { color: theme.colors.text }]}>
                  How are you feeling?
                </Text>
              </View>

              <FlatList
                data={MOOD_OPTIONS}
                renderItem={renderMoodOption}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.moodList}
              />
            </View>

            <View
              style={[
                styles.descriptionContainer,
                { backgroundColor: theme.colors.card },
              ]}
            >
              <TextInput
                placeholder="Write a description about your snap!"
                placeholderTextColor={`${theme.colors.text}80`}
                multiline
                style={[styles.descriptionInput, { color: theme.colors.text }]}
                value={description}
                onChangeText={setDescription}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.retakeButton,
                {
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                  borderWidth: 1,
                },
              ]}
              onPress={handleTakePicture}
            >
              <Ionicons name="camera" size={20} color={theme.colors.primary} />
              <Text
                style={[styles.retakeButtonText, { color: theme.colors.text }]}
              >
                Take another picture
              </Text>
            </TouchableOpacity>
          </>
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
    paddingLeft: 40,
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontWeight: "600",
    fontSize: 14,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  imageContainer: {
    width: "100%",
    borderRadius: 12,
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
  freeformHint: {
    marginTop: 4,
    fontSize: 12,
    opacity: 0.7,
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
    borderRadius: 12,
    marginBottom: 16,
  },
  addressHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 6,
  },
  addressText: {
    fontSize: 16,
    lineHeight: 24,
  },
  // Mood selection styles
  moodContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  moodHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  moodHeaderEmoji: {
    fontSize: 18,
    marginRight: 6,
  },
  moodTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 2,
  },
  moodList: {
    paddingVertical: 8,
  },
  moodOption: {
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    marginRight: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "transparent",
    minWidth: 80,
  },
  moodEmoji: {
    fontSize: 30,
    marginBottom: 6,
  },
  moodLabel: {
    marginTop: 2,
    fontSize: 12,
    textAlign: "center",
  },
  descriptionContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  descriptionInput: {
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
    lineHeight: 24,
  },
  retakeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
  },
  retakeButtonText: {
    fontSize: 16,
    marginLeft: 8,
  },
});

export default AddEntryScreen;
