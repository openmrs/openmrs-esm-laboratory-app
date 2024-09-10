import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader, LaboratoryPictogram } from '@openmrs/esm-framework';
import Overlay from './components/overlay/overlay.component';
import LaboratoryOrdersTabs from './lab-tabs/laboratory-tabs.component';
import LaboratorySummaryTiles from './lab-tiles/laboratory-summary-tiles.component';
import styles from './laboratory-dashboard.scss';

const LaboratoryDashboard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={`omrs-main-content`}>
      <PageHeader
        illustration={<LaboratoryPictogram />}
        title={t('laboratory', 'Laboratory')}
        className={styles.pageHeader}
      />
      <div>
        <LaboratorySummaryTiles />
        <LaboratoryOrdersTabs />
        <Overlay />
      </div>
    </div>
  );
};

export default LaboratoryDashboard;
