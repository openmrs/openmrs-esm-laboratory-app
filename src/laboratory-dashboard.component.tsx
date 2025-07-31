import React, { useState } from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { LaboratoryPictogram, PageHeader, useDefineAppContext } from '@openmrs/esm-framework';
import { type DateFilterContext } from './types';
import LaboratoryOrdersTabs from './lab-tabs/laboratory-tabs.component';
import LaboratorySummaryTiles from './lab-tiles/laboratory-summary-tiles.component';
import styles from './laboratory-dashboard.scss';

const LaboratoryDashboard: React.FC = () => {
  const { t } = useTranslation();

  const [dateRange, setDateRange] = useState<[Date, Date]>([dayjs().startOf('day').toDate(), new Date()]);

  useDefineAppContext<DateFilterContext>('laboratory-date-filter', {
    dateRange,
    setDateRange,
  });

  return (
    <div>
      <PageHeader
        illustration={<LaboratoryPictogram />}
        title={t('laboratory', 'Laboratory')}
        className={styles.pageHeader}
      />
      <div>
        <LaboratorySummaryTiles />
        <LaboratoryOrdersTabs />
      </div>
    </div>
  );
};

export default LaboratoryDashboard;
