import React from "react";
import {
  Button,
  ContentSwitcher,
  Form,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Switch,
  TextArea,
  Grid,
  Checkbox,
  TextInput,
  IconButton,
} from "@carbon/react";
import { useTranslation } from "react-i18next";

interface ReviewItemDialogProps {
  closeModal: () => void;
}

const ReviewItem: React.FC<ReviewItemDialogProps> = ({ closeModal }) => {
  const { t } = useTranslation();

  return (
    <div>
      <Form>
        <ModalHeader
          closeModal={closeModal}
          title={t("approveResult", "Approve Result")}
        />
        <ModalBody></ModalBody>
        <ModalFooter>
          <Button kind="secondary" onClick={closeModal}>
            {t("cancel", "Cancel")}
          </Button>
          <Button type="submit">{t("approveResult", "Approve Result")}</Button>
        </ModalFooter>
      </Form>
    </div>
  );
};
export default ReviewItem;
