import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';
import React from 'react';

// Mock axios if AuthContext uses it
vi.mock('axios', () => ({
    default: {
        create: vi.fn(() => ({
            defaults: { headers: { common: {} } },
            interceptors: {
                request: { use: vi.fn() },
                response: { use: vi.fn() }
            },
            get: vi.fn().mockResolvedValue({ data: {} }),
            post: vi.fn().mockResolvedValue({ data: {} })
        }))
    }
}));

const TestComponent = () => {
    const { user, login } = useAuth();
    return (
        <div>
            <span>{user ? 'Logged In' : 'Logged Out'}</span>
            <button onClick={() => login('test', 'test')}>Login</button>
        </div>
    );
};

describe('AuthContext', () => {
    it('provides auth state', async () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );
        // Initial state is loading, preventing children from rendering or rendering as null?
        // AuthProvider: if (loading) return ...? 
        // No, AuthProvider renders children immediately but passes loading: true/false.
        // But TestComponent checks {user}.
        // If user is null (default without localStorage), it should print "Logged Out".

        // Wait for potential useEffect to settle
        await waitFor(() => {
            expect(screen.getByText('Logged Out')).toBeInTheDocument();
        });
    });
});
