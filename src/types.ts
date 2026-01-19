import { type Order as FrameworkOrder, type OrderUrgency } from '@openmrs/esm-framework';

type FrameworkFulfillerStatus = FrameworkOrder['fulfillerStatus'];
export type FulfillerStatus = FrameworkFulfillerStatus | 'DRAFT' | null;

export type Order = Omit<FrameworkOrder, 'fulfillerStatus' | 'fulfillerComment'> & {
  fulfillerStatus?: FulfillerStatus;
  fulfillerComment?: string | null;
};

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

export type DateFilterContext = {
  dateRange: Array<Date>;
  setDateRange: React.Dispatch<React.SetStateAction<Array<Date>>>;
};
