import { type Order, type FulfillerStatus, type OrderUrgency } from '@openmrs/esm-patient-common-lib';

export interface FlattenedOrder {
  id: string;
  patientUuid: string;
  orderNumber: string;
  display: string;
  dateActivated: string;
  fulfillerStatus: FulfillerStatus;
  urgency: OrderUrgency;
  orderer: string;
  instructions: string;
  fulfillerComment: string;
}

export interface GroupedOrders {
  patientUuid: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientSex: string;
  totalOrders: number;
  orders: Array<FlattenedOrder>;
  originalOrders: Array<Order>;
}

export interface OrderAction {
  actionName: string;
  order: 0 | number;
}

export type DateFilterContext = {
  dateRange: Array<Date>;
  setDateRange: React.Dispatch<React.SetStateAction<Array<Date>>>;
};
