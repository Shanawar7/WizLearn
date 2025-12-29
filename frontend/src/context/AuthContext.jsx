import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// Use environment variable for API URL, fallback to localhost for development
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

export const AuthProvider = ({ children }) => {
    // Initialize state from localStorage to prevent flash of null user
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        try {
            // Only consider user "logged in" if BOTH user and token exist
            return (storedUser && storedToken) ? JSON.parse(storedUser) : null;
        } catch (e) {
            console.error('Error parsing user from storage', e);
            return null;
        }
    });

    const [token, setToken] = useState(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        return (storedUser && storedToken) ? storedToken : null;
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token && user) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete api.defaults.headers.common['Authorization'];
            // Cleanup inconsistent state
            if (localStorage.getItem('token') || localStorage.getItem('user')) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, [token, user]);

    const login = async (email, password) => {
        try {
            console.log('Attempting Login with:', email);
            const response = await api.post('/auth/login', { email, password });
            console.log('Login Response:', response.data);
            const { access_token, user } = response.data;

            if (!access_token || !user) {
                throw new Error('Invalid response structure');
            }

            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(user));

            console.log('Setting Token and User in State');
            setToken(access_token);
            setUser(user);
            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const signup = async (email, password, name) => {
        try {
            console.log('Attempting Signup...');
            const response = await api.post('/auth/signup', { email, password, name });
            console.log('Signup Response:', response.data);
            const { access_token, user } = response.data;

            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(user));

            console.log('Setting Token and User in State (Signup)');
            setToken(access_token);
            setUser(user);
            return { success: true };
        } catch (error) {
            console.error('Signup error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Signup failed'
            };
        }
    };

    const logout = () => {
        console.log('Logging out');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        delete api.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, token, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
