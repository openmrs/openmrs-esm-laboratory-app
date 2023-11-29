import React from "react";
import { useTranslation } from "react-i18next";
import { useLabTestsStats, useMetrics } from "./laboratory-summary.resource";
import SummaryTile from "./summary-tile.component";
import styles from "./laboratory-summary-tiles.scss";
import { useSession } from "@openmrs/esm-framework";
import { usePatientQueuesList } from "../queue-list/laboratory-patient-list.resource";

const LaboratorySummaryTiles: React.FC = () => {
  const { t } = useTranslation();

  const session = useSession();

  // get tests ordered
  const { count: testOrderedCount } = useLabTestsStats("");

  // get worklists
  const { count: worklistCount } = useLabTestsStats("IN_PROGRESS");

  // get refered lists

  // get approved
  const { count: completedCount } = useLabTestsStats("COMPLETED");

  return (
    <>
      <div className={styles.cardContainer}>
        <SummaryTile
          label={t("orders", "Orders")}
          value={testOrderedCount}
          headerLabel={t("testsOrdered", "Tests ordered")}
        />
        <SummaryTile
          label={t("inProgress", "In progress")}
          value={worklistCount}
          headerLabel={t("worklist", "Worklist")}
        />
        <SummaryTile
          label={t("transferred", "Transferred")}
          value={0}
          headerLabel={t("referredTests", "Referred tests")}
        />
        <SummaryTile
          label={t("completed", "Completed")}
          value={completedCount}
          headerLabel={t("results", "Results")}
        />
      </div>
    </>
  );
};

export default LaboratorySummaryTiles;
