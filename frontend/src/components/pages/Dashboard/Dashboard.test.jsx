import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Dashboard from './Dashboard';
import { BrowserRouter } from 'react-router-dom';

// Mock context and child components
vi.mock('../../../context/AuthContext', () => ({
    useAuth: () => ({ user: { name: 'TestUser', friendId: 'WL-USER-123' } }),
    api: { get: vi.fn().mockResolvedValue({ data: [] }) } // Mock api too since Dashboard uses it
}));

vi.mock('./DashboardNavbar', () => ({ default: () => <div>Navbar</div> }));
vi.mock('./CourseCard', () => ({ default: () => <div>Course Card</div> }));
vi.mock('./AddCourseModal', () => ({ default: () => <div>Add Course Modal</div> }));

describe('Dashboard', () => {
    it('renders welcome message', () => {
        render(
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        );
        expect(screen.getByText(/Welcome back, TestUser/i)).toBeInTheDocument();
        expect(screen.getByText('Navbar')).toBeInTheDocument();
    });
});
