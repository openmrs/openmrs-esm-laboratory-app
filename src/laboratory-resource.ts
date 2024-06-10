import { useState, useMemo } from "react";
import useSWR, { mutate } from "swr"; // Import mutate from swr
import { openmrsFetch, restBaseUrl, useConfig } from "@openmrs/esm-framework";
import { FulfillerStatus } from "./types";
import { Order } from "@openmrs/esm-patient-common-lib";
import dayjs from "dayjs";

/**
 * Custom hook for retrieving laboratory orders based on the specified status.
 *
 * @param status - The status of the orders to retrieve
 * @param excludeCanceled - Whether to exclude canceled, discontinued, and expired orders
 * @param activatedOnOrAfterDate - The date to filter orders activated on or after this date
 * @param days - The number of days to filter completed orders
 */
export function useLabOrders(
  status: "NEW" | FulfillerStatus = null,
  excludeCanceled = true,
  activatedOnOrAfterDate?: string,
  days = 30 // Add the days parameter with a default value
) {
  const { laboratoryOrderTypeUuid } = useConfig();
  const fulfillerStatus = useMemo(() => (status === "NEW" ? null : status), [status]);
  const newOrdersOnly = status === "NEW";

  let url = `${restBaseUrl}/order?orderTypes=${laboratoryOrderTypeUuid}&v=full`;
  url = fulfillerStatus ? url + `&fulfillerStatus=${fulfillerStatus}` : url;
  url = excludeCanceled
    ? `${url}&excludeCanceledAndExpired=true&excludeDiscontinueOrders=true`
    : url;
  url = activatedOnOrAfterDate
    ? `${url}&activatedOnOrAfterDate=${activatedOnOrAfterDate}`
    : url;

  const { data, error, isLoading, isValidating } = useSWR<{
    data: { results: Array<Order> };
  }>(url, openmrsFetch);

  const now = dayjs();
  const filteredOrders =
    data?.data &&
    data.data.results.filter(order => {
      const completionDate = dayjs(order.dateActivated);
      const diffDays = now.diff(completionDate, 'day');
      const isCompletedRecently = diffDays <= days && order.fulfillerStatus === "COMPLETED";
      const isNewOrder = newOrdersOnly && order?.action === "NEW" && order?.fulfillerStatus === null;
      return isCompletedRecently || isNewOrder;
    });

  return {
    labOrders: filteredOrders || data?.data.results || [],
    isLoading,
    isError: error,
    mutate, // Include mutate in the return value
    isValidating,
  };
}

/**
 * Function to set the fulfiller status of an order.
 *
 * @param orderId - The ID of the order to update
 * @param status - The new fulfiller status
 * @param abortController - The abort controller to cancel the request if needed
 */
export function setFulfillerStatus(
  orderId: string,
  status: FulfillerStatus,
  abortController: AbortController
) {
  return openmrsFetch(`${restBaseUrl}/order/${orderId}/fulfillerdetails/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    signal: abortController.signal,
    body: JSON.stringify({ fulfillerStatus: status }),
  }).then(() => {
    mutate(`${restBaseUrl}/order?orderTypes=${useConfig().laboratoryOrderTypeUuid}&v=full`); // Revalidate the data after status update
  }).catch(error => {
    console.error("Failed to update fulfiller status", error);
  });
}

/**
 * Function to reject a lab order.
 *
 * @param orderId - The ID of the order to reject
 * @param comment - The reason for rejecting the order
 * @param abortController - The abort controller to cancel the request if needed
 */
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
    body: JSON.stringify({
      fulfillerStatus: "DECLINED",
      fulfillerComment: comment,
    }),
  }).then(() => {
    mutate(`${restBaseUrl}/order?orderTypes=${useConfig().laboratoryOrderTypeUuid}&v=full`); // Revalidate the data after status update
  }).catch(error => {
    console.error("Failed to reject lab order", error);
  });
}
