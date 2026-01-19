import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@carbon/react';
import { showModal, type Order } from '@openmrs/esm-framework';
import styles from './actions.scss';

interface ApproveLabRequestActionMenuProps {
  order: Order;
}

const ApproveLabRequestAction: React.FC<ApproveLabRequestActionMenuProps> = ({ order }) => {
  const { t } = useTranslation();
  const unsupportedStatuses = ['COMPLETED', 'DECLINED', 'IN_PROGRESS'];

  const launchModal = useCallback(() => {
    const dispose = showModal('approval-lab-results-modal', {
      closeModal: () => dispose(),
      order,
    });
  }, [order]);

  return (
    <Button
      className={styles.actionButton}
      disabled={unsupportedStatuses.includes(order.fulfillerStatus)}
      size="sm"
      kind="primary"
      key={order.uuid}
      onClick={launchModal}
    >
      {t('approveLabResults', 'Approve lab results')}
    </Button>
  );
};

export default ApproveLabRequestAction;
