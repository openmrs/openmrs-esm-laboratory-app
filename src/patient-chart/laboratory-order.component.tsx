import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { EncounterList, EncounterListColumn, getObsFromEncounter } from "@ohri/openmrs-esm-ohri-commons-lib";
import moment from "moment";
import { moduleName, LABORATARORY_ENCOUNTER_TYPE, TEST_ORDER_ENCOUNTER_TYPE } from "../constants";
 

interface LaboratoryOrderOverviewProps {
  patientUuid: string;
}

const LaboratoryOrder: React.FC<LaboratoryOrderOverviewProps> = ({ patientUuid }) => {
  const { t } = useTranslation();  
 
  const columnsLab: EncounterListColumn[] = useMemo(
    () => [
      {
        key: 'encounterDate',
        header: t('encounterDate', 'Encounter Date'),
        getValue: (encounter) => {
          return moment(encounter.encounterDatetime).format('DD-MMM-YYYY');
        },
      },  
      {
        key: 'testOrders',
        header: t('deliveryType', 'Test Order(s)'),
        getValue: (encounter) => {
          return getObsFromEncounter(encounter, TEST_ORDER_ENCOUNTER_TYPE);
        },
      },

      {
        key: 'actions',
        header: t('actions', 'Actions'),
        getValue: (encounter) => {
          const baseActions = [
            {
              form: { name: 'HMIS LAB 001:General Laboratory Test Request Form'},
              encounterUuid: encounter.uuid,
              intent: '*',
              label: 'View Details',
              mode: 'view',
            },
            {
              form: { name: 'HMIS LAB 001:General Laboratory Test Request Form' },
              encounterUuid: encounter.uuid,
              intent: '*',
              label: 'Edit Form',
              mode: 'edit',
            },
          ];
          return baseActions;
        },
      },
    ],
    [t],
  );
  const headerTitle = t('Laboratory');

  return (
    <EncounterList
      patientUuid={patientUuid}
      encounterType={LABORATARORY_ENCOUNTER_TYPE}
      formList={[{ name: 'HMIS LAB 001:General Laboratory Test Request Form' }]}
      columns={columnsLab}
      description={headerTitle}
      headerTitle={headerTitle}
      launchOptions={{
        displayText: 'Add',
        moduleName: moduleName,
      }}
    />
  );
};

export default LaboratoryOrder;
