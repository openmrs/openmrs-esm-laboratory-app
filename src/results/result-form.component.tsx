import React, { useMemo, useState, createContext } from "react";
import styles from "./result-form.scss";
import {
  Button,
  InlineLoading,
  ModalBody,
  ModalFooter,
  TextInput,
  Select,
  SelectItem,
} from "@carbon/react";
import { useTranslation } from "react-i18next";
import { closeOverlay } from "../components/overlay/hook";
import {
  ExtensionSlot,
  showNotification,
  showToast,
  usePatient,
} from "@openmrs/esm-framework";
import {
  useGetOrderConceptByUuid,
  UpdateOrderResult,
} from "./result-form.resource";
import { Result } from "../work-list/work-list.resource";
import ResultFormField from "./result-form-field.component";
import { Controller, useForm } from "react-hook-form";

interface ResultFormProps {
  patientUuid: string;
  order: Result;
}

const ResultForm: React.FC<ResultFormProps> = ({ order, patientUuid }) => {
  const { t } = useTranslation();
  const {
    control,
    register,
    formState: { isSubmitting },
    getValues,
  } = useForm<{ testResult: string }>({
    defaultValues: {},
  });

  const { patient, isLoading } = usePatient(patientUuid);
  const { concept, isLoading: isLoadingConcepts } = useGetOrderConceptByUuid(
    order.concept.uuid
  );
  const bannerState = useMemo(() => {
    if (patient) {
      return {
        patient,
        patientUuid,
        hideActionsOverflow: true,
      };
    }
  }, [patient, patientUuid]);

  if (isLoadingConcepts) {
    return <div>Loading concepts</div>;
  }

  return (
    <>
      <div className="">
        <ModalBody>
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

          {concept && (
            <section className={styles.section}>
              <ResultFormField
                register={register}
                concept={concept}
                control={control}
              />
            </section>
          )}
        </ModalBody>

        <ModalFooter>
          <Button
            disabled={isSubmitting}
            onClick={() => closeOverlay()}
            kind="secondary"
          >
            {t("cancel", "Cancel")}
          </Button>
          <Button onClick={(e) => {}}>Save tests</Button>
        </ModalFooter>
      </div>
    </>
  );
};

export default ResultForm;
