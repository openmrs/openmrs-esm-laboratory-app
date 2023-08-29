import React from 'react';
import { LaboratoryHeader } from './header/laboratory-header.component';
import LaboratorySummaryTiles from './summary-tiles/laboratory-summary-tiles.component';
import LaboratoryQueueList from './queue-list/laboratory-queue.component';

const Laboratory: React.FC = () => {
  return (
    <div className={`omrs-main-content`}>
      <LaboratoryHeader />
      <LaboratorySummaryTiles />
      <LaboratoryQueueList />
    </div>
  );
};

export default Laboratory;
