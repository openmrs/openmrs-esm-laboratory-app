import { defineConfigSchema, getAsyncLifecycle, getSyncLifecycle } from '@openmrs/esm-framework';
import { configSchema } from './config-schema';
import { createHomeDashboardLink } from './components/create-dashboard-link.component';
import rootComponent from './root.component';

const moduleName = '@openmrs/esm-laboratory-app';

const options = {
  featureName: 'laboratory',
  moduleName,
};

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

export const root = getSyncLifecycle(rootComponent, options);

export const laboratoryDashboardLink = getSyncLifecycle(
  createHomeDashboardLink({
    name: 'laboratory',
    slot: 'laboratory-dashboard-slot',
    title: 'Laboratory',
  }),
  options,
);

// Modals

export const pickupLabRequestModal = getAsyncLifecycle(
  () => import('./lab-tabs/modals/pickup-lab-request-modal.component'),
  options,
);

export const rejectLabRequestModal = getAsyncLifecycle(
  () => import('./lab-tabs/modals/reject-lab-request-modal.component'),
  options,
);

// Tables and tiles

export const allLabRequestsTable = getAsyncLifecycle(
  () => import('./lab-tabs/data-table-extensions/tests-ordered-table.extension'),
  options,
);

export const inprogressLabRequestsTable = getAsyncLifecycle(
  () => import('./lab-tabs/data-table-extensions/in-progress-lab-requests-table.extension'),
  options,
);

export const completedLabRequestsTable = getAsyncLifecycle(
  () => import('./lab-tabs/data-table-extensions/completed-lab-requests-table.extension'),
  options,
);

export const worklistTile = getAsyncLifecycle(
  () => import('./lab-tiles/in-progress-lab-requests-tile.component'),
  options,
);

export const completedTile = getAsyncLifecycle(
  () => import('./lab-tiles/completed-lab-requests-tile.component'),
  options,
);

export const testOrderedTile = getAsyncLifecycle(() => import('./lab-tiles/all-lab-requests-tile.component'), options);

// Actions

export const addLabRequestResultsAction = getAsyncLifecycle(
  () => import('./lab-tabs/actions/add-lab-request-results-action.component'),
  options,
);

export const pickupLabRequestAction = getAsyncLifecycle(
  () => import('./lab-tabs/actions/pickup-lab-request-action.component'),
  options,
);

export const rejectLabRequestAction = getAsyncLifecycle(
  () => import('./lab-tabs/actions/reject-lab-request-action.component'),
  options,
);

export const editLabRequestAction = getAsyncLifecycle(
  () => import('./lab-tabs/actions/edit-lab-request-results-action.component'),
  options,
);

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}
