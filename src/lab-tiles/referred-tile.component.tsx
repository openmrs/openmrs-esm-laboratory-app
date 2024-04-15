import React from "react";
import { useTranslation } from "react-i18next";
import SummaryTile from "../summary-tiles/summary-tile.component";
import { useLabTestsStats } from "../summary-tiles/laboratory-summary.resource";

const ReferredTileComponent = () => {
  const { t } = useTranslation();

  const { data } = useLabTestsStats("");

  const filteredData = data?.filter(
    (item) =>
      item?.fulfillerStatus === "IN_PROGRESS" &&
      item?.accessionNumber !== null &&
      item?.dateStopped === null &&
      item?.instructions === "REFER TO cphl"
  );

  return (
    <SummaryTile
      label={t("transferred", "Transferred")}
      value={filteredData.length}
      headerLabel={t("referredTests", "Ex-Referred tests")}
    />
  );
};

export default ReferredTileComponent;
