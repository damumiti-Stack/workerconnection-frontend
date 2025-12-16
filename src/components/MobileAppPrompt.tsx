import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Apple, Play } from 'lucide-react';
import { isIOS, isAndroid } from '../utils/pwa';
import { Link } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';

const MobileAppPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Only show on mobile browsers, not in standalone mode
    if (!Capacitor.isNativePlatform() && 
        (isIOS() || isAndroid()) && 
        !window.matchMedia('(display-mode: standalone)').matches) {
      // Check if user has already dismissed the prompt
      const dismissed = localStorage.getItem('mobileAppPromptDismissed');
      if (!dismissed) {
        // Show prompt after 3 seconds
        setTimeout(() => {
          setShowPrompt(true);
        }, 3000);
      }
    }
  }, []);

  const handleDownload = () => {
    if (isIOS()) {
      // Redirect to App Store
      window.location.href = '/downloads/WorkerConnect.ipa';
    } else if (isAndroid()) {
      // Redirect to Play Store
      window.location.href = '/downloads/WorkerConnect.apk';
    }
    handleDismiss();
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Remember user's choice for 30 days
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    localStorage.setItem('mobileAppPromptDismissed', expiryDate.toISOString());
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center p-4">
      <div className="bg-white rounded-t-2xl w-full max-w-md p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Smartphone className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">WorkerConnect App</h3>
              <p className="text-sm text-gray-600">Mobile Application Available</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-gray-700 mb-6 text-sm leading-relaxed">
          Get the best experience with our native mobile app. Enjoy faster performance, 
          offline access, and push notifications for important updates.
        </p>

        <div className="space-y-3">
          <Link
            to="/mobile"
            onClick={() => setShowPrompt(false)}
            className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            <Download className="h-5 w-5 mr-2" />
            {isIOS() ? (
              <>
                <Apple className="h-5 w-5 mr-2" />
                Download from App Store
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-2" />
                Get it on Google Play
              </>
            )}
          </Link>
          
          <button
            onClick={handleDismiss}
            className="w-full px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors text-sm"
          >
            Continue in browser
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Free download • No ads • Secure & trusted
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobileAppPrompt;