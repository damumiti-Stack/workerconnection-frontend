import React, { useState } from 'react';
import { Camera, X, Check, RotateCcw } from 'lucide-react';
import { useCapacitorFeatures } from '../hooks/useCapacitorFeatures';
import { Capacitor } from '@capacitor/core';

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onCancel: () => void;
  label?: string;
  required?: boolean;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({
  onCapture,
  onCancel,
  label = 'Take Photo',
  required = false
}) => {
  const { isNative, takePicture } = useCapacitorFeatures();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const handleCapture = async () => {
    setIsCapturing(true);
    
    try {
      if (isNative) {
        const photo = await takePicture();
        if (photo && photo.webPath) {
          setImageUrl(photo.webPath);
        }
      } else {
        // Web fallback using file input
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'environment';
        
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = () => {
              const result = reader.result as string;
              setImageUrl(result);
            };
            reader.readAsDataURL(file);
          }
        };
        
        input.click();
      }
    } catch (error) {
      console.error('Error capturing image:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleConfirm = () => {
    if (imageUrl) {
      onCapture(imageUrl);
    }
  };

  const handleRetake = () => {
    setImageUrl(null);
  };

  return (
    <div className="w-full">
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>
      
      {!imageUrl ? (
        <button
          onClick={handleCapture}
          disabled={isCapturing}
          className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
        >
          {isCapturing ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
              <span>Capturing...</span>
            </div>
          ) : (
            <>
              <Camera className="h-5 w-5 mr-2 text-blue-600" />
              <span>{Capacitor.isNativePlatform() ? 'Take Photo' : 'Upload Photo'}</span>
            </>
          )}
        </button>
      ) : (
        <div className="space-y-3">
          <div className="relative border border-gray-200 rounded-lg overflow-hidden">
            <img 
              src={imageUrl} 
              alt="Captured" 
              className="w-full h-auto object-contain max-h-64"
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleRetake}
              className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Retake
            </button>
            
            <button
              onClick={handleConfirm}
              className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Check className="h-4 w-4 mr-2" />
              Use Photo
            </button>
            
            <button
              onClick={onCancel}
              className="flex items-center justify-center px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;