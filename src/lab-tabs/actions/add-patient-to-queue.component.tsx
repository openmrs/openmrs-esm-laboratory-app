import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./actions.scss";
import { showModal } from "@openmrs/esm-framework";
import { Button } from "@carbon/react";
import { AirlineManageGates } from "@carbon/react/icons";

interface AddPatientToQueueButtonProps {
  patientUuid: string;
}

const AddPatientToQueueButton: React.FC<AddPatientToQueueButtonProps> = ({
  patientUuid,
}) => {
  const { t } = useTranslation();

  const launchModal = () => {
    const dispose = showModal("add-patient-to-queue-entry-modal", {
      closeModal: () => dispose(),
      patientUuid,
    });
  };

  return (
    <Button
      kind="tertiary"
      className={styles.addPatientToQueue}
      onClick={launchModal}
      size="sm"
      renderIcon={() => <AirlineManageGates size={18} />}
    >
      {t("addToAQueue", "Add to a queue")}
    </Button>
  );
};

export default AddPatientToQueueButton;
