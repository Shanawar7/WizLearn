import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './components/pages/Landing/LandingPage';
import Login from './components/pages/Auth/Login';
import Signup from './components/pages/Auth/Signup';
import Dashboard from './components/pages/Dashboard/Dashboard';
import CoursePage from './components/pages/Course/CoursePage';
import ProfilePage from './components/pages/Profile/ProfilePage';
import ChatPage from './components/pages/Chat/ChatPage';
import CommunityNotes from './components/pages/Course/CommunityNotes';

// Admin Imports
import AdminLayout from './components/pages/Admin/AdminLayout';
import AdminDashboard from './components/pages/Admin/AdminDashboard';
import AdminCoursesPage from './components/pages/Admin/AdminCoursesPage';
import AdminUsersPage from './components/pages/Admin/AdminUsersPage';
import AdminMaterialsPage from './components/pages/Admin/AdminMaterialsPage';
import { AdminProvider } from './components/pages/Admin/AdminContext';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

// Main App Component with Router
const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ChatProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/course/:courseId" element={
              <ProtectedRoute>
                <CoursePage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/chat" element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            } />
            <Route path="/community" element={
              <ProtectedRoute>
                <CommunityNotes />
              </ProtectedRoute>
            } />

            {/* Admin Routes - Protected by Admin Guard */}
            <Route path="/admin" element={
              <ProtectedAdminRoute>
                <AdminProvider>
                  <AdminLayout />
                </AdminProvider>
              </ProtectedAdminRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="courses" element={<AdminCoursesPage />} />
              <Route path="courses/:courseId/materials" element={<AdminMaterialsPage />} />
              <Route path="users" element={<AdminUsersPage />} />
            </Route>

          </Routes>
        </ChatProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;