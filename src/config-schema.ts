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
};

export type Config = {
  laboratoryQueueConcept: string;
  laboratoryLocationTag: string;
};
