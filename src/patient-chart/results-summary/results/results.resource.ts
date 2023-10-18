import { FetchResponse, openmrsFetch, useConfig } from "@openmrs/esm-framework";
import useSWR from "swr";
export function useGetLabEncounterTests(encounterUuid: string) {
  const apiUrl = `/ws/rest/v1/encountertestresults?encounterUuid=${encounterUuid}`;

  const { data, error, isLoading } = useSWR<{ data: FetchResponse }, Error>(
    apiUrl,
    openmrsFetch,
    { refreshInterval: 3000 }
  );
  return {
    labResults: data?.data ? data?.data : [],
    isLoading,
    isError: error,
  };
}
