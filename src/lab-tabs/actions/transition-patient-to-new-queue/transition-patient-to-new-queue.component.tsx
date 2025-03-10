import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@carbon/react';
import { AirlineManageGates } from '@carbon/react/icons';
import { showModal } from '@openmrs/esm-framework';

interface TransitionLatestQueueEntryButtonProps {
  patientUuid: string;
}

const TransitionLatestQueueEntryButton: React.FC<TransitionLatestQueueEntryButtonProps> = ({ patientUuid }) => {
  const { t } = useTranslation();

  const handleLaunchModal = () => {
    const dispose = showModal('transition-patient-to-latest-queue-modal', {
      closeModal: () => dispose(),
      patientUuid,
    });
  };

  return (
    <Button
      iconDescription={t('transitionPatientToNewQueue', 'Transition patient to new queue')}
      kind="tertiary"
      onClick={handleLaunchModal}
      renderIcon={AirlineManageGates}
      size="sm"
    >
      {t('transition', 'Transition')}
    </Button>
  );
};

export default TransitionLatestQueueEntryButton;
