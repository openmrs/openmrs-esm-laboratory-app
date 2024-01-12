import React from "react";
import CompletedList from "../../completed-list/completed-list.component";
import styles from "./lab-tabs.scss";

interface CompletedListComponentProps {
  name: string;
}

const CompletedListComponent: React.FC<CompletedListComponentProps> = () => {
  return (
    <div>
      <div className={styles.headerBtnContainer}></div>
      <CompletedList fulfillerStatus={"COMPLETED"} />
    </div>
  );
};

export default CompletedListComponent;
