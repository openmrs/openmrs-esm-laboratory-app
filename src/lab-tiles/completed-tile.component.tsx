import React from "react";
import { useTranslation } from "react-i18next";
import SummaryTile from "../summary-tiles/summary-tile.component";
import { useLabTestsStats } from "../summary-tiles/laboratory-summary.resource";

const ReferredTileComponent = () => {
  const { t } = useTranslation();

  const { data } = useLabTestsStats("COMPLETED");

  return (
    <SummaryTile
      label={t("completed", "Completed")}
      value={data.length}
      headerLabel={t("results", "Results")}
    />
  );
};

export default ReferredTileComponent;
