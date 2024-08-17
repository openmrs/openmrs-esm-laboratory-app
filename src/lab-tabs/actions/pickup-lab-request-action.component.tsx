import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { OverflowMenuItem } from "@carbon/react";
import { showModal } from "@openmrs/esm-framework";
import { Order } from "@openmrs/esm-patient-common-lib";
import styles from "./actions.scss";

interface PickLabRequestActionMenuProps {
  order: Order;
}

const PickupLabRequestAction: React.FC<PickLabRequestActionMenuProps> = ({
  order,
}) => {
  const { t } = useTranslation();
  const unSupportedStatuses = ["IN_PROGRESS", "COMPLETED", "DECLINED"];

  const launchModal = useCallback(() => {
    const dispose = showModal("pickup-lab-request-modal", {
      closeModal: () => dispose(),
      order,
    });
  }, [order]);

  return (
    <OverflowMenuItem
      itemText={t("pickupLabRequest", "Pick up lab request")}
      onClick={launchModal}
      disabled={unSupportedStatuses.includes(order.fulfillerStatus)}
      className={styles.menuItem}
    />
  );
};

export default PickupLabRequestAction;
