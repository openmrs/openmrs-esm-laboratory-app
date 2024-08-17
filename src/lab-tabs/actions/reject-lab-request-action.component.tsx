import React, { useCallback } from "react";
import { OverflowMenuItem } from "@carbon/react";
import { useTranslation } from "react-i18next";
import { showModal } from "@openmrs/esm-framework";
import { Order } from "@openmrs/esm-patient-common-lib";
import styles from "./actions.scss";

interface RejectLabRequestActionProps {
  order: Order;
}

const RejectLabRequestAction: React.FC<RejectLabRequestActionProps> = ({
  order,
}) => {
  const { t } = useTranslation();
  const unSupportedStatuses = ["COMPLETED", "DECLINED"];
  const launchRejectLabRequestModal = useCallback(() => {
    const dispose = showModal("reject-lab-request-modal", {
      closeModal: () => dispose(),
      order,
    });
  }, [order]);

  return (
    <OverflowMenuItem
      className={styles.menuItem}
      disabled={unSupportedStatuses.includes(order.fulfillerStatus)}
      hasDivider
      isDelete
      itemText={t("rejectLabRequest", "Reject lab request")}
      onClick={launchRejectLabRequestModal}
    />
  );
};

export default RejectLabRequestAction;
