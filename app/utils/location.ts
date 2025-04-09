import * as Location from "expo-location";

export interface GeocodedAddress {
  address: string;
  city?: string;
  region?: string;
  country?: string;
  postalCode?: string;
  latitude: number;
  longitude: number;
}

export const getCurrentLocation =
  async (): Promise<Location.LocationObject> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        throw new Error("Location permission not granted");
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      return location;
    } catch (error) {
      console.error("Error getting location:", error);
      throw error;
    }
  };

export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<GeocodedAddress> => {
  try {
    const result = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (result.length === 0) {
      throw new Error("No address found for the coordinates");
    }

    const location = result[0];

    // Format the address
    const street = location.street ? `${location.street}, ` : "";
    const city = location.city ? `${location.city}, ` : "";
    const region = location.region ? `${location.region}, ` : "";
    const country = location.country || "";

    const formattedAddress = `${street}${city}${region}${country}`.trim();

    return {
      address: formattedAddress,
      city: location.city,
      region: location.region,
      country: location.country,
      postalCode: location.postalCode,
      latitude,
      longitude,
    };
  } catch (error) {
    console.error("Error reverse geocoding:", error);
    throw error;
  }
};
