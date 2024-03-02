import React from "react";
import CompletedList from "../completed-list/completed-list.component";

const ApprovedComponent = () => {
  return (
    <div>
      <CompletedList fulfillerStatus={"COMPLETED"} />
    </div>
  );
};

export default ApprovedComponent;
