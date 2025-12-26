import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const AddCourseModal = ({ isOpen, onClose, onSubmit, editCourse }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (editCourse) {
            setFormData({
                title: editCourse.title,
                description: editCourse.description
            });
        } else {
            setFormData({ title: '', description: '' });
        }
        setErrors({});
    }, [editCourse, isOpen]);

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
        if (!formData.title.trim()) {
            newErrors.title = 'Course title is required';
        }
        if (!formData.description.trim()) {
            newErrors.description = 'Course description is required';
        }
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        onSubmit(formData);
        setFormData({ title: '', description: '' });
        setErrors({});
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="add-course-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{editCourse ? 'Edit Course' : 'Create New Course'}</h2>
                    <button className="close-btn" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="title">Course Title *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            className={`form-input ${errors.title ? 'input-error' : ''}`}
                            placeholder="Enter course title"
                            value={formData.title}
                            onChange={handleChange}
                        />
                        {errors.title && <span className="error-message">{errors.title}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Course Description *</label>
                        <textarea
                            id="description"
                            name="description"
                            className={`form-textarea ${errors.description ? 'input-error' : ''}`}
                            placeholder="Enter course description"
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                        />
                        {errors.description && <span className="error-message">{errors.description}</span>}
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-done">
                            {editCourse ? 'Update' : 'Done'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCourseModal;
