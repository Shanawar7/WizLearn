import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AIQuiz from './AIQuiz';

describe('AIQuiz', () => {
    const mockQuiz = [
        { question: 'Q1?', options: ['Opt A', 'Opt B', 'Opt C', 'Opt D'], correctAnswer: 0 },
        { question: 'Q2?', options: ['Opt X', 'Opt Y', 'Opt Z', 'Opt W'], correctAnswer: 1 }
    ];

    it('renders empty state when no quiz data provided', () => {
        const onGenerate = vi.fn();
        render(<AIQuiz quiz={null} onGenerate={onGenerate} title="Test Quiz" />);
        expect(screen.getByText('Test Quiz')).toBeInTheDocument();
        expect(screen.getByText(/Generate a mock test/i)).toBeInTheDocument();

        fireEvent.click(screen.getByText('Generate Quiz'));
        expect(onGenerate).toHaveBeenCalled();
    });

    it('allows taking the quiz and showing results', () => {
        render(<AIQuiz quiz={mockQuiz} title="Test Quiz" />);

        // Start view
        expect(screen.getByText('Start Quiz')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Start Quiz'));

        // Question 1
        expect(screen.getByText('Q1?')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Opt A')); // Correct

        // Question 2
        expect(screen.getByText('Q2?')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Opt X')); // Incorrect

        // Results
        expect(screen.getByText('Quiz Completed!')).toBeInTheDocument();
        expect(screen.getByText(/You scored 1 out of 2/i)).toBeInTheDocument(); // 50%
        expect(screen.getByText('50%')).toBeInTheDocument();
    });

    it('resets the quiz', () => {
        render(<AIQuiz quiz={mockQuiz} title="Test Quiz" />);
        fireEvent.click(screen.getByText('Start Quiz'));
        fireEvent.click(screen.getByText('Opt A'));
        fireEvent.click(screen.getByText('Opt Y'));

        expect(screen.getByText('Quiz Completed!')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Try Again'));
        expect(screen.getByText('Q1?')).toBeInTheDocument();
    });
});
