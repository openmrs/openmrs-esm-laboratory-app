import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLabOrders } from '../laboratory.resource';
import LabSummaryTile from '../components/summary-tile/lab-summary-tile.component';

const InProgressLabRequestsTile = () => {
  const { t } = useTranslation();
  const { labOrders, isError } = useLabOrders({ status: 'IN_PROGRESS' });

  return (
    <LabSummaryTile
      label={t('inProgress', 'In progress')}
      value={isError ? '--' : labOrders?.length}
      headerLabel={t('worklist', 'Worklist')}
    />
  );
};

export default InProgressLabRequestsTile;
