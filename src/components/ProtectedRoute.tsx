import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  userType?: 'worker' | 'establishment' | 'department';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, userType }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Wait for async auth check to complete
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600 font-medium">Verifying authentication...</p>
        </div>
      </div>
    );
  }
  if (!isAuthenticated) {
    // Redirect to appropriate login page based on the route
    const path = location.pathname;
    let loginPath = '/login/worker'; // default

    if (path.includes('/establishment') || path.includes('/workers')) {
      loginPath = '/login/establishment';
    } else if (path.includes('/department') || path.includes('/applications') || path.includes('/documents') || path.includes('/compliance')) {
      loginPath = '/login/department';
    }

    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (userType && user?.type !== userType) {
    // Redirect to appropriate dashboard if user type doesn't match
    const dashboardPath = `/dashboard/${user?.type}`;
    return <Navigate to={dashboardPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;