import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Button, Tooltip } from "@carbon/react";
import { View } from "@carbon/react/icons";
import { launchPatientWorkspace } from "@openmrs/esm-patient-common-lib";
import { EncounterResponse } from "./view-laboratory-item.resource";

interface ViewLaboratoryItemActionMenuProps {
  closeModal: () => void;
  encounter: EncounterResponse;
}

const ViewLaboratoryItemActionMenu: React.FC<
  ViewLaboratoryItemActionMenuProps
> = ({ encounter }) => {
  const { t } = useTranslation();

  const handleClick = useCallback(
    () =>
      launchPatientWorkspace("results-summary", {
        workspaceTitle: `Results Summary Form`,
        encounter,
      }),
    [encounter]
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
