import React, { useCallback } from 'react';
import { Button } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { showModal, type Order } from '@openmrs/esm-framework';
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
      kind="danger--tertiary"
      className={styles.actionRejectButton}
      disabled={unSupportedStatuses.includes(order.fulfillerStatus)}
      key={`${order.uuid}`}
      size="sm"
      onClick={launchRejectLabRequestModal}
    >
      {t('rejectLabRequest', 'Reject lab request')}
    </Button>
  );
};

export default RejectLabRequestAction;
