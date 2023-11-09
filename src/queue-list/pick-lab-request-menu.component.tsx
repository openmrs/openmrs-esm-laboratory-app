import { Button, Tooltip } from "@carbon/react";
import { Notification } from "@carbon/react/icons";

import { showModal } from "@openmrs/esm-framework";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { MappedPatientQueueEntry } from "./laboratory-patient-list.resource";
import { Encounter, Order } from "../types/patient-queues";

interface PickLabRequestActionMenuProps {
  encounter: Encounter;
  order: Order;
  closeModal: () => void;
}

const PickLabRequestActionMenu: React.FC<PickLabRequestActionMenuProps> = ({
  encounter,
  order,
}) => {
  const { t } = useTranslation();

  const launchPickLabRequestQueueModal = useCallback(() => {
    const dispose = showModal("add-to-worklist-dialog", {
      closeModal: () => dispose(),
      encounter,
      order,
    });
  }, [encounter, order]);

  return (
    <Tooltip align="top" label="Pick Lab Request">
      <Button
        kind="ghost"
        onClick={launchPickLabRequestQueueModal}
        iconDescription={t("pickRequest", "Pick Lab Request ")}
        renderIcon={(props) => <Notification size={16} {...props} />}
      ></Button>
    </Tooltip>
  );
};

export default PickLabRequestActionMenu;
