import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import React, { createContext, useContext, useEffect, useState } from "react";
import { TravelEntry } from "../types";

interface TravelEntryContextType {
  entries: TravelEntry[];
  addEntry: (entry: Omit<TravelEntry, "id">) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
  loading: boolean;
}

const TravelEntryContext = createContext<TravelEntryContextType | undefined>(
  undefined
);

const ENTRIES_STORAGE_KEY = "travel_diary_entries";

export const TravelEntryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [entries, setEntries] = useState<TravelEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadEntries = async () => {
      try {
        const storedEntries = await AsyncStorage.getItem(ENTRIES_STORAGE_KEY);
        if (storedEntries) {
          setEntries(JSON.parse(storedEntries));
        }
      } catch (error) {
        console.error("Failed to load entries:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEntries();
  }, []);

  const saveEntries = async (updatedEntries: TravelEntry[]) => {
    try {
      await AsyncStorage.setItem(
        ENTRIES_STORAGE_KEY,
        JSON.stringify(updatedEntries)
      );
    } catch (error) {
      console.error("Failed to save entries:", error);
    }
  };

  const addEntry = async (entryData: Omit<TravelEntry, "id">) => {
    const newEntry: TravelEntry = {
      ...entryData,
      id: Date.now().toString(),
    };

    const updatedEntries = [...entries, newEntry];
    setEntries(updatedEntries);
    await saveEntries(updatedEntries);

    try {
      // Ensure notification is triggered properly
      const notificationContent = {
        title: "New Travel Entry Added!",
        body: `Your travel memory at ${newEntry.address} has been saved.`,
        data: { entryId: newEntry.id },
      };

      // Send notification immediately
      await Notifications.scheduleNotificationAsync({
        content: notificationContent,
        trigger: null, // null trigger means immediate delivery
      });

      console.log("Notification scheduled for new entry");
    } catch (error) {
      console.error("Failed to send notification:", error);
    }
  };

  const removeEntry = async (id: string) => {
    const updatedEntries = entries.filter((entry) => entry.id !== id);
    setEntries(updatedEntries);
    await saveEntries(updatedEntries);
  };

  return (
    <TravelEntryContext.Provider
      value={{ entries, addEntry, removeEntry, loading }}
    >
      {children}
    </TravelEntryContext.Provider>
  );
};

export const useTravelEntries = (): TravelEntryContextType => {
  const context = useContext(TravelEntryContext);
  if (!context) {
    throw new Error(
      "useTravelEntries must be used within a TravelEntryProvider"
    );
  }
  return context;
};
