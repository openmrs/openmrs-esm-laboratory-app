import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLabOrders } from '../laboratory-resource';
import LabSummaryTile from '../components/summary-tile/lab-summary-tile.component';

const InProgressLabRequestsTile = () => {
  const { t } = useTranslation();
  const { labOrders } = useLabOrders('IN_PROGRESS');

  return (
    <LabSummaryTile
      label={t('inProgress', 'In progress')}
      value={labOrders?.length}
      headerLabel={t('worklist', 'Ex-Worklist')}
    />
  );
};

export default InProgressLabRequestsTile;
