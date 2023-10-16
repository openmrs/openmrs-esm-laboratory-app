import {
  Button,
  Form,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@carbon/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { EncounterResponse } from "../../laboratory-item/view-laboratory-item.resource";

interface EditResultsDialogProps {
  encounterResponse: EncounterResponse;
  closeModal: () => void;
}

const EditResultsDialog: React.FC<EditResultsDialogProps> = ({
  encounterResponse,
  closeModal,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Form>
        <ModalHeader
          closeModal={closeModal}
          title={t("editOrder", "Edit Order")}
        />
        <ModalBody>
          <>
            <span>{encounterResponse?.display}</span>
          </>
        </ModalBody>
        <ModalFooter>
          <Button kind="secondary" onClick={closeModal}>
            {t("cancel", "Cancel")}
          </Button>
          <Button type="submit">{t("editOrder", "Submit")}</Button>
        </ModalFooter>
      </Form>
    </>
  );
};

export default EditResultsDialog;
