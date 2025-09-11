import { Type, validators } from '@openmrs/esm-framework';

const allowedLabTableColumns = ['name', 'age', 'sex', 'totalOrders', 'action', 'patientId'] as const;
type LabTableColumnName = (typeof allowedLabTableColumns)[number];

export const configSchema = {
  laboratoryOrderTypeUuid: {
    _type: Type.String,
    _default: '52a447d3-a64a-11e3-9aeb-50e549534c5e',
    _description: 'Uuid for orderType',
  },
  encounterTypeUuid: {
    _type: Type.String,
    _default: '39da3525-afe4-45ff-8977-c53b7b359158',
    _description: 'Orders encounter type uuid',
  },
  targetPatientDashboard: {
    redirectToResultsViewer: {
      _type: Type.String,
      _default: 'Results Viewer',
      _description: 'Redirects to Results Viewer in patient chart dashboard from lab app.',
    },
    redirectToOrders: {
      _type: Type.String,
      _default: 'Orders',
      _description: 'Redirects to Orders in patient chart dashboard from lab app.',
    },
    _description: 'The patient chart dashboard to navigate to from the lab app.',
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
};

export type Config = {
  laboratoryOrderTypeUuid: string;
  encounterTypeUuid: string;
  targetPatientDashboard: {
    redirectToResultsViewer: string;
    redirectToOrders: string;
  };
  labTableColumns: Array<LabTableColumnName>;
  patientIdIdentifierTypeUuid: string;
};
