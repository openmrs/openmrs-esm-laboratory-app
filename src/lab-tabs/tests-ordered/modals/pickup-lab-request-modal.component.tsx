import { Order } from "@openmrs/esm-patient-common-lib";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { setFulfillerStatus, useLabOrders } from "../../../laboratory-resource";
import { showNotification, showSnackbar } from "@openmrs/esm-framework";
import { Button, ModalBody, ModalFooter, ModalHeader } from "@carbon/react";

interface PickupLabRequestModal {
  closeModal: () => void;
  order: Order;
}

const PickupLabRequestModal: React.FC<PickupLabRequestModal> = ({
  order,
  closeModal,
}) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate } = useLabOrders();

  const handlePickup = () => {
    setIsSubmitting(true);
    setFulfillerStatus(order.uuid, "IN_PROGRESS").then(
      () => {
        mutate();
        setIsSubmitting(false);
        closeModal();
        showSnackbar({
          isLowContrast: true,
          title: t("pickedAnOrder", "Picked an order"),
          kind: "success",
          subtitle: t(
            "pickSuccessfully",
            "You have successfully picked an Order"
          ),
        });
      },
      (error) => {
        setIsSubmitting(false);
        showNotification({
          title: t(`errorPicking an order', 'Error Picking an Order`),
          kind: "error",
          critical: true,
          description: error?.message,
        });
      }
    );
  };

  return (
    <div>
      <ModalHeader
        closeModal={closeModal}
        title={t("pickRequest", "Pick Lab Request")}
      />
      <ModalBody>
        <p>
          {t(
            "pickRequestConfirmationText",
            'Continuing will update the request status to "In Progress" and advance it to the next stage. Are you sure you want to proceed?'
          )}
        </p>
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={closeModal}>
          {t("discard", "Discard")}
        </Button>
        <Button type="submit" onClick={handlePickup} disabled={isSubmitting}>
          {t("pickupLabRequest", "Pickup Lab Request")}
        </Button>
      </ModalFooter>
    </div>
  );
};

export default PickupLabRequestModal;
