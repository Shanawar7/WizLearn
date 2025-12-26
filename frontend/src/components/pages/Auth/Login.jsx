import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBrain, FaEnvelope, FaLock, FaUserShield, FaUser } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import './auth.css';

const Login = () => {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false); // Toggle state
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';

        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

        return newErrors;
    };

    const { login } = useAuth(); // Destructure login from context

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Unified Login Logic
        console.log('Login form submitted. Calling login context...');
        const result = await login(formData.email, formData.password);
        console.log('Login result:', result);

        if (result.success) {
            console.log('Login successful. Checking role...');
            // Check if user is admin based on role or specific email (if role not yet returned in login res)
            // Ideally login returns user object.
            const user = JSON.parse(localStorage.getItem('user'));

            if (isAdmin) {
                if (user?.role === 'admin') {
                    navigate('/admin');
                } else {
                    setErrors({ form: 'Not authorized as Admin' });
                    // Optional: logout if not admin
                }
            } else {
                if (user?.role === 'admin') {
                    // Admins can log in as users too, but maybe redirect to admin dashboard anyway?
                    // For now let them go to user dashboard if they chose 'User' tab.
                    navigate('/dashboard');
                } else {
                    navigate('/dashboard');
                }
            }
        } else {
            setErrors({ form: result.message });
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-content">
                <div className="auth-header">
                    <div className="auth-brand">
                        <FaBrain className="brand-icon" />
                        <h1>WizLearn</h1>
                    </div>
                    <h2>Welcome Back!</h2>
                    <p>Sign in to continue your learning journey</p>
                </div>

                {errors.form && (
                    <div className="alert alert-danger text-center mb-3" style={{ color: 'red', backgroundColor: '#ffd7d7', padding: '10px', borderRadius: '5px' }}>
                        {errors.form}
                    </div>
                )}

                {/* Role Switcher */}
                <div className="d-flex justify-content-center mb-4">
                    <div className="toggle-container">
                        <button
                            type="button"
                            className={`toggle-btn ${!isAdmin ? 'active' : ''}`}
                            onClick={() => setIsAdmin(false)}
                        >
                            <FaUser className="me-2" /> User
                        </button>
                        <button
                            type="button"
                            className={`toggle-btn ${isAdmin ? 'active' : ''}`}
                            onClick={() => setIsAdmin(true)}
                        >
                            <FaUserShield className="me-2" /> Admin
                        </button>
                    </div>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            <FaEnvelope className="label-icon" />
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className={`form-input ${errors.email ? 'input-error' : ''}`}
                            placeholder={isAdmin ? "admin@wizlearn.com" : "Enter your email"}
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            <FaLock className="label-icon" />
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className={`form-input ${errors.password ? 'input-error' : ''}`}
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>

                    <div className="form-footer">
                        <Link to="/forgot-password" className="forgot-link">
                            Forgot Password?
                        </Link>
                    </div>

                    <button type="submit" className="btn-submit">
                        Login as {isAdmin ? 'Admin' : 'User'}
                    </button>

                    <div className="auth-redirect">
                        <p>
                            Don't have an account?{' '}
                            <Link to="/signup" className="redirect-link">
                                Sign up here
                            </Link>
                        </p>
                    </div>
                </form>

                <div className="auth-footer">
                    <Link to="/" className="back-home">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
