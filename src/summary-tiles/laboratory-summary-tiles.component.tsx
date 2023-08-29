import React from 'react';
import { useTranslation } from 'react-i18next';
import { DataTableSkeleton } from '@carbon/react';
import { useMetrics } from './laboratory-summary.resource';
import SummaryTile from './summary-tile.component';
import styles from './laboratory-summary-tiles.scss';

const LaboratorySummaryTiles: React.FC = () => {
  const { t } = useTranslation();
  const { metrics, isError, isLoading } = useMetrics();

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />;
  }

  return (
    <>
      <div className={styles.cardContainer}>
        <SummaryTile
          label={t('orders', 'Orders')}
          value={metrics.orders}
          headerLabel={t('testsOrdered', 'Tests ordered')}
        />
        <SummaryTile
          label={t('inProgress', 'In progress')}
          value={metrics.in_progress}
          headerLabel={t('worklist', 'Worklist')}
        />
        <SummaryTile
          label={t('transferred', 'Transferred')}
          value={metrics.transferred}
          headerLabel={t('referredTests', 'Referred tests')}
        />
        <SummaryTile
          label={t('completed', 'Completed')}
          value={metrics.completed}
          headerLabel={t('results', 'Results')}
        />
      </div>
    </>
  );
};

export default LaboratorySummaryTiles;
