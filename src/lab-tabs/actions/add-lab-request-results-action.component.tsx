import React from "react";
import { useTranslation } from "react-i18next";
import { OverflowMenuItem } from "@carbon/react";
import { Order } from "@openmrs/esm-patient-common-lib";
import { launchOverlay } from "../../components/overlay/store";
import ResultForm from "../../results/result-form.component";
import styles from "./actions.scss";

interface AddLabRequestResultsActionProps {
  order: Order;
}
const AddLabRequestResultsAction: React.FC<AddLabRequestResultsActionProps> = ({
  order,
}) => {
  const { t } = useTranslation();

  return (
    <OverflowMenuItem
      itemText={t("labResultsForm", "Lab results form")}
      onClick={() => {
        launchOverlay(
          t("labResultsForm", "Lab results form"),
          <ResultForm patientUuid={order.patient.uuid} order={order} />
        );
      }}
      className={styles.menuItem}
    />
  );
};

export default AddLabRequestResultsAction;
