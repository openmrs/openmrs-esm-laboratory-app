import {
  OpenmrsResource,
  openmrsFetch,
  useVisit,
} from "@openmrs/esm-framework";
import useSWR from "swr";

const IN_PATIENT_VISIT_TYPE_UUID = "a73e2ac6-263b-47fc-99fc-e0f2c09fc914";
const EMERGENCY = "EMERGENCY";

type LineItem = {
  paymentStatus: string;
  price: number;
  quantity: number;
};

type QueueEntry = {
  queueEntry: {
    uuid: string;
    priority: OpenmrsResource;
    status: OpenmrsResource;
    queue: OpenmrsResource;
    queueComingFrom: OpenmrsResource;
  };
};

export const useBillStatus = (orderUuid: string, patientUuid: string) => {
  const { currentVisit } = useVisit(patientUuid);
  const { isEmergencyPatient, isLoading: isLoadingQueue } =
    usePatientQueue(patientUuid);
  const { isLoading: isLoadingBill, hasPendingBill } =
    usePatientBill(orderUuid);

  if (isLoadingQueue || isLoadingBill) {
    return { shouldPayBill: false, isLoading: true };
  }

  // If current visit type is inpatient then we should allow the patient to receive services without paying the bill
  if (currentVisit?.visitType?.uuid === IN_PATIENT_VISIT_TYPE_UUID) {
    return { shouldPayBill: false, isLoading: false };
  }

  // If the patient is in the emergency queue then we should allow the patient to receive services without paying the bill
  if (isEmergencyPatient) {
    return { shouldPayBill: false, isLoading: false };
  }

  // If the patient is not in the queue then we should check if the patient has a pending bill
  return { shouldPayBill: hasPendingBill, isLoading: false };
};

const usePatientQueue = (patientUuid: string) => {
  const url = `/ws/rest/v1/visit-queue-entry?patient=${patientUuid}`;
  const { data, isLoading, error } = useSWR<{
    data: { results: Array<QueueEntry> };
  }>(url, openmrsFetch);
  const isEmergencyPatient =
    data?.data?.results?.[0]?.queueEntry?.priority?.display === EMERGENCY;
  const isInQueue = data?.data?.results?.length > 0;
  return { isInQueue, isLoading, error, isEmergencyPatient };
};

const usePatientBill = (orderUuid: string) => {
  const url = `ws/rest/v1/cashier/billLineItem?orderUuid=${orderUuid}&v=full`;
  const { data, isLoading, error } = useSWR<{
    data: { results: Array<LineItem> };
  }>(url, openmrsFetch);
  const hasPendingBill = data?.data?.results?.some(
    (lineItem) => lineItem.paymentStatus === "PENDING"
  );
  return { hasPendingBill, isLoading, error };
};
