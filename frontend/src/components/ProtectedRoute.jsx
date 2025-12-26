import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, token, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>; // Or a spinner component
    }

    if (!user || !token) {
        console.log('ProtectedRoute: Missing Auth, redirecting to login');
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
