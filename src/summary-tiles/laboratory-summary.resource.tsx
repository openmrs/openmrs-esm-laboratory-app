import useSWR from "swr";
import useSWRImmutable from "swr/immutable";
import {
  FetchResponse,
  openmrsFetch,
  restBaseUrl,
} from "@openmrs/esm-framework";

import { Result } from "../work-list/work-list.resource";

export function useMetrics() {
  const metrics = {
    orders: 15,
    in_progress: 4,
    transferred: 1,
    completed: 6,
  };
  const { data, error } = useSWR<{ data: { results: {} } }, Error>(
    `${restBaseUrl}/queue?`,
    openmrsFetch
  );

  return {
    metrics: metrics,
    isError: error,
    isLoading: !data && !error,
  };
}

export function useServices() {
  const serviceConceptSetUuid = "330c0ec6-0ac7-4b86-9c70-29d76f0ae20a";
  const apiUrl = `${restBaseUrl}/concept/${serviceConceptSetUuid}`;
  const { data } = useSWRImmutable<FetchResponse>(apiUrl, openmrsFetch);

  return {
    services: data
      ? data?.data?.setMembers?.map((setMember) => setMember?.display)
      : [],
  };
}

// worklist
export function useLabTestsStats(fulfillerStatus: string) {
  const apiUrl = `${restBaseUrl}/order?orderTypes=52a447d3-a64a-11e3-9aeb-50e549534c5e&isStopped=false&fulfillerStatus=${fulfillerStatus}&v=full
  `;
  const { data, error, isLoading } = useSWR<
    { data: { results: Array<Result> } },
    Error
  >(apiUrl, openmrsFetch);
  return {
    count: data?.data ? data.data.results.length : 0,
    isLoading,
    isError: error,
  };
}
