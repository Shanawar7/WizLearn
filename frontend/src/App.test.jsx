import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// We need to mock the providers and complex children to avoid deep tree rendering issues in a unit test
// But for a smoke test, mocking properties might be enough.
// Since App contains Providers, we can just try to render it. 
// If it makes API calls on mount, we might need to mock services.
// Assuming AuthProvider might try to check validation on mount.

// Let's shallow mock the AuthProvider and ChatProvider to prevent complex logic
vi.mock('./context/AuthContext', () => ({
    AuthProvider: ({ children }) => <div>{children}</div>,
    useAuth: () => ({ isAuthenticated: false, login: vi.fn() }),
}));

vi.mock('./context/ChatContext', () => ({
    ChatProvider: ({ children }) => <div>{children}</div>,
}));

describe('App Component', () => {
    it('renders without crashing', () => {
        render(<App />);
        // Since we are mocking everything, we can just check if routes seem to work by checking for Landing Page text?
        // Or just that it didn't throw.
        // LandingPage usually has "Welcome" or "WizLearn"

        // App includes BrowserRouter, so it should render the path "/" by default which is LandingPage.
        // Let's assume LandingPage renders "WizLearn" (as seen in Login component brand)
        // or checking for some text we know exists.
    });
});
