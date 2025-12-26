import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAdmin } from './AdminContext';
import { api } from '../../../context/AuthContext';
import { FaTrash, FaArrowLeft, FaFileAlt } from 'react-icons/fa';

export default function AdminMaterialsPage() {
    const { courseId } = useParams();
    const { deleteMaterial, loading: contextLoading } = useAdmin();
    const [materials, setMaterials] = useState([]);
    const [courseTitle, setCourseTitle] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMaterials();
    }, [courseId]);

    const fetchMaterials = async () => {
        try {
            const response = await api.get(`/admin/materials/${courseId}`);
            setMaterials(response.data);
            if (response.data.length > 0) {
                setCourseTitle(response.data[0].course?.title);
            } else {
                // If no materials, fetch course info separately
                const courseRes = await api.get(`/courses/${courseId}`);
                setCourseTitle(courseRes.data.title);
            }
        } catch (error) {
            console.error('Error fetching materials:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (materialId) => {
        const result = await deleteMaterial(materialId);
        if (result.success) {
            setMaterials(prev => prev.filter(m => m.id !== materialId));
        }
    };

    if (loading || contextLoading) {
        return <div className="container mt-5 text-center"><h4>Loading Materials...</h4></div>;
    }

    return (
        <div className="container-fluid mt-4">
            <div className="d-flex align-items-center mb-4 gap-3">
                <Link to="/admin/courses" className="btn btn-outline-secondary btn-sm">
                    <FaArrowLeft /> Back to Courses
                </Link>
                <h2 className="mb-0" style={{ color: 'var(--navy)' }}>
                    Manage Materials: <span className="text-secondary">{courseTitle || 'Loading...'}</span>
                </h2>
            </div>

            <div className="card shadow-sm" style={{ borderRadius: '12px' }}>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="ps-4">Title</th>
                                    <th>Description</th>
                                    <th>Files</th>
                                    <th>Uploaded At</th>
                                    <th className="pe-4 text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {materials.length > 0 ? (
                                    materials.map((material) => (
                                        <tr key={material.id}>
                                            <td className="ps-4 fw-bold">{material.title}</td>
                                            <td>{material.description?.substring(0, 50)}...</td>
                                            <td>
                                                <span className="badge bg-info text-white">
                                                    <FaFileAlt className="me-1" /> {material.files?.length || 0} Files
                                                </span>
                                            </td>
                                            <td>{new Date(material.createdAt).toLocaleDateString()}</td>
                                            <td className="pe-4 text-end">
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDelete(material.id)}
                                                    title="Remove Material"
                                                >
                                                    <FaTrash className="me-1" /> Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5 text-muted">
                                            No materials found for this course.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
