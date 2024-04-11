import React from "react";
import { EmptyState } from "@openmrs/esm-patient-common-lib";
import ReferredOrdersList from "../referred-orders/referred-orders.component";

const ReferredComponent = () => {
  return (
    <div>
      <ReferredOrdersList />
    </div>
  );
};

export default ReferredComponent;
