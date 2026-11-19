import React from 'react';
import { Button } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { AddIcon, launchWorkspace2, useConfig, useLayoutType, userHasAccess, useSession } from '@openmrs/esm-framework';
import { type Config } from '../../config-schema';
import styles from './add-walk-in-button.scss';

const AddWalkInButton = () => {
  const isTablet = useLayoutType() === 'tablet';
  const responsiveSize = isTablet ? 'lg' : 'md';
  const { t } = useTranslation();
  const session = useSession();
  const { walkIn } = useConfig<Config>();

  const canAddWalkIn =
    walkIn?.enabled && (!walkIn.requiredPrivilege || userHasAccess(walkIn.requiredPrivilege, session?.user));

  if (!canAddWalkIn) {
    return null;
  }

  const launchAddWalkInWorkspace = () => {
    launchWorkspace2('add-walk-in-workspace', {
      workspaceTitle: t('addWalkIn', 'Add walk-in patient'),
    });
  };

  return (
    <Button
      className={styles.buttonContainer}
      onClick={launchAddWalkInWorkspace}
      kind="tertiary"
      size={responsiveSize}
      renderIcon={(props) => <AddIcon size={16} {...props} />}
    >
      {t('addWalkIn', 'Add walk-in patient')}
    </Button>
  );
};

export default AddWalkInButton;
