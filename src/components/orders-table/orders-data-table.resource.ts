import { type Order } from '@openmrs/esm-patient-common-lib';
import { useMemo } from 'react';

interface CustomOrder extends Omit<Order, 'orderer' | 'patient'> {
  patient: string;
  patientUuid: string;
  orderer: string;
}

export default function useSearchResults(tableEntries: CustomOrder[], searchString): CustomOrder[] {
  const searchResults = useMemo(() => {
    if (searchString && searchString.trim() !== '') {
      const search = searchString.toLowerCase();
      return tableEntries.filter((eachDataRow) =>
        Object.entries(eachDataRow).some(([header, value]) => {
          return `${value}`.toLowerCase().includes(search);
        }),
      );
    }

    return tableEntries;
  }, [searchString, tableEntries]);

  return searchResults;
}
