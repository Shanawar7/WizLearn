import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AdminDashboard from './AdminDashboard';
import { BrowserRouter } from 'react-router-dom';

// Mock AdminContext and other sub-components if necessary to avoid deep crashing
vi.mock('./AdminContext', () => ({
    useAdmin: () => ({
        stats: { totalUsers: 10, totalCourses: 5, activeStudents: 8 },
        recentActivity: [],
        loading: false,
        users: [],
        courses: []
    })
}));

// Mock chart.js to avoid canvas rendering issues in jsdom
vi.mock('react-chartjs-2', () => ({
    Line: () => <div>Line Chart</div>,
    Bar: () => <div>Bar Chart</div>,
    Doughnut: () => <div>Doughnut Chart</div>
}));

describe('AdminDashboard', () => {
    it('renders dashboard stats', () => {
        render(
            <BrowserRouter>
                <AdminDashboard />
            </BrowserRouter>
        );
        expect(screen.getByText(/Total Users/i)).toBeInTheDocument();
        // Since we mocked stats to 10, checks for that if rendered
    });
});
