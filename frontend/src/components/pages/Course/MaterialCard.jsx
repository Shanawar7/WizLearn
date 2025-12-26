import React from 'react';
import { FaFileAlt, FaTrash, FaDownload, FaEye, FaBrain, FaRoad } from 'react-icons/fa';

const MaterialCard = ({ material, onDelete, onQuiz, onRoadmap, isCompleted, onToggleComplete }) => {
    const { id, title, description, files, uploadDate } = material;

    const handleDownload = (e, file) => {
        e.stopPropagation();
        if (file && file.fileData) {
            const link = document.createElement('a');
            link.href = file.fileData;
            link.download = file.fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const [previewFile, setPreviewFile] = React.useState(null);

    const handleView = (e, file) => {
        e.stopPropagation();
        console.log('Viewing file:', file.fileName, file.fileType);
        if (file && file.fileData) {
            setPreviewFile(file);
        }
    };

    const closePreview = () => setPreviewFile(null);

    return (
        <>
            <div className={`material-card ${isCompleted ? 'completed-material' : ''}`}>
                <div className="material-header">
                    <div className="d-flex align-items-center gap-2">
                        <input
                            type="checkbox"
                            checked={isCompleted}
                            onChange={() => onToggleComplete && onToggleComplete(id)}
                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            onClick={(e) => e.stopPropagation()}
                            title={isCompleted ? "Mark as unread" : "Mark as read"}
                        />
                        <FaFileAlt className={`material-icon ${isCompleted ? 'text-success' : ''}`} />
                    </div>
                    <div className="material-info">
                        <h3 className={`material-title ${isCompleted ? 'text-decoration-line-through text-muted' : ''}`}>{title}</h3>
                        <p className="material-date">{new Date(material.createdAt || uploadDate).toLocaleDateString()}</p>
                    </div>
                    <div className="d-flex gap-2">
                        <button className="material-quiz-btn" onClick={(e) => { e.stopPropagation(); onQuiz && onQuiz(); }} title="Material Mock Test">
                            <FaBrain />
                        </button>
                        <button className="material-roadmap-btn" onClick={(e) => { e.stopPropagation(); onRoadmap && onRoadmap(); }} title="Material Study Roadmap" style={{ background: '#38a169', color: 'white', border: 'none', padding: '5px 8px', borderRadius: '4px', cursor: 'pointer' }}>
                            <FaRoad />
                        </button>
                        {onDelete && (
                            <button className="material-delete-btn" onClick={() => onDelete(id)} title="Delete material">
                                <FaTrash />
                            </button>
                        )}
                    </div>
                </div>

                <div className="material-body">
                    <p className="material-description">{description}</p>

                    {files && files.length > 0 && (
                        <div className="material-files-container">
                            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: '#666' }}>Attached Files:</h4>
                            {files.map((file, index) => {
                                const isImage = file.fileType.startsWith('image/');
                                const isPDF = file.fileType === 'application/pdf';

                                return (
                                    <div key={file.id || index} className="material-file-item">
                                        <div className="file-info">
                                            <FaFileAlt className="file-icon" />
                                            <span className="file-name">{file.fileName}</span>
                                        </div>
                                        <div className="file-actions">
                                            {(isImage || isPDF) && (
                                                <button className="file-action-btn view-file-btn" onClick={(e) => handleView(e, file)} title="View file">
                                                    <FaEye />
                                                </button>
                                            )}
                                            <button className="file-action-btn download-file-btn" onClick={(e) => handleDownload(e, file)} title="Download file">
                                                <FaDownload />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                <style jsx>{`
                    .material-files-container {
                        margin-top: 1rem;
                        border-top: 1px solid #eee;
                        padding-top: 0.5rem;
                    }
                    .material-file-item {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        background: #f8f9fa;
                        padding: 0.5rem;
                        border-radius: 4px;
                        margin-bottom: 0.5rem;
                        font-size: 0.9rem;
                    }
                    .file-info {
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                        overflow: hidden;
                    }
                    .file-name {
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        max-width: 150px;
                    }
                    .file-actions {
                        display: flex;
                        gap: 0.25rem;
                    }
                    .file-action-btn {
                        padding: 0.25rem 0.5rem;
                        border: none;
                        border-radius: 3px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        font-size: 0.8rem;
                    }
                    .view-file-btn {
                        background: #e2e8f0;
                        color: #4a5568;
                    }
                    .download-file-btn {
                        background: #e2e8f0;
                        color: #4a5568;
                    }
                    .view-file-btn:hover, .download-file-btn:hover {
                        background: #cbd5e0;
                    }
                `}</style>
            </div>

            {previewFile && (
                <div className="file-preview-overlay" onClick={closePreview}>
                    <div className="file-preview-modal" onClick={e => e.stopPropagation()}>
                        <div className="preview-header">
                            <h3>{previewFile.fileName}</h3>
                            <button onClick={closePreview}>×</button>
                        </div>
                        <div className="preview-content">
                            {previewFile.fileType === 'application/pdf' ? (
                                <iframe
                                    src={previewFile.fileData}
                                    title={previewFile.fileName}
                                    width="100%"
                                    height="600px"
                                    style={{ border: 'none' }}
                                />
                            ) : (
                                <img
                                    src={previewFile.fileData}
                                    alt={previewFile.fileName}
                                    style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }}
                                />
                            )}
                        </div>
                    </div>
                    <style jsx>{`
                        .file-preview-overlay {
                            position: fixed;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            background: rgba(0, 0, 0, 0.8);
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            z-index: 1000;
                            padding: 20px;
                        }
                        .file-preview-modal {
                            background: white;
                            width: 90%;
                            max-width: 900px;
                            border-radius: 8px;
                            overflow: hidden;
                            display: flex;
                            flex-direction: column;
                            max-height: 90vh;
                        }
                        .preview-header {
                            padding: 15px;
                            border-bottom: 1px solid #eee;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                        }
                        .preview-header h3 {
                            margin: 0;
                            font-size: 1.1rem;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                        .preview-header button {
                            background: none;
                            border: none;
                            font-size: 1.5rem;
                            cursor: pointer;
                            line-height: 1;
                        }
                        .preview-content {
                            flex: 1;
                            overflow: auto;
                            padding: 20px;
                            background: #f5f5f5;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }
                    `}</style>
                </div>
            )}
        </>
    );
};

export default MaterialCard;
