import { Order } from "@openmrs/esm-patient-common-lib";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { setFulfillerStatus } from "../../laboratory-resource";
import {
  restBaseUrl,
  showNotification,
  showSnackbar,
  useAbortController,
  useConfig,
} from "@openmrs/esm-framework";
import { Button, ModalBody, ModalFooter, ModalHeader } from "@carbon/react";
import { mutate } from "swr";
import { Config } from "../../config-schema";

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
  const { laboratoryOrderTypeUuid } = useConfig<Config>();
  const abortController = useAbortController();

  const handlePickup = () => {
    setIsSubmitting(true);
    setFulfillerStatus(order.uuid, "IN_PROGRESS", abortController).then(
      () => {
        mutate(
          (key) =>
            typeof key === "string" &&
            key.startsWith(
              `${restBaseUrl}/order?orderTypes=${laboratoryOrderTypeUuid}`
            ),
          undefined,
          { revalidate: true }
        );
        setIsSubmitting(false);
        closeModal();
        showSnackbar({
          isLowContrast: true,
          title: t("pickedAnOrder", "Picked an order"),
          kind: "success",
          subtitle: t(
            "orderPickedSuccessfully",
            "You have successfully picked an order"
          ),
        });
      },
      (error) => {
        setIsSubmitting(false);
        showNotification({
          title: t(`errorPickingAnOrder', 'Error picking an order`),
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
