import React from "react";
import WorkList from "../work-list/work-list.component";
import styles from "../queue-list/laboratory-queue.scss";

const WorkListComponent = () => {
  return (
    <div>
      <WorkList fulfillerStatus={"IN_PROGRESS"} />
    </div>
  );
};

export default WorkListComponent;
