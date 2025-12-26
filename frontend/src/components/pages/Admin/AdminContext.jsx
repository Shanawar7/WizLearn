import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../../../context/AuthContext';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
    const [courses, setCourses] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [usersRes, coursesRes] = await Promise.all([
                api.get('/admin/users'),
                api.get('/admin/courses')
            ]);
            setUsers(usersRes.data);
            setCourses(coursesRes.data);
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteCourse = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await api.delete(`/admin/courses/${id}`);
                setCourses(prev => prev.filter(c => c.id !== id));
            } catch (error) {
                console.error('Failed to delete course', error);
                alert('Failed to delete course');
            }
        }
    };

    const deleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/admin/users/${id}`);
                setUsers(prev => prev.filter(u => u.id !== id));
            } catch (error) {
                console.error('Failed to delete user', error);
                alert('Failed to delete user');
            }
        }
    };

    const deleteMaterial = async (id) => {
        if (window.confirm('Are you sure you want to delete this material?')) {
            try {
                await api.delete(`/admin/materials/${id}`);
                // Refresh data to reflect changes (material count in courses list)
                fetchData();
                return { success: true };
            } catch (error) {
                console.error('Failed to delete material', error);
                alert('Failed to delete material');
                return { success: false };
            }
        }
    };

    const blockUser = async (id, seconds) => {
        try {
            await api.patch(`/admin/users/${id}/block`, { seconds });
            fetchData(); // Refresh users list
            return { success: true };
        } catch (error) {
            console.error('Failed to block user', error);
            alert('Failed to block user');
            return { success: false };
        }
    };

    const unblockUser = async (id) => {
        try {
            await api.patch(`/admin/users/${id}/unblock`);
            fetchData(); // Refresh users list
            return { success: true };
        } catch (error) {
            console.error('Failed to unblock user', error);
            alert('Failed to unblock user');
            return { success: false };
        }
    };

    return (
        <AdminContext.Provider value={{ courses, users, deleteCourse, deleteUser, deleteMaterial, blockUser, unblockUser, loading }}>
            {children}
        </AdminContext.Provider>
    );
};
