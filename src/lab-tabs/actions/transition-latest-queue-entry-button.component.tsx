import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './actions.scss';
import { showModal } from '@openmrs/esm-framework';
import { Button } from '@carbon/react';
import { AirlineManageGates } from '@carbon/react/icons';

interface TransitionLatestQueueEntryButtonProps {
  patientUuid: string;
}

const TransitionLatestQueueEntryButton: React.FC<TransitionLatestQueueEntryButtonProps> = ({ patientUuid }) => {
  const { t } = useTranslation();

  const launchModal = () => {
    const dispose = showModal('transition-patient-to-latest-queue-modal', {
      closeModal: () => dispose(),
      patientUuid,
    });
  };

  return (
    <Button
      kind="tertiary"
      className={styles.addPatientToQueue}
      onClick={launchModal}
      size="sm"
      renderIcon={() => <AirlineManageGates size={18} />}
    >
      {t('transition', 'Transition')}
    </Button>
  );
};

export default TransitionLatestQueueEntryButton;
