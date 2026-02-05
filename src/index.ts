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
  // t('Laboratory', 'Laboratory')
  createHomeDashboardLink({
    name: 'laboratory',
    title: 'Laboratory',
  }),
  options,
);

// Modals

export const pickupLabRequestModal = getAsyncLifecycle(
  () => import('./lab-tabs/modals/pickup-lab-request-modal.component'),
  options,
);

export const approvalLabResultsModal = getAsyncLifecycle(
  () => import('./lab-tabs/modals/approval-lab-results-modal.component'),
  options,
);

export const rejectLabRequestModal = getAsyncLifecycle(
  () => import('./lab-tabs/modals/reject-lab-request-modal.component'),
  options,
);

// Tables and tiles
// t('Tests ordered', 'Tests ordered')
export const allLabRequestsTable = getAsyncLifecycle(
  () => import('./lab-tabs/data-table-extensions/tests-ordered-table.extension'),
  options,
);

// t('In progress', 'In progress')
export const inprogressLabRequestsTable = getAsyncLifecycle(
  () => import('./lab-tabs/data-table-extensions/in-progress-lab-requests-table.extension'),
  options,
);

// t('Completed', 'Completed')
export const completedLabRequestsTable = getAsyncLifecycle(
  () => import('./lab-tabs/data-table-extensions/completed-lab-requests-table.extension'),
  options,
);

// t('Declined tests', 'Declined tests')
export const declinedLabRequestsTable = getAsyncLifecycle(
  () => import('./lab-tabs/data-table-extensions/declined-lab-requests-table-extension'),
  options,
);

// t('pending review tests', 'pending review tests')
export const pendingReviewLabRequestsTable = getAsyncLifecycle(
  () => import('./lab-tabs/data-table-extensions/pending-review-lab-request-table.extension'),
  options,
);

// t('Worklist', 'Worklist')
export const worklistTile = getAsyncLifecycle(
  () => import('./lab-tiles/in-progress-lab-requests-tile.component'),
  options,
);

// t('Pending review tests', 'Pending review tests')
export const pendingReviewListTile = getAsyncLifecycle(
  () => import('./lab-tiles/pending-review-lab-results-tile.component'),
  options,
);

// t("Referred tests", "Referred tests")
export const completedTile = getAsyncLifecycle(
  () => import('./lab-tiles/completed-lab-requests-tile.component'),
  options,
);

// t('Ordered tests', 'Ordered tests')
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

export const approveLabResultsAction = getAsyncLifecycle(
  () => import('./lab-tabs/actions/approve-lab-results-action.component'),
  options,
);

export const amendLabResultsAction = getAsyncLifecycle(
  () => import('./lab-tabs/actions/amend-lab-results-action.component'),
  options,
);

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}
