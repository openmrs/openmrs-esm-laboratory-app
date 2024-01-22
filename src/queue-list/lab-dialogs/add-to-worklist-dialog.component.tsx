import React, { useCallback, useEffect, useState } from "react";
import { MappedQueueEntry } from "../../types";
import { mutate } from "swr";
import {
  Button,
  ContentSwitcher,
  Form,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Switch,
  TextArea,
  Grid,
  Checkbox,
  TextInput,
  IconButton,
} from "@carbon/react";
import { useTranslation } from "react-i18next";
import { MappedPatientQueueEntry } from "../laboratory-patient-list.resource";
import styles from "./add-to-worklist-dialog.scss";
import {
  navigate,
  showNotification,
  showToast,
  useLocations,
  useSession,
} from "@openmrs/esm-framework";
import { Renew } from "@carbon/react/icons";
import {
  GenerateSpecimenId,
  GetOrderByUuid,
  useQueueRoomLocations,
  useSpecimenTypes,
  receiveOrder,
} from "./add-to-worklist-dialog.resource";
import { Encounter, Order } from "../../types/patient-queues";

interface AddToWorklistDialogProps {
  queueId;
  encounter: Encounter;
  order: Order;
  closeModal: () => void;
}

const AddToWorklistDialog: React.FC<AddToWorklistDialogProps> = ({
  queueId,
  encounter,
  order,
  closeModal,
}) => {
  const { t } = useTranslation();

  const locations = useLocations();

  const sessionUser = useSession();

  const [selectedLocation, setSelectedLocation] = useState("");

  const [preferred, setPreferred] = useState(false);

  const [specimenID, setSpecimenID] = useState();

  const { specimenTypes } = useSpecimenTypes();

  const [orderer, setOrderer] = useState("");

  const [concept, setConcept] = useState("");

  const [patient, setPatient] = useState("");

  const [encounterUuid, setEncounterUuid] = useState("");

  const { queueRoomLocations } = useQueueRoomLocations(
    sessionUser?.sessionLocation?.uuid
  );

  const [specimenType, setSpecimenType] = useState();

  const [selectedNextQueueLocation, setSelectedNextQueueLocation] = useState(
    queueRoomLocations[0]?.uuid
  );

  const filteredlocations = queueRoomLocations?.filter(
    (location) => location.uuid != selectedLocation
  );

  useEffect(() => {
    if (locations?.length && sessionUser) {
      setSelectedLocation(sessionUser?.sessionLocation?.uuid);
    }
  }, [locations, sessionUser]);

  // GetOrderByUuid
  GetOrderByUuid(order.uuid).then(
    (resp) => {
      setOrderer(resp.data?.orderer?.uuid);
      setConcept(resp.data?.concept?.uuid);
      setPatient(resp.data?.patient?.uuid);
      setEncounterUuid(resp.data?.encounter.uuid);
    },
    (err) => {
      showNotification({
        title: t(`errorGettingOrder', 'Error Getting Order Id`),
        kind: "error",
        critical: true,
        description: err?.message,
      });
    }
  );

  const pickLabRequestQueue = async (event) => {
    event.preventDefault();
    // pick lab test
    receiveOrder(order.uuid, { fulfillerStatus: "IN_PROGRESS" }).then(
      () => {
        showToast({
          critical: true,
          title: t("pickedAnOrder", "Picked an order"),
          kind: "success",
          description: t(
            "pickSuccessfully",
            "You have successfully picked an Order"
          ),
        });

        mutate(
          (key) =>
            typeof key === "string" &&
            key.startsWith("/ws/rest/v1/order?orderTypes="),
          undefined,
          { revalidate: true }
        );
        closeModal();
      },
      (error) => {
        showNotification({
          title: t(`errorPicking an order', 'Error Picking an Order`),
          kind: "error",
          critical: true,
          description: error?.message,
        });
      }
    );
  };

  const onChecked = () => {
    setPreferred(!preferred);
  };

  const generateId = async (e) => {
    e.preventDefault();
    // generate sample Id
    GenerateSpecimenId(order.uuid).then(
      (resp) => {
        setSpecimenID(resp.data.results[0].sampleId);
        showToast({
          critical: true,
          title: t("generatesampleID", "Generate Sample Id"),
          kind: "success",
          description: t(
            "generateSuccessfully",
            "You have successfully generated a Sample Id"
          ),
        });
      },
      (err) => {
        showNotification({
          title: t(`errorGeneratingId', 'Error Generating Sample Id`),
          kind: "error",
          critical: true,
          description: err?.message,
        });
      }
    );
  };

  return (
    <div>
      <Form onSubmit={pickLabRequestQueue}>
        <ModalHeader
          closeModal={closeModal}
          title={t("pickRequest", "Pick Lab Request")}
        />
        <ModalBody>
          <div className={styles.modalBody}>
            <section className={styles.section}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  alignContent: "stretch",
                }}
              >
                <div className={styles.sectionTitle}>
                  {t("specimenID", "Specimen ID")}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    columnGap: "10px",
                  }}
                >
                  <div style={{ width: "430px" }}>
                    <TextInput
                      type="text"
                      id="specimentID"
                      value={specimenID}
                    />
                  </div>
                  <div style={{ width: "50px" }}></div>
                </div>
              </div>
            </section>
            <section className={styles.section}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  alignContent: "stretch",
                }}
              >
                <div className={styles.sectionTitle}>
                  {t("specimenType", "Specimen Type")}
                </div>
                <div style={{ width: "500px" }}>
                  <section className={styles.section}>
                    <Select
                      labelText=""
                      id="speciment-types"
                      name="specimen-types"
                      value={specimenType}
                      onChange={(event) => setSpecimenType(event.target.value)}
                    >
                      {!specimenType ? (
                        <SelectItem
                          text={t("specimenType", "Select Specimen Type")}
                          value=""
                        />
                      ) : null}
                      {specimenTypes.map((type) => (
                        <SelectItem
                          key={type.uuid}
                          text={type.display}
                          value={type.uuid}
                        >
                          {type.display}
                        </SelectItem>
                      ))}
                    </Select>
                  </section>
                </div>
              </div>
            </section>
            <section
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                alignContent: "stretch",
              }}
            >
              <div>
                <Checkbox
                  checked={preferred}
                  onChange={onChecked}
                  labelText={"Referred"}
                  id="test-referred"
                />
              </div>
              {preferred && (
                <div style={{ width: "500px" }}>
                  <section className={styles.section}>
                    <Select
                      labelText={t("location", "Location ")}
                      id="nextQueueLocation"
                      name="nextQueueLocation"
                      invalidText="Required"
                      value={selectedNextQueueLocation}
                      onChange={(event) =>
                        setSelectedNextQueueLocation(event.target.value)
                      }
                    >
                      {filteredlocations.map((location) => (
                        <SelectItem
                          key={location.uuid}
                          text={location.display}
                          value={location.uuid}
                        >
                          {location.display}
                        </SelectItem>
                      ))}
                    </Select>
                  </section>
                </div>
              )}
            </section>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button kind="secondary" onClick={closeModal}>
            {t("cancel", "Cancel")}
          </Button>
          <Button type="submit" onClick={pickLabRequestQueue}>
            {t("pickPatient", "Pick Lab Request")}
          </Button>
        </ModalFooter>
      </Form>
    </div>
  );
};

export default AddToWorklistDialog;
