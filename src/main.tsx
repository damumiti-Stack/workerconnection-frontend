import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Capacitor } from '@capacitor/core';
import App from './App.tsx';
import './index.css';
import { registerServiceWorker, requestNotificationPermission } from './utils/pwa';
import { initializeCapacitorPlugins } from './utils/capacitor-plugins';

// Add error handling for initialization
const initApp = async () => {
  try {
    // Only register service worker for PWA functionality in web context
    if (!Capacitor.isNativePlatform()) {
      await registerServiceWorker();
    } else {
      // Initialize Capacitor plugins for native platforms
      await initializeCapacitorPlugins();
    }

    // Request notification permission
    await requestNotificationPermission();

    // Render the app
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } catch (error) {
    console.error('Error initializing app:', error);
    // Render the app anyway to avoid blank screen
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  }
};

// Start the app
initApp();