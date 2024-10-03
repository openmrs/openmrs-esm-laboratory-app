import { Type } from '@openmrs/esm-framework';

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
};

export type Config = {
  laboratoryOrderTypeUuid: string;
  encounterTypeUuid: string;
  targetPatientDashboard: Object;
};
