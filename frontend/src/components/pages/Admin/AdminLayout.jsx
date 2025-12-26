import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import './admin.css';

// Internal Layout Components
const Topbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear session if needed
        navigate('/login');
    };

    return (
        <header className="admin-topbar">
            <div className="brand-logo">WizLearn Admin</div>
            <button className="btn btn-warning" onClick={handleLogout}>Logout</button>
        </header>
    );
};

const Sidebar = () => {
    return (
        <aside className="admin-sidebar">
            <div className="sidebar-inner">
                <div className="sidebar-section">
                    <h4 className="sidebar-title">Menu</h4>
                    <NavLink to="/admin" end className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}>
                        Dashboard
                    </NavLink>
                    <NavLink to="/admin/courses" className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}>
                        Courses
                    </NavLink>
                    <NavLink to="/admin/users" className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}>
                        Users
                    </NavLink>
                </div>
            </div>
        </aside>
    );
};

// Main Layout Component
const AdminLayout = () => {
    return (
        <div className="admin-shell">
            <Topbar />
            <div className="admin-main">
                <Sidebar />
                <main className="admin-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
