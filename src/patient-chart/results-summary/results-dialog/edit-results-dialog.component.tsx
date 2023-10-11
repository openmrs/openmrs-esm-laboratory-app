import {
  Button,
  Form,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@carbon/react";
import React from "react";
import { useTranslation } from "react-i18next";

interface EditResultsDialogProps {
  closeModal: () => void;
}

const EditResultsDialog: React.FC<EditResultsDialogProps> = ({
  closeModal,
}) => {
  const { t } = useTranslation();
  return (
    <>
      <Form>
        <ModalHeader></ModalHeader>
        <ModalBody></ModalBody>
        <ModalFooter>
          <Button kind="secondary" onClick={closeModal}>
            {t("cancel", "Cancel")}
          </Button>
          <Button type="submit">{t("editOrder", "Edit Order")}</Button>
        </ModalFooter>
      </Form>
    </>
  );
};

export default EditResultsDialog;
