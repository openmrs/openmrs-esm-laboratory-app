import React, { useCallback } from 'react';
import { Button } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { showModal } from '@openmrs/esm-framework';
import { Order } from '@openmrs/esm-patient-common-lib';
import styles from './actions.scss';

interface RejectLabRequestActionProps {
  order: Order;
}

const RejectLabRequestAction: React.FC<RejectLabRequestActionProps> = ({ order }) => {
  const { t } = useTranslation();
  const unSupportedStatuses = ['COMPLETED', 'DECLINED'];
  const launchRejectLabRequestModal = useCallback(() => {
    const dispose = showModal('reject-lab-request-modal', {
      closeModal: () => dispose(),
      order,
    });
  }, [order]);

  return (
    <Button
      kind="danger"
      className={styles.actionButton}
      disabled={unSupportedStatuses.includes(order.fulfillerStatus)}
      key={`${order.uuid}`}
      onClick={launchRejectLabRequestModal}
    >
      {t('rejectLabRequest', 'Reject lab request')}
    </Button>
  );
};

export default RejectLabRequestAction;
