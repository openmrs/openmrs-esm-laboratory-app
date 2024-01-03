import React, { useCallback } from "react";
import { OverflowMenuItem, OverflowMenu } from "@carbon/react";
import { useTranslation } from "react-i18next";
import { showModal } from "@openmrs/esm-framework";
import { Result } from "../work-list/work-list.resource";

interface RejectOrderOverflowMenuItemProps {
  order: Result;
}

const RejectOrderOverflowMenuItem: React.FC<
  RejectOrderOverflowMenuItemProps
> = ({ order }) => {
  const { t } = useTranslation();

  const handleRejectOrder = useCallback(() => {
    const dispose = showModal("reject-order-dialog", {
      closeModal: () => dispose(),
      order,
    });
  }, [order]);
  return (
    <OverflowMenuItem
      itemText={t("rejectOrder", "Reject Order")}
      onClick={handleRejectOrder}
      style={{
        maxWidth: "100vw",
      }}
      isDelete={true}
      hasDivider
    />
  );
};

export default RejectOrderOverflowMenuItem;
