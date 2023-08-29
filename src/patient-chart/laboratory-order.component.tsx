import React from 'react';
import { useTranslation } from 'react-i18next';
import { EmptyStateComingSoon } from '@ohri/openmrs-esm-ohri-commons-lib';

const LaboratoryOrder: React.FC = () => {
  const { t } = useTranslation();
  const headerTitle = t('laboratory', 'Laboratory');

  return <EmptyStateComingSoon headerTitle={headerTitle} displayText={headerTitle} />;
};

export default LaboratoryOrder;
