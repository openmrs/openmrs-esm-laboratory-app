import { showModal } from "@openmrs/esm-framework";
import { Order } from "@openmrs/esm-patient-common-lib";
import React, { useCallback } from "react";
import { Button } from "@carbon/react";
import { TrashCan } from "@carbon/react/icons";

interface RejectLabRequestActionProps {
  order: Order;
}
const RejectLabRequestAction: React.FC<RejectLabRequestActionProps> = ({
  order,
}) => {
  const launchRejectOrderModal = useCallback(() => {
    const dispose = showModal("reject-lab-request-modal", {
      closeModal: () => dispose(),
      order,
    });
  }, [order]);
  return (
    <Button
      kind="ghost"
      onClick={launchRejectOrderModal}
      renderIcon={(props) => <TrashCan size={16} {...props} />}
    />
  );
};

export default RejectLabRequestAction;
