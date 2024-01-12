import React, { useMemo, useState, createContext, useContext } from "react";
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

interface ResultFormProps {
  patientUuid: string;
  order: Result;
}

const ResultForm: React.FC<ResultFormProps> = ({ order, patientUuid }) => {
  const { t } = useTranslation();

  const { patient, isLoading } = usePatient(patientUuid);
  const { concept } = useGetOrderConceptByUuid(order.concept.uuid);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputValues, setInputValues] = useState({});
  const formValuesContext = createContext({});

  const setFormValues = (val) => {
    setInputValues(val);
  };
  const bannerState = useMemo(() => {
    if (patient) {
      return {
        patient,
        patientUuid,
        hideActionsOverflow: true,
      };
    }
  }, [patient, patientUuid]);

  // create input fields
  const Questions = ({ concept }) => {
    const inputFields = useMemo(() => {
      if (concept === undefined) {
        return null;
      }

      if (concept.set && concept.setMembers.length > 0) {
        return concept.setMembers.map((member) => {
          let inputField = (
            <formValuesContext.Provider value={{ inputValues, setFormValues }}>
              <ResultFormField
                concept={member}
                setFormValues={setFormValues}
                inputValues={inputValues}
              />
            </formValuesContext.Provider>
          );
          return inputField;
        });
      } else if (!concept.set && concept.setMembers.length === 0) {
        let inputField = (
          <formValuesContext.Provider value={{ inputValues, setFormValues }}>
            <ResultFormField
              concept={concept}
              setFormValues={setFormValues}
              inputValues={inputValues}
            />
          </formValuesContext.Provider>
        );
        return <>{inputField}</>;
      }
    }, [concept]); // Memoize when conceptMembers changes

    return <>{inputFields}</>;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // assign result to test order
    let obsValue = [];

    if (concept.set && concept.setMembers.length > 0) {
      let groupMembers = [];
      concept.setMembers.forEach((item) => {
        let value;
        if (
          item.datatype.display === "Numeric" ||
          item.datatype.display === "Text"
        ) {
          value = inputValues[`${item.uuid}`];
        } else if (item.datatype.display === "Coded") {
          value = {
            uuid: inputValues[`${item.uuid}`],
          };
        }
        const groupMember = {
          concept: { uuid: item.uuid },
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
        value = inputValues[`${concept.uuid}`];
      } else if (concept.datatype.display === "Coded") {
        value = {
          uuid: inputValues[`${concept.uuid}`],
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

    setIsSubmitting(true);
    UpdateOrderResult(
      order.encounter.uuid,
      obsPayload,
      orderDiscontinuationPayload
    ).then(
      () => {
        setIsSubmitting(false);
        showToast({
          critical: true,
          title: t("updateEncounter", "Update lab results"),
          kind: "success",
          description: t(
            "generateSuccessfully",
            "You have successfully saved test results"
          ),
        });
      },
      (err) => {
        setIsSubmitting(false);
        showNotification({
          title: t(
            `errorUpdatingEncounter', 'Error occurred while updating encounter`
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

          {concept && (
            <section className={styles.section}>
              <Questions concept={concept} />
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
          <Button onClick={(e) => handleSubmit(e)}>Save tests</Button>
        </ModalFooter>
      </div>
    </>
  );
};

export default ResultForm;
