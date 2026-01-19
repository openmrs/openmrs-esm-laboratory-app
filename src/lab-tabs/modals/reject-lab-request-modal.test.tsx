import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { showSnackbar, showNotification, type Order } from '@openmrs/esm-framework';
import { rejectLabOrder, useInvalidateLabOrders } from '../../laboratory.resource';
import RejectLabRequestModal from './reject-lab-request-modal.component';

jest.mock('../../laboratory.resource', () => ({
  rejectLabOrder: jest.fn(),
  useInvalidateLabOrders: jest.fn(),
}));

const mockRejectLabOrder = jest.mocked(rejectLabOrder);
const mockUseInvalidateLabOrders = jest.mocked(useInvalidateLabOrders);
const mockShowSnackbar = jest.mocked(showSnackbar);
const mockShowNotification = jest.mocked(showNotification);

const mockOrder: Partial<Order> = {
  uuid: 'order-uuid-1',
  orderNumber: 'ORD-001',
  patient: {
    uuid: 'patient-uuid-1',
    display: 'Test Patient',
  } as Order['patient'],
  concept: {
    uuid: 'concept-uuid-1',
    display: 'Blood Test',
  },
};

describe('RejectLabRequestModal', () => {
  const mockCloseModal = jest.fn();
  const mockInvalidateLabOrders = jest.fn();

  beforeEach(() => {
    mockUseInvalidateLabOrders.mockReturnValue(mockInvalidateLabOrders);
  });

  it('should render the modal with order details and comment field', () => {
    render(<RejectLabRequestModal order={mockOrder as Order} closeModal={mockCloseModal} />);

    expect(screen.getByText(/Reject lab request.*\[ORD-001\]/)).toBeInTheDocument();
    expect(screen.getByText('Test type: Blood Test')).toBeInTheDocument();
    expect(screen.getByLabelText('Fulfiller comment')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reject/ })).toBeInTheDocument();
  });

  it('should close modal when cancel button is clicked', async () => {
    render(<RejectLabRequestModal order={mockOrder as Order} closeModal={mockCloseModal} />);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(mockCloseModal).toHaveBeenCalled();
  });

  it('should call rejectLabOrder with comment and show success snackbar when rejection succeeds', async () => {
    mockRejectLabOrder.mockResolvedValue({} as any);

    render(<RejectLabRequestModal order={mockOrder as Order} closeModal={mockCloseModal} />);

    const user = userEvent.setup();
    const commentInput = screen.getByLabelText('Fulfiller comment');
    await user.type(commentInput, 'Sample contaminated');
    await user.click(screen.getByRole('button', { name: /Reject/ }));

    await waitFor(() => {
      expect(mockRejectLabOrder).toHaveBeenCalledWith(
        'order-uuid-1',
        'Sample contaminated',
        expect.objectContaining({ signal: expect.any(Object) }),
      );
    });

    await waitFor(() => {
      expect(mockInvalidateLabOrders).toHaveBeenCalled();
      expect(mockCloseModal).toHaveBeenCalled();
      expect(mockShowSnackbar).toHaveBeenCalledWith(
        expect.objectContaining({
          isLowContrast: true,
          title: 'Lab request rejected',
          kind: 'success',
        }),
      );
    });
  });

  it('should show error notification when rejection fails', async () => {
    const error = new Error('Server error');
    mockRejectLabOrder.mockRejectedValue(error);

    render(<RejectLabRequestModal order={mockOrder as Order} closeModal={mockCloseModal} />);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /Reject/ }));

    await waitFor(() => {
      expect(mockShowNotification).toHaveBeenCalledWith({
        title: 'Error rejecting lab request',
        kind: 'error',
        critical: true,
        description: 'Server error',
      });
    });

    expect(mockCloseModal).not.toHaveBeenCalled();
  });

  it('should disable submit button while submitting', async () => {
    let resolvePromise: (value: unknown) => void;
    mockRejectLabOrder.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePromise = resolve;
        }),
    );

    render(<RejectLabRequestModal order={mockOrder as Order} closeModal={mockCloseModal} />);

    const user = userEvent.setup();
    const submitButton = screen.getByRole('button', { name: /Reject/ });
    expect(submitButton).not.toBeDisabled();

    await user.click(submitButton);

    expect(submitButton).toBeDisabled();

    resolvePromise!({});

    await waitFor(() => {
      expect(mockCloseModal).toHaveBeenCalled();
    });
  });

  it('should allow submitting with empty comment', async () => {
    mockRejectLabOrder.mockResolvedValue({} as any);

    render(<RejectLabRequestModal order={mockOrder as Order} closeModal={mockCloseModal} />);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /Reject/ }));

    await waitFor(() => {
      expect(mockRejectLabOrder).toHaveBeenCalledWith(
        'order-uuid-1',
        '',
        expect.objectContaining({ signal: expect.any(Object) }),
      );
    });
  });
});
