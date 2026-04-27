import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export type Coords = {
  latitude: number;
  longitude: number;
};

export type LocationState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'granted'; coords: Coords; city?: string }
  | { status: 'denied'; error: string };

export function useLocation() {
  const [location, setLocation] = useState<LocationState>({ status: 'idle' });

  useEffect(() => {
    request();
  }, []);

  const request = async () => {
    setLocation({ status: 'loading' });

    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      setLocation({ status: 'denied', error: 'Permiso de ubicación denegado' });
      return;
    }

    const result = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const coords = {
      latitude: result.coords.latitude,
      longitude: result.coords.longitude,
    };

    const geo = await Location.reverseGeocodeAsync(coords);

    const city =
      geo?.[0]?.city ||
      geo?.[0]?.region ||
      geo?.[0]?.district ||
      "Ubicación desconocida";

    setLocation({
      status: 'granted',
      coords,
      city,
    });
  };

  return { location, retry: request };
}