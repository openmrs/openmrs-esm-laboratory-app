import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLabOrders } from '../laboratory-resource';
import LabSummaryTile from '../components/summary-tile/lab-summary-tile.component';

const PendingReviewLabRequestsTile = () => {
  const { t } = useTranslation();
  const { labOrders, isLoading, isError } = useLabOrders({
    status: 'DRAFT',
    excludeCanceled: false,
  });

  return (
    <LabSummaryTile
      label={t('pendingReview', 'Pending Review')}
      value={labOrders?.length}
      headerLabel={t('awaitingApproval', 'Awaiting Approval')}
    />
  );
};

export default PendingReviewLabRequestsTile;
