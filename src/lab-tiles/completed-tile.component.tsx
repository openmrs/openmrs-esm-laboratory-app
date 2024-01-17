import React from "react";
import CompletedList from "../completed-list/completed-list.component";
import styles from "../queue-list/laboratory-queue.scss";
import { useTranslation } from "react-i18next";
import SummaryTile from "../summary-tiles/summary-tile.component";
import { useLabTestsStats } from "../summary-tiles/laboratory-summary.resource";

const ReferredTileComponent = () => {
  const { t } = useTranslation();

  const { count: completedCount } = useLabTestsStats("COMPLETED");

  return (
    <SummaryTile
      label={t("completed", "Completed")}
      value={completedCount}
      headerLabel={t("results", "Results")}
    />
  );
};

export default ReferredTileComponent;
