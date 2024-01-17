import React, { useMemo } from "react";
import styles from "./result-form.scss";
import { Button, InlineLoading, ModalBody, ModalFooter } from "@carbon/react";
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
import { useForm } from "react-hook-form";

interface ResultFormProps {
  patientUuid: string;
  order: Result;
}

const ResultForm: React.FC<ResultFormProps> = ({ order, patientUuid }) => {
  const { t } = useTranslation();
  const {
    control,
    register,
    formState: { isSubmitting, errors },
    getValues,
    handleSubmit,
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
    return <div>Loading test details</div>;
  }

  const onSubmit = (data, e) => {
    e.preventDefault();
    // assign result to test order
    const documentedValues = getValues();
    let obsValue = [];

    if (concept.set && concept.setMembers.length > 0) {
      let groupMembers = [];
      concept.setMembers.forEach((member) => {
        let value;
        if (
          member.datatype.display === "Numeric" ||
          member.datatype.display === "Text"
        ) {
          value = getValues()[`${member.uuid}`];
        } else if (member.datatype.display === "Coded") {
          value = {
            uuid: getValues()[`${member.uuid}`],
          };
        }
        const groupMember = {
          concept: { uuid: member.uuid },
          value: value,
          status: "FINAL",
          order: { uuid: order.uuid },
        };
        groupMembers.push(groupMember);
      });

      obsValue.push({
        concept: { uuid: order.concept.uuid },
        status: "FINAL",
        order: { uuid: order.uuid },
        groupMembers: groupMembers,
      });
    } else if (!concept.set && concept.setMembers.length === 0) {
      let value;
      if (
        concept.datatype.display === "Numeric" ||
        concept.datatype.display === "Text"
      ) {
        value = getValues()[`${concept.uuid}`];
      } else if (concept.datatype.display === "Coded") {
        value = {
          uuid: getValues()[`${concept.uuid}`],
        };
      }

      obsValue.push({
        concept: { uuid: order.concept.uuid },
        status: "FINAL",
        order: { uuid: order.uuid },
        value: value,
      });
    }

    const obsPayload = {
      obs: obsValue,
    };

    const orderDiscontinuationPayload = {
      previousOrder: order.uuid,
      type: "testorder",
      action: "DISCONTINUE",
      careSetting: order.careSetting.uuid,
      encounter: order.encounter.uuid,
      patient: order.patient.uuid,
      concept: order.concept.uuid,
      orderer: order.orderer,
    };

    UpdateOrderResult(
      order.encounter.uuid,
      obsPayload,
      orderDiscontinuationPayload
    ).then(
      () => {
        showToast({
          critical: true,
          title: t("updateEncounter", "Update lab results"),
          kind: "success",
          description: t(
            "generateSuccessfully",
            "You have successfully updated test results"
          ),
        });
        closeOverlay();
      },
      (err) => {
        showNotification({
          title: t(
            `errorUpdatingEncounter', 'Error occurred while updating test results`
          ),
          kind: "error",
          critical: true,
          description: err?.message,
        });
      }
    );
  };
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
          {/* // we need to display test name for test panels */}
          {concept.setMembers.length > 0 && <div>{concept.display}</div>}
          {concept && (
            <section className={styles.section}>
              <form>
                <ResultFormField
                  register={register}
                  concept={concept}
                  control={control}
                  errors={errors}
                />
              </form>
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
          <Button onClick={handleSubmit(onSubmit)}>Save test results</Button>
        </ModalFooter>
      </div>
    </>
  );
};

export default ResultForm;
