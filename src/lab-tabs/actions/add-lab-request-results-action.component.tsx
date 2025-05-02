import React from 'react';
import { Button } from '@carbon/react';
import { mutate } from 'swr';
import { useTranslation } from 'react-i18next';
import { AddIcon, launchWorkspace, restBaseUrl, useConfig } from '@openmrs/esm-framework';
import { type Order } from '@openmrs/esm-patient-common-lib';
import { type Config } from '../../config-schema';
import styles from './actions.scss';

interface AddLabRequestResultsActionProps {
  order: Order;
}

const AddLabRequestResultsAction: React.FC<AddLabRequestResultsActionProps> = ({ order }) => {
  const { t } = useTranslation();
  const { laboratoryOrderTypeUuid } = useConfig<Config>();

  const invalidateLabOrders = () => {
    mutate(
      (key) => typeof key === 'string' && key.startsWith(`${restBaseUrl}/order?orderTypes=${laboratoryOrderTypeUuid}`),
    );
  };

  const launchTestResultsWorkspace = () => {
    launchWorkspace('test-results-form-workspace', {
      order,
      invalidateLabOrders,
    });
  };

  return (
    <Button
      className={styles.actionButton}
      kind="primary"
      renderIcon={() => <AddIcon className={styles.actionButtonIcon} />}
      iconDescription="Add lab results"
      onClick={launchTestResultsWorkspace}
      size="sm"
    >
      {t('addLabResult', 'Add lab results')}
    </Button>
  );
};

export default AddLabRequestResultsAction;
