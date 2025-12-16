import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { Geolocation, Position } from '@capacitor/geolocation';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Device } from '@capacitor/device';
import { Network } from '@capacitor/network';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { StatusBar, Style } from '@capacitor/status-bar';

export const useCapacitorFeatures = () => {
  const [isNative, setIsNative] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [networkStatus, setNetworkStatus] = useState<{ connected: boolean; connectionType: string }>({
    connected: true,
    connectionType: 'unknown'
  });

  useEffect(() => {
    const checkPlatform = async () => {
      setIsNative(Capacitor.isNativePlatform());
      
      if (Capacitor.isNativePlatform()) {
        try {
          try {
            // Get device info
            const info = await Device.getInfo();
            const battery = await Device.getBatteryInfo();
            const id = await Device.getId();
            
            setDeviceInfo({
              ...info,
              battery,
              id: id.identifier
            });
          } catch (error) {
            console.error('Error getting device info:', error);
            setDeviceInfo({
              platform: 'android',
              model: 'Unknown',
              operatingSystem: 'Unknown',
              osVersion: 'Unknown',
              manufacturer: 'Unknown',
              isVirtual: false,
              webViewVersion: 'Unknown',
              battery: { batteryLevel: 1, isCharging: false },
              id: 'unknown'
            });
          }

          try {
            // Set up network status listener
            const status = await Network.getStatus();
            setNetworkStatus(status);
            
            Network.addListener('networkStatusChange', (status) => {
              setNetworkStatus(status);
            });
          } catch (error) {
            console.error('Error setting up network status:', error);
            setNetworkStatus({
              connected: true,
              connectionType: 'unknown'
            });
          }

          try {
            // Set up status bar
            if (Capacitor.getPlatform() === 'android') {
              await StatusBar.setBackgroundColor({ color: '#2563eb' });
            }
            await StatusBar.setStyle({ style: Style.Default });
          } catch (error) {
            console.error('Error setting up status bar:', error);
          }
          
          // Request permissions
          await requestPermissions();
        } catch (error) {
          console.error('Error initializing Capacitor features:', error);
        }
      }
    };
    
    checkPlatform();
    
    return () => {
      if (Capacitor.isNativePlatform()) {
        Network.removeAllListeners();
      }
    };
  }, []);
  
  const requestPermissions = async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        try {
          // Request geolocation permission
          await Geolocation.requestPermissions();
        } catch (error) {
          console.error('Error requesting geolocation permissions:', error);
        }

        try {
          // Request camera permission
          await Camera.requestPermissions();
        } catch (error) {
          console.error('Error requesting camera permissions:', error);
        }

        try {
          // Set up local notifications
          await LocalNotifications.requestPermissions();
        } catch (error) {
          console.error('Error requesting notification permissions:', error);
        }
      } catch (error) {
        console.error('Error requesting permissions:', error);
      }
    }
  };
  
  const getCurrentPosition = async (): Promise<Position | null> => {
    if (!Capacitor.isNativePlatform()) {
      // Fallback to browser geolocation
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              coords: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                altitudeAccuracy: position.coords.altitudeAccuracy || null,
                altitude: position.coords.altitude || null,
                speed: position.coords.speed || null,
                heading: position.coords.heading || null
              },
              timestamp: position.timestamp
            });
          },
          (error) => {
            reject(error);
          }
        );
      });
    }
    
    try {
      return await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      });
    } catch (error) {
      console.error('Error getting current position:', error);
      return null;
    }
  };
  
  const takePicture = async () => {
    if (!Capacitor.isNativePlatform()) {
      // Fallback for web
      alert('Camera functionality is only available in the mobile app');
      return null;
    }
    
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera
      });
      
      return image;
    } catch (error) {
      console.error('Error taking picture:', error);
      return null;
    }
  };
  
  const saveFile = async (fileName: string, data: string, mimeType: string) => {
    if (!Capacitor.isNativePlatform()) {
      // Fallback for web - use browser download
      const blob = new Blob([data], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      return null;
    }
    
    try {
      const result = await Filesystem.writeFile({
        path: fileName,
        data: data,
        directory: Directory.Documents,
        recursive: true
      });
      
      return result;
    } catch (error) {
      console.error('Error saving file:', error);
      return null;
    }
  };
  
  const scheduleNotification = async (title: string, body: string, id: number, schedule?: { at: Date }) => {
    if (!Capacitor.isNativePlatform()) {
      // Fallback for web - use browser notification
      if (Notification.permission === 'granted') {
        new Notification(title, { body });
      } else if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          new Notification(title, { body });
        }
      }
      return;
    }
    
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title,
            body,
            id,
            schedule: schedule ? { at: schedule.at } : undefined,
            sound: 'default',
            attachments: [],
            actionTypeId: '',
            extra: null
          }
        ]
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };
  
  const vibrate = (style: 'light' | 'medium' | 'heavy' = 'medium') => {
    if (!Capacitor.isNativePlatform()) {
      // Fallback for web
      if ('vibrate' in navigator) {
        switch (style) {
          case 'light':
            navigator.vibrate(10);
            break;
          case 'medium':
            navigator.vibrate(20);
            break;
          case 'heavy':
            navigator.vibrate(30);
            break;
        }
      }
      return;
    }
    
    try {
      switch (style) {
        case 'light':
          Haptics.impact({ style: ImpactStyle.Light });
          break;
        case 'medium':
          Haptics.impact({ style: ImpactStyle.Medium });
          break;
        case 'heavy':
          Haptics.impact({ style: ImpactStyle.Heavy });
          break;
      }
    } catch (error) {
      console.error('Error with haptic feedback:', error);
    }
  };
  
  return {
    isNative,
    deviceInfo,
    networkStatus,
    getCurrentPosition,
    takePicture,
    saveFile,
    scheduleNotification,
    vibrate
  };
};