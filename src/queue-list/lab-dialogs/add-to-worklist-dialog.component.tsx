import React, { useCallback, useEffect, useState } from "react";
import { MappedQueueEntry } from "../../types";
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
import { useQueueRoomLocations } from "./add-to-worklist-dialog.resource";

interface AddToWorklistDialogProps {
  queueEntry: MappedPatientQueueEntry;
  closeModal: () => void;
}

const AddToWorklistDialog: React.FC<AddToWorklistDialogProps> = ({
  queueEntry,
  closeModal,
}) => {
  const { t } = useTranslation();

  const locations = useLocations();

  const sessionUser = useSession();

  const [selectedLocation, setSelectedLocation] = useState("");

  const { queueRoomLocations } = useQueueRoomLocations(
    sessionUser?.sessionLocation?.uuid
  );

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

  const pickLabRequestQueue = useCallback((event) => {
    event.preventDefault();
  }, []);

  if (queueEntry && Object.keys(queueEntry)?.length > 0) {
    return (
      <div>
        <Form onSubmit={pickLabRequestQueue}>
          <ModalHeader
            closeModal={closeModal}
            title={t("pickRequest", "Pick Lab Request")}
          />
          <ModalBody>
            <div className={styles.modalBody}>
              <h4 className={styles.section}>
                Currently Picked : {queueEntry.name}
              </h4>
              <section className={styles.section}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div className={styles.sectionTitle}>
                    {t("specimenID", "Specimen ID")}
                  </div>
                  <div className={styles.sectionTitle}>
                    <TextInput type="text" id="specimentID" />
                  </div>
                </div>
              </section>
              <section className={styles.section}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div className={styles.sectionTitle}>
                    {t("specimenType", "Specimen Type")}
                  </div>
                  <div className={styles.sectionTitle}>
                    <TextInput type="text" id="specimenType" />
                  </div>
                </div>
              </section>
              <section style={{ display: "flex", alignItems: "center" }}>
                <div>
                  <Checkbox labelText={"Referred"} id="test-referred" />
                </div>
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
              </section>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button kind="secondary" onClick={closeModal}>
              {t("cancel", "Cancel")}
            </Button>
            <Button type="submit">
              {t("pickPatient", "Pick Lab Request")}
            </Button>
          </ModalFooter>
        </Form>
      </div>
    );
  }
};

export default AddToWorklistDialog;
