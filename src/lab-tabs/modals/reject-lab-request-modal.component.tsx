import React, { useState } from "react";

import {
  Button,
  Form,
  ModalBody,
  ModalFooter,
  ModalHeader,
  TextArea,
  Layer,
} from "@carbon/react";
import { useTranslation } from "react-i18next";
import styles from "./reject-lab-request-modal.scss";
import {
  showNotification,
  showSnackbar,
  useAbortController,
} from "@openmrs/esm-framework";
import { Order } from "@openmrs/esm-patient-common-lib";
import { rejectLabOrder } from "../../laboratory-resource";

interface RejectLabRequestModalProps {
  order: Order;
  closeModal: () => void;
}

const RejectLabRequestModal: React.FC<RejectLabRequestModalProps> = ({
  order,
  closeModal,
}) => {
  const { t } = useTranslation();
  const [fulfillerComment, setFulfillerComment] = useState("");
  const abortController = useAbortController();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRejectOrder = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    rejectLabOrder(order.uuid, fulfillerComment, abortController).then(
      (resp) => {
        setIsSubmitting(false);
        closeModal();
        showSnackbar({
          isLowContrast: true,
          title: t("rejectLabRequestTitle", "Lab Request Rejected"),
          kind: "success",
          subtitle: t(
            "rejectLabRequestSuccessMessage",
            `You have successfully rejected a lab request with Order Number: ${order.orderNumber}.`
          ),
        });
      },
      (err) => {
        setIsSubmitting(false);
        showNotification({
          title: t(`errorRejectingRequest', 'Error Rejecting a lab request.`),
          kind: "error",
          critical: true,
          description: err?.message,
        });
      }
    );
  };

  return (
    <div>
      <Form onSubmit={handleRejectOrder}>
        <ModalHeader
          closeModal={closeModal}
          title={`${t("rejectLabRequest", "Reject Lab Request")} [${
            order.orderNumber
          }]`}
        />
        <ModalBody>
          <div className={styles.modalBody}>
            <Layer>
              <p className={styles.section}>
                {`${t("testType", "Test Type")}: ${order.concept.display}`}
              </p>
            </Layer>
            <br />
            <Layer>
              <TextArea
                labelText={t("fulfillerComment", "Fulfiller Comment")}
                id="commentField"
                maxCount={500}
                enableCounter
                onChange={(e) => setFulfillerComment(e.target.value)}
              />
            </Layer>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button kind="secondary" onClick={closeModal}>
            {t("cancel", "Cancel")}
          </Button>
          <Button kind="danger" type="submit" disabled={isSubmitting}>
            {t("reject", "Reject")}
          </Button>
        </ModalFooter>
      </Form>
    </div>
  );
};

export default RejectLabRequestModal;
