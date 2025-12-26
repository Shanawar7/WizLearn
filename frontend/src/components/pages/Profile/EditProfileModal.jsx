import React, { useState, useEffect } from 'react';
import { FaTimes, FaUser, FaEnvelope, FaPen } from 'react-icons/fa';

const EditProfileModal = ({ isOpen, onClose, user, onUpdate }) => {
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        avatarUrl: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                bio: user.bio || '',
                avatarUrl: user.avatarUrl || ''
            });
        }
    }, [user, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="add-course-modal profile-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Edit Profile</h2>
                    <button className="close-btn" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <div className="input-with-icon">
                            <FaUser className="input-icon" />
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="form-input"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="bio">Bio</label>
                        <div className="input-with-icon">
                            <FaPen className="input-icon" />
                            <textarea
                                id="bio"
                                name="bio"
                                className="form-textarea"
                                value={formData.bio}
                                onChange={handleChange}
                                placeholder="Tell us about yourself..."
                                rows="3"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="avatarUrl">Avatar URL</label>
                        <div className="input-with-icon">
                            <FaEnvelope className="input-icon" />
                            <input
                                type="text"
                                id="avatarUrl"
                                name="avatarUrl"
                                className="form-input"
                                value={formData.avatarUrl}
                                onChange={handleChange}
                                placeholder="https://example.com/avatar.png"
                            />
                        </div>
                        <small style={{ color: '#718096', marginTop: '0.5rem', display: 'block' }}>
                            Paste a direct link to an image for your profile picture.
                        </small>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-done">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
            <style>{`
                .profile-modal {
                    max-width: 500px;
                }
                .input-with-icon {
                    position: relative;
                }
                .input-icon {
                    position: absolute;
                    left: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #718096;
                }
                .input-with-icon .form-input,
                .input-with-icon .form-textarea {
                    padding-left: 2.5rem;
                }
                .input-with-icon .form-textarea {
                    padding-top: 1rem;
                    top: 1rem;
                    transform: none;
                }
                .input-with-icon .input-icon {
                    top: 1.2rem; 
                }
                 /* Fix alignment for textarea icon */
                 .form-group textarea + .input-icon {
                    top: 20px;
                 }
            `}</style>
        </div>
    );
};

export default EditProfileModal;
