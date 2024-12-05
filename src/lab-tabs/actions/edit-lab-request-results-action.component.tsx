import React from 'react';
import { Button } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { launchWorkspace } from '@openmrs/esm-framework';
import { type Order } from '@openmrs/esm-patient-common-lib';
import styles from './actions.scss';

type EditButtonProps = {
  order: Order;
};

const EditButton: React.FC<EditButtonProps> = ({ order }) => {
  const { t } = useTranslation();
  return (
    <Button
      kind="tertiary"
      className={styles.actionButton}
      size="sm"
      onClick={() => launchWorkspace('test-results-form-workspace', { order })}
    >
      {t('editResults', 'Edit results')}
    </Button>
  );
};

export default EditButton;
