import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getWorkerDashboardDetails, checkInOrOut } from '../api/api';
import { useCardReader } from '../hooks/useCardReader';
import { LogOut, MapPin, Clock, User as UserIcon, Building, ScanLine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardData {
    worker: {
        fullName: string;
        accessCardId: string;
        workerId: string;
    };
    establishment: {
        name: string;
        workLocation: string;
        id: number;
    };
    attendance: {
        status: 'checked-in' | 'checked-out' | 'none';
        lastTime: string | null;
    };
}

const WorkerDynamicDashboard: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [processingAttendance, setProcessingAttendance] = useState(false);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            // Fetch consolidated details
            // Note: In real implementation, these might be separate calls or one aggregate
            const details = await getWorkerDashboardDetails();

            // Transform API response to our local state shape
            setData({
                worker: {
                    fullName: details.worker.fullName,
                    accessCardId: details.worker.accessCardId,
                    workerId: String(details.worker.id)
                },
                establishment: {
                    name: details.establishment.name,
                    workLocation: details.establishment.workLocation,
                    id: details.establishment.id
                },
                attendance: {
                    status: details.attendance.status,
                    lastTime: details.attendance.status === 'checked-in' ? details.attendance.lastCheckIn : details.attendance.lastCheckOut
                }
            });
        } catch (error) {
            console.error("Failed to load dashboard", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleLogout = async () => {
        // Call backend logout
        // Then clear local session
        logout();
        navigate('/login/card');
    };

    const handleCardScan = async (scannedId: string) => {
        // 1. If scanned ID matches current user, toggle attendance
        if (data?.worker.accessCardId === scannedId) {
            await toggleAttendance();
        } else {
            // 2. If different card, log out and redirect (fast switch)
            console.log("Different card scanned, logging out...");
            await handleLogout();
            // Redirect to login (or re-trigger scan processing there)
            // navigate('/login/card'); 
            // Ideally we might want to pass the new card ID to the login page to auto-submit?
            // For now, simple security: logout.
        }
    };

    const toggleAttendance = async () => {
        if (!data || processingAttendance) return;

        setProcessingAttendance(true);
        try {
            // Determine action
            const newStatus = data.attendance.status === 'checked-in' ? 'o' : 'i';

            // Call API
            await checkInOrOut({
                attendanceId: 0, // Backend logic usually handles finding the open record for 'o'
                establishmentId: data.establishment.id,
                workerId: parseInt(data.worker.workerId),
                estmtWorkerId: 0, // Assuming backend can infer or we have it
                workLocation: data.establishment.workLocation,
                status: newStatus,
                checkInDateTime: newStatus === 'i' ? new Date().toISOString() : null,
                checkOutDateTime: newStatus === 'o' ? new Date().toISOString() : null
            });

            // Refresh data
            await fetchDashboardData();

        } catch (error) {
            console.error("Attendance update failed", error);
            alert("Failed to update attendance. Please try again.");
        } finally {
            setProcessingAttendance(false);
        }
    };

    useCardReader({ onScan: handleCardScan });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!data) {
        return <div className="p-8 text-center text-red-500">Failed to load worker data.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">Worker Dashboard</h1>
                <button
                    onClick={handleLogout}
                    className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
                >
                    <LogOut className="w-5 h-5 mr-2" />
                    Logout
                </button>
            </header>

            <main className="max-w-4xl mx-auto p-6 space-y-6">

                {/* Worker Info Card */}
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{data.worker.fullName}</h2>
                            <div className="flex items-center text-gray-600 mb-1">
                                <UserIcon className="w-4 h-4 mr-2" />
                                <span>ID: {data.worker.workerId}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <ScanLine className="w-4 h-4 mr-2" />
                                <span>Card: {data.worker.accessCardId}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center text-gray-700 font-medium mb-1 justify-end">
                                <Building className="w-4 h-4 mr-2 text-gray-500" />
                                {data.establishment.name}
                            </div>
                            <div className="flex items-center text-gray-500 text-sm justify-end">
                                <MapPin className="w-4 h-4 mr-2" />
                                {data.establishment.workLocation}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Attendance Action Card */}
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    <div className={`inline-flex p-4 rounded-full mb-4 ${data.attendance.status === 'checked-in' ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                        <Clock className={`w-12 h-12 ${data.attendance.status === 'checked-in' ? 'text-green-600' : 'text-gray-600'
                            }`} />
                    </div>

                    <h3 className="text-xl font-semibold mb-2">
                        {data.attendance.status === 'checked-in' ? 'Currently Working' : 'Currently Away'}
                    </h3>

                    <p className="text-gray-500 mb-8">
                        {data.attendance.status === 'checked-in'
                            ? `Checked in at `
                            : `Last checked out: `}
                        {data.attendance.lastTime ? new Date(data.attendance.lastTime).toLocaleString() : 'N/A'}
                    </p>

                    <button
                        onClick={toggleAttendance}
                        disabled={processingAttendance}
                        className={`px-8 py-3 rounded-lg font-bold text-lg shadow-md transition-all transform active:scale-95 ${data.attendance.status === 'checked-in'
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                            }`}
                    >
                        {processingAttendance ? 'Processing...' : (
                            data.attendance.status === 'checked-in' ? 'Check Out' : 'Check In'
                        )}
                    </button>

                    <p className="mt-4 text-sm text-gray-400 italic">
                        (Or scan your card again to {data.attendance.status === 'checked-in' ? 'Check Out' : 'Check In'})
                    </p>
                </div>

            </main>
        </div>
    );
};

export default WorkerDynamicDashboard;
