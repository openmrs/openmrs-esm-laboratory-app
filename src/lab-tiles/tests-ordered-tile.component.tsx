import React from "react";
import { useTranslation } from "react-i18next";
import SummaryTile from "../summary-tiles/summary-tile.component";
import { useLabTestsStats } from "../summary-tiles/laboratory-summary.resource";

const ReferredTileComponent = () => {
  const { t } = useTranslation();

  const { data } = useLabTestsStats("");

  const count = data?.filter(
    (item) => item?.action === "NEW" && item?.dateStopped === null
  );

  return (
    <SummaryTile
      label={t("orders", "Orders")}
      value={count?.length}
      headerLabel={t("testsOrdered", "Tests ordered")}
    />
  );
};

export default ReferredTileComponent;
