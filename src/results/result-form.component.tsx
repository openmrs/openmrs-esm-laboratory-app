import React, { useMemo, useState } from "react";
import { mutate } from "swr";
import {
  Button,
  ButtonSet,
  Form,
  InlineLoading,
  InlineNotification,
  Stack,
} from "@carbon/react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { Order } from "@openmrs/esm-patient-common-lib";
import {
  ExtensionSlot,
  restBaseUrl,
  showNotification,
  showSnackbar,
  useConfig,
  useLayoutType,
  usePatient,
  useSession,
} from "@openmrs/esm-framework";
import {
  useGetOrderConceptByUuid,
  updateOrderResult,
} from "./result-form.resource";
import { Config } from "../config-schema";
import { closeOverlay } from "../components/overlay/store";
import { setFulfillerStatus } from "../laboratory-resource";
import Loader from "../components/loader/loader.component";
import ResultFormField from "./result-form-field.component";
import styles from "./result-form.scss";

interface ResultFormProps {
  patientUuid: string;
  order: Order;
}

const ResultForm: React.FC<ResultFormProps> = ({ order, patientUuid }) => {
  const { t } = useTranslation();
  const session = useSession();
  const { laboratoryOrderTypeUuid, encounterTypeUuid } = useConfig<Config>();
  const [showEmptyFormErrorNotification, setShowEmptyFormErrorNotification] =
    useState(false);

  const {
    control,
    formState: { isSubmitting },
    getValues,
    handleSubmit,
    register,
  } = useForm<{
    testResult: string;
  }>({
    defaultValues: {},
  });

  const isTablet = useLayoutType() === "tablet";
  const { patient, isLoading: isLoadingPatient } = usePatient(patientUuid);
  const { concept, isLoading: isLoadingConcepts } = useGetOrderConceptByUuid(
    order.concept.uuid
  );

  const bannerState = useMemo(
    () => ({
      patient,
      patientUuid,
      hideActionsOverflow: true,
    }),
    [patient, patientUuid]
  );

  const onSubmit = () => {
    const formValues = getValues();
    const isEmptyForm = Object.values(formValues).every(
      (value) => value === "" || value === null || value === undefined
    );

    if (isEmptyForm) {
      setShowEmptyFormErrorNotification(true);
      return;
    }

    let obsValue = [];
    const submissionDatetime = new Date().toISOString();

    if (concept.set && concept.setMembers.length > 0) {
      let groupMembers = [];
      concept.setMembers.forEach((member) => {
        let value;
        if (
          member.datatype.display === "Numeric" ||
          member.datatype.display === "Text"
        ) {
          value = getValues()[member.uuid];
        } else if (member.datatype.display === "Coded") {
          value = {
            uuid: getValues()[member.uuid],
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
        value = getValues()[concept.uuid];
      } else if (concept.datatype.display === "Coded") {
        value = {
          uuid: getValues()[concept.uuid],
        };
      }

      obsValue.push({
        concept: { uuid: order.concept.uuid },
        status: "FINAL",
        order: { uuid: order.uuid },
        value: value,
        obsDatetime: submissionDatetime,
      });

      setShowEmptyFormErrorNotification(false);
    }

    const encounterPayload = {
      encounterDatetime: submissionDatetime,
      patient: patientUuid,
      encounterType: encounterTypeUuid,
      location: session.sessionLocation.uuid,
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
      orderer: order.orderer?.uuid,
    };

    updateOrderResult(encounterPayload, orderDiscontinuationPayload)
      .then(
        (res) => {
          showSnackbar({
            isLowContrast: true,
            title: t("updateEncounter", "Update lab results"),
            kind: "success",
            subtitle: t(
              "labResultsUpdatedSuccessfully",
              "Lab test results updated successfully"
            ),
          });

          const abortController = new AbortController();
          setFulfillerStatus(order.uuid, "COMPLETED", abortController).then(
            () => {
              showSnackbar({
                isLowContrast: true,
                title: t("markOrderFulfillStatus", "Test order completed"),
                kind: "success",
                subtitle: t(
                  "testOrderCompletedSuccessfully",
                  "You have successfully completed the test order"
                ),
              });

              mutate(
                (key) =>
                  typeof key === "string" &&
                  key.startsWith(
                    `${restBaseUrl}/order?orderTypes=${laboratoryOrderTypeUuid}`
                  ),
                undefined,
                { revalidate: true }
              );
            },
            (err) => {
              showNotification({
                title: t(
                  "errorMarkingOrderFulfillStatus",
                  "Error occurred while marking order fulfill status"
                ),
                kind: "error",
                critical: true,
                description: err?.message,
              });
            }
          );

          return res;
        },
        (err) => {
          showNotification({
            title: t("errorUpdatingEncounter", "Error updating test results"),
            kind: "error",
            critical: true,
            description: err?.message,
          });
        }
      )
      .finally(() => {
        closeOverlay();
      });

    setShowEmptyFormErrorNotification(false);
  };

  if (isLoadingPatient || isLoadingConcepts) {
    return <Loader />;
  }

  return (
    <Form className={styles.form}>
      <ExtensionSlot name="patient-header-slot" state={bannerState} />
      <Stack className={styles.container} gap={5}>
        {concept.setMembers.length > 0 && <div>{concept.display}</div>}
        {concept && (
          <ResultFormField
            register={register}
            concept={concept}
            control={control}
          />
        )}
        {showEmptyFormErrorNotification && (
          <InlineNotification
            className={styles.emptyFormError}
            lowContrast
            title={t("error", "Error")}
            subtitle={
              t("pleaseFillField", "Please fill at least one field") + "."
            }
          />
        )}
      </Stack>
      <ButtonSet className={isTablet ? styles.tablet : styles.desktop}>
        <Button
          className={styles.button}
          onClick={closeOverlay}
          kind="secondary"
        >
          {t("cancel", "Cancel")}
        </Button>
        <Button className={styles.button} onClick={handleSubmit(onSubmit)}>
          {/* TODO: Consider simulating an artifical delay in the submission process to get
          this loading state to show */}
          {isSubmitting ? (
            <InlineLoading description={t("saving", "Saving") + "..."} />
          ) : (
            <span>{t("save", "Save")}</span>
          )}
        </Button>
      </ButtonSet>
    </Form>
  );
};

export default ResultForm;
