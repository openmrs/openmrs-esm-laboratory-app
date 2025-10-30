import { type OpenmrsResource } from '@openmrs/esm-framework';
import {
  type Drug,
  type Concept,
  type OrderUrgency,
  type OrderAction as ExternalOrderAction,
} from '@openmrs/esm-patient-common-lib';
export type FulfillerStatus = 'DRAFT' | 'RECEIVED' | 'IN_PROGRESS' | 'EXCEPTION' | 'ON_HOLD' | 'DECLINED' | 'COMPLETED';

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

export interface Order {
  uuid: string;
  action: ExternalOrderAction;
  asNeeded: boolean;
  asNeededCondition?: string;
  autoExpireDate: string;
  brandName?: string;
  careSetting: OpenmrsResource;
  commentToFulfiller: string;
  concept: Concept;
  dateActivated: string;
  dateStopped?: string | null;
  dispenseAsWritten: boolean;
  dose: number;
  doseUnits: OpenmrsResource;
  dosingInstructions: string | null;
  dosingType?: 'org.openmrs.FreeTextDosingInstructions' | 'org.openmrs.SimpleDosingInstructions';
  drug: Drug;
  duration: number;
  durationUnits: OpenmrsResource;
  encounter: OpenmrsResource;
  frequency: OpenmrsResource;
  instructions?: string | null;
  numRefills: number;
  orderNumber: string;
  orderReason: string | null;
  orderReasonNonCoded: string | null;
  orderType: {
    conceptClasses: Array<any>;
    description: string;
    display: string;
    name: string;
    parent: string | null;
    retired: boolean;
    uuid: string;
  };
  orderer: {
    display: string;
    person: {
      display: string;
    };
    uuid: string;
  };
  patient: OpenmrsResource;
  previousOrder: { uuid: string; type: string; display: string } | null;
  quantity: number;
  quantityUnits: OpenmrsResource;
  route: OpenmrsResource;
  scheduleDate: null;
  urgency: OrderUrgency;

  accessionNumber: string;
  scheduledDate: string;
  display: string;
  auditInfo: {
    creator: {
      uuid: string;
      display: string;
    };
    dateCreated: string;
    changedBy: string;
    dateChanged: string;
  };
  fulfillerStatus: FulfillerStatus;
  fulfillerComment: string;
  specimenSource: string;
  laterality: string;
  clinicalHistory: string;
  numberOfRepeats: string;
  type: string;
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
