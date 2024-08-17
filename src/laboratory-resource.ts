import { openmrsFetch, restBaseUrl, useConfig } from '@openmrs/esm-framework';
import { FulfillerStatus, GroupedOrders } from './types';
import { Order } from '@openmrs/esm-patient-common-lib';
import useSWR from 'swr';
import { useMemo } from 'react';

/**
 * Custom hook for retrieving laboratory orders based on the specified status.
 *
 * @param status - The status of the orders to retrieve
 * @param excludeCanceled - Whether to exclude canceled, discontinued and expired orders
 */
export function useLabOrders(
  status: 'NEW' | FulfillerStatus = null,
  excludeCanceled = true,
  activatedOnOrAfterDate?: string,
) {
  const { laboratoryOrderTypeUuid } = useConfig();
  const fulfillerStatus = useMemo(() => (status === 'NEW' ? null : status), [status]);
  const newOrdersOnly = status === 'NEW';
  let url = `${restBaseUrl}/order?orderTypes=${laboratoryOrderTypeUuid}&v=full`;
  url = fulfillerStatus ? url + `&fulfillerStatus=${fulfillerStatus}` : url;
  url = excludeCanceled ? `${url}&excludeCanceledAndExpired=true&excludeDiscontinueOrders=true` : url;
  // The usage of SWR's mutator seems to only suffice for cases where we don't apply a status filter
  url = activatedOnOrAfterDate ? `${url}&=&activatedOnOrAfterDate=${activatedOnOrAfterDate}` : url;

  const { data, error, mutate, isLoading, isValidating } = useSWR<{
    data: { results: Array<Order> };
  }>(`${url}`, openmrsFetch);

  const filteredOrders =
    data?.data &&
    newOrdersOnly &&
    data.data.results.filter((order) => order?.action === 'NEW' && order?.fulfillerStatus === null);
  return {
    labOrders: filteredOrders || data?.data.results || [],
    isLoading,
    isError: error,
    mutate,
    isValidating,
  };
}
export function useSearchGroupedResults(data: Array<GroupedOrders>, searchString: string) {
  const searchResults = useMemo(() => {
    if (searchString && searchString.trim() !== '') {
      // Normalize the search string to lowercase
      const lowerSearchString = searchString.toLowerCase();
      return data.filter((orderGroup) =>
        orderGroup.orders.some(
          (order) =>
            order.orderNumber.toLowerCase().includes(lowerSearchString) ||
            order.patient.display.toLowerCase().includes(lowerSearchString),
        ),
      );
    }

    return data;
  }, [searchString, data]);

  return searchResults;
}
export function setFulfillerStatus(orderId: string, status: FulfillerStatus, abortController: AbortController) {
  return openmrsFetch(`${restBaseUrl}/order/${orderId}/fulfillerdetails/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: abortController.signal,
    body: { fulfillerStatus: status },
  });
}

export function rejectLabOrder(orderId: string, comment: string, abortController: AbortController) {
  return openmrsFetch(`${restBaseUrl}/order/${orderId}/fulfillerdetails/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: abortController.signal,
    body: {
      fulfillerStatus: 'DECLINED',
      fulfillerComment: comment,
    },
  });
}
