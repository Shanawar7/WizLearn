import React, { useState, useEffect } from 'react';
import { FaTimes, FaUpload } from 'react-icons/fa';

const UploadMaterialModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        fileName: ''
    });

    const [errors, setErrors] = useState({});
    const [selectedFiles, setSelectedFiles] = useState([]);

    useEffect(() => {
        if (!isOpen) {
            setFormData({ title: '', description: '', fileName: '' });
            setSelectedFiles([]);
            setErrors({});
        }
    }, [isOpen]);

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

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setSelectedFiles(prev => [...prev, ...files]);
        }
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) {
            newErrors.title = 'Material title is required';
        }
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const processedFiles = [];
        if (selectedFiles.length > 0) {
            for (const file of selectedFiles) {
                const reader = new FileReader();
                const fileData = await new Promise((resolve) => {
                    reader.onload = (e) => {
                        resolve({
                            fileName: file.name,
                            fileType: file.type,
                            // size: file.size,
                            fileData: e.target.result // Base64
                        });
                    };
                    reader.readAsDataURL(file);
                });
                processedFiles.push(fileData);
            }
        }

        onSubmit({
            title: formData.title,
            description: formData.description,
            files: processedFiles
        });

        setFormData({ title: '', description: '', fileName: '' });
        setSelectedFiles([]);
        setErrors({});
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="upload-material-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Upload Material</h2>
                    <button className="close-btn" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="title">Material Title *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            className={`form-input ${errors.title ? 'input-error' : ''}`}
                            placeholder="e.g., Week 1 Lecture Notes"
                            value={formData.title}
                            onChange={handleChange}
                        />
                        {errors.title && <span className="error-message">{errors.title}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description *</label>
                        <textarea
                            id="description"
                            name="description"
                            className={`form-textarea ${errors.description ? 'input-error' : ''}`}
                            placeholder="Describe the material..."
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                        />
                        {errors.description && <span className="error-message">{errors.description}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="file">Upload Files (Optional)</label>
                        <div className="file-upload-container">
                            <input
                                type="file"
                                id="file"
                                className="file-input"
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
                                multiple
                            />
                            <label htmlFor="file" className="file-upload-label">
                                <FaUpload />
                                <span>{selectedFiles.length > 0 ? `${selectedFiles.length} files selected` : 'Choose files'}</span>
                            </label>
                        </div>
                        {selectedFiles.length > 0 && (
                            <div className="selected-files-list">
                                {selectedFiles.map((file, index) => (
                                    <div key={index} className="selected-file-item">
                                        <span>{file.name}</span>
                                        <button type="button" onClick={() => removeFile(index)}>×</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-done">
                            Upload
                        </button>
                    </div>
                </form>
            </div>
            <style jsx>{`
                .selected-files-list {
                    margin-top: 10px;
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }
                .selected-file-item {
                    display: flex;
                    justify-content: space-between;
                    background: #f0f0f0;
                    padding: 5px 10px;
                    border-radius: 4px;
                    align-items: center;
                }
                .selected-file-item button {
                    background: none;
                    border: none;
                    color: red;
                    cursor: pointer;
                    font-size: 1.2rem;
                }
            `}</style>
        </div >
    );
};

export default UploadMaterialModal;
