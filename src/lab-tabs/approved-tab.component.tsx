import React from "react";
import CompletedList from "../completed-list/completed-list.component";
import styles from "../queue-list/laboratory-queue.scss";

const ApprovedComponent = () => {
  return (
    <div>
      <CompletedList fulfillerStatus={"COMPLETED"} />
    </div>
  );
};

export default ApprovedComponent;
