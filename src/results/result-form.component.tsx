import React, { useMemo, useState } from "react";
import styles from "./result-form.scss";
import { Button, InlineLoading } from "@carbon/react";
import { useTranslation } from "react-i18next";
import { closeOverlay } from "../components/overlay/hook";
import { ExtensionSlot, usePatient } from "@openmrs/esm-framework";

interface ResultFormProps {
  patientUuid: string;
}
const ResultForm: React.FC<ResultFormProps> = ({ patientUuid }) => {
  const { t } = useTranslation();

  const { patient, isLoading } = usePatient(patientUuid);

  // whether or not the form is valid and ready to submit
  const [isValid, setIsValid] = useState(false);

  // to prevent duplicate submits
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bannerState = useMemo(() => {
    if (patient) {
      return {
        patient,
        patientUuid,
        hideActionsOverflow: true,
      };
    }
  }, [patient, patientUuid]);

  return (
    <>
      <div className="">
        {isLoading && (
          <InlineLoading
            className={styles.bannerLoading}
            iconDescription="Loading"
            description="Loading banner"
            status="active"
          />
        )}
        {patient && (
          <ExtensionSlot name="patient-header-slot" state={bannerState} />
        )}
        <section className={styles.section}></section>
        <section className={styles.section}>
          <Button
            disabled={isSubmitting}
            onClick={() => closeOverlay()}
            kind="secondary"
          >
            {t("cancel", "Cancel")}
          </Button>
          <Button disabled={!isValid || isSubmitting}>Save tests</Button>
        </section>
      </div>
    </>
  );
};

export default ResultForm;
