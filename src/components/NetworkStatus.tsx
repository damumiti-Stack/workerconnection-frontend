import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { useNetwork } from '../hooks/useNetwork';

const NetworkStatus: React.FC = () => {
  const { isOnline, connectionType } = useNetwork();

  if (isOnline) {
    return null; // Don't show anything when online
  }

  return (
    <div className="fixed top-16 left-0 right-0 bg-red-500 text-white px-4 py-2 z-50">
      <div className="flex items-center justify-center">
        <WifiOff className="h-4 w-4 mr-2" />
        <span className="text-sm font-medium">
          You're offline. Some features may not be available.
        </span>
      </div>
    </div>
  );
};

export default NetworkStatus;