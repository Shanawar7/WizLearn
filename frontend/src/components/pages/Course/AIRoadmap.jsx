import React from 'react';
import { FaCheckCircle, FaCalendarAlt } from 'react-icons/fa';

const AIRoadmap = ({ roadmap, onGenerate, title, completedTasks = [], onToggleTask }) => {
    if (!roadmap || !Array.isArray(roadmap)) return (
        <div className="text-center p-5 bg-white rounded shadow-sm">
            <h4 className="text-muted mb-3">{title || 'No roadmap generated yet.'}</h4>
            <p className="mb-4">Generate a personalized 4-week study plan!</p>
            <button className="btn btn-navy px-4 py-2" onClick={onGenerate}>
                <FaCalendarAlt className="me-2" />
                Generate Roadmap
            </button>
        </div>
    );

    return (
        <div className="ai-roadmap py-4">
            <h2 className="mb-4 text-navy d-flex align-items-center">
                <FaCalendarAlt className="me-3" /> {title || 'Personalized Study Roadmap'}
            </h2>

            <div className="roadmap-timeline">
                {roadmap.map((week, wIdx) => (
                    <div key={wIdx} className="roadmap-week mb-5">
                        <h4 className="week-title px-3 py-2 bg-navy text-white rounded mb-4">Week {wIdx + 1}</h4>
                        <div className="roadmap-days row">
                            {week.days?.map((day, dIdx) => {
                                const taskKey = `w${wIdx}-d${dIdx}`;
                                const isCompleted = completedTasks.includes(taskKey);
                                return (
                                    <div key={dIdx} className="col-md-6 col-lg-4 mb-4">
                                        <div className={`roadmap-card shadow-sm p-4 h-100 border-top border-4 ${isCompleted ? 'border-success bg-light opacity-75' : 'border-warning'}`} style={{ transition: 'all 0.3s ease' }}>
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <span className={`badge ${isCompleted ? 'bg-success' : 'bg-light text-navy'}`}>
                                                    {isCompleted ? 'Done' : `Day ${dIdx + 1}`}
                                                </span>
                                                <FaCheckCircle
                                                    className={isCompleted ? 'text-success cursor-pointer' : 'text-light cursor-pointer'}
                                                    size={22}
                                                    onClick={() => onToggleTask && onToggleTask(taskKey)}
                                                    style={{ cursor: 'pointer', transition: 'color 0.2s' }}
                                                    title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                                                />
                                            </div>
                                            <h5 className={`topic-title ${isCompleted ? 'text-decoration-line-through text-muted' : ''}`}>{day.topic}</h5>
                                            <p className={`task-text fw-bold mb-1 ${isCompleted ? 'text-muted' : 'text-secondary'}`}>{day.task}</p>
                                            <small className="description text-muted">{day.description}</small>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AIRoadmap;
