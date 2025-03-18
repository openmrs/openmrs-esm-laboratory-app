import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { showModal, useVisit } from '@openmrs/esm-framework';
import { mockPatient } from '@tools';
import TransitionLatestQueueEntryButton from './transition-patient-to-new-queue.component';

jest.mock('@openmrs/esm-framework', () => ({
  showModal: jest.fn(),
  useVisit: jest.fn(),
}));

describe('TransitionLatestQueueEntryButton', () => {
  const patientUuid = mockPatient.id;
  const mockActiveVisit = { uuid: 'visit-uuid', display: 'Test Visit' };

  beforeEach(() => {
    jest.clearAllMocks();
    (useVisit as jest.Mock).mockReturnValue({
      activeVisit: mockActiveVisit,
      isLoading: false,
    });
  });

  it('should render a button', () => {
    render(<TransitionLatestQueueEntryButton patientUuid={patientUuid} />);

    expect(screen.getByRole('button', { name: /transition/i })).toBeInTheDocument();
  });

  it('should launch the transition queue modal when clicked', async () => {
    const user = userEvent.setup();
    render(<TransitionLatestQueueEntryButton patientUuid={patientUuid} />);

    await user.click(screen.getByRole('button', { name: /transition/i }));

    expect(showModal).toHaveBeenCalledTimes(1);
    expect(showModal).toHaveBeenCalledWith(
      'transition-patient-to-latest-queue-modal',
      expect.objectContaining({
        closeModal: expect.any(Function),
        activeVisit: mockActiveVisit,
      }),
    );
  });

  it('should show loading state when visit data is loading', () => {
    (useVisit as jest.Mock).mockReturnValue({
      activeVisit: null,
      isLoading: true,
    });

    render(<TransitionLatestQueueEntryButton patientUuid={patientUuid} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should disable the button when no active visit exists', () => {
    (useVisit as jest.Mock).mockReturnValue({
      activeVisit: null,
      isLoading: false,
    });

    render(<TransitionLatestQueueEntryButton patientUuid={patientUuid} />);

    expect(screen.getByRole('button', { name: /transition/i })).toBeDisabled();
  });
});
