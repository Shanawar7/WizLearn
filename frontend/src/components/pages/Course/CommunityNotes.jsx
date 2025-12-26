import React, { useState, useEffect } from 'react';
import { FaPlus, FaUserCircle, FaBook, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { api, useAuth } from '../../../context/AuthContext';

const CommunityNotes = () => {
    const { user } = useAuth();
    const [notes, setNotes] = useState([]);
    const [courses, setCourses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newNote, setNewNote] = useState({ title: '', content: '', courseId: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchNotes();
        fetchCourses();
    }, []);

    const fetchNotes = async () => {
        try {
            const response = await api.get('/notes');
            setNotes(response.data);
        } catch (error) {
            console.error('Failed to fetch notes', error);
        }
    };

    const fetchCourses = async () => {
        try {
            const response = await api.get('/courses');
            setCourses(response.data);
        } catch (error) {
            console.error('Failed to fetch courses', error);
        }
    };

    const handleCreateNote = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/notes', newNote);
            setNewNote({ title: '', content: '', courseId: '' });
            setIsModalOpen(false);
            fetchNotes();
        } catch (error) {
            alert('Failed to create note');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this note?')) return;
        try {
            await api.delete(`/notes/${id}`);
            setNotes(notes.filter(n => n.id !== id));
        } catch (error) {
            alert('Failed to delete');
        }
    };

    return (
        <div className="community-notes-page p-4" style={{ minHeight: '100vh', background: '#f7f9fc' }}>
            <div className="container mt-4">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div className="d-flex align-items-center">
                        <Link to="/dashboard" className="btn btn-outline-navy me-3"><FaArrowLeft /></Link>
                        <h1 className="text-navy mb-0">Community Shared Notes</h1>
                    </div>
                    <button className="btn btn-warning px-4 py-2 fw-bold" onClick={() => setIsModalOpen(true)}>
                        <FaPlus className="me-2" /> Share Note
                    </button>
                </div>

                <div className="notes-grid row">
                    {notes.map(note => (
                        <div key={note.id} className="col-md-6 col-lg-4 mb-4">
                            <div className="note-card shadow-sm p-4 bg-white rounded-3 h-100 position-relative border-top border-5 border-navy">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div className="d-flex align-items-center">
                                        <FaUserCircle className="text-secondary me-2" size={20} />
                                        <small className="text-muted fw-bold">{note.author.name}</small>
                                    </div>
                                    {(user.id === note.author.id || user.role === 'admin') && (
                                        <button className="btn btn-sm text-danger" onClick={() => handleDelete(note.id)}>
                                            <FaTrash />
                                        </button>
                                    )}
                                </div>

                                <h4 className="note-title text-navy mb-2">{note.title}</h4>
                                {note.course && (
                                    <div className="badge bg-light text-navy mb-3">
                                        <FaBook className="me-1" /> {note.course.title}
                                    </div>
                                )}
                                <p className="note-content text-secondary">{note.content}</p>
                                <small className="text-muted position-absolute bottom-0 end-0 p-3">
                                    {new Date(note.createdAt).toLocaleDateString()}
                                </small>
                            </div>
                        </div>
                    ))}
                    {notes.length === 0 && (
                        <div className="col-12 text-center p-5">
                            <h3 className="text-muted">No notes shared yet. Be the first!</h3>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Note Modal */}
            {isModalOpen && (
                <div className="modal-overlay d-flex align-items-center justify-content-center" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1100 }}>
                    <div className="bg-white p-5 rounded-4 shadow-lg w-100" style={{ maxWidth: '600px' }}>
                        <h2 className="text-navy mb-4">Share a New Note</h2>
                        <form onSubmit={handleCreateNote}>
                            <div className="mb-3">
                                <label className="form-label fw-bold">Title</label>
                                <input
                                    type="text"
                                    className="form-control p-3"
                                    placeholder="e.g., Summary of OS Week 3"
                                    required
                                    value={newNote.title}
                                    onChange={e => setNewNote({ ...newNote, title: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-bold">Course (Optional)</label>
                                <select
                                    className="form-select p-3"
                                    value={newNote.courseId}
                                    onChange={e => setNewNote({ ...newNote, courseId: e.target.value })}
                                >
                                    <option value="">Select a course</option>
                                    {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="form-label fw-bold">Note Content</label>
                                <textarea
                                    className="form-control p-3"
                                    rows="5"
                                    placeholder="Paste your notes or summary here..."
                                    required
                                    value={newNote.content}
                                    onChange={e => setNewNote({ ...newNote, content: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="d-flex gap-3">
                                <button type="button" className="btn btn-light flex-grow-1 p-3" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-warning flex-grow-1 p-3 fw-bold" disabled={loading}>
                                    {loading ? 'Sharing...' : 'Share Now'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommunityNotes;
