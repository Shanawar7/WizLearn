import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProtectedAdminRoute from './ProtectedAdminRoute';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import * as AuthContext from '../context/AuthContext';

// Mock AuthContext
vi.mock('../context/AuthContext', () => ({
    useAuth: vi.fn()
}));

describe('ProtectedAdminRoute', () => {
    it('renders loading state', () => {
        vi.spyOn(AuthContext, 'useAuth').mockReturnValue({ loading: true });
        render(
            <MemoryRouter>
                <ProtectedAdminRoute><div>Admin Content</div></ProtectedAdminRoute>
            </MemoryRouter>
        );
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('redirects to login if not authenticated', () => {
        vi.spyOn(AuthContext, 'useAuth').mockReturnValue({ loading: false, user: null, token: null });

        render(
            <MemoryRouter initialEntries={['/admin']}>
                <Routes>
                    <Route path="/admin" element={<ProtectedAdminRoute><div>Admin Content</div></ProtectedAdminRoute>} />
                    <Route path="/login" element={<div>Login Page</div>} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('Login Page')).toBeInTheDocument();
        expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
    });

    it('redirects to dashboard if authenticated but not admin', () => {
        vi.spyOn(AuthContext, 'useAuth').mockReturnValue({ loading: false, user: { id: 1, role: 'student' }, token: 'abc' });

        render(
            <MemoryRouter initialEntries={['/admin']}>
                <Routes>
                    <Route path="/admin" element={<ProtectedAdminRoute><div>Admin Content</div></ProtectedAdminRoute>} />
                    <Route path="/dashboard" element={<div>Dashboard Page</div>} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
        expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
    });

    it('renders children if authenticated and admin', () => {
        vi.spyOn(AuthContext, 'useAuth').mockReturnValue({ loading: false, user: { id: 1, role: 'admin' }, token: 'abc' });

        render(
            <MemoryRouter initialEntries={['/admin']}>
                <Routes>
                    <Route path="/admin" element={<ProtectedAdminRoute><div>Admin Content</div></ProtectedAdminRoute>} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('Admin Content')).toBeInTheDocument();
    });
});
