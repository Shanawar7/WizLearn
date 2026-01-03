import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MaterialCard from './MaterialCard';

describe('MaterialCard', () => {
    const mockMaterial = {
        id: 'm1',
        title: 'Lec 1',
        description: 'Intro to React',
        uploadDate: '2023-01-01T10:00:00Z',
        files: [
            { fileName: 'notes.pdf', fileType: 'application/pdf', fileData: 'base64...' },
            { fileName: 'image.png', fileType: 'image/png', fileData: 'base64...' }
        ]
    };

    it('renders material info correctly', () => {
        render(<MaterialCard material={mockMaterial} />);
        expect(screen.getByText('Lec 1')).toBeInTheDocument();
        expect(screen.getByText('Intro to React')).toBeInTheDocument();
        expect(screen.getByText('notes.pdf')).toBeInTheDocument();
        expect(screen.getByText('image.png')).toBeInTheDocument();
    });

    it('triggers callbacks', () => {
        const onDelete = vi.fn();
        const onQuiz = vi.fn();
        const onRoadmap = vi.fn();
        const onToggle = vi.fn();

        render(
            <MaterialCard
                material={mockMaterial}
                onDelete={onDelete}
                onQuiz={onQuiz}
                onRoadmap={onRoadmap}
                onToggleComplete={onToggle}
                isCompleted={false}
            />
        );

        // Click delete
        fireEvent.click(screen.getByTitle('Delete material'));
        expect(onDelete).toHaveBeenCalledWith('m1');

        // Click quiz
        fireEvent.click(screen.getByTitle('Material Mock Test'));
        expect(onQuiz).toHaveBeenCalled();

        // Click roadmap
        fireEvent.click(screen.getByTitle('Material Study Roadmap'));
        expect(onRoadmap).toHaveBeenCalled();

        // Click checkbox
        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);
        expect(onToggle).toHaveBeenCalledWith('m1');
    });

    it('shows preview for images/pdfs', () => {
        // Mock URL.createObjectURL is not needed as component uses base64 directly in src/href

        // This test might fail if jsdom doesn't support some DOM methods used in preview, but let's try.
        // The component renders a modal on click.

        render(<MaterialCard material={mockMaterial} />);

        // Find view button for image
        // We have two view buttons (one for pdf, one for png) because both types are previewable
        const viewButtons = screen.getAllByTitle('View file');
        fireEvent.click(viewButtons[1]); // Click image view

        expect(screen.getByAltText('image.png')).toBeInTheDocument();
        expect(screen.getAllByText('image.png')[1]).toBeInTheDocument(); // Header in modal is the second one likely

        // Close
        fireEvent.click(screen.getByText('×'));
        expect(screen.queryByAltText('image.png')).not.toBeInTheDocument();
    });
});
