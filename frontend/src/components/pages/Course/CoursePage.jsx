import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPlus, FaRoad, FaBrain } from 'react-icons/fa';
import CourseNavbar from './CourseNavbar';
import MaterialCard from './MaterialCard';
import UploadMaterialModal from './UploadMaterialModal';
import { getCourseColorByIndex } from '../Utils/idGenerator';
import { useAuth, api } from '../../../context/AuthContext';
import './course.css';

import AIRoadmap from './AIRoadmap';
import ExternalResources from './ExternalResources';
import AIQuiz from './AIQuiz';

const CoursePage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [course, setCourse] = useState(null);
    const [materials, setMaterials] = useState([]);
    const [enrollment, setEnrollment] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentView, setCurrentView] = useState('materials'); // 'materials', 'roadmap', 'resources', 'quiz'
    const [resources, setResources] = useState(null);
    const [activeMaterialForQuiz, setActiveMaterialForQuiz] = useState(null);
    const [activeMaterialForRoadmap, setActiveMaterialForRoadmap] = useState(null);
    const [isCourseScope, setIsCourseScope] = useState(true);
    const [aiLoading, setAiLoading] = useState(false);

    const isOwner = user && course && user.id === course.userId;

    useEffect(() => {
        if (user && courseId) {
            const fetchCourse = async () => {
                try {
                    const response = await api.get(`/courses/${courseId}`);
                    if (response.data) {
                        const code = response.data.courseCode || 'WL-COURSE-DEFAULT';
                        setCourse({ ...response.data, color: getCourseColorByIndex(code.length) });
                    } else {
                        navigate('/dashboard');
                    }
                } catch (error) {
                    console.error('Error loading course:', error);
                    navigate('/dashboard');
                }
            };

            const fetchMaterials = async () => {
                try {
                    const response = await api.get(`/materials/${courseId}`);
                    setMaterials(Array.isArray(response.data) ? response.data : []);
                } catch (error) {
                    console.error('Error loading materials:', error);
                }
            };

            const fetchEnrollment = async () => {
                try {
                    const response = await api.get('/enrollments/my-enrollments');
                    if (Array.isArray(response.data)) {
                        const myEnrollment = response.data.find(e => e.course?.id === courseId);
                        setEnrollment(myEnrollment || null);
                    }
                } catch (error) {
                    console.error('Error fetching enrollment:', error);
                }
            };

            fetchCourse();
            fetchMaterials();
            fetchEnrollment();

            let cleanupFn = null;
            const checkEnrollmentAndStartHeartbeat = async () => {
                if (!user) return;
                try {
                    const response = await api.get('/enrollments/my-enrollments');
                    if (!Array.isArray(response.data)) return;
                    const myEnrollment = response.data.find(e => e.course?.id === courseId && e.status === 'APPROVED');

                    if (myEnrollment) {
                        const interval = setInterval(async () => {
                            try {
                                await api.post(`/enrollments/${myEnrollment.id}/heartbeat`);
                            } catch (err) {
                                console.error('Heartbeat failed', err);
                            }
                        }, 60000); // Every 60 seconds
                        cleanupFn = () => clearInterval(interval);
                    }
                } catch (error) {
                    console.error('Error checking enrollment for heartbeat:', error);
                }
            };

            checkEnrollmentAndStartHeartbeat();
            return () => {
                if (cleanupFn) cleanupFn();
            };
        }
    }, [courseId, navigate, user]);

    const handleToggleMaterialProgress = async (materialId) => {
        if (!enrollment) return;
        try {
            const response = await api.patch(`/enrollments/${enrollment.id}/toggle-material`, { materialId });
            setEnrollment({
                ...enrollment,
                completedMaterials: response.data.completedMaterials,
                progress: calculateProgress(response.data)
            });
        } catch (error) {
            console.error('Error toggling material progress:', error);
        }
    };

    const handleToggleRoadmapProgress = async (taskKey) => {
        if (!enrollment) return;
        try {
            const response = await api.patch(`/enrollments/${enrollment.id}/toggle-roadmap`, { taskKey });
            setEnrollment({
                ...enrollment,
                completedRoadmap: response.data.completedRoadmap,
                progress: calculateProgress(response.data)
            });
        } catch (error) {
            console.error('Error toggling roadmap progress:', error);
        }
    };

    const calculateProgress = (enr) => {
        if (!course || !enr) return 0;

        const totalMaterials = materials?.length || 0;
        if (totalMaterials === 0) return 0;

        const completedCount = enr.completedMaterials?.length || 0;
        return Math.round((completedCount / totalMaterials) * 100);
    };

    // Auto-create enrollment for owner if missing
    useEffect(() => {
        if (course && isOwner && !enrollment && !aiLoading) {
            const initOwnerProgress = async () => {
                try {
                    await api.post('/enrollments/join', { courseCode: course.courseCode });
                    // Refresh enrollment
                    const response = await api.get('/enrollments/my-enrollments');
                    const myEnrollment = response.data.find(e => e.course.id === courseId);
                    setEnrollment(myEnrollment || null);
                } catch (error) {
                    console.error('Failed to auto-init owner progress:', error);
                }
            };
            initOwnerProgress();
        }
    }, [course, isOwner, enrollment, courseId, aiLoading]);

    const handleUploadMaterial = async (formData) => {
        try {
            await api.post(`/materials/${courseId}`, formData);
            const response = await api.get(`/materials/${courseId}`);
            setMaterials(response.data);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error uploading material:', error);
            alert('Failed to upload material');
        }
    };

    const handleDeleteMaterial = async (materialId) => {
        if (window.confirm('Are you sure you want to delete this material?')) {
            try {
                await api.delete(`/materials/${materialId}`);
                setMaterials(materials.filter(m => m.id !== materialId));
            } catch (error) {
                console.error('Error deleting material:', error);
                alert('Failed to delete material');
            }
        }
    };

    const handleGenerateQuiz = (material) => {
        setIsCourseScope(false);
        setActiveMaterialForQuiz(material);
        setCurrentView('quiz');
    };

    const handleGenerateMaterialRoadmap = (material) => {
        setIsCourseScope(false);
        setActiveMaterialForRoadmap(material);
        setCurrentView('roadmap');
    };

    const handleGenerateCourseQuizTrigger = () => {
        setIsCourseScope(true);
        setActiveMaterialForQuiz(null);
        setCurrentView('quiz');
    };

    const handleGenerateAiQuiz = async () => {
        setAiLoading(true);
        try {
            if (isCourseScope) {
                const response = await api.post(`/ai/generate-course-quiz/${courseId}`);
                setCourse({ ...course, quiz: response.data });
            } else {
                const response = await api.post(`/ai/generate-quiz/${activeMaterialForQuiz.id}`);
                const updatedMaterials = materials.map(m =>
                    m.id === activeMaterialForQuiz.id ? { ...m, quiz: response.data } : m
                );
                setMaterials(updatedMaterials);
                setActiveMaterialForQuiz({ ...activeMaterialForQuiz, quiz: response.data });
            }
        } catch (error) {
            console.error('Error generating quiz:', error);
            alert('Gemini AI failed to generate quiz.');
        } finally {
            setAiLoading(false);
        }
    };

    const handleGenerateRoadmap = async (forceInit = false) => {
        // If we are triggering course roadmap
        setIsCourseScope(true);
        setActiveMaterialForRoadmap(null);

        // If we have a roadmap and just want to view it (not explicitly updating)
        if (course.roadmap && currentView !== 'roadmap' && !forceInit) {
            setCurrentView('roadmap');
            return;
        }

        setAiLoading(true);
        try {
            const response = await api.post(`/ai/generate-roadmap/${courseId}`);
            setCourse({ ...course, roadmap: response.data });
            setCurrentView('roadmap');
            alert('Course Roadmap updated successfully!');
        } catch (error) {
            console.error('Error generating roadmap:', error);
            alert('Failed to generate course roadmap.');
        } finally {
            setAiLoading(false);
        }
    };

    const handleGenerateMaterialAiRoadmap = async () => {
        setAiLoading(true);
        try {
            const response = await api.post(`/ai/generate-material-roadmap/${activeMaterialForRoadmap.id}`);
            const updatedMaterials = materials.map(m =>
                m.id === activeMaterialForRoadmap.id ? { ...m, roadmap: response.data } : m
            );
            setMaterials(updatedMaterials);
            setActiveMaterialForRoadmap({ ...activeMaterialForRoadmap, roadmap: response.data });
            alert('Material Roadmap generated successfully!');
        } catch (error) {
            console.error('Error generating material roadmap:', error);
            alert('Failed to generate material roadmap.');
        } finally {
            setAiLoading(false);
        }
    };

    const handleShowResources = async () => {
        setCurrentView('resources');
        if (!resources) {
            setAiLoading(true);
            try {
                const response = await api.get(`/resources/${courseId}`);
                setResources(response.data);
            } catch (error) {
                console.error('Error loading resources:', error);
            } finally {
                setAiLoading(false);
            }
        }
    };

    if (!course) {
        return <div className="loading">Loading...</div>;
    }

    const headerColor = (course && course.color) ? course.color : { from: '#1D2A50', to: '#2a3f6e' };

    return (
        <div className="course-page">
            <CourseNavbar
                courseTitle={course.title}
                onGenerateRoadmap={handleGenerateRoadmap}
                onGenerateQuiz={handleGenerateCourseQuizTrigger}
                onShowResources={handleShowResources}
                activeView={currentView}
            />

            {/* Course Header */}
            <div
                className="course-header"
                style={{
                    background: `linear-gradient(135deg, ${headerColor.from} 0%, ${headerColor.to} 100%)`
                }}
            >
                <div className="course-header-content">
                    <div className="d-flex justify-content-between align-items-start w-100">
                        <div>
                            <h1 className="course-page-title">{course.title}</h1>
                            <div className="course-page-id">
                                <span className="id-label">Course ID:</span>
                                <span className="id-value">{course.courseCode}</span>
                            </div>
                            {enrollment && (
                                <div className="course-page-id ms-2">
                                    <span className="id-label">Time Spent:</span>
                                    <span className="id-value">
                                        {Math.floor((enrollment.timeSpent || 0) / 3600)}h {Math.floor(((enrollment.timeSpent || 0) % 3600) / 60)}m
                                    </span>
                                </div>
                            )}
                        </div>
                        {enrollment && enrollment.status === 'APPROVED' && (
                            <div className="course-progress-container text-end" style={{ minWidth: '200px' }}>
                                <div className="d-flex justify-content-between mb-1 text-white small">
                                    <span>Learning Progress</span>
                                    <span>{enrollment.progress || 0}%</span>
                                </div>
                                <div className="progress" style={{ height: '8px', background: 'rgba(255,255,255,0.2)' }}>
                                    <div
                                        className="progress-bar bg-warning"
                                        role="progressbar"
                                        style={{ width: `${enrollment.progress || 0}%`, transition: 'width 1s ease' }}
                                    ></div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="d-flex gap-3 align-items-center mt-3">
                        <button
                            className={`btn btn-sm ${currentView === 'materials' ? 'btn-warning' : 'btn-outline-light'}`}
                            onClick={() => setCurrentView('materials')}
                        >
                            Materials
                        </button>
                        <button
                            className={`btn btn-sm ${currentView === 'quiz' && isCourseScope ? 'btn-warning' : 'btn-outline-light'}`}
                            onClick={handleGenerateCourseQuizTrigger}
                        >
                            Global Quiz
                        </button>
                    </div>
                </div>
            </div>

            {/* Course Content */}
            <div className="course-content">
                {aiLoading && (
                    <div className="ai-overlay">
                        <div className="ai-spinner"></div>
                        <p>Gemini AI is thinking...</p>
                    </div>
                )}

                {currentView === 'materials' && (
                    <div className="materials-section">
                        <div className="section-header d-flex justify-content-between align-items-center">
                            <div>
                                <h2>Course Materials</h2>
                                <p>{materials.length} {materials.length === 1 ? 'material' : 'materials'}</p>
                            </div>
                            {materials.length > 0 && isOwner && (
                                <div className="d-flex gap-2">
                                    <button
                                        className="btn btn-navy d-flex align-items-center gap-2"
                                        onClick={() => handleGenerateRoadmap(true)}
                                        style={{ background: '#1a365d', color: 'white' }}
                                        title="Re-scan all materials for updated roadmap"
                                    >
                                        <FaRoad />
                                        <span>Update Roadmap</span>
                                    </button>
                                    <button
                                        className="btn btn-navy d-flex align-items-center gap-2"
                                        onClick={handleGenerateAiQuiz}
                                        style={{ background: '#1a365d', color: 'white' }}
                                        title="Generate a fresh quiz from current materials"
                                    >
                                        <FaBrain />
                                        <span>Regenerate Quiz</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {materials.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">📚</div>
                                <h3>No materials yet</h3>
                                {isOwner && <p>Click the + button to upload your first material!</p>}
                            </div>
                        ) : (
                            <div className="materials-grid">
                                {materials.map(material => (
                                    <MaterialCard
                                        key={material.id}
                                        material={material}
                                        onDelete={isOwner ? handleDeleteMaterial : null}
                                        onQuiz={() => handleGenerateQuiz(material)}
                                        onRoadmap={() => handleGenerateMaterialRoadmap(material)}
                                        isCompleted={enrollment?.completedMaterials?.includes(material.id)}
                                        onToggleComplete={handleToggleMaterialProgress}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {currentView === 'roadmap' && (
                    <AIRoadmap
                        roadmap={isCourseScope ? course.roadmap : activeMaterialForRoadmap?.roadmap}
                        onGenerate={isCourseScope ? handleGenerateRoadmap : handleGenerateMaterialAiRoadmap}
                        title={isCourseScope ? 'Course Roadmap' : `Roadmap: ${activeMaterialForRoadmap?.title}`}
                        completedTasks={enrollment?.completedRoadmap || []}
                        onToggleTask={handleToggleRoadmapProgress}
                    />
                )}

                {currentView === 'resources' && (
                    <ExternalResources resources={resources} />
                )}

                {currentView === 'quiz' && (
                    <AIQuiz
                        quiz={isCourseScope ? course.quiz : activeMaterialForQuiz?.quiz}
                        onGenerate={handleGenerateAiQuiz}
                        title={isCourseScope ? 'Course Quiz' : `Quiz: ${activeMaterialForQuiz?.title}`}
                    />
                )}

                {/* Floating Upload Button */}
                {isOwner && currentView === 'materials' && (
                    <button
                        className="floating-add-btn"
                        onClick={() => setIsModalOpen(true)}
                        title="Upload material"
                    >
                        <FaPlus />
                    </button>
                )}

                {/* Upload Material Modal */}
                <UploadMaterialModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleUploadMaterial}
                />
            </div>
        </div>
    );
};

export default CoursePage;
