import {
  getAsyncLifecycle,
  defineConfigSchema,
  getSyncLifecycle,
} from "@openmrs/esm-framework";
import { configSchema } from "./config-schema";
import { createHomeDashboardLink } from "./components/create-dashboard-link.component";
import { createDashboardLink } from "@openmrs/esm-patient-common-lib";
import Root from "./root.component";
import LaboratoryOrder from "./patient-chart/laboratory-order.component";
import AddToWorklistDialog from "./queue-list/lab-dialogs/add-to-worklist-dialog.component";
import SendEmailDialog from "./patient-chart/results-summary/send-email-dialog.component";
import ResultsSummary from "./patient-chart/results-summary/results-summary.component";
import EditResultsDialog from "./patient-chart/results-summary/results-dialog/edit-results-dialog.component";
import ReviewItem from "./review-list/dialog/review-item.component";
import RejectOrderDialog from "./reject-order/reject-order-dialog.component";
import ReviewComponent from "./lab-tabs/review-tab.component";
import ApprovedComponent from "./lab-tabs/approved-tab.component";
import ReferredComponent from "./lab-tabs/referred-tab.component";
import WorkListComponent from "./lab-tabs/work-list-tab.component";
import PickLabRequestActionMenu from "./order-actions/pick-lab-request-menu.component";
import RejectOrderOverflowMenuItem from "./order-actions/reject-order-menu.component";
import WorklistTile from "./lab-tiles/worklist-tile.component";
import ReferredTile from "./lab-tiles/referred-tile.component";
import CompletedTile from "./lab-tiles/completed-tile.component";
import TestOrderedTile from "./lab-tiles/tests-ordered-tile.component";
import Laboratory from "./laboratory.component";

const moduleName = "@openmrs/esm-laboratory-app";

const options = {
  featureName: "laboratory",
  moduleName,
};

export const importTranslation = require.context(
  "../translations",
  false,
  /.json$/,
  "lazy"
);

export const root = getSyncLifecycle(Root, options);

export const laboratoryDashboardLink = getSyncLifecycle(
  createHomeDashboardLink({
    name: "laboratory",
    slot: "laboratory-dashboard-slot",
    title: "Laboratory",
  }),
  options
);

export const laboratoryComponent = getSyncLifecycle(Laboratory, options);

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
  LaboratoryOrder,
  options
);

export const addToWorklistDialog = getSyncLifecycle(
  AddToWorklistDialog,
  options
);

export const sendEmailDialog = getSyncLifecycle(SendEmailDialog, options);

export const resultsSummaryWorkSpace = getSyncLifecycle(
  ResultsSummary,
  options
);

export const editResultsDialog = getSyncLifecycle(EditResultsDialog, options);

export const reviewItemDialog = getSyncLifecycle(ReviewItem, options);

export const rejectOrderDialog = getSyncLifecycle(RejectOrderDialog, options);

export const reviewComponent = getSyncLifecycle(ReviewComponent, options);

export const approvedComponent = getSyncLifecycle(ApprovedComponent, options);

export const referredTestComponent = getSyncLifecycle(
  ReferredComponent,
  options
);

export const worklistComponent = getSyncLifecycle(WorkListComponent, options);

export const pickLabRequestButton = getSyncLifecycle(
  PickLabRequestActionMenu,
  options
);

export const rejectOrderButton = getSyncLifecycle(
  RejectOrderOverflowMenuItem,
  options
);

export const worklistTile = getSyncLifecycle(WorklistTile, options);

export const referredTile = getSyncLifecycle(ReferredTile, options);

export const completedTile = getSyncLifecycle(CompletedTile, options);

export const testOrderedTile = getSyncLifecycle(TestOrderedTile, options);

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}
