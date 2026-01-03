import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProtectedRoute from './ProtectedRoute';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import * as AuthContext from '../context/AuthContext';

// Mock AuthContext
vi.mock('../context/AuthContext', () => ({
    useAuth: vi.fn()
}));

describe('ProtectedRoute', () => {
    it('renders loading state', () => {
        vi.spyOn(AuthContext, 'useAuth').mockReturnValue({ loading: true });
        render(
            <MemoryRouter>
                <ProtectedRoute><div>Protected Content</div></ProtectedRoute>
            </MemoryRouter>
        );
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('redirects to login if not authenticated', () => {
        vi.spyOn(AuthContext, 'useAuth').mockReturnValue({ loading: false, user: null, token: null });

        render(
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route path="/protected" element={<ProtectedRoute><div>Protected Content</div></ProtectedRoute>} />
                    <Route path="/login" element={<div>Login Page</div>} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('Login Page')).toBeInTheDocument();
        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('renders children if authenticated', () => {
        vi.spyOn(AuthContext, 'useAuth').mockReturnValue({ loading: false, user: { id: 1 }, token: 'abc' });

        render(
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route path="/protected" element={<ProtectedRoute><div>Protected Content</div></ProtectedRoute>} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
});
