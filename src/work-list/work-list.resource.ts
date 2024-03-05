import { openmrsFetch, restBaseUrl, useConfig } from "@openmrs/esm-framework";
import { useCallback } from "react";
import useSWR, { mutate } from "swr";

export interface Result {
  uuid: string;
  orderNumber: string;
  accessionNumber: string;
  patient: Patient;
  concept: Concept;
  action: string;
  careSetting: CareSetting;
  previousOrder: PreviousOrder;
  dateActivated: string;
  scheduledDate: any;
  dateStopped: any;
  autoExpireDate: any;
  encounter: Encounter;
  orderer: Orderer;
  orderReason: any;
  orderReasonNonCoded: any;
  orderType: OrderType;
  urgency: string;
  instructions: any;
  commentToFulfiller: any;
  display: string;
  auditInfo: AuditInfo;
  fulfillerStatus: string;
  fulfillerComment: any;
  specimenSource: SpecimenSource;
  laterality: any;
  clinicalHistory: any;
  frequency: any;
  numberOfRepeats: any;
  links: Link[];
  type: string;
  resourceVersion: string;
}

export interface Patient {
  uuid: string;
  display: string;
  links: Link[];
}

export interface Link {
  rel: string;
  uri: string;
  resourceAlias: string;
}

export interface Concept {
  uuid: string;
  display: string;
  links: Link[];
}

export interface CareSetting {
  uuid: string;
  name: string;
  description: string;
  retired: boolean;
  careSettingType: string;
  display: string;
  links: Link[];
  resourceVersion: string;
}

export interface PreviousOrder {
  uuid: string;
  display: string;
  links: Link[];
  type: string;
}

export interface Encounter {
  uuid: string;
  display: string;
  links: Link[];
}

export interface Orderer {
  uuid: string;
  display: string;
  links: Link[];
}

export interface OrderType {
  uuid: string;
  display: string;
  name: string;
  javaClassName: string;
  retired: boolean;
  description: string;
  conceptClasses: any[];
  parent: any;
  links: Link[];
  resourceVersion: string;
}

export interface AuditInfo {
  creator: Creator;
  dateCreated: string;
  changedBy: any;
  dateChanged: any;
}

export interface Creator {
  uuid: string;
  display: string;
  links: Link[];
}

export interface SpecimenSource {
  uuid: string;
  display: string;
  links: Link[];
}

export function useGetOrdersWorklist(fulfillerStatus: string) {
  const { laboratoryOrderTypeUuid } = useConfig();

  const orderTypeQuery =
    laboratoryOrderTypeUuid !== ""
      ? `orderType=${laboratoryOrderTypeUuid}&`
      : "";

  const apiUrl = `${restBaseUrl}/order?${orderTypeQuery}fulfillerStatus=${fulfillerStatus}&v=full`;

  const mutateOrders = useCallback(
    () =>
      mutate(
        (key) =>
          typeof key === "string" &&
          key.startsWith(
            `/ws/rest/v1/order?orderType=${laboratoryOrderTypeUuid}`
          )
      ),
    [laboratoryOrderTypeUuid]
  );

  const { data, error, isLoading } = useSWR<
    { data: { results: Array<Result> } },
    Error
  >(apiUrl, openmrsFetch, { refreshInterval: 3000 });

  return {
    workListEntries: data?.data ? data.data.results : [],
    isLoading,
    isError: error,
    mutate: mutateOrders,
  };
}
