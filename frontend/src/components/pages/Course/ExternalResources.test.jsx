import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ExternalResources from './ExternalResources';

describe('ExternalResources', () => {
    const mockResources = {
        videos: [{ id: 'v1', title: 'Video 1', description: 'Desc 1', thumbnail: 'thumb1.jpg' }],
        books: [{ id: 'b1', title: 'Book 1', authors: ['Author A'], link: 'http://book.com', thumbnail: 'book1.jpg' }],
        wiki: { title: 'Wiki Concept', extract: 'Extract info' }
    };

    it('renders nothing if no resources', () => {
        const { container } = render(<ExternalResources resources={null} />);
        expect(container).toBeEmptyDOMElement();
    });

    it('renders videos tab by default', () => {
        render(<ExternalResources resources={mockResources} />);
        expect(screen.getByText('Videos')).toHaveClass('active');
        expect(screen.getByText('Video 1')).toBeInTheDocument();
        expect(screen.queryByText('Book 1')).not.toBeInTheDocument();
    });

    it('switches tabs correctly', () => {
        render(<ExternalResources resources={mockResources} />);

        // Switch to Books
        fireEvent.click(screen.getByText('Books'));
        expect(screen.queryByText('Video 1')).not.toBeInTheDocument();
        expect(screen.getByText('Book 1')).toBeInTheDocument();
        expect(screen.getByText('Author A')).toBeInTheDocument();

        // Switch to Concepts (Wiki)
        fireEvent.click(screen.getByText('Concepts'));
        expect(screen.getByText('Wiki Concept')).toBeInTheDocument();
        expect(screen.getByText('Extract info')).toBeInTheDocument();
    });
});
