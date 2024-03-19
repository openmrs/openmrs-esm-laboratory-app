import { OverflowMenuItem } from "@carbon/react";
import { showModal } from "@openmrs/esm-framework";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Order } from "../types/patient-queues";

interface PickLabRequestActionMenuProps {
  order: Order;
  closeModal: () => void;
}

const PickLabRequestActionMenu: React.FC<PickLabRequestActionMenuProps> = ({
  order,
}) => {
  const { t } = useTranslation();

  const launchPickLabRequestModal = useCallback(() => {
    const dispose = showModal("add-to-worklist-dialog", {
      closeModal: () => dispose(),
      order,
    });
  }, [order]);

  return (
    <OverflowMenuItem
      itemText={t("pickLabRequest", "Pick Lab Request")}
      onClick={launchPickLabRequestModal}
      style={{
        maxWidth: "100vw",
      }}
    />
  );
};

export default PickLabRequestActionMenu;
