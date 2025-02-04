import React, { useCallback } from 'react';
import { Button } from '@carbon/react';
import { mutate } from 'swr';
import { useTranslation } from 'react-i18next';
import { type Config } from '../../config-schema';
import { launchWorkspace, restBaseUrl, useConfig } from '@openmrs/esm-framework';
import { type Order } from '@openmrs/esm-patient-common-lib';
import styles from './actions.scss';

interface AddLabRequestResultsActionProps {
  order: Order;
}
const AddLabRequestResultsAction: React.FC<AddLabRequestResultsActionProps> = ({ order }) => {
  const { t } = useTranslation();
  const { laboratoryOrderTypeUuid } = useConfig<Config>();

  const mutateLabOrders = useCallback(() => {
    mutate(
      (key) => typeof key === 'string' && key.startsWith(`${restBaseUrl}/order?orderTypes=${laboratoryOrderTypeUuid}`),
    );
  }, [laboratoryOrderTypeUuid]);

  const launchTestResultsWorkspace = useCallback(() => {
    launchWorkspace('test-results-form-workspace', {
      order,
      mutateLabOrders,
    });
  }, [mutateLabOrders, order]);

  return (
    <Button className={styles.actionButton} kind="primary" size="sm" onClick={launchTestResultsWorkspace}>
      {t('addLabResult', 'Add lab results')}
    </Button>
  );
};

export default AddLabRequestResultsAction;
