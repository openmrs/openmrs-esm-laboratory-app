import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { AddIcon, launchWorkspace2, showSnackbar, useConfig, useLayoutType, useVisit } from '@openmrs/esm-framework';
import { useInvalidateLabOrders } from '../../laboratory.resource';
import { type Config } from '../../config-schema';
import styles from './add-test-order-button.scss';

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
      const closePromise = closeWorkspaceRef.current?.() ?? Promise.resolve();
      closePromise
        ?.then(() => {
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
          setSelectedPatient(null);
          closeWorkspaceRef.current = null;
        })
        .catch(() => {
          // Close was cancelled; keep state so the user can retry.
        });
    } else {
      const patientName =
        [
          selectedPatient?.patient?.name?.[0]?.given?.filter(Boolean).join(' '),
          selectedPatient?.patient?.name?.[0]?.family,
        ]
          .filter(Boolean)
          .join(' ') || t('theSelectedPatient', 'The selected patient');
      showSnackbar({
        title: t('visitRequired', 'Visit required'),
        subtitle: t(
          'startVisitToAddLabTest',
          '{{patientName}} does not have an active visit. Click the "Start visit" button next to their name to begin one.',
          { patientName },
        ),
        kind: 'warning',
      });
      setSelectedPatient(null);
      closeWorkspaceRef.current = null;
    }
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
        workspaceTitle: t('addTestOrder', 'Add test Order'),
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
      {t('addTestOrder', 'Add test Order')}
    </Button>
  );
};

export default AddTestOrderButton;
