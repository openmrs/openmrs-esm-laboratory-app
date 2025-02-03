import React from 'react';
import { Button } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { type Config, launchWorkspace, restBaseUrl, useConfig } from '@openmrs/esm-framework';
import { type Order } from '@openmrs/esm-patient-common-lib';
import styles from './actions.scss';
import { mutate } from 'swr';

interface AddLabRequestResultsActionProps {
  order: Order;
}
const AddLabRequestResultsAction: React.FC<AddLabRequestResultsActionProps> = ({ order }) => {
  const { t } = useTranslation();
  const { laboratoryOrderTypeUuid } = useConfig<Config>();

  return (
    <Button
      className={styles.actionButton}
      kind="primary"
      size="sm"
      key={`${order.uuid}`}
      onClick={() => {
        launchWorkspace('test-results-form-workspace', {
          order,
          mutateLabOrders: () => {
            mutate(
              (key) =>
                typeof key === 'string' && key.startsWith(`${restBaseUrl}/order?orderTypes=${laboratoryOrderTypeUuid}`),
            );
          },
        });
      }}
    >
      {t('addLabResult', 'Add lab results')}
    </Button>
  );
};

export default AddLabRequestResultsAction;
