import { Button, Tooltip } from "@carbon/react";
import { Notification } from "@carbon/react/icons";

import { showModal } from "@openmrs/esm-framework";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { MappedPatientQueueEntry } from "./laboratory-patient-list.resource";
import { Encounter, Order } from "../types/patient-queues";

interface PickLabRequestActionMenuProps {
  order: Order;
  closeModal: () => void;
}

const PickLabRequestActionMenu: React.FC<PickLabRequestActionMenuProps> = ({
  order,
}) => {
  const { t } = useTranslation();

  const launchPickLabRequestQueueModal = useCallback(() => {
    const dispose = showModal("add-to-worklist-dialog", {
      closeModal: () => dispose(),

      order,
    });
  }, [order]);

  return (
    <Button
      kind="ghost"
      onClick={launchPickLabRequestQueueModal}
      iconDescription={t("pickRequest", "Pick Lab Request ")}
      renderIcon={(props) => <Notification size={16} {...props} />}
    />
  );
};

export default PickLabRequestActionMenu;
