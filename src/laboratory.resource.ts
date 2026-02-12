import { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import useSWR, { mutate } from 'swr';
import { openmrsFetch, type Order, restBaseUrl, useAppContext, useConfig, useSession } from '@openmrs/esm-framework';
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
 * Custom hook for retrieving laboratory orders.
 *
 * @param status - The fulfiller status to filter by (e.g. 'IN_PROGRESS', 'COMPLETED')
 * @param newOrdersOnly - Whether to return only new orders that haven't been picked (action=NEW, fulfillerStatus=null). Filtered client-side as the REST API doesn't support this query natively.
 * @param excludeCanceled - Whether to exclude canceled, discontinued and expired orders
 * @param includePatientId - Whether to include patient identifiers in the response
 */
export function useLabOrders(params: Partial<UseLabOrdersParams> = useLabOrdersDefaultParams) {
  const [filteredOrdersByLocation, setFilteredOrdersByLocation] = useState<Array<Order>>([]);
  const definedParams = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined));
  const { status, newOrdersOnly, excludeCanceled, includePatientId } = {
    ...useLabOrdersDefaultParams,
    ...definedParams,
  };
  const { dateRange } = useAppContext<DateFilterContext>('laboratory-date-filter') ?? {
    dateRange: [dayjs().startOf('day').toDate(), new Date()],
  };
  const { sessionLocation } = useSession();

  const { laboratoryOrderTypeUuid, filterByCurrentLocation } = useConfig<Config>();
  const customRepresentation = `custom:(uuid,orderNumber,patient:(uuid,display,person:(uuid,display,age,birthdate,gender)${
    includePatientId ? ',identifiers' : ''
  }),concept:(uuid,display),action,careSetting:(uuid,display,description,careSettingType,display),previousOrder,dateActivated,scheduledDate,dateStopped,autoExpireDate,encounter:(uuid,display),orderer:(uuid,display),orderReason,orderReasonNonCoded,orderType:(uuid,display,name,description,conceptClasses,parent),urgency,instructions,commentToFulfiller,display,fulfillerStatus,fulfillerComment,accessionNumber,specimenSource,laterality,clinicalHistory,frequency,numberOfRepeats)`;
  let url = `${restBaseUrl}/order?orderTypes=${laboratoryOrderTypeUuid}&v=${customRepresentation}`;
  url = status ? url + `&fulfillerStatus=${status}` : url;
  url = excludeCanceled ? `${url}&excludeCanceledAndExpired=true&excludeDiscontinueOrders=true` : url;
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

  useEffect(() => {
    if (!filterByCurrentLocation) {
      setFilteredOrdersByLocation(filteredOrders ?? []);
      return;
    }

    const filterByLocation = async () => {
      const results = await Promise.all(
        filteredOrders.map(async (order) => {
          try {
            const customRepresentation = `custom:(uuid,location:(uuid))`;
            const response = await openmrsFetch(
              `${restBaseUrl}/encounter/${order.encounter.uuid}?v=${customRepresentation}`,
            );
            return response.data?.location?.uuid === sessionLocation?.uuid ? order : null;
          } catch (error) {
            return null;
          }
        }),
      );
      setFilteredOrdersByLocation(results.filter(Boolean) as Order[]);
    };

    filterByLocation();
  }, [filteredOrders, sessionLocation?.uuid, filterByCurrentLocation]);

  return {
    labOrders: filteredOrdersByLocation ?? [],
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
