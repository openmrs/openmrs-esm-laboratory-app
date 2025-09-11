import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLabOrders } from '../laboratory-resource';
import LabSummaryTile from '../components/summary-tile/lab-summary-tile.component';

const AllLabRequestsTile = () => {
  const { t } = useTranslation();

  const { labOrders } = useLabOrders({ newOrdersOnly: true });

  return (
    <LabSummaryTile
      label={t('orders', 'Orders')}
      value={labOrders?.length}
      headerLabel={t('testsOrdered', 'Tests ordered')}
    />
  );
};

export default AllLabRequestsTile;
