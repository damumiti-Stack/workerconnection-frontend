import React, { useEffect, useState } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { useCapacitorFeatures } from '../hooks/useCapacitorFeatures';

const OfflineIndicator: React.FC = () => {
  const { networkStatus, isNative } = useCapacitorFeatures();
  const [showBanner, setShowBanner] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [connectionType, setConnectionType] = useState<string>('unknown');

  useEffect(() => {
    // For web fallback
    const handleOnline = () => {
      setIsOnline(true);
      setShowBanner(false);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
    };

    if (!isNative) {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      setIsOnline(navigator.onLine);
    } else {
      // For native apps, use Capacitor Network plugin
      setIsOnline(networkStatus.connected);
      setConnectionType(networkStatus.connectionType);
    }

    return () => {
      if (!isNative) {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    };
  }, [isNative, networkStatus]);

  useEffect(() => {
    if (isNative) {
      setIsOnline(networkStatus.connected);
      setConnectionType(networkStatus.connectionType);
      
      if (!networkStatus.connected) {
        setShowBanner(true);
      } else {
        // Hide banner after a delay when coming back online
        const timer = setTimeout(() => {
          setShowBanner(false);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [networkStatus, isNative]);

  if (!showBanner) {
    return null;
  }

  return (
    <div className={`fixed top-16 left-0 right-0 z-50 px-4 py-2 text-white ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}>
      <div className="flex items-center justify-center">
        {isOnline ? (
          <>
            <Wifi className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">
              Back online. Connection: {connectionType}
            </span>
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">
              You're offline. Some features may not be available.
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default OfflineIndicator;