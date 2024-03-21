import { Order } from "@openmrs/esm-patient-common-lib";
import React from "react";
import { Button } from "@carbon/react";
import { Microscope } from "@carbon/react/icons";
import { launchOverlay } from "../../../components/overlay/hook";
import ResultForm from "../../../results/result-form.component";
import { useTranslation } from "react-i18next";

interface AddLabRequestResultsActionProps {
  order: Order;
  patientUuid: string;
}
const AddLabRequestResultsAction: React.FC<AddLabRequestResultsActionProps> = ({
  order,
  patientUuid,
}) => {
  const { t } = useTranslation();

  return (
    <Button
      kind="ghost"
      onClick={() => {
        launchOverlay(
          t("labResultsForm", "Lab Results Form"),
          // TODO: Remove the cast to any when order type is fixed in Result form
          <ResultForm patientUuid={patientUuid} order={order as any} />
        );
      }}
      renderIcon={(props) => <Microscope size={16} {...props} />}
    />
  );
};

export default AddLabRequestResultsAction;
