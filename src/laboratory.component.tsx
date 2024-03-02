import React from "react";
import { LaboratoryHeader } from "./header/laboratory-header.component";
import LaboratorySummaryTiles from "./summary-tiles/laboratory-summary-tiles.component";
import LaboratoryOrdersList from "./tests-ordered/laboratory-tabs.component";
import Overlay from "./components/overlay/overlay.component";

const Laboratory: React.FC = () => {
  return (
    <div className={`omrs-main-content`}>
      <LaboratoryHeader />
      <LaboratorySummaryTiles />
      <LaboratoryOrdersList />
      <Overlay />
    </div>
  );
};

export default Laboratory;
