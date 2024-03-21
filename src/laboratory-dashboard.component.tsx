import React from "react";
import { LaboratoryHeader } from "./header/laboratory-header.component";
import Overlay from "./components/overlay/overlay.component";
import LaboratoryOrdersTabs from "./lab-tabs/laboratory-tabs.component";
import LaboratorySummaryTiles from "./lab-tiles/laboratory-summary-tiles.component";

const LaboratoryDashboard: React.FC = () => {
  return (
    <div className={`omrs-main-content`}>
      <LaboratoryHeader />
      <LaboratorySummaryTiles />
      <LaboratoryOrdersTabs />
      <Overlay />
    </div>
  );
};

export default LaboratoryDashboard;
