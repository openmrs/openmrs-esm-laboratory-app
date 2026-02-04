import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AddIcon, launchWorkspace2, showSnackbar, useConfig, useLayoutType, useVisit } from '@openmrs/esm-framework';
import { Button } from '@carbon/react';
import { useInvalidateLabOrders } from '../../laboratory.resource';
import styles from './add-test-order-button.scss';
import { type Config } from '../../config-schema';

const AddTestOrderButton = () => {
  const isTablet = useLayoutType() === 'tablet';
  const responsiveSize = isTablet ? 'lg' : 'md';
  const { t } = useTranslation();
  const { laboratoryOrderTypeUuid } = useConfig<Config>();
  const invalidateLabOrders = useInvalidateLabOrders();

  const [selectedPatient, setSelectedPatient] = useState<{ uuid: string; patient: fhir.Patient } | null>(null);
  const closeWorkspaceRef = useRef<(() => Promise<void>) | null>(null);

  const { activeVisit, isLoading } = useVisit(selectedPatient?.uuid);

  useEffect(() => {
    if (!selectedPatient || isLoading) {
      return;
    }

    if (activeVisit) {
      closeWorkspaceRef.current?.().then(() => {
        launchWorkspace2(
          'add-test-order-basket-workspace',
          {},
          {
            patientUuid: selectedPatient.uuid,
            patient: selectedPatient.patient,
            visitContext: activeVisit,
            visibleOrderPanels: [laboratoryOrderTypeUuid],
            labOrderWorkspaceName: 'add-test-order-basket-add-lab-order-workspace',
            onOrderBasketSubmitted: () => {
              invalidateLabOrders();
            },
          },
        );
      });
    } else {
      showSnackbar({
        title: t('visitRequired', 'Visit required'),
        subtitle: t('visitRequiredToAddLabTest', 'An active visit is required to add a lab test'),
        kind: 'error',
      });
    }

    setSelectedPatient(null);
    closeWorkspaceRef.current = null;
  }, [activeVisit, laboratoryOrderTypeUuid, isLoading, selectedPatient, invalidateLabOrders, t]);

  const handlePatientSelected = useCallback(
    (
      patientUuid: string,
      patient: fhir.Patient,
      _launchChildWorkspace: unknown,
      closeWorkspace: () => Promise<void>,
    ) => {
      closeWorkspaceRef.current = closeWorkspace;
      setSelectedPatient({ uuid: patientUuid, patient });
    },
    [],
  );

  const launchSearchWorkspace = () => {
    launchWorkspace2(
      'add-test-order-patient-search-workspace',
      {
        workspaceTitle: t('addTestOrder', 'Add Test Order'),
        onPatientSelected: handlePatientSelected,
      },
      {
        startVisitWorkspaceName: 'add-test-order-start-visit-workspace',
      },
    );
  };
  return (
    <Button
      className={styles.buttonContainer}
      onClick={launchSearchWorkspace}
      kind="primary"
      size={responsiveSize}
      renderIcon={(props) => <AddIcon size={16} {...props} />}
    >
      {t('addTestOrder', 'Add Test Order')}
    </Button>
  );
};

export default AddTestOrderButton;
