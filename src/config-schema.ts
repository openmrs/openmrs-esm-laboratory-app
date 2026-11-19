import { Type, validators } from '@openmrs/esm-framework';

const allowedLabTableColumns = ['name', 'urgency', 'age', 'dob', 'sex', 'totalOrders', 'action', 'patientId'] as const;
type LabTableColumnName = (typeof allowedLabTableColumns)[number];

export const configSchema = {
  laboratoryOrderTypeUuid: {
    _type: Type.String,
    _default: '52a447d3-a64a-11e3-9aeb-50e549534c5e',
    _description: 'UUID for orderType',
  },
  labTableColumns: {
    _type: Type.Array,
    _default: ['name', 'urgency', 'age', 'sex', 'totalOrders', 'action'] as Array<LabTableColumnName>,
    _description: 'The columns to display in the lab table. Allowed values: ' + allowedLabTableColumns.join(', '),
    _elements: {
      _type: Type.String,
      _validators: [validators.oneOf(allowedLabTableColumns)],
    },
  },
  patientIdIdentifierTypeUuid: {
    _type: Type.UUID,
    _default: '05a29f94-c0ed-11e2-94be-8c13b969e334',
    _description: 'Needed if the "id" column of "labTableColumns" is used. Is the OpenMRS ID by default.',
  },
  usePreferredPatientIdentifier: {
    _type: Type.Boolean,
    _default: true,
    _description:
      "When true (default), the patientId column shows an identifier only when it is both preferred and matches patientIdIdentifierTypeUuid. When false, any identifier of the configured type is shown regardless of preferred status, with a fallback to the patient's preferred identifier of any type.",
  },
  enableReviewingLabResultsBeforeApproval: {
    _type: Type.Boolean,
    _default: false,
    _description:
      'Enable reviewing lab results before final approval. When enabled, lab results will be submitted for review before being approved and finalized.',
  },
  walkIn: {
    _description:
      'Settings for the "Add walk-in patient" action, which registers a lab-only patient with a minimal form, starts a visit and opens the order basket.',
    enabled: {
      _type: Type.Boolean,
      _default: false,
      _description: 'Whether to show the "Add walk-in patient" button on the Laboratory dashboard.',
    },
    requiredPrivilege: {
      _type: Type.String,
      _default: '',
      _description:
        'Privilege required to see the "Add walk-in patient" button. Leave empty to show it to everyone who can see the Laboratory dashboard.',
    },
    identifierSourceUuid: {
      _type: Type.UUID,
      _default: '8549f706-7e85-4c1d-9424-217d50a2988b',
      _description:
        'idgen identifier source used to generate the identifier of type `patientIdIdentifierTypeUuid` for walk-in patients. Is the OpenMRS ID generator by default.',
    },
    walkInIdentifierTypeUuid: {
      _type: Type.String,
      _default: '',
      _description:
        'Optional identifier type for a dedicated walk-in identifier. Used together with `walkInIdentifierSourceUuid`; when both are set, a walk-in identifier is added to walk-in patients and marked preferred.',
    },
    walkInIdentifierSourceUuid: {
      _type: Type.String,
      _default: '',
      _description: 'idgen identifier source that generates identifiers of type `walkInIdentifierTypeUuid`.',
    },
    visitTypeUuid: {
      _type: Type.UUID,
      _default: '7b0f5697-27e3-40c4-8bae-f4049abfb4ed',
      _description: 'Visit type of the visit started for walk-in patients. Is "Facility Visit" by default.',
    },
    visitAttributeTypeUuid: {
      _type: Type.String,
      _default: '',
      _description:
        'Optional boolean visit attribute type set to true on walk-in visits, so they can be told apart from other visits.',
    },
    phoneNumberAttributeTypeUuid: {
      _type: Type.UUID,
      _default: '14d4f066-15f5-102d-96e4-000c29c2a5d7',
      _description: 'Person attribute type used to store the phone number. Is "Telephone Number" by default.',
    },
  },
};

export type Config = {
  enableReviewingLabResultsBeforeApproval: boolean;
  laboratoryOrderTypeUuid: string;
  labTableColumns: Array<LabTableColumnName>;
  patientIdIdentifierTypeUuid: string;
  usePreferredPatientIdentifier: boolean;
  walkIn: {
    enabled: boolean;
    requiredPrivilege: string;
    identifierSourceUuid: string;
    walkInIdentifierTypeUuid: string;
    walkInIdentifierSourceUuid: string;
    visitTypeUuid: string;
    visitAttributeTypeUuid: string;
    phoneNumberAttributeTypeUuid: string;
  };
};
