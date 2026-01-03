import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Signup from './Signup';
import { BrowserRouter } from 'react-router-dom';
import * as AuthContext from '../../../context/AuthContext';

// Mock the AuthContext
vi.mock('../../../context/AuthContext', () => ({
    useAuth: vi.fn(),
}));

describe('Signup Component', () => {
    it('renders signup form', () => {
        vi.mocked(AuthContext.useAuth).mockReturnValue({
            signup: vi.fn(),
        });

        render(
            <BrowserRouter>
                <Signup />
            </BrowserRouter>
        );

        expect(screen.getByPlaceholderText(/Choose a username/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Enter your email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Create a password/i)).toBeInTheDocument();
    });

    it('calls signup on valid form submission', async () => {
        const mockSignup = vi.fn().mockResolvedValue({ success: true });
        vi.mocked(AuthContext.useAuth).mockReturnValue({
            signup: mockSignup,
        });

        render(
            <BrowserRouter>
                <Signup />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/Choose a username/i), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), { target: { value: 'test@test.com' } });
        // Select password inputs specifically (there are two, password and confirm)
        // Using getByPlaceholderText is safer here as they are unique
        fireEvent.change(screen.getByPlaceholderText(/Create a password/i), { target: { value: 'password123' } });
        fireEvent.change(screen.getByPlaceholderText(/Confirm your password/i), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

        await waitFor(() => {
            expect(mockSignup).toHaveBeenCalledWith('test@test.com', 'password123', 'testuser');
        });
    });
});
