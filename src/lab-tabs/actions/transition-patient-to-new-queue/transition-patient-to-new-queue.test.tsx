import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { showModal } from '@openmrs/esm-framework';
import { mockPatient } from '@tools';
import TransitionLatestQueueEntryButton from './transition-patient-to-new-queue.component';

describe('TransitionLatestQueueEntryButton', () => {
  const patientUuid = mockPatient.id;

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
        patientUuid,
      }),
    );
  });
});
