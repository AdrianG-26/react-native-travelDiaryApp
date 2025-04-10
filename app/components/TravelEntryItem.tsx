import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const formatDate = (timestamp: number) => {
    const now = new Date();
    const entryDate = new Date(timestamp);
    const diffInMS = now.getTime() - entryDate.getTime();
    const diffInHours = diffInMS / (1000 * 60 * 60);

    if (diffInHours < 1) {
      // Less than an hour ago
      const minutes = Math.floor(diffInMS / (1000 * 60));
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    } else if (diffInHours < 24) {
      // Less than a day ago
      const hours = Math.floor(diffInHours);
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else if (diffInHours < 48) {
      // Yesterday
      return "Yesterday";
    } else {
      // More than 2 days ago
      return entryDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  };

  const handleRemove = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setShowDeleteModal(false);
    removeEntry(entry.id);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
          borderWidth: theme.dark ? 0 : 1,
        },
      ]}
    >
      {/* Post Header */}
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <Ionicons
            name="location-outline"
            size={16}
            color={theme.colors.primary}
            style={styles.locationIcon}
          />
          <Text
            style={[styles.locationText, { color: theme.colors.text }]}
            numberOfLines={1}
          >
            {entry.address}
          </Text>
        </View>
        <TouchableOpacity onPress={handleRemove} style={styles.optionsButton}>
          <Ionicons
            name="trash-outline"
            size={20}
            color={theme.colors.notification}
          />
        </TouchableOpacity>
      </View>

      {/* Post Image */}
      <Image
        source={{ uri: entry.imageUri }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Action Bar */}
      <View
        style={[
          styles.actionBar,
          { borderBottomColor: theme.colors.border, borderBottomWidth: 1 },
        ]}
      >
        <Text style={[styles.timestamp, { color: theme.colors.text }]}>
          {formatDate(entry.timestamp)}
        </Text>
      </View>

      {/* Description */}
      {entry.description && (
        <View style={styles.captionContainer}>
          <Text style={[styles.description, { color: theme.colors.text }]}>
            {entry.description}
          </Text>
        </View>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showDeleteModal}
        onRequestClose={cancelDelete}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.colors.card },
            ]}
          >
            <View style={styles.modalHeader}>
              <Ionicons
                name="alert-circle-outline"
                size={32}
                color={theme.colors.notification}
              />
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                Delete Travel Memory
              </Text>
            </View>

            <Text style={[styles.modalMessage, { color: theme.colors.text }]}>
              Are you sure you want to delete this travel memory? This action
              cannot be undone.
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.cancelButton,
                  { borderColor: theme.colors.border },
                ]}
                onPress={cancelDelete}
              >
                <Text style={[styles.buttonText, { color: theme.colors.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.deleteButton,
                  { backgroundColor: theme.colors.notification },
                ]}
                onPress={confirmDelete}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    marginBottom: 16,
    marginHorizontal: 8,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  locationIcon: {
    marginRight: 6,
  },
  locationText: {
    fontSize: 14,
    fontWeight: "600",
  },
  optionsButton: {
    padding: 4,
  },
  image: {
    width: "100%",
    height: width - 16,
    backgroundColor: "#EFEFEF",
  },
  actionBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  timestamp: {
    fontSize: 12,
    opacity: 0.7,
  },
  captionContainer: {
    padding: 12,
    paddingTop: 10,
    paddingBottom: 16,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "90%",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 8,
  },
  modalMessage: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    minWidth: "45%",
    alignItems: "center",
  },
  cancelButton: {
    borderWidth: 1,
  },
  deleteButton: {},
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  deleteButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default TravelEntryItem;
