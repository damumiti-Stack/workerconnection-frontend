// PWA utilities
import { Capacitor } from '@capacitor/core';

export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('SW registered: ', registration);
      return registration;
    } catch (registrationError) {
      console.log('SW registration failed: ', registrationError);
    }
  }
};

export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
};

export const isStandalone = () => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone ||
         document.referrer.includes('android-app://');
};

export const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

export const isAndroid = () => {
  return /Android/.test(navigator.userAgent);
};

export const isMobile = () => {
  return isIOS() || isAndroid() || window.innerWidth <= 768;
};

export const showInstallPrompt = (deferredPrompt: any) => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    return deferredPrompt.userChoice;
  }
  return Promise.resolve({ outcome: 'dismissed' });
};

// Haptic feedback for mobile devices
export const hapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'light') => {
  // This is now handled by useCapacitorFeatures
  if (!Capacitor.isNativePlatform() && 'vibrate' in navigator) {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30]
    };
    navigator.vibrate(patterns[type]);
  }
};

// Check if app is installed
export const isAppInstalled = () => {
  return Capacitor.isNativePlatform() || isStandalone();
};

// Get device info
export const getDeviceInfo = () => {
  return {
    isCapacitor: Capacitor.isNativePlatform(),
    platform: Capacitor.getPlatform(),
    userAgent: navigator.userAgent,
    language: navigator.language,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    screenWidth: screen.width,
    screenHeight: screen.height,
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
    isStandalone: isStandalone(),
    isMobile: isMobile(),
    isIOS: isIOS(),
    isAndroid: isAndroid()
  };
};