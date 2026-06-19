import { capitalize } from 'lodash-es';
import { type TFunction } from 'i18next';
import { type Patient, type OrderUrgency } from '@openmrs/esm-framework';

export const urgencyTagType: Record<OrderUrgency, 'red' | 'green' | 'gray'> = {
  STAT: 'red',
  ROUTINE: 'green',
  ON_SCHEDULED_DATE: 'gray',
};

export const urgencyPriority: Record<string, number> = { STAT: 0, ROUTINE: 1, ON_SCHEDULED_DATE: 2 };

export function formatUrgencyLabel(
  urgency: (OrderUrgency & {}) | (string & {}) | null | undefined,
  t: TFunction,
): string {
  if (!urgency) return '';
  switch (urgency) {
    case 'STAT':
      return t('stat', 'Stat');
    case 'ROUTINE':
      return t('routine', 'Routine');
    case 'ON_SCHEDULED_DATE':
      return t('scheduled', 'Scheduled');
    default:
      return capitalize(urgency.replace(/_/g, ' ').toLowerCase());
  }
}

export const getPatientIdentifier = (
  patient: Patient | undefined,
  patientIdIdentifierTypeUuid: string,
  usePreferredPatientIdentifier: boolean,
) => {
  if (usePreferredPatientIdentifier) {
    // Default/old behavior: identifier must be both preferred and match the configured type.
    return (
      patient?.identifiers?.find(
        (identifier) =>
          identifier.preferred &&
          !identifier.voided &&
          identifier?.identifierType?.uuid === patientIdIdentifierTypeUuid,
      )?.identifier ?? '--'
    );
  }

  // Opt-in behavior: first match identifiers by the configured type, regardless of the preferred flag.
  // If no matching type is found, fall back to any preferred identifier of any type, then '--'.
  const byType = patient?.identifiers?.find(
    (identifier) => !identifier.voided && identifier?.identifierType?.uuid === patientIdIdentifierTypeUuid,
  )?.identifier;

  const anyPreferred = patient?.identifiers?.find((identifier) => identifier.preferred && !identifier.voided);

  return byType ?? anyPreferred?.identifier ?? '--';
};
