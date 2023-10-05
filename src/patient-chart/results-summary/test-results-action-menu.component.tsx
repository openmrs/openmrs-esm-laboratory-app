import { showModal, useSession } from "@openmrs/esm-framework";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Button, Tooltip } from "@carbon/react";
import { View } from "@carbon/react/icons";
import { launchPatientWorkspace } from "@openmrs/esm-patient-common-lib";

interface RescentTestResultActionMenuProps {
  closeModal: () => void;
}

const RescentTestResultActionMenu: React.FC<
  RescentTestResultActionMenuProps
> = () => {
  const { t } = useTranslation();

  return (
    <Tooltip align="bottom" label="Rescend Results">
      <Button
        kind="ghost"
        iconDescription={t("rescend", "Recend Tests ")}
        renderIcon={(props) => <View size={16} {...props} />}
      ></Button>
    </Tooltip>
  );
};

export default RescentTestResultActionMenu;
