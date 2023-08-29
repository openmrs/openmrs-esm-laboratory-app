import { getAsyncLifecycle, defineConfigSchema, getSyncLifecycle } from '@openmrs/esm-framework';
import { configSchema } from './config-schema';
import { createHomeDashboardLink } from './components/create-dashboard-link.component';
import { createDashboardLink } from '@openmrs/esm-patient-common-lib';

const moduleName = '@ugandaemr/esm-laboratory-app';

const options = {
  featureName: 'ugandaemr-laboratory',
  moduleName,
};

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

export const root = getAsyncLifecycle(() => import('./root.component'), options);

export const laboratoryDashboardLink = getSyncLifecycle(
  createHomeDashboardLink({
    name: 'laboratory',
    slot: 'laboratory-dashboard-slot',
    title: 'Laboratory',
  }),
  options,
);

export const laboratoryComponent = getAsyncLifecycle(() => import('./laboratory.component'), options);

// Patient chart
export const laboratoryOrderDashboardLink = getSyncLifecycle(
  createDashboardLink({
    path: 'laboratory-orders',
    title: 'Laboratory',
    moduleName,
  }),
  options,
);
export const laboratoryOrderComponent = getAsyncLifecycle(
  () => import('./patient-chart/laboratory-order.component'),
  options,
);

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}
