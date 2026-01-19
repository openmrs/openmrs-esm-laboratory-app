import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { showSnackbar, showNotification, type Order } from '@openmrs/esm-framework';
import { setFulfillerStatus, useInvalidateLabOrders } from '../../laboratory-resource';
import PickupLabRequestModal from './pickup-lab-request-modal.component';

jest.mock('../../laboratory-resource', () => ({
  setFulfillerStatus: jest.fn(),
  useInvalidateLabOrders: jest.fn(),
}));

const mockSetFulfillerStatus = jest.mocked(setFulfillerStatus);
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
};

describe('PickupLabRequestModal', () => {
  const mockCloseModal = jest.fn();
  const mockInvalidateLabOrders = jest.fn();

  beforeEach(() => {
    mockUseInvalidateLabOrders.mockReturnValue(mockInvalidateLabOrders);
  });

  it('should render the modal with confirmation text', () => {
    render(<PickupLabRequestModal order={mockOrder as Order} closeModal={mockCloseModal} />);

    expect(screen.getByText('Pick lab request')).toBeInTheDocument();
    expect(screen.getByText(/Continuing will update the request status to "In Progress"/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Discard' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Pick up lab request' })).toBeInTheDocument();
  });

  it('should close modal when discard button is clicked', async () => {
    render(<PickupLabRequestModal order={mockOrder as Order} closeModal={mockCloseModal} />);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Discard' }));

    expect(mockCloseModal).toHaveBeenCalled();
  });

  it('should call setFulfillerStatus and show success snackbar when picking up order succeeds', async () => {
    mockSetFulfillerStatus.mockResolvedValue({} as any);

    render(<PickupLabRequestModal order={mockOrder as Order} closeModal={mockCloseModal} />);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Pick up lab request' }));

    await waitFor(() => {
      expect(mockSetFulfillerStatus).toHaveBeenCalledWith(
        'order-uuid-1',
        'IN_PROGRESS',
        expect.objectContaining({ signal: expect.any(Object) }),
      );
    });

    await waitFor(() => {
      expect(mockInvalidateLabOrders).toHaveBeenCalled();
      expect(mockCloseModal).toHaveBeenCalled();
      expect(mockShowSnackbar).toHaveBeenCalledWith({
        isLowContrast: true,
        title: 'Picked an order',
        kind: 'success',
        subtitle: 'You have successfully picked an order',
      });
    });
  });

  it('should show error notification when picking up order fails', async () => {
    const error = new Error('Network error');
    mockSetFulfillerStatus.mockRejectedValue(error);

    render(<PickupLabRequestModal order={mockOrder as Order} closeModal={mockCloseModal} />);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Pick up lab request' }));

    await waitFor(() => {
      expect(mockShowNotification).toHaveBeenCalledWith({
        title: 'Error picking order',
        kind: 'error',
        critical: true,
        description: 'Network error',
      });
    });

    expect(mockCloseModal).not.toHaveBeenCalled();
  });

  it('should disable submit button while submitting', async () => {
    let resolvePromise: (value: unknown) => void;
    mockSetFulfillerStatus.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePromise = resolve;
        }),
    );

    render(<PickupLabRequestModal order={mockOrder as Order} closeModal={mockCloseModal} />);

    const user = userEvent.setup();
    const submitButton = screen.getByRole('button', { name: 'Pick up lab request' });
    expect(submitButton).not.toBeDisabled();

    await user.click(submitButton);

    expect(submitButton).toBeDisabled();

    resolvePromise!({});

    await waitFor(() => {
      expect(mockCloseModal).toHaveBeenCalled();
    });
  });
});
