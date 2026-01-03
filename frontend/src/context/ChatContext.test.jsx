import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ChatProvider, useChat } from './ChatContext';
import React from 'react';

// Mock AuthContext as ChatContext often depends on it
vi.mock('./AuthContext', () => ({
    useAuth: () => ({ user: { id: 'u1' } })
}));

const TestComponent = () => {
    const { messages } = useChat();
    return <div>Messages: {messages.length}</div>;
};

describe('ChatContext', () => {
    it('provides chat state', () => {
        render(
            <ChatProvider>
                <TestComponent />
            </ChatProvider>
        );
        expect(screen.getByText(/Messages:/)).toBeInTheDocument();
    });
});
