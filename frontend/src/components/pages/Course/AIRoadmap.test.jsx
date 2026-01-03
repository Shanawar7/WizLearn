import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AIRoadmap from './AIRoadmap';

describe('AIRoadmap', () => {
    const mockRoadmap = [
        {
            days: [
                { topic: 'Topic 1', task: 'Task 1', description: 'Desc 1' },
                { topic: 'Topic 2', task: 'Task 2', description: 'Desc 2' }
            ]
        }
    ];

    it('renders empty state when no roadmap', () => {
        const onGenerate = vi.fn();
        render(<AIRoadmap roadmap={null} onGenerate={onGenerate} />);
        expect(screen.getByText(/No roadmap generated yet/i)).toBeInTheDocument();
        fireEvent.click(screen.getByText('Generate Roadmap'));
        expect(onGenerate).toHaveBeenCalled();
    });

    it('renders usage roadmap correctly', () => {
        const onToggleTask = vi.fn();
        render(<AIRoadmap roadmap={mockRoadmap} completedTasks={['w0-d0']} onToggleTask={onToggleTask} />);

        expect(screen.getByText('Week 1')).toBeInTheDocument();
        expect(screen.getByText('Topic 1')).toBeInTheDocument();
        expect(screen.getByText('Task 1')).toBeInTheDocument();

        // Check 1st task is completed (Done badge)
        const badges = screen.getAllByText(/Done|Day/);
        expect(badges[0]).toHaveTextContent('Done');

        // Check 2nd task is not completed (Day 2)
        expect(badges[1]).toHaveTextContent('Day 2');

        // Toggle task
        const checks = screen.getAllByTitle('Mark as complete'); // Day 2 is incomplete
        fireEvent.click(checks[0]); // Click the check for the second item (since first one has title "Mark as incomplete")

        // Actually, let's just find by icon presence or role if we added one, but click logic:
        // We know 'w0-d0' is complete. 'w0-d1' is incomplete.
        // We can query by title.
        const incompleteBtn = screen.getByTitle('Mark as complete');
        fireEvent.click(incompleteBtn);
        expect(onToggleTask).toHaveBeenCalledWith('w0-d1');
    });
});
