import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBrain, FaHome, FaUser, FaComments, FaSignOutAlt, FaUserPlus, FaSearch } from 'react-icons/fa';
import { clearUser } from '../Utils/idGenerator';

const DashboardNavbar = ({ onFindCourse, onAddFriend }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        clearUser();
        navigate('/');
    };

    return (
        <nav className="dashboard-navbar">
            <div className="dashboard-nav-container">
                <Link to="/dashboard" className="dashboard-brand">
                    <FaBrain className="brand-icon" />
                    <span>WizLearn</span>
                </Link>

                <ul className="dashboard-nav-links">
                    <li>
                        <Link to="/dashboard" className="nav-link">
                            <FaHome />
                            <span>Home</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/profile" className="nav-link">
                            <FaUser />
                            <span>Profile</span>
                        </Link>
                    </li>
                    <li>
                        <button className="nav-link nav-button" onClick={() => navigate('/chat')}>
                            <FaComments />
                            <span>ChatBox</span>
                        </button>
                    </li>
                    <li>
                        <button className="nav-link nav-button" onClick={() => navigate('/community')}>
                            <FaBrain />
                            <span>Community</span>
                        </button>
                    </li>
                    <li>
                        <button className="nav-link nav-button" onClick={onAddFriend}>
                            <FaUserPlus />
                            <span>Add Friend</span>
                        </button>
                    </li>
                    <li>
                        <button className="nav-link nav-button" onClick={onFindCourse}>
                            <FaSearch />
                            <span>Find Course</span>
                        </button>
                    </li>
                    <li>
                        <button className="nav-link nav-button logout-btn" onClick={handleLogout}>
                            <FaSignOutAlt />
                            <span>Logout</span>
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default DashboardNavbar;
