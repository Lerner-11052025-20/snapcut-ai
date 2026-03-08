import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

/**
 * 🚀 Tactical Hook for Landing Page Actions
 * Handles dynamic redirection based on Auth state.
 */
export const useLandingActions = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    /**
     * Executes the 'Get Started' or 'Join' logic
     * Redirects to /upload if logged in, otherwise /register
     */
    const handleGetStarted = (e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (isAuthenticated) {
            navigate("/upload");
        } else {
            navigate("/register");
        }
    };

    /**
     * Executes the 'Get API Key' logic
     * Redirects to /dashboard if logged in, otherwise /register
     */
    const handleGetApiKey = (e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (isAuthenticated) {
            navigate("/dashboard");
        } else {
            navigate("/register");
        }
    };

    return { handleGetStarted, handleGetApiKey };
};
