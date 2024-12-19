import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { useTranslation } from 'react-i18next';
import { showModal } from '@openmrs/esm-framework';
import TransitionLatestQueueEntryButton from './transition-patient-to-new-queue.component';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('@openmrs/esm-framework', () => ({
  showModal: jest.fn(),
}));

jest.mock('@carbon/react', () => ({
  Button: ({ children, onClick, renderIcon }: any) => (
    <button onClick={onClick} data-testid="transition-button">
      {renderIcon && renderIcon()}
      {children}
    </button>
  ),
}));

jest.mock('@carbon/react/icons', () => ({
  AirlineManageGates: () => <svg data-testid="airline-icon" />,
}));

describe('TransitionLatestQueueEntryButton', () => {
  const patientUuid = '1234-uuid';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the button with correct text and icon', () => {
    render(<TransitionLatestQueueEntryButton patientUuid={patientUuid} />);

    const button = screen.getByTestId('transition-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('transition');

    const icon = screen.getByTestId('airline-icon');
    expect(icon).toBeInTheDocument();
  });

  it('calls the showModal function when clicked', () => {
    render(<TransitionLatestQueueEntryButton patientUuid={patientUuid} />);

    const button = screen.getByTestId('transition-button');
    fireEvent.click(button);

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
