import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { Camera } from '@capacitor/camera';
import { Filesystem } from '@capacitor/filesystem';
import { Device } from '@capacitor/device';
import { Network } from '@capacitor/network';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Haptics } from '@capacitor/haptics';
import { StatusBar } from '@capacitor/status-bar';
import { PushNotifications } from '@capacitor/push-notifications';

// Initialize and export Capacitor plugins
export const initializeCapacitorPlugins = async () => {
  if (!Capacitor.isNativePlatform()) {
    console.log('Not running on a native platform, skipping Capacitor plugin initialization');
    return;
  }

  try {
    console.log('Initializing Capacitor plugins...');

    // Add error handling for each plugin initialization
    try {
      // Request permissions
      await Geolocation.requestPermissions();
      console.log('Geolocation permissions requested');
    } catch (error) {
      console.error('Error requesting Geolocation permissions:', error);
    }
    
    try {
      await Camera.requestPermissions();
      console.log('Camera permissions requested');
    } catch (error) {
      console.error('Error requesting Camera permissions:', error);
    }
    
    try {
      await LocalNotifications.requestPermissions();
      console.log('LocalNotifications permissions requested');
    } catch (error) {
      console.error('Error requesting LocalNotifications permissions:', error);
    }
    
    try {
      // Set up push notifications
      await PushNotifications.requestPermissions();
      await PushNotifications.register();
      console.log('Push notifications registered');
    } catch (error) {
      console.error('Error setting up push notifications:', error);
    }
    
    try {
      // Set up status bar
      if (Capacitor.getPlatform() === 'android') {
        await StatusBar.setBackgroundColor({ color: '#2563eb' });
        console.log('Status bar color set');
      }
    } catch (error) {
      console.error('Error setting status bar color:', error);
    }
    
    console.log('Capacitor plugins initialized successfully');
  } catch (error) {
    console.error('Error initializing Capacitor plugins:', error);
  }
};

// Export plugins for direct use
export {
  Geolocation,
  Camera,
  Filesystem,
  Device,
  Network,
  LocalNotifications,
  Haptics,
  StatusBar,
  PushNotifications
};