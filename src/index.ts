import {
  getAsyncLifecycle,
  defineConfigSchema,
  getSyncLifecycle,
} from "@openmrs/esm-framework";
import { configSchema } from "./config-schema";
import { createHomeDashboardLink } from "./components/create-dashboard-link.component";
import { createDashboardLink } from "@openmrs/esm-patient-common-lib";

const moduleName = "@ugandaemr/esm-laboratory-app";

const options = {
  featureName: "ugandaemr-laboratory",
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
  () => import("./patient-chart/laboratory-order.component"),
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

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}
