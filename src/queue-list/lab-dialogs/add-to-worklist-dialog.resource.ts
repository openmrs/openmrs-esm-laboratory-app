import { FetchResponse, openmrsFetch, useConfig } from "@openmrs/esm-framework";
import { useMemo } from "react";
import useSWR from "swr";
import useSWRImmutable from "swr/immutable";
import {
  STOOL_CONCEPT_ID,
  STOOL_DISPLAY,
  additionEntries,
} from "../../constants";

export interface QueueRoomsResponse {
  uuid: string;
  display: string;
  name: string;
  description: string;
  address1: string;
  address2: string;
  cityvillage: string;
  stateprovince: string;
  country: string;
  postalcode: string;
  latitude: string;
  longitude: string;
  countydistrict: string;
  address3: string;
  address4: string;
  address5: string;
  address6: string;
  parentLocation: ParentLocation;
  childLocations: String[];
  retired: boolean;
  attributes: String[];
  address7: string;
  address8: string;
  address9: string;
  address10: string;
  address11: string;
  address12: string;
  address13: string;
  address14: string;
  address15: string;
  resourceVersion: string;
}

export interface ParentLocation {
  uuid: string;
  display: string;
  name: string;
  description: string;
  address1: string;
  address2: string;
  cityVillage: string;
  stateProvince: string;
  country: string;
  postalcode: string;
  latitude: string;
  longitude: string;
  countydistrict: string;
  address3: string;
  address4: string;
  address5: string;
  address6: string;
  parentLocation: ParentLocation;
  childLocations: ChildLocations[];
  retired: boolean;
  attributes: String[];
  address7: string;
  address8: string;
  address9: string;
  address10: string;
  address11: string;
  address12: string;
  address13: string;
  address14: string;
  address15: string;
  resourceversion: string;
}

export interface ChildLocations {
  uuid: string;
  display: string;
}

export interface ParentLocation {
  uuid: string;
  display: string;
}

// get queue rooms
export function useQueueRoomLocations(currentQueueLocation: string) {
  const apiUrl = `/ws/rest/v1/location/${currentQueueLocation}?v=full`;
  const { data, error, isLoading } = useSWR<{ data: QueueRoomsResponse }>(
    apiUrl,
    openmrsFetch
  );

  const queueRoomLocations = useMemo(
    () =>
      data?.data?.parentLocation?.childLocations?.map((response) => response) ??
      [],
    [data?.data?.parentLocation?.childLocations]
  );
  return {
    queueRoomLocations: queueRoomLocations ? queueRoomLocations : [],
    isLoading,
    error,
  };
}

// get specimen types
export function useSpecimenTypes() {
  const config = useConfig();
  const { laboratorySpecimenTypeConcept } = config;

  const apiUrl = `/ws/rest/v1/concept/${laboratorySpecimenTypeConcept}`;
  const { data, error, isLoading } = useSWRImmutable<FetchResponse>(
    apiUrl,
    openmrsFetch
  );
  const existingSpecimenTypes = data?.data?.answers ?? [];
  additionEntries.forEach((entry) => {
    const hasEntry = existingSpecimenTypes.some(
      (existingEntry) => existingEntry.uuid === entry.uuid
    );

    if (!hasEntry) {
      existingSpecimenTypes.push(entry);
    }
  });
  const specimenTypes = existingSpecimenTypes.map((answer) =>
    answer.uuid === STOOL_CONCEPT_ID
      ? { ...answer, display: STOOL_DISPLAY }
      : answer
  );
  return {
    specimenTypes,
    isLoading,
  };
}

// generate specimen id
export async function GenerateSpecimenId(uuid: string) {
  const abortController = new AbortController();
  return openmrsFetch(`/ws/rest/v1/generatesampleId?uuid=${uuid}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    signal: abortController.signal,
  });
}

// update Order
export async function UpdateOrder(uuid: string, body: any) {
  const abortController = new AbortController();
  return openmrsFetch(`/ws/rest/v1/accessionorder/${uuid}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    signal: abortController.signal,
    body: body,
  });
}

export async function GetOrderByUuid(uuid: string) {
  const abortController = new AbortController();
  return openmrsFetch(`/ws/rest/v1/order/${uuid}`, {
    headers: {
      "Content-Type": "application/json",
    },
    signal: abortController.signal,
  });
}

export async function receiveOrder(uuid: string, body: any) {
  const abortController = new AbortController();

  return openmrsFetch(`/ws/rest/v1/order/${uuid}/fulfillerdetails/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    signal: abortController.signal,
    body: body,
  });
}
