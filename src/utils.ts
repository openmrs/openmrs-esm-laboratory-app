import { capitalize } from 'lodash-es';
import { type TFunction } from 'i18next';
import { type OrderUrgency } from '@openmrs/esm-framework';

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
