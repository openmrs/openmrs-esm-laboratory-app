import { Order } from '@openmrs/esm-patient-common-lib';
import React from 'react';
import { OverflowMenuItem } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import styles from './actions.scss';
import { launchWorkspace } from '@openmrs/esm-framework';

interface AddLabRequestResultsActionProps {
  order: Order;
}
const AddLabRequestResultsAction: React.FC<AddLabRequestResultsActionProps> = ({ order }) => {
  const { t } = useTranslation();

  return (
    <OverflowMenuItem
      itemText={t('labResultsForm', 'Lab Results Form')}
      onClick={() => launchWorkspace('test-results-form-workspace', { order })}
      className={styles.menuItem}
    />
  );
};

export default AddLabRequestResultsAction;
