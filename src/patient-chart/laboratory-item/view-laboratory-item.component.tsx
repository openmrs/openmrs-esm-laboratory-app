import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Button, Tooltip } from "@carbon/react";
import { View } from "@carbon/react/icons";
import { launchPatientWorkspace } from "@openmrs/esm-patient-common-lib";

interface ViewLaboratoryItemActionMenuProps {
  closeModal: () => void;
  encounterUuid: string;
}

const ViewLaboratoryItemActionMenu: React.FC<
  ViewLaboratoryItemActionMenuProps
> = ({ encounterUuid }) => {
  const { t } = useTranslation();

  const handleClick = useCallback(
    () =>
      launchPatientWorkspace("results-summary", {
        workspaceTitle: `Results Summary Form`,
        encounterUuid,
      }),
    [encounterUuid]
  );

  return (
    <Tooltip align="bottom" label="View Results">
      <Button
        kind="ghost"
        onClick={handleClick}
        iconDescription={t("viewResults", "View Results ")}
        renderIcon={(props) => <View size={16} {...props} />}
      ></Button>
    </Tooltip>
  );
};

export default ViewLaboratoryItemActionMenu;
