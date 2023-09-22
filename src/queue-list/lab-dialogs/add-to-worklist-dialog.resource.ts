import { openmrsFetch } from "@openmrs/esm-framework";
import { useMemo } from "react";
import useSWR from "swr";

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
