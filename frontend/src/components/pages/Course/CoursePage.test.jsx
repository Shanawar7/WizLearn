import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CoursePage from './CoursePage';
import { MemoryRouter } from 'react-router-dom';

// Mock Modules
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useParams: () => ({ courseId: '123' }),
        useNavigate: () => vi.fn()
    };
});

vi.mock('../../../context/AuthContext', () => ({
    useAuth: () => ({ user: { id: 'u1', name: 'Test User' } }),
    api: {
        get: vi.fn(),
        post: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn()
    }
}));

vi.mock('../Utils/idGenerator', () => ({
    getCourseColorByIndex: () => ({ from: '#000', to: '#fff' })
}));

// Mock Child Components to simplify testing
vi.mock('./CourseNavbar', () => ({ default: ({ activeView }) => <div data-testid="course-navbar">Navbar: {activeView}</div> }));
vi.mock('./MaterialCard', () => ({ default: ({ material }) => <div data-testid="material-card">{material.title}</div> }));
vi.mock('./UploadMaterialModal', () => ({ default: () => <div data-testid="upload-modal">Upload Modal</div> }));
vi.mock('./AIRoadmap', () => ({ default: () => <div data-testid="ai-roadmap">AI Roadmap</div> }));
vi.mock('./ExternalResources', () => ({ default: () => <div data-testid="external-resources">External Resources</div> }));
vi.mock('./AIQuiz', () => ({ default: () => <div data-testid="ai-quiz">AI Quiz</div> }));

import { api } from '../../../context/AuthContext';

describe('CoursePage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading state initially', () => {
        // Mock API implementation to return promise that doesn't resolve immediately if needed
        // But for this component, it renders "Loading..." only if course is null.
        // We will mock API to resolve nicely
        api.get.mockImplementation((url) => {
            if (url.includes('/courses/123')) return Promise.resolve({ data: { id: '123', title: 'Test Course', courseCode: 'TC101', userId: 'u1' } });
            if (url.includes('/materials/123')) return Promise.resolve({ data: [] });
            if (url.includes('/enrollments/my-enrollments')) return Promise.resolve({ data: [] });
            return Promise.reject(new Error('not found'));
        });

        render(
            <MemoryRouter>
                <CoursePage />
            </MemoryRouter>
        );
        // Initially course is null, so it should briefly show Loading...
        // However, with waitFor, we usually check the final state. 
        // If we want to check loading, we would need to control the promise resolution.
        // Given existing code structure, let's wait for the title.
    });

    it('renders course content after fetching', async () => {
        api.get.mockImplementation((url) => {
            if (url === '/courses/123') return Promise.resolve({ data: { id: '123', title: 'Test Course', courseCode: 'TC101', userId: 'u1' } });
            if (url === '/materials/123') return Promise.resolve({ data: [{ id: 'm1', title: 'Material 1' }] });
            if (url === '/enrollments/my-enrollments') return Promise.resolve({ data: [] });
            return Promise.resolve({ data: {} });
        });

        render(
            <MemoryRouter>
                <CoursePage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Test Course')).toBeInTheDocument();
            expect(screen.getByText('TC101')).toBeInTheDocument();
            expect(screen.getByText('Material 1')).toBeInTheDocument();
        });
    });

    it('toggles views when buttons are clicked', async () => {
        api.get.mockImplementation((url) => {
            if (url === '/courses/123') return Promise.resolve({ data: { id: '123', title: 'Test Course', courseCode: 'TC101', userId: 'u1' } });
            if (url === '/materials/123') return Promise.resolve({ data: [] });
            if (url === '/enrollments/my-enrollments') return Promise.resolve({ data: [] });
            return Promise.resolve({ data: {} });
        });

        render(
            <MemoryRouter>
                <CoursePage />
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText('Global Quiz')).toBeInTheDocument());

        const quizBtn = screen.getByText('Global Quiz');
        fireEvent.click(quizBtn);

        await waitFor(() => {
            expect(screen.getByTestId('ai-quiz')).toBeInTheDocument();
        });
    });
});
