import React, { useCallback } from "react";
import { OverflowMenuItem, OverflowMenu } from "@carbon/react";
import { useTranslation } from "react-i18next";
import { showModal } from "@openmrs/esm-framework";
import { Order } from "@openmrs/esm-patient-common-lib";

interface RejectLabRequestActionProps {
  order: Order;
}

const RejectLabRequestAction: React.FC<RejectLabRequestActionProps> = ({
  order,
}) => {
  const { t } = useTranslation();

  const launchRejectLabRequestModal = useCallback(() => {
    const dispose = showModal("reject-lab-request-modal", {
      closeModal: () => dispose(),
      order,
    });
  }, [order]);

  return (
    <OverflowMenuItem
      itemText={t("rejectLabRequest", "Reject Lab Request")}
      onClick={launchRejectLabRequestModal}
      style={{
        maxWidth: "100vw",
      }}
      isDelete={true}
      hasDivider
    />
  );
};

export default RejectLabRequestAction;
