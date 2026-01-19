import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@carbon/react';
import { showModal, type Order } from '@openmrs/esm-framework';
import styles from './actions.scss';

interface PickLabRequestActionMenuProps {
  order: Order;
}

const PickupLabRequestAction: React.FC<PickLabRequestActionMenuProps> = ({ order }) => {
  const { t } = useTranslation();
  const unsupportedStatuses = ['COMPLETED', 'DECLINED', 'IN_PROGRESS', 'ON_HOLD'];

  const launchModal = useCallback(() => {
    const dispose = showModal('pickup-lab-request-modal', {
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
      {t('pickRequest', 'Pick lab request')}
    </Button>
  );
};

export default PickupLabRequestAction;
