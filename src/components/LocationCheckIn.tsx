import React, { useState, useEffect } from 'react';
import { MapPin, Clock, CheckCircle, XCircle, AlertTriangle, Loader } from 'lucide-react';
import { useGeolocation, isWithinWorkLocation } from '../hooks/useGeolocation';
import { useLanguage } from '../contexts/LanguageContext';
import { useCapacitorFeatures } from '../hooks/useCapacitorFeatures';

interface LocationCheckInProps {
  workLocation?: {
    latitude: number;
    longitude: number;
    name: string;
    allowedRadius?: number;
  };
  onCheckIn: (coordinates: { latitude: number; longitude: number; timestamp: Date }) => void;
  onCheckOut: (coordinates: { latitude: number; longitude: number; timestamp: Date }) => void;
  isCheckedIn: boolean;
  lastCheckInTime?: Date;
}

const LocationCheckIn: React.FC<LocationCheckInProps> = ({
  workLocation,
  onCheckIn,
  onCheckOut,
  isCheckedIn,
  lastCheckInTime
}) => {
  const { t } = useLanguage();
  const { coordinates, error, loading, getCurrentPosition, isLocationEnabled } = useGeolocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const { vibrate, isNative } = useCapacitorFeatures();
  const [locationStatus, setLocationStatus] = useState<'unknown' | 'allowed' | 'restricted'>('unknown');

  // Check location status when coordinates change
  useEffect(() => {
    if (coordinates && workLocation) {
      const withinLocation = isWithinWorkLocation(
        coordinates.latitude,
        coordinates.longitude,
        workLocation.latitude,
        workLocation.longitude,
        workLocation.allowedRadius || 100
      );
      setLocationStatus(withinLocation ? 'allowed' : 'restricted');
    }
  }, [coordinates, workLocation]);

  const handleCheckIn = async () => {
    if (!coordinates) {
      getCurrentPosition();
      return;
    }

    if (workLocation && locationStatus === 'restricted') {
      vibrate('heavy');
      return;
    }

    setIsProcessing(true);
    vibrate('medium');

    try {
      await onCheckIn({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Check-in failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckOut = async () => {
    if (!coordinates) {
      getCurrentPosition();
      return;
    }

    setIsProcessing(true);
    vibrate('medium');

    try {
      await onCheckOut({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Check-out failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getLocationStatusIcon = () => {
    switch (locationStatus) {
      case 'allowed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'restricted':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getLocationStatusText = () => {
    switch (locationStatus) {
      case 'allowed':
        return t('worker.locationAllowed');
      case 'restricted':
        return t('worker.locationRestricted');
      default:
        return t('worker.locationUnknown');
    }
  };

  return (
    <div className="card-mobile">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {t('worker.attendance')}
        </h3>
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-600">
            {new Date().toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })}
          </span>
        </div>
      </div>

      {/* Location Status */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 flex items-center">
            {t('worker.locationStatus')}
            {isNative && <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Native GPS</span>}
          </span>
          {loading && <Loader className="h-4 w-4 animate-spin text-blue-500" />}
        </div>
        
        {/* <div className={`flex items-center space-x-2 p-3 rounded-lg ${
          locationStatus === 'allowed' ? 'bg-green-50 border border-green-200' :
          locationStatus === 'restricted' ? 'bg-red-50 border border-red-200' :
          'bg-yellow-50 border border-yellow-200'
        }`}>
          {getLocationStatusIcon()}
          <span className={`text-sm font-medium ${
            locationStatus === 'allowed' ? 'text-green-700' :
            locationStatus === 'restricted' ? 'text-red-700' :
            'text-yellow-700'
          }`}>
            {getLocationStatusText()}
          </span>
        </div> */}

        {error && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
            <button
              onClick={getCurrentPosition}
              className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium"
            >
              {t('common.retry')}
            </button>
          </div>
        )}
      </div>

      {/* Current Location Display */}
      {coordinates && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              {t('worker.currentLocation')}
            </span>
          </div>
          <div className="text-xs text-gray-600 space-y-1">
            <div>Latitude: {coordinates.latitude.toFixed(6)}</div>
            <div>Longitude: {coordinates.longitude.toFixed(6)}</div>
            <div>Accuracy: ±{Math.round(coordinates.accuracy)}m</div>
          </div>
        </div>
      )}

      {/* Work Location Info */}
      {workLocation && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <MapPin className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-700">
              {t('worker.workLocation')}
            </span>
          </div>
          <div className="text-sm text-blue-600">
            {workLocation.name}
          </div>
          <div className="text-xs text-blue-500 mt-1">
            Allowed radius: {workLocation.allowedRadius || 100}m
          </div>
        </div>
      )}

      {/* Check-in Status */}
      {isCheckedIn && lastCheckInTime && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-green-700">
              {t('worker.checkedInAt')} {formatTime(lastCheckInTime)}
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {!isCheckedIn ? (
          <button
            onClick={handleCheckIn}
            disabled={
              isProcessing || 
              loading || 
              !isLocationEnabled || 
              (workLocation && locationStatus === 'restricted')
            }
            className={`w-full btn-mobile font-semibold ${
              workLocation && locationStatus === 'restricted'
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <Loader className="h-4 w-4 animate-spin mr-2" />
                {t('worker.checkingIn')}
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                {t('worker.checkIn')}
              </div>
            )}
          </button>
        ) : (
          <button
            onClick={handleCheckOut}
            disabled={isProcessing || loading || !isLocationEnabled}
            className="w-full btn-mobile bg-red-600 text-white hover:bg-red-700 font-semibold"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <Loader className="h-4 w-4 animate-spin mr-2" />
                {t('worker.checkingOut')}
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <XCircle className="h-4 w-4 mr-2" />
                {t('worker.checkOut')}
              </div>
            )}
          </button>
        )}

        {/* {!coordinates && !loading && (
          <button
            onClick={getCurrentPosition}
            className="w-full btn-mobile bg-blue-600 text-white hover:bg-blue-700 font-semibold"
          >
            <div className="flex items-center justify-center">
              <MapPin className="h-4 w-4 mr-2" />
              {t('worker.getLocation')}
            </div>
          </button>
        )} */}
      </div>

      {/* Location Permission Help */}
      {!isLocationEnabled && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-700 mb-1">
                {t('worker.locationPermissionRequired')}
              </p>
              <p className="text-xs text-yellow-600">
                {t('worker.locationPermissionHelp')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationCheckIn;