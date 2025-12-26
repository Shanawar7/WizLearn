import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaRobot, FaCommentDots } from 'react-icons/fa';
import DashboardNavbar from './DashboardNavbar';
import CourseCard from './CourseCard';
import AddCourseModal from './AddCourseModal';
import { generateCourseId, getCourseColorByIndex } from '../Utils/idGenerator';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../context/AuthContext';
import './dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [aiInput, setAiInput] = useState('');
    const [requests, setRequests] = useState([]);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiResponse, setAiResponse] = useState('');
    const [aiHistory, setAiHistory] = useState([]);

    useEffect(() => {
        if (user) {
            fetchCourses();
            fetchRequests();
            fetchRecommendations();
        }
    }, [user]);

    const fetchRecommendations = async () => {
        try {
            const response = await api.get('/courses/recommendations');
            setRecommendations(response.data);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
        }
    };

    const fetchCourses = async () => {
        try {
            const [ownedRes, enrolledRes] = await Promise.all([
                api.get('/courses'),
                api.get('/enrollments/my-enrollments')
            ]);

            // Filter to only show approved enrollments
            const enrolledCourses = Array.isArray(enrolledRes.data) ? enrolledRes.data
                .filter(e => e.status === 'APPROVED' && e.course)
                .map(e => ({
                    ...e.course,
                    progress: e.progress,
                    isEnrolled: true,
                    enrollmentId: e.id
                })) : [];

            const ownedCourses = Array.isArray(ownedRes.data) ? ownedRes.data.map(c => ({
                ...c,
                isOwner: true
            })) : [];

            // Create a map for easy lookup
            const courseMap = new Map();
            ownedCourses.forEach(c => courseMap.set(c.id, c));

            enrolledCourses.forEach(eCourse => {
                if (eCourse && eCourse.id) {
                    if (courseMap.has(eCourse.id)) {
                        // Update owned course with enrollment info
                        const existing = courseMap.get(eCourse.id);
                        courseMap.set(eCourse.id, {
                            ...existing,
                            progress: eCourse.progress,
                            enrollmentId: eCourse.enrollmentId,
                            isEnrolled: true
                        });
                    } else {
                        courseMap.set(eCourse.id, eCourse);
                    }
                }
            });

            setCourses(Array.from(courseMap.values()));
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const fetchRequests = async () => {
        try {
            const response = await api.get('/enrollments/requests');
            setRequests(response.data);
        } catch (error) {
            console.error('Error fetching requests:', error);
        }
    };

    const handleApproveRequest = async (requestId) => {
        try {
            await api.patch(`/enrollments/${requestId}/approve`);
            setRequests(requests.filter(req => req.id !== requestId));
            alert('Request approved!');
        } catch (error) {
            console.error('Error approving request:', error);
            alert('Failed to approve request.');
        }
    };

    const handleRejectRequest = async (requestId) => {
        if (window.confirm('Reject this enrollment request?')) {
            try {
                await api.patch(`/enrollments/${requestId}/reject`);
                setRequests(requests.filter(req => req.id !== requestId));
            } catch (error) {
                console.error('Error rejecting request:', error);
                alert('Failed to reject request.');
            }
        }
    };

    const handleAddCourse = async (formData) => {
        try {
            if (editingCourse) {
                // Update existing course
                const response = await api.patch(`/courses/${editingCourse.id}`, formData);
                setCourses(courses.map(course =>
                    course.id === editingCourse.id ? response.data : course
                ));
                setEditingCourse(null);
            } else {
                // Create new course
                const response = await api.post('/courses', formData);
                setCourses([...courses, response.data]);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving course:', error);
            alert('Failed to save course. Please try again.');
        }
    };

    const handleDeleteCourse = async (courseId) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await api.delete(`/courses/${courseId}`);
                setCourses(courses.filter(course => course.id !== courseId));
            } catch (error) {
                console.error('Error deleting course:', error);
                alert('Failed to delete course.');
            }
        }
    };

    const handleEditCourse = (course) => {
        setEditingCourse(course);
        setIsModalOpen(true);
    };

    const handleFindCourse = async () => {
        const courseCode = prompt('Enter Course Code to join:');
        if (!courseCode) return;

        try {
            await api.post('/enrollments/join', { courseCode });
            alert('Enrollement request sent successfully!');
        } catch (error) {
            console.error('Error joining course:', error);
            alert(error.response?.data?.message || 'Failed to join course');
        }
    };

    const handleAddFriend = async () => {
        const friendId = prompt('Enter Friend\'s User ID:');
        if (!friendId) return;

        try {
            await api.post('/friends/request', { friendId });
            alert('Friend request sent successfully!');
        } catch (error) {
            console.error('Error sending friend request:', error);
            alert(error.response?.data?.message || 'Failed to send friend request');
        }
    };

    const handleAiSubmit = async (e) => {
        e.preventDefault();
        if (aiInput.trim()) {
            const currentInput = aiInput.trim();
            setAiLoading(true);
            setAiResponse('');
            try {
                const response = await api.post('/ai/general-chat', {
                    question: currentInput,
                    history: aiHistory
                });

                const newAiResponse = response.data.answer;
                setAiResponse(newAiResponse);
                setAiInput('');

                // Update history with brackets for both user and model
                setAiHistory(prev => [
                    ...prev,
                    { role: 'user', parts: [currentInput] },
                    { role: 'model', parts: [newAiResponse] }
                ]);
            } catch (error) {
                console.error('AI Error:', error);
                setAiResponse('Sorry, I encountered an error while processing your request.');
            } finally {
                setAiLoading(false);
            }
        }
    };

    const handleCopyAiResponse = () => {
        if (aiResponse) {
            navigator.clipboard.writeText(aiResponse);
            alert('Response copied to clipboard!');
        }
    };

    const handleResetAi = () => {
        setAiResponse('');
        setAiHistory([]);
    };

    return (
        <div className="dashboard-container">
            <DashboardNavbar
                onFindCourse={handleFindCourse}
                onAddFriend={handleAddFriend}
            />

            <main className="dashboard-main">
                {/* AI Assistance Section */}
                <div className="ai-assistance-section">
                    <form onSubmit={handleAiSubmit} className="ai-input-container">
                        <FaRobot className={`ai-icon ${aiLoading ? 'ai-spinning' : ''}`} />
                        <input
                            type="text"
                            className="ai-input"
                            placeholder="Ask me any academic question..."
                            value={aiInput}
                            onChange={(e) => setAiInput(e.target.value)}
                            disabled={aiLoading}
                        />
                        {aiLoading && <div className="ai-dots">...</div>}
                    </form>
                    {aiResponse && (
                        <div className="ai-response-bubble animate-fade-in">
                            <div className="ai-response-header">
                                <span className="d-flex align-items-center gap-2 text-primary">
                                    <FaRobot /> AI Assistant {aiHistory.length > 0 && <small className="text-muted">(Following up...)</small>}
                                </span>
                                <div className="ai-header-actions">
                                    <button
                                        className="btn-ai-action copy-btn-ai"
                                        onClick={handleCopyAiResponse}
                                        title="Copy response"
                                    >
                                        Copy
                                    </button>
                                    <button className="btn-ai-action reset-btn-ai" onClick={handleResetAi} title="Reset conversion">
                                        Reset
                                    </button>
                                </div>
                            </div>
                            <div className="ai-response-scroll-container">
                                <div className="ai-response-body">
                                    {aiResponse}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Welcome Section */}
                <div className="dashboard-welcome">
                    <h1>Welcome back, {user?.name}! 👋</h1>
                    <p className="user-id-display">Your User ID: <span className="user-id-badge">{user?.friendId}</span></p>
                </div>

                {/* Requests Section */}
                {requests.length > 0 && (
                    <div className="requests-section" style={{ marginBottom: '2rem' }}>
                        <div className="section-header">
                            <h2>Enrollment Requests</h2>
                            <span className="badge-pending">{requests.length} Pending</span>
                        </div>
                        <div className="requests-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                            {requests.map(req => (
                                <div key={req.id} className="request-card" style={{ background: 'white', padding: '1rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#1D2A50' }}>{req.course.title}</h4>
                                    <p style={{ margin: '0 0 1rem 0', color: '#718096', fontSize: '0.9rem' }}>
                                        Student: <strong>{req.user.name}</strong> ({req.user.email})
                                    </p>
                                    <div className="request-actions" style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => handleApproveRequest(req.id)}
                                            style={{ padding: '0.5rem 1rem', background: '#F0D459', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold', color: '#1D2A50' }}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleRejectRequest(req.id)}
                                            style={{ padding: '0.5rem 1rem', background: '#e53e3e', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold', color: 'white' }}
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Courses Section */}
                <div className="courses-section">
                    <div className="section-header">
                        <h2>My Courses</h2>
                        <p>{courses.length} {courses.length === 1 ? 'course' : 'courses'}</p>
                    </div>

                    {courses.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">📚</div>
                            <h3>No courses yet</h3>
                            <p>Click the + button to create your first course!</p>
                        </div>
                    ) : (
                        <div className="courses-grid">
                            {courses.map((course, index) => (
                                <CourseCard
                                    key={course.id}
                                    course={{
                                        ...course,
                                        courseId: course.courseCode, // Map backend 'courseCode' to frontend 'courseId'
                                        color: getCourseColorByIndex(index)
                                    }}
                                    onDelete={handleDeleteCourse}
                                    onEdit={handleEditCourse}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Recommended Section */}
                {recommendations.length > 0 && (
                    <div className="courses-section recommendations-container">
                        <div className="section-header">
                            <div>
                                <h2 className="recommendation-title">Recommended for You</h2>
                                <p className="recommendation-subtitle">Discover courses your friends are taking</p>
                            </div>
                        </div>
                        <div className="courses-grid recommendation-grid">
                            {recommendations.map((course, index) => (
                                <CourseCard
                                    key={`rec-${course.id}`}
                                    course={{
                                        ...course,
                                        courseId: course.courseCode,
                                        isRecommendation: true,
                                        color: getCourseColorByIndex(index + 5)
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Floating Add Button */}
                <button
                    className="floating-add-btn"
                    onClick={() => {
                        setEditingCourse(null);
                        setIsModalOpen(true);
                    }}
                    title="Create new course"
                >
                    <FaPlus />
                </button>

                {/* Add Course Modal */}
                <AddCourseModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingCourse(null);
                    }}
                    onSubmit={handleAddCourse}
                    editCourse={editingCourse}
                />

                {/* Floating Chat Button */}
                <div
                    style={{
                        position: 'fixed',
                        bottom: '30px',
                        left: '30px',
                        zIndex: 1000
                    }}
                >
                    <button
                        className="btn btn-warning shadow-lg rounded-circle p-3 d-flex align-items-center justify-content-center"
                        style={{ width: '60px', height: '60px' }}
                        onClick={() => navigate('/chat')}
                        title="Open Chat"
                    >
                        <FaCommentDots size={28} color="#17294f" />
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
