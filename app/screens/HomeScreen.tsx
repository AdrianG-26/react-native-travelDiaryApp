import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import EmptyState from "../components/EmptyState";
import ThemeToggle from "../components/ThemeToggle";
import TravelEntryItem from "../components/TravelEntryItem";
import { useTheme } from "../context/ThemeContext";
import { useTravelEntries } from "../context/TravelEntryContext";
import { TravelEntry } from "../types";
import { HomeScreenProps } from "../types/navigation";
import {
  requestNotificationPermission,
  setupNotifications,
} from "../utils/permissions";

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { theme, themeMode } = useTheme();
  const { entries, loading } = useTravelEntries();

  useEffect(() => {
    // Setup notifications when the app starts
    const initNotifications = async () => {
      await setupNotifications();
      await requestNotificationPermission();
    };

    initNotifications();
  }, []);

  const renderItem = ({ item }: { item: TravelEntry }) => (
    <TravelEntryItem entry={item} />
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
      {/* App header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 12,
          },
        ]}
      >
        {/* Logo image based on theme */}
        <View style={styles.logoContainer}>
          <Image
            source={
              themeMode === "dark"
                ? require("../../assets/logo/snaplog-logo2.png")
                : require("../../assets/logo/snaplog-logo1.png")
            }
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.headerIcons}>
          <ThemeToggle />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          style={styles.loader}
        />
      ) : (
        <FlatList
          data={entries}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={
            entries.length === 0 ? styles.emptyList : styles.list
          }
          ListEmptyComponent={
            <EmptyState
              message="Start snapping!"
              icon="camera"
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate("AddEntry")}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
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
    paddingRight: 20,
    paddingBottom: 16,
    marginBottom: 8,
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  logoImage: {
    height: 48,
    width: 180,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  list: {
    paddingTop: 8,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default HomeScreen;
