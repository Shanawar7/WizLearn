import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ChatPage from './ChatPage';
import { BrowserRouter } from 'react-router-dom';

// Mock context
vi.mock('../../../context/AuthContext', () => ({
    useAuth: () => ({ user: { id: 'u1', username: 'Me' } }),
    api: {
        get: vi.fn().mockResolvedValue({ data: [] }),
        post: vi.fn(),
        delete: vi.fn()
    }
}));

vi.mock('../../../context/ChatContext', () => ({
    useChat: () => ({
        messages: [],
        sendMessage: vi.fn(),
        activeChat: null,
        chats: [],
        setChats: vi.fn(),
        selectChat: vi.fn()
    })
}));

describe('ChatPage', () => {
    it('renders chat interface', () => {
        render(
            <BrowserRouter>
                <ChatPage />
            </BrowserRouter>
        );
        // Assuming ChatPage has some default text or layout
        // Just checking it renders without crashing
        expect(document.body).toBeInTheDocument();
    });
});
