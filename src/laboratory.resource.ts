import { useCallback } from 'react';
import dayjs from 'dayjs';
import useSWR, { mutate } from 'swr';
import { openmrsFetch, type Order, restBaseUrl, useAppContext, useConfig } from '@openmrs/esm-framework';
import type { DateFilterContext, FulfillerStatus } from './types';
import { type Config } from './config-schema';

const useLabOrdersDefaultParams: UseLabOrdersParams = {
  status: null,
  newOrdersOnly: false,
  excludeCanceled: true,
  includePatientId: false,
};

interface UseLabOrdersParams {
  status: FulfillerStatus;
  newOrdersOnly: boolean;
  excludeCanceled: boolean;
  includePatientId: boolean;
}

/**
 * Custom hook for retrieving laboratory orders based on the specified status.
 *
 * @param status - The status of the orders to retrieve
 * @param excludeCanceled - Whether to exclude canceled, discontinued and expired orders
 */
export function useLabOrders(params: Partial<UseLabOrdersParams> = useLabOrdersDefaultParams) {
  const definedParams = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined));
  const { status, newOrdersOnly, excludeCanceled, includePatientId } = {
    ...useLabOrdersDefaultParams,
    ...definedParams,
  };
  const { dateRange } = useAppContext<DateFilterContext>('laboratory-date-filter') ?? {
    dateRange: [dayjs().startOf('day').toDate(), new Date()],
  };

  const { laboratoryOrderTypeUuid } = useConfig();
  const customRepresentation = `custom:(uuid,orderNumber,patient:(uuid,display,person:(uuid,display,age,birthdate,gender)${
    includePatientId ? ',identifiers' : ''
  }),concept:(uuid,display),action,careSetting:(uuid,display,description,careSettingType,display),previousOrder,dateActivated,scheduledDate,dateStopped,autoExpireDate,encounter:(uuid,display),orderer:(uuid,display),orderReason,orderReasonNonCoded,orderType:(uuid,display,name,description,conceptClasses,parent),urgency,instructions,commentToFulfiller,display,fulfillerStatus,fulfillerComment,accessionNumber,specimenSource,laterality,clinicalHistory,frequency,numberOfRepeats)`;
  let url = `${restBaseUrl}/order?orderTypes=${laboratoryOrderTypeUuid}&v=${customRepresentation}`;
  url = status ? url + `&fulfillerStatus=${status}` : url;
  url = excludeCanceled ? `${url}&excludeCanceledAndExpired=true&excludeDiscontinueOrders=true` : url;
  // The usage of SWR's mutator seems to only suffice for cases where we don't apply a status filter
  url = dateRange
    ? `${url}&activatedOnOrAfterDate=${dateRange.at(0).toISOString()}&activatedOnOrBeforeDate=${dateRange
        .at(1)
        .toISOString()}`
    : url;

  const { data, error, mutate, isLoading, isValidating } = useSWR<{
    data: { results: Array<Order> };
  }>(`${url}`, openmrsFetch);

  const filteredOrders = data?.data?.results?.filter(
    (order) => !newOrdersOnly || (order?.action === 'NEW' && order?.fulfillerStatus === null),
  );
  return {
    labOrders: filteredOrders ?? [],
    isLoading,
    isError: error,
    mutate,
    isValidating,
  };
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

/**
 * Custom hook that returns a function to invalidate and refetch all lab orders.
 * Use this after mutations to ensure the UI reflects the latest data.
 */
export function useInvalidateLabOrders() {
  const { laboratoryOrderTypeUuid } = useConfig<Config>();

  return useCallback(() => {
    mutate(
      (key) => typeof key === 'string' && key.startsWith(`${restBaseUrl}/order?orderTypes=${laboratoryOrderTypeUuid}`),
      undefined,
      { revalidate: true },
    );
  }, [laboratoryOrderTypeUuid]);
}
