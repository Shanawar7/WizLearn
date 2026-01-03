import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProfilePage from './ProfilePage';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../../../context/AuthContext', () => ({
    useAuth: () => ({ user: { name: 'TestUser', email: 'test@test.com', friendId: 'WL-USER-12345' } })
}));

describe('ProfilePage', () => {
    it('renders user profile info', () => {
        render(
            <BrowserRouter>
                <ProfilePage />
            </BrowserRouter>
        );
        // ProfilePage might render inputs with values, or text.
        // If it renders inputs:
        // expect(screen.getByDisplayValue('TestUser')).toBeInTheDocument();

        // Let's assume it renders text for now, but if it fails I'll try finding by role or just generic text.
        // The error said "Unable to find an element with the text: TestUser".
        // This implies it might be loading or the structure is different.
        // Let's check if it's loading? mock Auth context usually is instant.

        // Debug: check what is rendered?
        // screen.debug(); 

        expect(screen.getByText('TestUser')).toBeInTheDocument();
        // Email is not displayed in the header, let's check for ID instead
        expect(screen.getByText(/WL-USER-12345/)).toBeInTheDocument();
    });
});
