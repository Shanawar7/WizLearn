import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedAdminRoute = ({ children }) => {
    const { user, token, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>;
    }

    // Must be logged in AND have admin role
    if (!user || !token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (user.role !== 'admin') {
        console.warn('Access denied: User is not an admin');
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedAdminRoute;
