import {
  FetchResponse,
  openmrsFetch,
  restBaseUrl,
  useConfig,
} from "@openmrs/esm-framework";
import useSWR from "swr";

export interface LabTestResultResponse {
  results: Result[];
}

export interface Result {
  order: string;
  result: Result2[];
  links: Link[];
}

export interface Result2 {
  investigation: string;
  set: string;
  test: string;
  value: string;
  hiNormal: any;
  lowNormal: any;
  lowAbsolute: any;
  hiCritical: any;
  lowCritical: any;
  unit: any;
  level: string;
  concept: string;
  encounterId: any;
  testId: any;
  hiAbsolute: any;
}

export interface Link {
  rel: string;
  uri: string;
  resourceAlias: string;
}

export function useGetLabEncounterTests(encounterUuid: string) {
  const apiUrl = `${restBaseUrl}/encountertestresults?encounterUuid=${encounterUuid}`;

  const { data, error, isLoading } = useSWR<
    { data: LabTestResultResponse },
    Error
  >(apiUrl, openmrsFetch, { refreshInterval: 3000 });
  return {
    labResults: data?.data ? data?.data.results : [],
    isLoading,
    isError: error,
  };
}
