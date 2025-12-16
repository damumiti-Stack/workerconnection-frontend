import React, { useState } from 'react';
import { ScanLine, FileText, Check, X, RotateCcw } from 'lucide-react';
import { useCapacitorFeatures } from '../hooks/useCapacitorFeatures';
import { Capacitor } from '@capacitor/core';

interface DocumentScannerProps {
  onScan: (documentData: string) => void;
  onCancel: () => void;
  documentType?: string;
}

const DocumentScanner: React.FC<DocumentScannerProps> = ({
  onScan,
  onCancel,
  documentType = 'Document'
}) => {
  const { isNative, takePicture } = useCapacitorFeatures();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleScan = async () => {
    setIsScanning(true);
    
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
      console.error('Error scanning document:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const handleConfirm = () => {
    if (imageUrl) {
      setIsProcessing(true);
      
      // Simulate document processing
      setTimeout(() => {
        onScan(imageUrl);
        setIsProcessing(false);
      }, 1500);
    }
  };

  const handleRetake = () => {
    setImageUrl(null);
  };

  return (
    <div className="w-full">
      <div className="mb-2">
        <h3 className="text-lg font-semibold text-gray-900">Scan {documentType}</h3>
        <p className="text-sm text-gray-600">
          Document should be clear and all text must be readable
        </p>
      </div>
      
      {!imageUrl ? (
        <button
          onClick={handleScan}
          disabled={isScanning}
          className="w-full flex flex-col items-center justify-center px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
        >
          {isScanning ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3"></div>
              <span>Scanning...</span>
            </div>
          ) : (
            <>
              <ScanLine className="h-10 w-10 text-blue-600 mb-3" />
              <span className="font-medium">{Capacitor.isNativePlatform() ? 'Scan Document' : 'Upload Document'}</span>
              <span className="text-sm text-gray-500 mt-1">Tap to {Capacitor.isNativePlatform() ? 'scan' : 'upload'}</span>
            </>
          )}
        </button>
      ) : (
        <div className="space-y-4">
          <div className="relative border border-gray-200 rounded-lg overflow-hidden">
            <img 
              src={imageUrl} 
              alt="Scanned Document" 
              className="w-full h-auto object-contain max-h-80"
            />
            <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          
          {isProcessing ? (
            <div className="flex items-center justify-center py-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
              <span>Processing document...</span>
            </div>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleRetake}
                className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Rescan
              </button>
              
              <button
                onClick={handleConfirm}
                className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Check className="h-4 w-4 mr-2" />
                Confirm
              </button>
              
              <button
                onClick={onCancel}
                className="flex items-center justify-center px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentScanner;