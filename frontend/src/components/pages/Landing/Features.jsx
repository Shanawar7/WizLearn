import React from 'react';
import { FaBook, FaBrain, FaUsers, FaChartLine } from 'react-icons/fa';
import { MdQuiz } from 'react-icons/md';
import { FaRoad } from 'react-icons/fa';

const Features = () => {
    const features = [
        {
            icon: <FaBook />,
            title: "Course Creation",
            description: "Easily create and organize courses. Upload your study materials and let AI help structure your learning path."
        },
        {
            icon: <MdQuiz />,
            title: "AI-Generated Quizzes",
            description: "Test your knowledge with intelligent quizzes automatically generated from your course materials."
        },
        {
            icon: <FaRoad />,
            title: "Smart Roadmaps",
            description: "Get personalized study roadmaps that help you meet deadlines and master topics efficiently."
        },
        {
            icon: <FaBrain />,
            title: "AI Tutor Assistance",
            description: "Receive instant help understanding complex concepts with our AI-powered learning assistant."
        },
        {
            icon: <FaUsers />,
            title: "Collaborative Learning",
            description: "Share courses with friends and study together. Enable view-only mode for secure sharing."
        },
        {
            icon: <FaChartLine />,
            title: "Progress Tracking",
            description: "Monitor your learning journey with detailed analytics and performance insights."
        }
    ];

    return (
        <section id="features" className="features-section">
            <div className="container">
                <h2 className="section-title">Powerful Features for Smarter Learning</h2>
                <p className="section-subtitle">
                    Everything you need to transform your study routine and achieve academic excellence
                </p>

                <div className="row g-4">
                    {features.map((feature, index) => (
                        <div key={index} className="col-md-6 col-lg-4">
                            <div className="card feature-card">
                                <div className="card-body">
                                    <div className="feature-icon">{feature.icon}</div>
                                    <h3 className="feature-title">{feature.title}</h3>
                                    <p className="feature-description">{feature.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
