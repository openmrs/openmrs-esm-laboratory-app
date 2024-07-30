import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./actions.scss";
import { showModal } from "@openmrs/esm-framework";
import { OverflowMenuItem } from "@carbon/react";

interface SendBackPatientActionProps {
  patientUuid: string;
}

const SendBackPatientAction: React.FC<SendBackPatientActionProps> = ({
  patientUuid,
}) => {
  const { t } = useTranslation();

  const launchModal = () => {
    const dispose = showModal("send-back-patient-to-queue-entry-modal", {
      closeModal: () => dispose(),
      patientUuid,
    });
  };

  return (
    <OverflowMenuItem
      itemText={t("addToQueue", "Add to queue")}
      onClick={launchModal}
      className={styles.menuItem}
    />
  );
};

export default SendBackPatientAction;
