import { OverflowMenuItem, InlineLoading } from "@carbon/react";
import { showModal } from "@openmrs/esm-framework";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Order } from "../types/patient-queues";
import { useBillStatus } from "../bills/bill.resource";

interface PickLabRequestActionMenuProps {
  order: Order;
  closeModal: () => void;
}

const PickLabRequestActionMenu: React.FC<PickLabRequestActionMenuProps> = ({
  order,
}) => {
  const { t } = useTranslation();
  const { isLoading, shouldPayBill } = useBillStatus(
    order.uuid,
    order.patient.uuid
  );

  const launchPickLabRequestModal = useCallback(() => {
    const dispose = showModal("add-to-worklist-dialog", {
      closeModal: () => dispose(),

      order,
    });
  }, [order]);

  const overflowMenuItemLabel = shouldPayBill
    ? t("pendingBill", "Pending bill")
    : t("pickLabRequest", "Pick Lab Request");

  if (isLoading) {
    return (
      <InlineLoading
        status="active"
        iconDescription="Loading"
        description="Loading data..."
      />
    );
  }

  return (
    <OverflowMenuItem
      itemText={overflowMenuItemLabel}
      onClick={launchPickLabRequestModal}
      style={{
        maxWidth: "100vw",
      }}
      disabled={shouldPayBill}
    />
  );
};

export default PickLabRequestActionMenu;
