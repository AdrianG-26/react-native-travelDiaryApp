import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useTravelEntries } from "../context/TravelEntryContext";
import { TravelEntry } from "../types";

interface TravelEntryItemProps {
  entry: TravelEntry;
}

const { width } = Dimensions.get("window");

const TravelEntryItem: React.FC<TravelEntryItemProps> = ({ entry }) => {
  const { theme } = useTheme();
  const { removeEntry } = useTravelEntries();

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleRemove = () => {
    removeEntry(entry.id);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
      <Image
        source={{ uri: entry.imageUri }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.contentContainer}>
        <Text style={[styles.address, { color: theme.colors.text }]}>
          {entry.address}
        </Text>
        <Text style={[styles.date, { color: theme.colors.text }]}>
          {formatDate(entry.timestamp)}
        </Text>
      </View>
      <TouchableOpacity
        style={[
          styles.removeButton,
          { backgroundColor: theme.colors.notification },
        ]}
        onPress={handleRemove}
      >
        <Ionicons name="trash-outline" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    overflow: "hidden",
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: "100%",
    height: 200,
  },
  contentContainer: {
    padding: 12,
  },
  address: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    opacity: 0.8,
  },
  removeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default TravelEntryItem;
