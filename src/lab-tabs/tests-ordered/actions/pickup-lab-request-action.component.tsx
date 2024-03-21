import { OverflowMenuItem } from "@carbon/react";
import { showModal } from "@openmrs/esm-framework";
import { Order } from "@openmrs/esm-patient-common-lib";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";

interface PickLabRequestActionMenuProps {
  order: Order;
}

const PickupLabRequestAction: React.FC<PickLabRequestActionMenuProps> = ({
  order,
}) => {
  const { t } = useTranslation();

  const launchModal = useCallback(() => {
    const dispose = showModal("pickup-lab-request-modal", {
      closeModal: () => dispose(),
      order,
    });
  }, [order]);

  return (
    <OverflowMenuItem
      itemText={t("pickupLabRequest", "Pickup Lab Request")}
      onClick={launchModal}
      style={{
        maxWidth: "100vw",
      }}
    />
  );
};

export default PickupLabRequestAction;
