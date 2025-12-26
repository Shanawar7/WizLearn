import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBrain, FaUser, FaEnvelope, FaLock, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import './auth.css';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        return newErrors;
    };

    const { signup } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const result = await signup(formData.email, formData.password, formData.username);

        if (result.success) {
            // Success message handled by UI flow usually, or we can fetch user from context
            alert(`Account created successfully!`);
            navigate('/dashboard');
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
                    <h2>Create Your Account</h2>
                    <p>Join thousands of students learning smarter with AI</p>
                </div>

                {errors.form && (
                    <div className="alert alert-danger text-center mb-3" style={{ color: 'red', backgroundColor: '#ffd7d7', padding: '10px', borderRadius: '5px' }}>
                        {errors.form}
                    </div>
                )}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username" className="form-label">
                            <FaUser className="label-icon" />
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className={`form-input ${errors.username ? 'input-error' : ''}`}
                            placeholder="Choose a username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                        {errors.username && <span className="error-message">{errors.username}</span>}
                    </div>

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
                            placeholder="Enter your email"
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
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword" className="form-label">
                            <FaCheckCircle className="label-icon" />
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                        {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                    </div>

                    <button type="submit" className="btn-submit">
                        Create Account
                    </button>

                    <div className="auth-redirect">
                        <p>
                            Already have an account?{' '}
                            <Link to="/login" className="redirect-link">
                                Login here
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

export default Signup;
