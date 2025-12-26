import React from 'react';
import { FaBook, FaRoad } from 'react-icons/fa';
import { MdQuiz } from 'react-icons/md';

const Hero = () => {
    return (
        <section className="hero-section">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-6 mb-4 mb-lg-0">
                        <h1 className="hero-title">
                            Master Your Studies with <span className="highlight">AI-Powered</span> Learning
                        </h1>
                        <p className="hero-text">
                            WizLearn transforms your study materials into personalized learning experiences. Create courses, generate quizzes, build roadmaps, and collaborate with friends—all powered by artificial intelligence.
                        </p>
                        <div className="d-flex flex-column flex-sm-row gap-3">
                            <button className="btn btn-hero-primary">Start Learning Free</button>
                            <button className="btn btn-hero-secondary">Watch Demo</button>
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <div className="hero-card">
                            <div className="course-card">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="course-icon me-3">
                                        <FaBook />
                                    </div>
                                    <div>
                                        <h3 className="mb-1" style={{ color: '#1D2A50', fontWeight: 'bold', fontSize: '1.25rem' }}>Data Structures</h3>
                                        <p className="mb-0" style={{ color: '#718096', fontSize: '0.875rem' }}>42 lessons • 85% complete</p>
                                    </div>
                                </div>
                                <div className="progress-bar-custom">
                                    <div className="progress-fill" style={{ width: '85%' }}></div>
                                </div>
                            </div>

                            <div className="row g-3">
                                <div className="col-6">
                                    <div style={{
                                        backgroundColor: 'rgba(240, 212, 89, 0.2)',
                                        borderRadius: '0.75rem',
                                        padding: '1.5rem',
                                        textAlign: 'center'
                                    }}>
                                        <MdQuiz style={{ color: '#F0D459', fontSize: '2.5rem', marginBottom: '0.5rem' }} />
                                        <p style={{ color: 'white', fontWeight: '600', margin: 0 }}>AI Quizzes</p>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div style={{
                                        backgroundColor: 'rgba(240, 212, 89, 0.2)',
                                        borderRadius: '0.75rem',
                                        padding: '1.5rem',
                                        textAlign: 'center'
                                    }}>
                                        <FaRoad style={{ color: '#F0D459', fontSize: '2.5rem', marginBottom: '0.5rem' }} />
                                        <p style={{ color: 'white', fontWeight: '600', margin: 0 }}>Smart Roadmaps</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
