import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader } from 'lucide-react';

interface DashboardAuthGuardProps {
    children: React.ReactNode;
    allowedRole: 'worker' | 'establishment' | 'department';
}

const DashboardAuthGuard: React.FC<DashboardAuthGuardProps> = ({ children, allowedRole }) => {
    const { user, loading } = useAuth();
    const role = user?.type ?? null;

    // Wait for async auth check to complete
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                    <Loader className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
                    <p className="mt-4 text-gray-600 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    // After loading completes, validate role
    if (role !== allowedRole) {
        console.warn(`[DashboardAuthGuard] Blocked access. Expected ${allowedRole}, got ${role}`);

        if (!role) {
            // User is not authenticated, redirect to landing page
            return <Navigate to="/" replace />;
        }

        // Role mismatch - redirect to their correct dashboard
        if (role === 'worker') return <Navigate to="/dashboard/worker" replace />;
        if (role === 'establishment') return <Navigate to="/dashboard/establishment" replace />;
        if (role === 'department') return <Navigate to="/dashboard/department" replace />;

        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default DashboardAuthGuard;
