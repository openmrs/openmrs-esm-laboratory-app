import { showModal, useSession } from "@openmrs/esm-framework";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Button, Tooltip } from "@carbon/react";
import { TrashCan } from "@carbon/react/icons";

interface RescendTestResultActionMenuProps {
  closeModal: () => void;
}

const DeleteTestResultActionMenu: React.FC<
  RescendTestResultActionMenuProps
> = () => {
  const { t } = useTranslation();

  return (
    <Tooltip align="bottom" label="Delete Results">
      <Button
        kind="ghost"
        iconDescription={t("delete", "Delete Test ")}
        renderIcon={(props) => <TrashCan size={16} {...props} />}
      ></Button>
    </Tooltip>
  );
};

export default DeleteTestResultActionMenu;
