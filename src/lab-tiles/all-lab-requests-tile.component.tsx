import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLabOrders } from '../laboratory.resource';
import LabSummaryTile from '../components/summary-tile/lab-summary-tile.component';

const AllLabRequestsTile = () => {
  const { t } = useTranslation();
  const { labOrders, isError } = useLabOrders({ unpickedOrdersOnly: true });

  return (
    <LabSummaryTile
      label={t('orders', 'Orders')}
      value={isError ? '--' : labOrders?.length}
      headerLabel={t('testsOrdered', 'Tests ordered')}
    />
  );
};

export default AllLabRequestsTile;
