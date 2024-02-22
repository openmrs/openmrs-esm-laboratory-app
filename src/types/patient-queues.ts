import { OpenmrsResource } from "@openmrs/esm-framework";

export interface PatientQueue {
  uuid: string;
  creator: {
    uuid: string;
    display: string;
    username: string;
    systemId: string;
    person: UuidDisplay;
    privileges: [];
    roles: Array<UuidDisplay>;
    retired: boolean;
  };
  dateCreated: string;
  changedBy?: string;
  dateChanged?: string;
  voided: boolean;
  dateVoided: string;
  voidedBy: string;
  patient: {
    uuid: string;
    display: string;
    identifiers: Array<UuidDisplay>;
    person: {
      uuid: string;
      display: string;
      gender: string;
      age: number;
      birthdate: string;
      birthdateEstimated: boolean;
      dead: boolean;
      deathDate?: string;
      causeOfDeath?: string;
      preferredName: UuidDisplay;
      preferredAddress: UuidDisplay;
      attributes: [];
      voided: boolean;
      birthtime?: string;
      deathdateEstimated: boolean;
    };
    voided: boolean;
  };
  encounter: Encounter;
  provider: {
    uuid: string;
    display: string;
    person: UuidDisplay;
    identifier: string;
    attributes: [];
    retired: boolean;
  };
  locationFrom: QueueLocation;
  locationTo: QueueLocation;
  // encounter: string; // TODO add encounter type
  status: string; // TODO add status enum
  priority: number; // TODO add priority enum
  priorityComment: string;
  visitNumber: string;
  comment: string;
  queueRoom: QueueRoom;
  datePicked: string;
  dateCompleted: string;
}

export interface QueueLocation {
  uuid: string;
  display: string;
  name: string;
  description: string;
  address1?: string;
  address2?: string;
  cityVillage?: string;
  stateProvince?: string;
  country: string;
  postalCode?: string;
  latitude?: string;
  longitude?: string;
  countyDistrict?: string;
  address3?: string;
  address4?: string;
  address5?: string;
  address6?: string;
  tags: Array<UuidDisplay>;
  parentLocation: UuidDisplay;
  childLocations: Array<UuidDisplay>;
  retired: boolean;
  attributes: [];
}

export interface QueueRoom {
  uuid: string;
  display: string;
  name: string;
  description: string;
  address1?: string;
  address2?: string;
  cityVillage?: string;
  stateProvince?: string;
  country?: string;
  postalCode?: string;
  latitude?: string;
  longitude?: string;
  countyDistrict?: string;
  address3?: string;
  address4?: string;
  address5?: string;
  address6?: string;
  tags: Array<UuidDisplay>;
  parentLocation: UuidDisplay;
  childLocations: Array<QueueLocation>;
  retired: boolean;
}

export interface UuidDisplay {
  uuid: string;
  display: string;
}

export interface Encounter {
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
  links: Link[];
}

export interface Form {
  uuid: string;
  display: string;
  links: Link[];
}

export interface EncounterType {
  uuid: string;
  display: string;
  links: Link[];
}

export interface Ob {
  uuid: string;
  display: string;
  links: Link[];
}

export interface Order {
  uuid: string;
  display: string;
  links: Link[];
  type: string;
  patient: OpenmrsResource;
}

export interface Visit {
  uuid: string;
  display: string;
  links: Link[];
}

export interface EncounterProvider {
  uuid: string;
  display: string;
  links: Link[];
}
