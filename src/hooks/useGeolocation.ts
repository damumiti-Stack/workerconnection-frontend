import { useState, useEffect, useCallback } from 'react';
import { useCapacitorFeatures } from './useCapacitorFeatures';
import { Capacitor } from '@capacitor/core';

interface GeolocationState {
  coordinates: {
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null;
  error: string | null;
  loading: boolean;
  isLocationEnabled: boolean;
}

interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export const useGeolocation = (options: GeolocationOptions = {}) => {
  const { getCurrentPosition: getNativePosition, isNative } = useCapacitorFeatures();
  const [state, setState] = useState<GeolocationState>({
    coordinates: null,
    error: null,
    loading: false,
    isLocationEnabled: false
  });

  const defaultOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 60000,
    ...options
  };

  const getCurrentPosition = useCallback(async () => {
    if (!navigator.geolocation && !isNative) {
      setState(prev => ({
        ...prev,
        error: 'Geolocation is not supported by this browser',
        loading: false
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    // Use Capacitor Geolocation if available
    if (Capacitor.isNativePlatform() && isNative) {
      try {
        const position = await getNativePosition();
        if (position) {
          setState({
            coordinates: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy
            },
            error: null,
            loading: false,
            isLocationEnabled: true
          });
        }
        return;
      } catch (error) {
        setState({
          coordinates: null,
          error: 'Failed to get location. Please check permissions.',
          loading: false,
          isLocationEnabled: false
        });
      }
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          coordinates: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          },
          error: null,
          loading: false,
          isLocationEnabled: true
        });
      },
      (error) => {
        let errorMessage = 'Unable to retrieve location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }

        setState({
          coordinates: null,
          error: errorMessage,
          loading: false,
          isLocationEnabled: false
        });
      },
      defaultOptions
    );
  }, [defaultOptions, isNative, getNativePosition]);

  const watchPosition = useCallback(() => {
    if (!navigator.geolocation && !isNative) {
      setState(prev => ({
        ...prev,
        error: 'Geolocation is not supported by this browser'
      }));
      return null;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setState({
          coordinates: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          },
          error: null,
          loading: false,
          isLocationEnabled: true
        });
      },
      (error) => {
        setState(prev => ({
          ...prev,
          error: error.message,
          loading: false,
          isLocationEnabled: false
        }));
      },
      defaultOptions
    );

    return watchId;
  }, [defaultOptions]);

  const clearWatch = useCallback((watchId: number) => {
    navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    // Check if location services are available
    if ('geolocation' in navigator || isNative) {
      setState(prev => ({ ...prev, isLocationEnabled: true }));
    }
  }, [isNative]);

  return {
    ...state,
    getCurrentPosition,
    watchPosition,
    clearWatch,
    requestPermission: getCurrentPosition
  };
};

// Utility function to calculate distance between two coordinates
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  return distance * 1000; // Convert to meters
};

// Check if user is within allowed radius of work location
export const isWithinWorkLocation = (
  userLat: number,
  userLon: number,
  workLat: number,
  workLon: number,
  allowedRadius: number = 100 // meters
): boolean => {
  const distance = calculateDistance(userLat, userLon, workLat, workLon);
  return distance <= allowedRadius;
};