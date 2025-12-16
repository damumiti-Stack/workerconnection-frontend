import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCardReader } from '../hooks/useCardReader';
import { cardScanRedirect } from '../api/api';
import { Layout, ScanLine } from 'lucide-react';

const WorkerCardLogin: React.FC = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);

    const handleCardScan = (cardId: string) => {
        setIsScanning(true);
        setError(null);
        try {
            // Initiate redirection to SAML login via backend
            cardScanRedirect(cardId);
            // We are redirecting, so maybe show a spinner or wait
            // The browser will unload this page if redirect happens via window.location
        } catch (err: any) {
            setError("Failed to process card scan. Please try again.");
            setIsScanning(false);
        }
    };

    // Listen for HID keyboard input (card reader)
    useCardReader({
        onScan: handleCardScan,
        minLength: 5
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="flex justify-center mb-6">
                    <div className="bg-blue-100 p-4 rounded-full animate-pulse">
                        <ScanLine className="w-12 h-12 text-blue-600" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-800 mb-2">Worker Login</h1>
                <p className="text-gray-500 mb-8">Please scan your access card to login</p>

                {isScanning ? (
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                        <p className="text-blue-600 font-medium">Processing scan...</p>
                    </div>
                ) : (
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <p className="text-sm text-gray-400">
                            Ready to scan...
                        </p>
                    </div>
                )}

                {error && (
                    <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorkerCardLogin;
