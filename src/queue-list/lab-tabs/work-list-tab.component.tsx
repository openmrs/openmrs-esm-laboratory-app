import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import styles from "./lab-tabs.scss";
import WorkList from "../../work-list/work-list.component";

interface WorkListComponentProps {
  name: string;
}

const WorkListComponent: React.FC<WorkListComponentProps> = () => {
  const { t } = useTranslation();
  return (
    <div>
      <div className={styles.headerBtnContainer}></div>
      <WorkList fulfillerStatus={"IN_PROGRESS"} />
    </div>
  );
};

export default WorkListComponent;
