import { FetchResponse, openmrsFetch, restBaseUrl, useAppContext, useConfig } from '@openmrs/esm-framework';
import { Order } from '@openmrs/esm-patient-common-lib';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import useSWR from 'swr';
import { DateFilterContext, FulfillerStatus, GroupedOrders } from './types';

/**
 * Custom hook for retrieving laboratory orders based on the specified status.
 *
 * @param status - The status of the orders to retrieve
 * @param excludeCanceled - Whether to exclude canceled, discontinued and expired orders
 */
export function useLabOrders(status: 'NEW' | FulfillerStatus = null, excludeCanceled = true) {
  const { dateRange } = useAppContext<DateFilterContext>('laboratory-date-filter') ?? {
    dateRange: [dayjs().startOf('day').toDate(), new Date()],
  };

  const { laboratoryOrderTypeUuid } = useConfig();
  const fulfillerStatus = useMemo(() => (status === 'NEW' ? null : status), [status]);
  const newOrdersOnly = status === 'NEW';
  const customRepresentation =
    'custom:(uuid,orderNumber,patient:(uuid,display,person:(uuid,display,age)),concept:(uuid,display),action,careSetting:(uuid,display,description,careSettingType,display),previousOrder,dateActivated,scheduledDate,dateStopped,autoExpireDate,encounter:(uuid,display),orderer:(uuid,display),orderReason,orderReasonNonCoded,orderType:(uuid,display,name,description,conceptClasses,parent),urgency,instructions,commentToFulfiller,display,fulfillerStatus,fulfillerComment,specimenSource,laterality,clinicalHistory,frequency,numberOfRepeats)';
  let url = `${restBaseUrl}/order?orderTypes=${laboratoryOrderTypeUuid}&v=${customRepresentation}`;
  url = fulfillerStatus ? url + `&fulfillerStatus=${fulfillerStatus}` : url;
  url = excludeCanceled ? `${url}&excludeCanceledAndExpired=true&excludeDiscontinueOrders=true` : url;
  // The usage of SWR's mutator seems to only suffice for cases where we don't apply a status filter
  url = dateRange
    ? `${url}&=&activatedOnOrAfterDate=${dateRange.at(0).toISOString()}&activatedOnOrBeforeDate=${dateRange
        .at(1)
        .toISOString()}`
    : url;

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

const usePatientAge = (uuid: string) => {
  const customRepresentation = `custom:(person:(age))`;
  const url = `${restBaseUrl}/patient/${uuid}?v=${customRepresentation}`;
  const { isLoading, error, data } = useSWR<FetchResponse<{ person: { age: number } }>>(url, openmrsFetch);
  return { isLoading, error, patientAge: data?.data?.person?.age };
};

export default usePatientAge;
