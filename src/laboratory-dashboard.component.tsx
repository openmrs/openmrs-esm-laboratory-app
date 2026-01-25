import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LaboratoryPictogram, PageHeader, PageHeaderContent, useDefineAppContext } from '@openmrs/esm-framework';
import AddTestOrderButton from './components/add-test-order/add-test-order-button';
import LaboratoryOrdersTabs from './lab-tabs/laboratory-tabs.component';
import LaboratorySummaryTiles from './lab-tiles/laboratory-summary-tiles.component';
import dayjs from 'dayjs';
import { type DateFilterContext } from './types';
import styles from './laboratory-dashboard.scss';

const LaboratoryDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState<[Date, Date]>([dayjs().startOf('day').toDate(), new Date()]);
  useDefineAppContext<DateFilterContext>('laboratory-date-filter', { dateRange, setDateRange });

  return (
    <div>
      <PageHeader className={styles.pageHeader}>
        <PageHeaderContent illustration={<LaboratoryPictogram />} title={t('laboratory', 'Laboratory')} />
        <AddTestOrderButton />
      </PageHeader>
      <div>
        <LaboratorySummaryTiles />
        <LaboratoryOrdersTabs />
      </div>
    </div>
  );
};

export default LaboratoryDashboard;
