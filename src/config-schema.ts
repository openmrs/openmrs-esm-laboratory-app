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
    _default: "162476AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    _description: "Concept UUID for laboratory specimen types",
  },
  laboratoryEncounterTypeUuid: {
    _type: Type.String,
    _default: "214e27a1-606a-4b1e-a96e-d736c87069d5",
    _description: "Concept uuid for the laboratory tool encounter type.",
  },
  artCardEncounterTypeUuid: {
    _type: Type.String,
    _default: "8d5b2be0-c2cc-11de-8d13-0010c6dffd0f",
    _description: "Concept uuid for the laboratory tool encounter type.",
  },
  laboratoryOrderTypeUuid: {
    _type: Type.String,
    _default: "52a447d3-a64a-11e3-9aeb-50e549534c5e",
    _description: "Uuid for orderType",
  },
  laboratoryReferalDestinationUuid: {
    _type: Type.String,
    _default: "b1f8b6c8-c255-4518-89f5-4236ab76025b",
    _description: "Concept uuid for laboratory referals destinations",
  },

  enableSendingLabTestsByEmail: {
    _type: Type.Boolean,
    _default: false,
    _description: "This enables sending results to patient via email",
  },
  enableSpecimenIdAutoGeneration: {
    _type: Type.Boolean,
    _default: true,
    _description:
      "Configuration to enable/disable auto speciment id generation button.",
  },
};

export type Config = {
  laboratoryQueueConcept: string;
  laboratoryLocationTag: string;
  laboratorySpecimenTypeConcept: string;
  laboratoryEncounterTypeUuid: string;
};
