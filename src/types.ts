import { Order } from "@openmrs/esm-patient-common-lib";

export type FulfillerStatus =
  | "EXCEPTION"
  | "RECEIVED"
  | "COMPLETED"
  | "IN_PROGRESS"
  | "ON_HOLD"
  | "DECLINED";

export interface GroupedOrders {
  patientId: string;
  orders: Array<Order>;
}

export interface ListOrdersDetailsProps {
  groupedOrders: GroupedOrders;
  actions: Array<OrderAction>;
}

export interface OrderAction {
  actionName: string;
  order: 0 | number;
}
export interface OrdersDataTableProps {
  useFilter?: boolean;
  actionsSlotName?: string;
  excludeColumns?: string[];
  fulfillerStatus?: FulfillerStatus;
  excludeCanceledAndDiscontinuedOrders?: boolean;
  useActivatedOnOrAfterDateFilter?: boolean;
  actions: Array<OrderAction>;
}
