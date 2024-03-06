import {
  getAsyncLifecycle,
  defineConfigSchema,
  getSyncLifecycle,
} from "@openmrs/esm-framework";
import { configSchema } from "./config-schema";
import { createHomeDashboardLink } from "./components/create-dashboard-link.component";

import laboratoryReferralWorkspaceComponent from "./patient-chart/laboratory-workspaces/laboratory-referral.workspace.component";

import {
  createDashboardLink,
  registerWorkspace,
} from "@openmrs/esm-patient-common-lib";

const moduleName = "@openmrs/esm-laboratory-app";

const options = {
  featureName: "openmrs-esm-laboratory",
  moduleName,
};

export const importTranslation = require.context(
  "../translations",
  false,
  /.json$/,
  "lazy"
);

export const root = getAsyncLifecycle(
  () => import("./root.component"),
  options
);

export const laboratoryDashboardLink = getSyncLifecycle(
  createHomeDashboardLink({
    name: "laboratory",
    slot: "laboratory-dashboard-slot",
    title: "Laboratory",
  }),
  options
);

export const laboratoryComponent = getAsyncLifecycle(
  () => import("./laboratory.component"),
  options
);

// Patient chart
export const laboratoryOrderDashboardLink = getSyncLifecycle(
  createDashboardLink({
    path: "laboratory-orders",
    title: "Investigative Results",
    moduleName,
  }),
  options
);
export const laboratoryOrderComponent = getAsyncLifecycle(
  () => import("./patient-chart/patient-laboratory-order-results.component"),
  options
);

export const addToWorklistDialog = getAsyncLifecycle(
  () => import("./queue-list/lab-dialogs/add-to-worklist-dialog.component"),
  options
);

export const sendEmailDialog = getAsyncLifecycle(
  () => import("./patient-chart/results-summary/send-email-dialog.component"),
  options
);

export const resultsSummaryWorkSpace = getAsyncLifecycle(
  () => import("./patient-chart/results-summary/results-summary.component"),
  options
);

export const editResultsDialog = getAsyncLifecycle(
  () =>
    import(
      "./patient-chart/results-summary/results-dialog/edit-results-dialog.component"
    ),
  options
);

export const reviewItemDialog = getAsyncLifecycle(
  () => import("./review-list/dialog/review-item.component"),
  options
);

export const rejectOrderDialog = getAsyncLifecycle(
  () => import("./reject-order/reject-order-dialog.component"),
  options
);

export const reviewComponent = getAsyncLifecycle(
  () => import("./lab-tabs/review-tab.component"),
  options
);

export const approvedComponent = getAsyncLifecycle(
  () => import("./lab-tabs/approved-tab.component"),
  options
);

export const referredTestComponent = getAsyncLifecycle(
  () => import("./lab-tabs/referred-tab.component"),
  options
);

export const worklistComponent = getAsyncLifecycle(
  () => import("./lab-tabs/work-list-tab.component"),
  options
);

export const pickLabRequestButton = getAsyncLifecycle(
  () => import("./queue-list/pick-lab-request-menu.component"),
  options
);

export const rejectOrderButton = getAsyncLifecycle(
  () => import("./order-actions/reject-order.component"),
  options
);

export const worklistTileComponent = getAsyncLifecycle(
  () => import("./lab-tiles/worklist-tile.component"),
  options
);

export const referredTileComponent = getAsyncLifecycle(
  () => import("./lab-tiles/referred-tile.component"),
  options
);

export const completedTileComponent = getAsyncLifecycle(
  () => import("./lab-tiles/completed-tile.component"),
  options
);

export const testOrderedTileComponent = getAsyncLifecycle(
  () => import("./lab-tiles/tests-ordered-tile.component"),
  options
);

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
  registerWorkspace({
    name: "patient-laboratory-referral-workspace",
    title: "Laboratory Referral Form",
    load: getSyncLifecycle(laboratoryReferralWorkspaceComponent, options),
  });
}
