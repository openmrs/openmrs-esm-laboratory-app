import { defineConfigSchema, getSyncLifecycle } from "@openmrs/esm-framework";
import { configSchema } from "./config-schema";
import { createHomeDashboardLink } from "./components/create-dashboard-link.component";
import rootComponent from "./root.component";
import laboratoryReferralWorkspaceComponent from "./patient-chart/laboratory-workspaces/laboratory-referral.workspace.component";
import laboratory from "./laboratory.component";
import laboratoryOrder from "./patient-chart/patient-laboratory-order-results.component";
import addToWorklist from "./tests-ordered/lab-dialogs/add-to-worklist-dialog.component";
import sendEmail from "./patient-chart/results-summary/send-email-dialog.component";
import reviewItemDialogComponent from "./review-list/dialog/review-item.component";
import rejectOrderDialogComponent from "./reject-order/reject-order-dialog.component";
import approvedTabComponent from "./lab-tabs/approved-tab.component";
import referredTestTabComponent from "./lab-tabs/referred-tab.component";
import worklistTabComponent from "./lab-tabs/work-list-tab.component";
import reveiwTabComponent from "./lab-tabs/review-tab.component";
import pickLabRequestButtonComponent from "./tests-ordered/pick-lab-request-menu.component";
import rejectOrderButtonComponent from "./order-actions/reject-order.component";
import worklistTile from "./lab-tiles/worklist-tile.component";
import referredTile from "./lab-tiles/referred-tile.component";
import completedTile from "./lab-tiles/completed-tile.component";
import testsOrdered from "./lab-tiles/tests-ordered-tile.component";
import rejectedTile from "./lab-tiles/rejected-tile.component";

import {
  createDashboardLink,
  registerWorkspace,
} from "@openmrs/esm-patient-common-lib";
import rejectedTabComponent from "./lab-tabs/rejected-tab.component";

const moduleName = "@ugandaemr/esm-laboratory-app";

const options = {
  featureName: "ugandaemr-esm-laboratory",
  moduleName,
};

export const importTranslation = require.context(
  "../translations",
  false,
  /.json$/,
  "lazy"
);

export const root = getSyncLifecycle(rootComponent, options);

export const laboratoryDashboardLink = getSyncLifecycle(
  createHomeDashboardLink({
    name: "laboratory",
    slot: "laboratory-dashboard-slot",
    title: "Laboratory",
  }),
  options
);

export const laboratoryComponent = getSyncLifecycle(laboratory, options);

// Patient chart
export const laboratoryOrderDashboardLink = getSyncLifecycle(
  createDashboardLink({
    path: "laboratory-orders",
    title: "Investigative Results",
    moduleName,
  }),
  options
);
export const laboratoryOrderComponent = getSyncLifecycle(
  laboratoryOrder,
  options
);

export const addToWorklistDialog = getSyncLifecycle(addToWorklist, options);

export const sendEmailDialog = getSyncLifecycle(sendEmail, options);

export const reviewItemDialog = getSyncLifecycle(
  reviewItemDialogComponent,
  options
);

export const rejectOrderDialog = getSyncLifecycle(
  rejectOrderDialogComponent,
  options
);

export const reviewComponent = getSyncLifecycle(reveiwTabComponent, options);

export const approvedComponent = getSyncLifecycle(
  approvedTabComponent,
  options
);

export const rejectedComponent = getSyncLifecycle(
  rejectedTabComponent,
  options
);

export const referredTestComponent = getSyncLifecycle(
  referredTestTabComponent,
  options
);

export const worklistComponent = getSyncLifecycle(
  worklistTabComponent,
  options
);

export const pickLabRequestButton = getSyncLifecycle(
  pickLabRequestButtonComponent,
  options
);

export const rejectOrderButton = getSyncLifecycle(
  rejectOrderButtonComponent,
  options
);

export const worklistTileComponent = getSyncLifecycle(worklistTile, options);

export const referredTileComponent = getSyncLifecycle(referredTile, options);

export const completedTileComponent = getSyncLifecycle(completedTile, options);

export const testOrderedTileComponent = getSyncLifecycle(testsOrdered, options);

export const rejectedTileComponent = getSyncLifecycle(rejectedTile, options);

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
  registerWorkspace({
    name: "patient-laboratory-referral-workspace",
    title: "Laboratory Referral Form",
    load: getSyncLifecycle(laboratoryReferralWorkspaceComponent, options),
  });
}
