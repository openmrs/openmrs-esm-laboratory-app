import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, InlineLoading } from '@carbon/react';
import { AirlineManageGates } from '@carbon/react/icons';
import { showModal, useVisit } from '@openmrs/esm-framework';

interface TransitionLatestQueueEntryButtonProps {
  patientUuid: string;
}

const TransitionLatestQueueEntryButton: React.FC<TransitionLatestQueueEntryButtonProps> = ({ patientUuid }) => {
  const { activeVisit, isLoading } = useVisit(patientUuid);
  const shouldHideButton = !activeVisit;
  const { t } = useTranslation();
  if (shouldHideButton) {
    return null;
  }

  const handleLaunchModal = () => {
    const dispose = showModal('transition-patient-to-latest-queue-modal', {
      closeModal: () => dispose(),
      activeVisit,
    });
  };

  if (isLoading) {
    return <InlineLoading description={t('loading', 'Loading...')} />;
  }

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
