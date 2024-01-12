import React from "react";
import { EmptyState } from "@openmrs/esm-patient-common-lib";
import styles from "./lab-tabs.scss";

interface ReferredTestsComponent {
  name: string;
}

const ReferredTestsComponent: React.FC<ReferredTestsComponent> = () => {
  return (
    <div>
      <div className={styles.headerBtnContainer}></div>
      <EmptyState
        displayText={"referred tests"}
        headerTitle={"Referred tests"}
      />
    </div>
  );
};

export default ReferredTestsComponent;
