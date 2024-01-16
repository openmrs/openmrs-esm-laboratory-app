import React from "react";
import { EmptyState } from "@openmrs/esm-patient-common-lib";
import styles from "../queue-list/laboratory-queue.scss";

const ReferredComponent = () => {
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

export default ReferredComponent;
