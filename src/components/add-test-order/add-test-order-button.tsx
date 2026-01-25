import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  AddIcon,
  type FetchResponse,
  launchWorkspace2,
  openmrsFetch,
  restBaseUrl,
  showSnackbar,
  useLayoutType,
  type Visit,
  type Workspace2DefinitionProps,
} from '@openmrs/esm-framework';
import { Button } from '@carbon/react';
import { useInvalidateLabOrders } from '../../laboratory.resource';
import styles from './add-test-order-button.scss';

const AddTestOrderButton = () => {
  const isTablet = useLayoutType() === 'tablet';
  const responsiveSize = isTablet ? 'lg' : 'md';
  const { t } = useTranslation();
  const invalidateLabOrders = useInvalidateLabOrders();

  const launchSearchWorkspace = () => {
    launchWorkspace2(
      'add-test-order-patient-search-workspace',
      {
        workspaceTitle: t('addTestOrder', 'Add Test Order'),
        onPatientSelected(
          patientUuid: string,
          patient: fhir.Patient,
          _launchChildWorkspace: Workspace2DefinitionProps['launchChildWorkspace'],
          closeWorkspace: Workspace2DefinitionProps['closeWorkspace'],
        ) {
          getActiveVisitsForPatient(patientUuid).then(async (response) => {
            const activeVisit = response.data.results?.[0];
            if (activeVisit) {
              await closeWorkspace();
              launchWorkspace2(
                'add-test-order-basket-workspace',
                {},
                {
                  patientUuid: patientUuid,
                  patient: patient,
                  visitContext: activeVisit,
                  labOrderWorkspaceName: 'add-test-order-basket-add-lab-order-workspace',
                  onOrderBasketSubmitted: () => {
                    invalidateLabOrders();
                  },
                },
              );
            } else {
              showSnackbar({
                title: t('visitRequired', 'Visit required'),
                subtitle: t('visitRequiredToAddLabTest', 'An active visit is required to add a lab test'),
                kind: 'error',
              });
            }
          });
        },
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

function getActiveVisitsForPatient(
  patientUuid: string,
  abortController?: AbortController,
  v?: string,
): Promise<FetchResponse<{ results: Array<Visit> }>> {
  const custom = v ?? `default`;

  return openmrsFetch(`${restBaseUrl}/visit?patient=${patientUuid}&v=${custom}&includeInactive=false`, {
    signal: abortController?.signal,
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
    },
  });
}
export default AddTestOrderButton;
