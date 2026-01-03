import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CourseNavbar from './CourseNavbar';
import { MemoryRouter } from 'react-router-dom';
import * as idGen from '../Utils/idGenerator';

// Mock clearUser
vi.mock('../Utils/idGenerator', () => ({
    clearUser: vi.fn()
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

describe('CourseNavbar', () => {
    it('renders title and buttons', () => {
        render(
            <MemoryRouter>
                <CourseNavbar courseTitle="React Basics" activeView="materials" />
            </MemoryRouter>
        );

        expect(screen.getByText('React Basics')).toBeInTheDocument();
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Resources')).toBeInTheDocument();
        expect(screen.getByText('Quiz')).toBeInTheDocument();
        expect(screen.getByText('Roadmap')).toBeInTheDocument();
    });

    it('navigates back to dashboard', () => {
        render(
            <MemoryRouter>
                <CourseNavbar />
            </MemoryRouter>
        );
        fireEvent.click(screen.getByText('Dashboard'));
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });

    it('calls action props', () => {
        const onQuiz = vi.fn();
        const onRoadmap = vi.fn();
        const onRes = vi.fn();

        render(
            <MemoryRouter>
                <CourseNavbar
                    onGenerateQuiz={onQuiz}
                    onGenerateRoadmap={onRoadmap}
                    onShowResources={onRes}
                />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText('Quiz'));
        expect(onQuiz).toHaveBeenCalled();

        fireEvent.click(screen.getByText('Roadmap'));
        expect(onRoadmap).toHaveBeenCalled();

        fireEvent.click(screen.getByText('Resources'));
        expect(onRes).toHaveBeenCalled();
    });

    it('handles logout', () => {
        render(
            <MemoryRouter>
                <CourseNavbar />
            </MemoryRouter>
        );
        // Find logout button by icon or class. Since it doesn't have text, use class selector via querySelector or add testid
        // We'll rely on the class 'logout-btn'
        const logoutBtn = document.querySelector('.logout-btn');
        fireEvent.click(logoutBtn);
        expect(idGen.clearUser).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });
});
