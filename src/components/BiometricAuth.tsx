import React, { useState } from 'react';
import { Fingerprint, Shield, AlertCircle } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { useCapacitorFeatures } from '../hooks/useCapacitorFeatures';

interface BiometricAuthProps {
  onAuthenticated: () => void;
  onCancel: () => void;
  onError?: (error: string) => void;
}

const BiometricAuth: React.FC<BiometricAuthProps> = ({
  onAuthenticated,
  onCancel,
  onError
}) => {
  const { isNative, deviceInfo } = useCapacitorFeatures();
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authenticate = async () => {
    setIsAuthenticating(true);
    setError(null);
    
    if (!isNative) {
      // Web fallback - simulate authentication
      setTimeout(() => {
        setIsAuthenticating(false);
        onAuthenticated();
      }, 1500);
      return;
    }
    
    try {
      // In a real implementation, we would use a native biometric plugin
      // For this demo, we'll simulate success after a delay
      setTimeout(() => {
        setIsAuthenticating(false);
        onAuthenticated();
      }, 1500);
    } catch (err) {
      setIsAuthenticating(false);
      const errorMessage = 'Authentication failed. Please try again.';
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-xl max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Fingerprint className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Biometric Authentication</h2>
        <p className="text-gray-600">
          {isNative 
            ? 'Use your fingerprint or face ID to securely log in' 
            : 'This feature works best in the mobile app'}
        </p>
      </div>
      
      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        <button
          onClick={authenticate}
          disabled={isAuthenticating}
          className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAuthenticating ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              <span>Authenticating...</span>
            </div>
          ) : (
            <>
              <Fingerprint className="h-5 w-5 mr-2" />
              <span>Authenticate</span>
            </>
          )}
        </button>
        
        <button
          onClick={onCancel}
          className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          <span>Use Password Instead</span>
        </button>
      </div>
      
      <div className="mt-6 flex items-center justify-center text-xs text-gray-500">
        <Shield className="h-3 w-3 mr-1" />
        <span>Your biometric data never leaves your device</span>
      </div>
    </div>
  );
};

export default BiometricAuth;