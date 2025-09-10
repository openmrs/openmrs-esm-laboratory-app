import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@carbon/react';
import { showModal } from '@openmrs/esm-framework';
import { type Order } from '@openmrs/esm-patient-common-lib';
import styles from './actions.scss';

interface AmendLabResultsActionMenuProps {
  order: Order;
  orders?: Order[];
}

const AmendLabResultsAction: React.FC<AmendLabResultsActionMenuProps> = ({ order, orders }) => {
  const { t } = useTranslation();
  const unsupportedStatuses = ['DECLINED', 'IN_PROGRESS', 'NEW'];

  const handleLaunchModal = () => {
    const editableOrders = orders
      ? orders.filter((order) => ['COMPLETED', 'ON_HOLD'].includes(order.fulfillerStatus))
      : [order].filter((order) => ['COMPLETED', 'ON_HOLD'].includes(order.fulfillerStatus));

    const dispose = showModal('edit-lab-results-modal', {
      closeModal: () => dispose(),
      orders: editableOrders,
    });
  };

  return (
    <Button
      className={styles.actionButton}
      disabled={unsupportedStatuses.includes(order.fulfillerStatus)}
      size="sm"
      kind="danger"
      onClick={handleLaunchModal}
    >
      {t('amendLabResults', 'Amend lab results')}
    </Button>
  );
};

export default AmendLabResultsAction;
