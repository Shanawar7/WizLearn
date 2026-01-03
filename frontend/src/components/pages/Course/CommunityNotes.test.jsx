import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CommunityNotes from './CommunityNotes';
import { MemoryRouter } from 'react-router-dom';

// Mock AuthContext
vi.mock('../../../context/AuthContext', () => ({
    useAuth: () => ({ user: { id: 'u1', name: 'Test User', role: 'student' } }),
    api: {
        get: vi.fn(),
        post: vi.fn(),
        delete: vi.fn()
    }
}));

import { api } from '../../../context/AuthContext';

describe('CommunityNotes', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders notes and fetches data', async () => {
        api.get.mockImplementation((url) => {
            if (url === '/notes') return Promise.resolve({ data: [{ id: 'n1', title: 'Note 1', content: 'Content 1', author: { name: 'User A' }, createdAt: new Date().toISOString() }] });
            if (url === '/courses') return Promise.resolve({ data: [] });
            return Promise.resolve({ data: [] });
        });

        render(
            <MemoryRouter>
                <CommunityNotes />
            </MemoryRouter>
        );

        expect(screen.getByText('Community Shared Notes')).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByText('Note 1')).toBeInTheDocument();
            expect(screen.getByText('Content 1')).toBeInTheDocument();
            expect(screen.getByText('User A')).toBeInTheDocument();
        });
    });

    it('opens share modal and submits', async () => {
        api.get.mockResolvedValue({ data: [] });
        api.post.mockResolvedValue({ data: {} });

        render(
            <MemoryRouter>
                <CommunityNotes />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText('Share Note'));
        expect(screen.getByText('Share a New Note')).toBeInTheDocument();

        fireEvent.change(screen.getByPlaceholderText(/e.g., Summary/i), { target: { value: 'New Note' } });
        fireEvent.change(screen.getByPlaceholderText(/Paste your notes/i), { target: { value: 'New Content' } });

        fireEvent.click(screen.getByText('Share Now'));

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/notes', expect.objectContaining({
                title: 'New Note',
                content: 'New Content'
            }));
        });
    });
});
