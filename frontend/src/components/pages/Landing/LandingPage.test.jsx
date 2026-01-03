import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LandingPage from './LandingPage';
import { BrowserRouter } from 'react-router-dom';

// Mock sub-components if they are complex, but Landing usually is static
vi.mock('./Hero', () => ({ default: () => <div>Hero Section</div> }));
vi.mock('./Features', () => ({ default: () => <div>Features Section</div> }));
vi.mock('./HowItWorks', () => ({ default: () => <div>How It Works Section</div> }));
vi.mock('./CTA', () => ({ default: () => <div>CTA Section</div> }));

describe('LandingPage', () => {
    it('renders all sections', () => {
        render(
            <BrowserRouter>
                <LandingPage />
            </BrowserRouter>
        );

        expect(screen.getByText('Hero Section')).toBeInTheDocument();
        expect(screen.getByText('Features Section')).toBeInTheDocument();
        expect(screen.getByText('How It Works Section')).toBeInTheDocument();
    });
});
