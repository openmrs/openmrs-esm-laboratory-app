import React, { useMemo } from "react";
import styles from "./result-form.scss";
import { Button, Form, Stack, ButtonSet } from "@carbon/react";
import { useTranslation } from "react-i18next";
import { closeOverlay } from "../components/overlay/store";
import {
  ExtensionSlot,
  restBaseUrl,
  showNotification,
  showSnackbar,
  useConfig,
  useLayoutType,
  usePatient,
} from "@openmrs/esm-framework";
import {
  useGetOrderConceptByUuid,
  UpdateOrderResult,
} from "./result-form.resource";
import ResultFormField from "./result-form-field.component";
import { useForm } from "react-hook-form";
import { Order } from "@openmrs/esm-patient-common-lib";
import Loader from "../components/loader/loader.component";
import { setFulfillerStatus } from "../laboratory-resource";
import { mutate } from "swr";
import { Config } from "../config-schema";

interface ResultFormProps {
  patientUuid: string;
  order: Order;
}

const ResultForm: React.FC<ResultFormProps> = ({ order, patientUuid }) => {
  const { t } = useTranslation();
  const { laboratoryOrderTypeUuid } = useConfig<Config>();
  const {
    control,
    register,
    formState: { isSubmitting, errors },
    getValues,
    handleSubmit,
  } = useForm<{ testResult: string }>({
    defaultValues: {},
  });
  const isTablet = useLayoutType() === "tablet";
  const { patient, isLoading: isLoadingPatient } = usePatient(patientUuid);
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

  const onSubmit = (data, e) => {
    e.preventDefault();
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
    )
      .then(
        (resp) => {
          showSnackbar({
            isLowContrast: true,
            title: t("updateEncounter", "Update lab results"),
            kind: "success",
            subtitle: t(
              "generateSuccessfully",
              "You have successfully updated test results"
            ),
          });
          return resp;
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
      )
      .then((resp) => {
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
            closeOverlay();
          },
          (err) => {
            showNotification({
              title: t(
                `errorMarkingOrderFulfillStatus`,
                "Error occurred while marking order fulfill status"
              ),
              kind: "error",
              critical: true,
              description: err?.message,
            });
          }
        );
      });
  };
  if (isLoadingPatient || isLoadingConcepts) {
    return <Loader />;
  }
  return (
    <Form className={styles.form}>
      <Stack>
        <ExtensionSlot name="patient-header-slot" state={bannerState} />
      </Stack>
      <Stack className={styles.container}>
        <section>
          {concept.setMembers.length > 0 && <div>{concept.display}</div>}
          {concept && (
            <ResultFormField
              register={register}
              concept={concept}
              control={control}
              errors={errors}
            />
          )}
        </section>
      </Stack>
      <ButtonSet className={isTablet ? styles.tablet : styles.desktop}>
        <Button
          className={styles.button}
          disabled={isSubmitting}
          onClick={() => closeOverlay()}
          kind="secondary"
        >
          {t("cancel", "Cancel")}
        </Button>
        <Button className={styles.button} onClick={handleSubmit(onSubmit)}>
          {t("save", "Save")}
        </Button>
      </ButtonSet>
    </Form>
  );
};

export default ResultForm;
