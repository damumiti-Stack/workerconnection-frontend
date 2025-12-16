import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { logoutUser } from '../api/api';

const Logout: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const performLogout = async () => {
            try {
                await logoutUser(); // Call backend
            } catch (e) {
                console.error("Logout failed", e);
            } finally {
                logout(); // Clear client state
                navigate('/login/card');
            }
        };
        performLogout();
    }, [logout, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <p className="text-gray-500">Logging out...</p>
        </div>
    );
};

export default Logout;
