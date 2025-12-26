import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEllipsisV, FaTrash, FaEdit, FaEye, FaCopy } from 'react-icons/fa';
import { getCourseColorByIndex } from '../Utils/idGenerator';

const CourseCard = ({ course, onDelete, onEdit }) => {
    if (!course) return null;
    const { id: courseId, title, description, courseCode, createdAt, isOwner, progress } = course;
    const navigate = useNavigate();

    const { from, to } = getCourseColorByIndex((courseCode || '').length);

    const handleCopyCourseId = (e) => {
        e.stopPropagation(); // Prevent card click
        navigator.clipboard.writeText(courseId);
        alert(`Course ID "${courseId}" copied to clipboard!`);
    };

    const handleCardClick = () => {
        navigate(`/course/${courseId}`);
    };

    const handleEdit = (e) => {
        e.stopPropagation(); // Prevent card click
        onEdit(course);
    };

    const handleDelete = (e) => {
        e.stopPropagation(); // Prevent card click
        onDelete(courseId);
    };

    const isRecommendation = course.isRecommendation;

    return (
        <div className="course-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
            <div
                className="course-card-header"
                style={{
                    background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`
                }}
            >
                <h3 className="course-title">{title}</h3>
                {!isRecommendation && (
                    <button className="course-menu-btn" onClick={(e) => e.stopPropagation()}>
                        <FaEllipsisV />
                    </button>
                )}
            </div>

            <div className="course-card-body">
                <p className="course-description">{description}</p>

                {progress !== undefined && !isRecommendation && (
                    <div className="course-progress-mini mb-3">
                        <div className="d-flex justify-content-between mb-1 small">
                            <span className="text-muted">Progress</span>
                            <span className="fw-bold text-navy">{progress}%</span>
                        </div>
                        <div className="progress" style={{ height: '6px', backgroundColor: '#e2e8f0' }}>
                            <div
                                className="progress-bar bg-success"
                                role="progressbar"
                                style={{ width: `${progress}%`, transition: 'width 0.5s ease' }}
                            ></div>
                        </div>
                    </div>
                )}

                <div className="course-meta">
                    <div className="course-id-badge" onClick={handleCopyCourseId} title="Click to copy">
                        <span className="course-id-label">Course ID:</span>
                        <span className="course-id-value">{courseCode}</span>
                        <FaCopy className="copy-icon" />
                    </div>
                    {isRecommendation ? (
                        <span className="course-date text-primary fw-bold">Student Favorite!</span>
                    ) : (
                        <span className="course-date">Created: {new Date(createdAt).toLocaleDateString()}</span>
                    )}
                </div>
            </div>

            <div className="course-card-footer" onClick={(e) => e.stopPropagation()}>
                <button className="course-action-btn view-btn" onClick={handleCardClick} style={{ flex: '1' }}>
                    {isRecommendation ? 'Enroll Now' : 'View'}
                </button>
                {!isRecommendation && isOwner && (
                    <>
                        <button className="course-action-btn edit-btn" onClick={handleEdit}>
                            <FaEdit />
                            Edit
                        </button>
                        <button className="course-action-btn delete-btn" onClick={handleDelete}>
                            <FaTrash />
                            Delete
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default CourseCard;
