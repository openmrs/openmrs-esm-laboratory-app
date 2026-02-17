import { Type, validators } from '@openmrs/esm-framework';

const allowedLabTableColumns = ['name', 'age', 'dob', 'sex', 'totalOrders', 'action', 'patientId'] as const;
type LabTableColumnName = (typeof allowedLabTableColumns)[number];

export const configSchema = {
  laboratoryOrderTypeUuid: {
    _type: Type.String,
    _default: '52a447d3-a64a-11e3-9aeb-50e549534c5e',
    _description: 'UUID for orderType',
  },
  labTableColumns: {
    _type: Type.Array,
    _default: ['name', 'age', 'sex', 'totalOrders', 'action'] as Array<LabTableColumnName>,
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
  enableReviewingLabResultsBeforeApproval: {
    _type: Type.Boolean,
    _default: false,
    _description:
      'Enable reviewing lab results before final approval. When enabled, lab results will be submitted for review before being approved and finalized.',
  },
  filterByCurrentLocation: {
    _type: Type.Boolean,
    _default: false,
    _description: 'Enable filtering lab requests by current location',
  },
};

export type Config = {
  enableReviewingLabResultsBeforeApproval: boolean;
  laboratoryOrderTypeUuid: string;
  labTableColumns: Array<LabTableColumnName>;
  patientIdIdentifierTypeUuid: string;
  filterByCurrentLocation: boolean;
};
