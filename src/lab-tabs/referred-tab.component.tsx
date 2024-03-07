import React from "react";
import { EmptyState } from "@openmrs/esm-patient-common-lib";

const ReferredComponent = () => {
  return (
    <div>
      <EmptyState
        displayText={"referred tests"}
        headerTitle={"Referred tests"}
      />
    </div>
  );
};

export default ReferredComponent;
