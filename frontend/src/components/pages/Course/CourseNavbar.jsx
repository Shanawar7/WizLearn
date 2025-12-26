import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaBrain, FaLightbulb, FaRoad, FaSignOutAlt } from 'react-icons/fa';
import { clearUser } from '../Utils/idGenerator';

const CourseNavbar = ({ courseTitle, onGenerateQuiz, onGenerateRoadmap, onShowResources, activeView }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        clearUser();
        navigate('/');
    };

    return (
        <nav className="course-navbar">
            <div className="course-nav-container">
                {/* Left: Back Button */}
                <button className="nav-back-btn" onClick={() => navigate('/dashboard')}>
                    <FaArrowLeft />
                    <span>Dashboard</span>
                </button>

                {/* Center: Course Title */}
                <div className="course-nav-title">
                    <FaBrain className="course-icon" />
                    <h2>{courseTitle}</h2>
                </div>

                {/* Right: Action Buttons */}
                <div className="course-nav-actions">
                    <button
                        className={`nav-action-btn resource-btn ${activeView === 'resources' ? 'active' : ''}`}
                        onClick={onShowResources}
                    >
                        <FaLightbulb />
                        <span>Resources</span>
                    </button>
                    <button
                        className={`nav-action-btn quiz-btn ${activeView === 'quiz' && !activeView.isMaterial ? 'active' : ''}`}
                        onClick={onGenerateQuiz}
                    >
                        <FaBrain />
                        <span>Quiz</span>
                    </button>
                    <button
                        className={`nav-action-btn roadmap-btn ${activeView === 'roadmap' ? 'active' : ''}`}
                        onClick={onGenerateRoadmap}
                    >
                        <FaRoad />
                        <span>Roadmap</span>
                    </button>
                    <button className="nav-action-btn logout-btn" onClick={handleLogout}>
                        <FaSignOutAlt />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default CourseNavbar;
