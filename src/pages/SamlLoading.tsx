import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, mapWorkerToUser } from '../contexts/AuthContext';
import { fetchAuthUser } from '../api/api';

const SamlLoading: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [status, setStatus] = useState("Authenticating...");

    useEffect(() => {
        let mounted = true;

        const checkSession = async () => {
            try {
                // Attempt to fetch the user from backend session
                // If the cookie was set by the backend after SAML callback, this will succeed.
                const userData = await fetchAuthUser();

                if (mounted && userData && userData.id) {
                    // Map response to internal User object structure if needed
                    const user = mapWorkerToUser(userData);
                    login(user);
                    navigate('/dashboard/dynamic');
                } else {
                    throw new Error("User data invalid");
                }
            } catch (error) {
                console.error("Session check failed", error);
                // If we fail immediately, it might be because the cookie isn't ready or user isn't logged in.
                // In a real SAML flow, the backend would redirect browser to /saml/login, then callback to backend, then backend redirects to THIS page?
                // Or if backend redirects straight to dashboard, we might not hit this page.
                // Assuming the prompt: "Frontend must follow redirect and show a /loading screen while the SAML login happens."

                // If we are here, we might be waiting for the backend to finalize something purely if we polled, 
                // OR we are the landing page AFTER the backend redirects us back?
                // Prompt says: "After SAML callback, backend sets session cookie. Frontend should then fetch: GET /auth/user and navigate to /dashboard."

                // So this page is likely key.
                if (mounted) setStatus("Waiting for authentication...");

                // Maybe retry once or twice? Or just show error?
                setTimeout(() => {
                    if (mounted) navigate('/login/card'); // Go back to login if failed
                }, 3000);
            }
        };

        // Small delay to ensure cookies are readable/propagated if needed
        const timer = setTimeout(() => {
            checkSession();
        }, 1000);

        return () => {
            mounted = false;
            clearTimeout(timer);
        };
    }, [navigate, login]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-gray-700">{status}</h2>
                <p className="text-gray-500 mt-2">Please wait while we verify your identity.</p>
            </div>
        </div>
    );
};

export default SamlLoading;
