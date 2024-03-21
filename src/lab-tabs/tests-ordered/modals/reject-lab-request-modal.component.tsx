import React, { useState } from "react";

import {
  Button,
  Form,
  ModalBody,
  ModalFooter,
  ModalHeader,
  TextArea,
} from "@carbon/react";
import { useTranslation } from "react-i18next";
import styles from "./reject-lab-request-modal.scss";
import { showNotification, showSnackbar } from "@openmrs/esm-framework";
import { Order } from "@openmrs/esm-patient-common-lib";
import { rejectLabOrder } from "../../../laboratory-resource";

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

  const handleRejectOrder = async (event) => {
    event.preventDefault();

    rejectLabOrder(order.uuid, fulfillerComment).then(
      (resp) => {
        showSnackbar({
          isLowContrast: true,
          title: t("rejectLabRequestTitle", "Lab Request Rejected"),
          kind: "success",
          subtitle: t(
            "rejectLabRequestSuccessMessage",
            `You have successfully rejected a lab request with Order Number: ${order.orderNumber}.`
          ),
        });
        closeModal();
      },
      (err) => {
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
          title={t("rejectLabRequest", "Reject Lab Request")}
        />
        <ModalBody>
          <div className={styles.modalBody}>
            <section className={styles.section}>
              <h5 className={styles.section}>
                {/* What happens if the `accessionNumber` and `fulfillerStatus` are null? */}
                {order?.accessionNumber} &nbsp; · &nbsp;{order?.fulfillerStatus}{" "}
                &nbsp; · &nbsp;
                {order?.orderNumber}
                &nbsp;
              </h5>
            </section>
            <br />
            <section className={styles.section}>
              <TextArea
                labelText={t("fulfillerComment", "Fulfiller Comment")}
                id="commentField"
                maxCount={500}
                enableCounter
                onChange={(e) => setFulfillerComment(e.target.value)}
              />
            </section>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button kind="secondary" onClick={closeModal}>
            {t("cancel", "Cancel")}
          </Button>
          <Button kind="danger" type="submit">
            {t("reject", "Reject")}
          </Button>
        </ModalFooter>
      </Form>
    </div>
  );
};

export default RejectLabRequestModal;
