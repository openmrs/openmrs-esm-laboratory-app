import { openmrsFetch, useConfig } from "@openmrs/esm-framework";
import useSWR from "swr";

export interface LaboratoryResponse {
  results: Result[];
}

export interface Result {
  uuid: string;
  display: string;
  encounterDatetime: string;
  patient: Patient;
  location: Location;
  form: Form;
  encounterType: EncounterType;
  obs: Ob[];
  orders: Order[];
  voided: boolean;
  auditInfo: AuditInfo;
  visit: Visit;
  encounterProviders: EncounterProvider[];
  diagnoses: any[];
  links: Link[];
  resourceVersion: string;
}

export interface Patient {
  uuid: string;
  display: string;
  links: Link[];
}

export interface Link {
  rel: string;
  uri: string;
  resourceAlias: string;
}

export interface Location {
  uuid: string;
  display: string;
  name: string;
  description: any;
  address1: any;
  address2: any;
  cityVillage: any;
  stateProvince: any;
  country: string;
  postalCode: any;
  latitude: any;
  longitude: any;
  countyDistrict: any;
  address3: any;
  address4: any;
  address5: any;
  address6: any;
  tags: Tag[];
  parentLocation: ParentLocation;
  childLocations: ChildLocation[];
  retired: boolean;
  attributes: any[];
  address7: any;
  address8: any;
  address9: any;
  address10: any;
  address11: any;
  address12: any;
  address13: any;
  address14: any;
  address15: any;
  links: Link[];
  resourceVersion: string;
}

export interface Tag {
  uuid: string;
  display: string;
  links: Link[];
}

export interface ParentLocation {
  uuid: string;
  display: string;
  links: Link[];
}

export interface ChildLocation {
  uuid: string;
  display: string;
  links: Link[];
}

export interface Form {
  uuid: string;
  display: string;
  name: string;
  description: string;
  encounterType: EncounterType;
  version: string;
  build: any;
  published: boolean;
  formFields: any[];
  retired: boolean;
  resources: Resource[];
  links: Link[];
  resourceVersion: string;
}

export interface Resource {
  uuid: string;
  display: string;
  links: Link[];
}

export interface EncounterType {
  uuid: string;
  display: string;
  name: string;
  description: string;
  retired: boolean;
  links: Link[];
  resourceVersion: string;
}

export interface Ob {
  uuid: string;
  display: string;
  concept: Concept;
  person: Person;
  obsDatetime: string;
  accessionNumber: any;
  obsGroup: any;
  valueCodedName: any;
  groupMembers: any;
  comment: any;
  location: Location;
  order: any;
  encounter: Encounter;
  voided: boolean;
  value: any;
  valueModifier: any;
  formFieldPath: string;
  formFieldNamespace: string;
  links: Link[];
  resourceVersion: string;
}

export interface Concept {
  uuid: string;
  display: string;
  links: Link[];
}

export interface Person {
  uuid: string;
  display: string;
  links: Link[];
}

export interface Encounter {
  uuid: string;
  display: string;
  links: Link[];
}

export interface AuditInfo {
  creator: Creator;
  dateCreated: string;
  changedBy: any;
  dateChanged: any;
}

export interface Creator {
  uuid: string;
  display: string;
  links: Link[];
}

export interface Visit {
  uuid: string;
  display: string;
  patient: Patient;
  visitType: VisitType;
  indication: any;
  location: Location;
  startDatetime: string;
  stopDatetime: any;
  encounters: Encounter[];
  attributes: any[];
  voided: boolean;
  links: Link[];
  resourceVersion: string;
}

export interface VisitType {
  uuid: string;
  display: string;
  links: Link[];
}

export interface EncounterRole {
  uuid: string;
  display: string;
  links: Link[];
}

export interface EncounterProvider {
  uuid: string;
  provider: Provider;
  encounterRole: EncounterRole;
  voided: boolean;
  links: Link[];
  resourceVersion: string;
}

export interface Provider {
  uuid: string;
  display: string;
  links: Link[];
}

// order
export interface Order {
  uuid: string;
  orderNumber: string;
  accessionNumber: any;
  patient: Patient;
  concept: Concept;
  action: string;
  careSetting: CareSetting;
  previousOrder: any;
  dateActivated: string;
  scheduledDate: any;
  dateStopped: string;
  autoExpireDate: any;
  encounter: Encounter;
  orderer: Orderer;
  orderReason: any;
  orderReasonNonCoded: any;
  orderType: OrderType;
  urgency: string;
  instructions: any;
  commentToFulfiller: any;
  display: string;
  specimenSource: any;
  laterality: any;
  clinicalHistory: any;
  frequency: any;
  numberOfRepeats: any;
  links: Link[];
  type: string;
  resourceVersion: string;
}

export interface Patient {
  uuid: string;
  display: string;
  links: Link[];
}

export interface Link {
  rel: string;
  uri: string;
  resourceAlias: string;
}

export interface Concept {
  uuid: string;
  display: string;
  links: Link[];
}

export interface CareSetting {
  uuid: string;
  display: string;
  links: Link[];
}

export interface Encounter {
  uuid: string;
  display: string;
  links: Link[];
}

export interface Orderer {
  uuid: string;
  display: string;
  links: Link[];
}

export interface OrderType {
  uuid: string;
  display: string;
  name: string;
  javaClassName: string;
  retired: boolean;
  description: string;
  conceptClasses: any[];
  parent: any;
  links: Link[];
  resourceVersion: string;
}

export const getOrderColor = (activated: string, stopped: string) => {
  const numAct = parseInt(activated);
  let numStopped = 0;
  if (stopped == null) {
    numStopped = parseInt(stopped);
  }
  if (numAct <= 0 && numStopped == 0) {
    return "green";
  } else {
    return "#6F6F6F";
  }
};

export function useLabOrders(patientUuid: string) {
  const config = useConfig();
  const { laboratoryEncounterTypeUuid } = config;

  const apiUrl = `/ws/rest/v1/encounter?patient=${patientUuid}&encounterType=${laboratoryEncounterTypeUuid}&v=full`;
  const { data, error, isLoading } = useSWR<
    { data: LaboratoryResponse },
    Error
  >(apiUrl, openmrsFetch, { refreshInterval: 3000 });

  return {
    labRequests: data?.data ? data?.data?.results : [],
    isLoading,
    isError: error,
  };
}
