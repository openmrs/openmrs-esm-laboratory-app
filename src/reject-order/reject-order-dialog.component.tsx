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
import styles from "./reject-order-dialog.scss";

interface RejectOrderDialogProps {
  order: string;
  closeModal: () => void;
}

const RejectOrderDialog: React.FC<RejectOrderDialogProps> = ({
  order,
  closeModal,
}) => {
  const { t } = useTranslation();
  const rejectOrder = async (event) => {
    event.preventDefault();
  };

  return (
    <div>
      <Form onSubmit={rejectOrder}>
        <ModalHeader
          closeModal={closeModal}
          title={t("rejectOrder", "Reject Order")}
        />
        <ModalBody>
          <div className={styles.modalBody}>
            <section className={styles.section}></section>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button kind="secondary" onClick={closeModal}>
            {t("cancel", "Cancel")}
          </Button>
          <Button kind="danger" type="submit">
            {t("rejectOrder", "Reject Order")}
          </Button>
        </ModalFooter>
      </Form>
    </div>
  );
};

export default RejectOrderDialog;
