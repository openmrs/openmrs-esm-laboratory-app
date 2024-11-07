import React from 'react';
import { Button } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import styles from './actions.scss';

const EditButton: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Button kind="secondary" className={styles.actionButton}>
      {t('editResults', 'Edit results')}
    </Button>
  );
};

export default EditButton;
