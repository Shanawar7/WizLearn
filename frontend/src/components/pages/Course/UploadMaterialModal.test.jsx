import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import UploadMaterialModal from './UploadMaterialModal';

describe('UploadMaterialModal', () => {
    it('does not render when isOpen is false', () => {
        render(<UploadMaterialModal isOpen={false} />);
        expect(screen.queryByText('Upload Material')).not.toBeInTheDocument();
    });

    it('renders form when open', () => {
        render(<UploadMaterialModal isOpen={true} onClose={vi.fn()} />);
        expect(screen.getByText('Upload Material')).toBeInTheDocument();
        expect(screen.getByLabelText(/Material Title/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Description/)).toBeInTheDocument();
    });

    it('validates inputs', async () => {
        const onSubmit = vi.fn();
        render(<UploadMaterialModal isOpen={true} onSubmit={onSubmit} />);

        fireEvent.click(screen.getByText('Upload'));

        expect(screen.getByText('Material title is required')).toBeInTheDocument();
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('submits form with valid data', async () => {
        const onSubmit = vi.fn();
        render(<UploadMaterialModal isOpen={true} onSubmit={onSubmit} onClose={vi.fn()} />);

        fireEvent.change(screen.getByLabelText(/Material Title/), { target: { value: 'Test Material' } });
        fireEvent.change(screen.getByLabelText(/Description/), { target: { value: 'Test Desc' } });

        fireEvent.click(screen.getByText('Upload'));

        expect(onSubmit).toHaveBeenCalledWith({
            title: 'Test Material',
            description: 'Test Desc',
            files: [] // No files selected
        });
    });

    // File upload test requires mocking FileReader, which is tricky in jsdom sometimes,
    // but we can try a basic mock if needed. For now, basic flow is covered.
});
