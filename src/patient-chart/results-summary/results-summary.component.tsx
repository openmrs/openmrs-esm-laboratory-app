import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
  DataTableSkeleton,
  Form,
  ModalBody,
  ModalFooter,
} from "@carbon/react";
import { Printer, MailAll, Edit } from "@carbon/react/icons";
import styles from "./results-summary.scss";
import TestsResults from "./test-results-table.component";
import { useReactToPrint } from "react-to-print";
import {
  EncounterResponse,
  useGetEncounterById,
} from "../laboratory-item/view-laboratory-item.resource";
import { ErrorState } from "@openmrs/esm-patient-common-lib";
import PrintResultsSummary from "./print-results-summary.component";
import { formatDate, parseDate, showModal } from "@openmrs/esm-framework";
import { useTranslation } from "react-i18next";
import { useGetLabEncounterTests } from "./results/results.resource";

interface ResultsSummaryProps {
  encounterUuid: string;
}

interface EditResultsProps {
  encounterResponse: EncounterResponse;
}

const ResultsSummary: React.FC<ResultsSummaryProps> = ({ encounterUuid }) => {
  const { t } = useTranslation();
  // get encouter details
  const { encounter, isLoading, isError } = useGetEncounterById(encounterUuid);

  // print button
  const PrintButtonAction: React.FC = () => {
    const [isPrinting, setIsPrinting] = useState(false);

    const contentToPrintRef = useRef(null);

    const onBeforeGetContentResolve = useRef(null);

    useEffect(() => {
      if (onBeforeGetContentResolve.current) {
        onBeforeGetContentResolve.current();
      }
    }, [isPrinting]);

    const handlePrint = useReactToPrint({
      content: () => contentToPrintRef.current,
      onBeforeGetContent: () =>
        new Promise((resolve) => {
          onBeforeGetContentResolve.current = resolve;
          setIsPrinting(true);
        }),
      onAfterPrint: () => {
        onBeforeGetContentResolve.current = null;
        setIsPrinting(false);
      },
    });

    return (
      <div>
        <div ref={contentToPrintRef}>
          <PrintResultsSummary encounterResponse={encounter} />
        </div>
        <Button
          kind="ghost"
          size="sm"
          onClick={handlePrint}
          renderIcon={(props) => <Printer size={16} {...props} />}
        />
      </div>
    );
  };

  // email button
  const EmailButtonAction: React.FC = () => {
    const handleButtonClick = (event: MouseEvent) => {
      event.preventDefault();
    };
    return (
      <Button
        kind="ghost"
        size="sm"
        onClick={(e) => handleButtonClick(e)}
        renderIcon={(props) => <MailAll size={16} {...props} />}
      />
    );
  };

  // edit button
  const EditButtonAction: React.FC<EditResultsProps> = ({
    encounterResponse,
  }) => {
    const launchEditResultModal = useCallback(() => {
      const dispose = showModal("edit-results-dialog", {
        encounterResponse,
        closeModal: () => dispose(),
      });
    }, [encounterResponse]);
    return (
      <Button
        kind="ghost"
        size="sm"
        onClick={launchEditResultModal}
        renderIcon={(props) => <Edit size={16} {...props} />}
      />
    );
  };

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />;
  }
  if (isError) {
    return <ErrorState error={isError} headerTitle={"Error"} />;
  }

  if (encounter) {
    return (
      <div>
        <Form>
          <ModalBody>
            <section className={styles.section}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div></div>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <PrintButtonAction />
                  <EmailButtonAction />
                </div>
              </div>
            </section>
            <section className={styles.section}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ margin: "5px" }}>
                  Date :{" "}
                  {formatDate(parseDate(encounter.encounterDatetime), {
                    time: true,
                  })}
                </span>
                <span style={{ margin: "5px" }}>
                  Ordered By : {encounter?.auditInfo?.creator?.display}
                </span>
              </div>
            </section>
            <section className={styles.section}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <span> Results Ordered</span>
                </div>
                <div>
                  {/* <EditButtonAction encounterResponse={encounter} /> */}
                </div>
              </div>
            </section>
            <section className={styles.section}>
              <TestsResults
                encounterUuid={encounter.uuid}
                orders={encounter?.orders}
              />
            </section>
          </ModalBody>
          {/* <ModalFooter>
            <Button kind="secondary">{t("cancel", "Cancel")}</Button>
            <Button type="submit">{t("results", "Save")}</Button>
          </ModalFooter> */}
        </Form>
      </div>
    );
  }
};

export default ResultsSummary;
