import React, { useState } from 'react';
import { Download, Smartphone, Phone, Apple, FileText, CheckCircle, AlertCircle, HelpCircle, MapPin, Bell, Camera, Fingerprint, WifiOff } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const MobileDownload: React.FC = () => {
  const { t } = useLanguage();
  const [selectedPlatform, setSelectedPlatform] = useState<'android' | 'ios'>('android');

  const appInfo = {
    version: '1.0.0',
    androidSize: '15 MB',
    iosSize: '18 MB',
    lastUpdated: '2024-06-15',
    androidMinVersion: 'Android 7.0 (API 24)',
    iosMinVersion: 'iOS 12.0'
  };

  const features = [
    { icon: WifiOff, text: t('mobile.offlineAccess'), description: 'Access your data even without internet connection' },
    { icon: Bell, text: t('mobile.pushNotifications'), description: 'Get real-time alerts for important updates' },
    { icon: MapPin, text: t('mobile.locationTracking'), description: 'Accurate GPS-based attendance tracking' },
    { icon: Camera, text: t('mobile.cameraIntegration'), description: 'Scan documents and take photos directly in the app' },
    { icon: Fingerprint, text: t('mobile.biometricAuth'), description: 'Secure login with fingerprint or face recognition' }
  ];

  const androidSteps = [
    'Download the APK file from the link below',
    'Go to Settings > Security > Unknown Sources and enable it',
    'Open the downloaded APK file',
    'Tap "Install" and wait for installation to complete',
    'Open WorkerConnect from your app drawer'
  ];

  const iosSteps = [
    'Download the IPA file from the link below',
    'Install AltStore or similar sideloading tool',
    'Use the tool to install the IPA file',
    'Go to Settings > General > Device Management',
    'Trust the developer certificate',
    'Open WorkerConnect from your home screen'
  ];

  const troubleshooting = [
    {
      problem: 'Installation blocked by security settings',
      solution: 'Enable "Unknown Sources" in Android settings or trust the developer certificate on iOS'
    },
    {
      problem: 'App crashes on startup',
      solution: 'Ensure your device meets the minimum system requirements and restart your device'
    },
    {
      problem: 'Location features not working',
      solution: 'Grant location permissions in app settings and ensure GPS is enabled'
    },
    {
      problem: 'Cannot download files',
      solution: 'Check your internet connection and ensure you have sufficient storage space'
    }
  ];

  const handleDownload = (platform: 'android' | 'ios') => {
    // In a real implementation, these would be actual download links
    if (platform === 'android') {
      window.location.href = '/downloads/WorkerConnect.apk';
    } else {
      window.location.href = '/downloads/WorkerConnect.ipa';
    }
    
    // Show a message to the user
    alert(`Downloading WorkerConnect for ${platform === 'android' ? 'Android' : 'iOS'}. If the download doesn't start automatically, please check your browser settings.`);
  };

  return (
    <div className="min-h-screen py-8 mobile-nav-spacing">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Smartphone className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('mobile.downloadApp')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get the full WorkerConnect experience with our native mobile apps. 
            Available for Android and iOS devices.
          </p>
        </div>

        {/* Platform Selection */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setSelectedPlatform('android')}
              className={`flex items-center px-6 py-3 rounded-md transition-colors ${
                selectedPlatform === 'android'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <Phone className="h-5 w-5 mr-2" />
              Android
            </button>
            <button
              onClick={() => setSelectedPlatform('ios')}
              className={`flex items-center px-6 py-3 rounded-md transition-colors ${
                selectedPlatform === 'ios'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <Apple className="h-5 w-5 mr-2" />
              iOS
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Download Section */}
          <div className="card-mobile">
            <div className="text-center mb-6">
              {selectedPlatform === 'android' ? (
                <Phone className="h-16 w-16 text-green-600 mx-auto mb-4" />
              ) : (
                <Apple className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              )}
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                WorkerConnect for {selectedPlatform === 'android' ? 'Android' : 'iOS'}
              </h2>
              <p className="text-gray-600">
                {t('mobile.version')}: {appInfo.version}
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">{t('mobile.fileSize')}:</span>
                <span className="font-medium">
                  {selectedPlatform === 'android' ? appInfo.androidSize : appInfo.iosSize}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('mobile.lastUpdated')}:</span>
                <span className="font-medium">{appInfo.lastUpdated}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('mobile.requirements')}:</span>
                <span className="font-medium text-sm">
                  {selectedPlatform === 'android' ? appInfo.androidMinVersion : appInfo.iosMinVersion}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleDownload(selectedPlatform)}
              className={`w-full flex items-center justify-center px-6 py-4 rounded-lg text-white font-semibold text-lg transition-colors ${
                selectedPlatform === 'android' 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <Download className="h-5 w-5 mr-2" />
              {selectedPlatform === 'android' ? t('mobile.downloadApk') : t('mobile.downloadIpa')}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              By downloading, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>

          {/* Features */}
          <div className="card-mobile space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">{t('mobile.features')}</h3>
            <div className="space-y-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{feature.text}</h4>
                      <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Mobile App Advantages</h4>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-blue-600" />
                  <span>Faster performance than web version</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-blue-600" />
                  <span>Works without internet connection</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-blue-600" />
                  <span>Enhanced security with biometric authentication</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-blue-600" />
                  <span>Direct access to device features (camera, GPS)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-blue-600" />
                  <span>Reduced data usage and battery optimization</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Installation Instructions */}
        <div className="card-mobile mt-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            {t('mobile.installSteps')} - {selectedPlatform === 'android' ? 'Android' : 'iOS'}
          </h3>
          <div className="space-y-4">
            {(selectedPlatform === 'android' ? androidSteps : iosSteps).map((step, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <p className="text-gray-700">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="card-mobile mt-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            <HelpCircle className="h-6 w-6 inline mr-2" />
            {t('mobile.troubleshooting')}
          </h3>
          <div className="space-y-6">
            {troubleshooting.map((item, index) => (
              <div key={index} className="border-l-4 border-yellow-400 pl-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  <AlertCircle className="h-4 w-4 inline mr-1 text-yellow-600" />
                  {item.problem}
                </h4>
                <p className="text-gray-600">{item.solution}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Support */}
        <div className="card-mobile mt-8 bg-blue-50 border-blue-200">
          <div className="text-center">
            <h3 className="text-xl font-bold text-blue-900 mb-4">
              {t('mobile.support')}
            </h3>
            <p className="text-blue-800 mb-6">
              Having trouble with installation or need technical assistance?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@workerconnect.gov.in"
                className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FileText className="h-4 w-4 mr-2" />
                Email Support
              </a>
              <a
                href="tel:1800-123-4567"
                className="flex items-center justify-center px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
              >
                <Smartphone className="h-4 w-4 mr-2" />
                Call Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileDownload;