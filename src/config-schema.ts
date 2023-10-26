import { Type } from "@openmrs/esm-framework";

export const configSchema = {
  laboratoryQueueConcept: {
    _type: Type.String,
    _default: "1836ac8a-a855-4c7e-b2ba-a290233c67b7",
    _description: "Concept uuid for the laboratory queue.",
  },
  laboratoryLocationTag: {
    _type: Type.String,
    _default: "Laboratory",
    _description: "Location tag for laboratory locations.",
  },
  laboratorySpecimenTypeConcept: {
    _type: Type.ConceptUuid,
    _default: "159959AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    _description: "Concept UUID for laboratory specimen types",
  },
  laboratoryEncounterTypeUuid: {
    _type: Type.String,
    _default: "214e27a1-606a-4b1e-a96e-d736c87069d5",
    _description: "Concept uuid for the laboratory tool encounter type.",
  },
  laboratoryOrderTypeUuid: {
    _type: Type.String,
    _default: "52a447d3-a64a-11e3-9aeb-50e549534c5e",
    _description: "Uuid for orderType",
  },
};

export type Config = {
  laboratoryQueueConcept: string;
  laboratoryLocationTag: string;
  laboratorySpecimenTypeConcept: string;
  laboratoryEncounterTypeUuid: string;
};
