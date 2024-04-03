import { openmrsFetch, restBaseUrl, useConfig } from "@openmrs/esm-framework";
import { FulfillerStatus } from "./types";
import { Order } from "@openmrs/esm-patient-common-lib";
import useSWR from "swr";

/**
 * Custom hook for retrieving laboratory orders based on the specified status.
 *
 * @param status - The status of the orders to retrieve
 * @param excludeCanceled - Whether to exclude canceled, discontinued and expired orders
 */
export function useLabOrders(
  status: FulfillerStatus = null,
  excludeCanceled = true
) {
  const { laboratoryOrderTypeUuid } = useConfig();
  let url = `${restBaseUrl}/order?orderTypes=${laboratoryOrderTypeUuid}&v=full`;
  url = status ? url + `&fulfillerStatus=${status}` : url;
  url = excludeCanceled
    ? `${url}&excludeCanceledAndExpired=true&excludeDiscontinueOrders=true`
    : url;
  // The usage of SWR's mutator seems to only suffice for cases where we don't apply a status filter
  const refreshInterval = status ? 5000 : null;
  const { data, error, mutate, isLoading } = useSWR<{
    data: { results: Array<Order> };
  }>(url, openmrsFetch, { refreshInterval });

  return {
    labOrders: data?.data ? data.data.results : [],
    isLoading,
    isError: error,
    mutate,
  };
}

export function setFulfillerStatus(
  orderId: string,
  status: FulfillerStatus,
  abortController: AbortController
) {
  return openmrsFetch(`{$restBaseUrl}/order/${orderId}/fulfillerdetails/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    signal: abortController.signal,
    body: { fulfillerStatus: status },
  });
}

export function rejectLabOrder(
  orderId: string,
  comment: string,
  abortController: AbortController
) {
  return openmrsFetch(`${restBaseUrl}/order/${orderId}/fulfillerdetails/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    signal: abortController.signal,
    body: {
      fulfillerStatus: "DECLINED",
      fulfillerComment: comment,
    },
  });
}
