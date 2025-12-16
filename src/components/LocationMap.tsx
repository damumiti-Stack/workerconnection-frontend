import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Maximize2, Minimize2, Users, Navigation } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface LocationData {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: 'worker' | 'establishment' | 'department';
  status?: 'online' | 'offline' | 'checked-in' | 'checked-out';
  lastUpdate?: Date;
  accuracy?: number;
}

interface LocationMapProps {
  locations: LocationData[];
  center?: { latitude: number; longitude: number };
  zoom?: number;
  height?: string;
  showControls?: boolean;
  onLocationClick?: (location: LocationData) => void;
}

const LocationMap: React.FC<LocationMapProps> = ({
  locations,
  center,
  zoom = 15,
  height = '400px',
  showControls = true,
  onLocationClick
}) => {
  const { t } = useLanguage();
  const mapRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  // Since we can't use external map libraries, we'll create a simple coordinate display
  // In a real implementation, you would integrate with Google Maps, Mapbox, or OpenStreetMap

  const defaultCenter = center || { latitude: 17.3850, longitude: 78.4867 }; // Hyderabad

  const getMarkerColor = (location: LocationData) => {
    switch (location.type) {
      case 'worker':
        return location.status === 'checked-in' ? '#10b981' : '#6b7280';
      case 'establishment':
        return '#f59e0b';
      case 'department':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (location: LocationData) => {
    if (location.type === 'worker') {
      switch (location.status) {
        case 'checked-in':
          return t('worker.checkedIn');
        case 'checked-out':
          return t('worker.checkedOut');
        case 'online':
          return t('common.online');
        case 'offline':
          return t('common.offline');
        default:
          return t('status.unknown');
      }
    }
    return location.status || t('status.active');
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleLocationSelect = (location: LocationData) => {
    setSelectedLocation(location);
    if (onLocationClick) {
      onLocationClick(location);
    }
  };

  // Simple map visualization using CSS and positioning
  const renderSimpleMap = () => {
    const mapWidth = 100; // percentage
    const mapHeight = 100; // percentage

    return (
      <div className="relative w-full h-full bg-gradient-to-br from-green-100 to-blue-100 rounded-lg overflow-hidden">
        {/* Map Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-10 grid-rows-10 h-full">
            {Array.from({ length: 100 }).map((_, i) => (
              <div key={i} className="border border-gray-300"></div>
            ))}
          </div>
        </div>

        {/* Center Marker */}
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: '50%',
            top: '50%'
          }}
        >
          <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
        </div>

        {/* Location Markers */}
        {locations.map((location, index) => {
          // Calculate relative position based on distance from center
          const distance = calculateDistance(
            defaultCenter.latitude,
            defaultCenter.longitude,
            location.latitude,
            location.longitude
          );
          
          // Simple positioning logic (in real app, use proper map projection)
          const offsetX = (location.longitude - defaultCenter.longitude) * 1000;
          const offsetY = (defaultCenter.latitude - location.latitude) * 1000;
          
          const x = Math.max(5, Math.min(95, 50 + offsetX));
          const y = Math.max(5, Math.min(95, 50 + offsetY));

          return (
            <div
              key={location.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{
                left: `${x}%`,
                top: `${y}%`
              }}
              onClick={() => handleLocationSelect(location)}
            >
              <div 
                className="w-4 h-4 rounded-full border-2 border-white shadow-lg hover:scale-110 transition-transform"
                style={{ backgroundColor: getMarkerColor(location) }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
                  {location.name}
                </div>
              </div>
            </div>
          );
        })}

        {/* Compass */}
        <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg">
          <Navigation className="h-4 w-4 text-gray-600" />
        </div>

        {/* Scale */}
        <div className="absolute bottom-4 left-4 bg-white px-2 py-1 rounded text-xs text-gray-600">
          1km
        </div>
      </div>
    );
  };

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'relative'}`}>
      <div className="card-mobile h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              {t('department.locationMap')}
            </h3>
          </div>
          
          {showControls && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>{locations.length}</span>
              </div>
              <button
                onClick={toggleFullscreen}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Map Container */}
        <div 
          ref={mapRef}
          className="relative rounded-lg border border-gray-200 overflow-hidden"
          style={{ height: isFullscreen ? 'calc(100vh - 120px)' : height }}
        >
          {mapError ? (
            <div className="flex items-center justify-center h-full bg-gray-50">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">{mapError}</p>
              </div>
            </div>
          ) : (
            renderSimpleMap()
          )}
        </div>

        {/* Location List */}
        <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
          {locations.map((location) => (
            <div
              key={location.id}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedLocation?.id === location.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => handleLocationSelect(location)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getMarkerColor(location) }}
                  ></div>
                  <div>
                    <p className="font-medium text-gray-900">{location.name}</p>
                    <p className="text-sm text-gray-600">
                      {getStatusText(location)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                  </p>
                  {location.lastUpdate && (
                    <p className="text-xs text-gray-400">
                      {location.lastUpdate.toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Legend</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>{t('worker.checkedIn')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              <span>{t('worker.checkedOut')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>{t('establishment.establishment')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>{t('department.department')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationMap;