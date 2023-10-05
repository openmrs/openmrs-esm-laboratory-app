import { showModal, useSession } from "@openmrs/esm-framework";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Button, Tooltip } from "@carbon/react";
import { ArrowRight } from "@carbon/react/icons";

interface RescendTestResultActionMenuProps {
  closeModal: () => void;
}

const RescendTestResultActionMenu: React.FC<
  RescendTestResultActionMenuProps
> = () => {
  const { t } = useTranslation();

  return (
    <Tooltip align="bottom" label="Rescend Results">
      <Button
        kind="ghost"
        iconDescription={t("rescend", "Rescend Tests ")}
        renderIcon={(props) => <ArrowRight size={16} {...props} />}
      ></Button>
    </Tooltip>
  );
};

export default RescendTestResultActionMenu;
