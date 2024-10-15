import { Order } from '@openmrs/esm-patient-common-lib';
import React from 'react';
import { Button } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import styles from './actions.scss';
import { launchWorkspace } from '@openmrs/esm-framework';

interface AddLabRequestResultsActionProps {
  order: Order;
}
const AddLabRequestResultsAction: React.FC<AddLabRequestResultsActionProps> = ({ order }) => {
  const { t } = useTranslation();

  return (
    <Button
      className={styles.actionButton}
      kind="primary"
      key={`${order.uuid}`}
      onClick={() => launchWorkspace('test-results-form-workspace', { order })}
    >
      {t('labResultsForm', 'Lab Results Form')}
    </Button>
  );
};

export default AddLabRequestResultsAction;
