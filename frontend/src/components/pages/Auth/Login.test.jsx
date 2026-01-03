import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Login from './Login';
import { BrowserRouter } from 'react-router-dom';
import * as AuthContext from '../../../context/AuthContext';

// Mock the AuthContext
vi.mock('../../../context/AuthContext', () => ({
    useAuth: vi.fn(),
}));

describe('Login Component', () => {
    it('renders login form', () => {
        // Setup mock return value
        vi.mocked(AuthContext.useAuth).mockReturnValue({
            login: vi.fn(),
        });

        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        expect(screen.getByPlaceholderText(/Enter your email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Enter your password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Login as User/i })).toBeInTheDocument();
    });

    it('updates input values', () => {
        vi.mocked(AuthContext.useAuth).mockReturnValue({
            login: vi.fn(),
        });

        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        const emailInput = screen.getByPlaceholderText(/Enter your email/i);
        const passwordInput = screen.getByPlaceholderText(/Enter your password/i);

        fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(emailInput.value).toBe('test@test.com');
        expect(passwordInput.value).toBe('password123');
    });

    it('calls login on form submission', async () => {
        const mockLogin = vi.fn().mockResolvedValue({ success: true });
        vi.mocked(AuthContext.useAuth).mockReturnValue({
            login: mockLogin,
        });

        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), { target: { value: 'test@test.com' } });
        fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: /Login as User/i }));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('test@test.com', 'password123');
        });
    });
});
