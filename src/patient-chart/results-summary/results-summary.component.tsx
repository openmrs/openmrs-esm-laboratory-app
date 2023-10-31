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
import { EncounterResponse } from "../laboratory-item/view-laboratory-item.resource";
import PrintResultsSummary from "./print-results-summary.component";
import { formatDate, parseDate, showModal } from "@openmrs/esm-framework";
import { useTranslation } from "react-i18next";
import { Order } from "../laboratory-order.resource";

interface ResultsSummaryProps {
  encounter: EncounterResponse;
}

const ResultsSummary: React.FC<ResultsSummaryProps> = ({ encounter }) => {
  const { t } = useTranslation();
  // get encouter details
  // const { encounter, isLoading, isError } = useGetEncounterById(encounterUuid);

  // print button

  // email button

  // if (encounter) {
  //   return <DataTableSkeleton role="progressbar" />;
  // }
  // if (isError) {
  //   return <ErrorState error={isError} headerTitle={"Error"} />;
  // }

  const obsData = encounter.obs.filter((ob) => ob?.order?.type === "testorder");

  if (encounter) {
    return (
      <div>
        <Form>
          <ModalBody>
            <section className={styles.section}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div></div>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  {/* <PrintButtonAction /> */}
                  {/* <EmailButtonAction /> */}
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
              {/* <TestsResults obs={obsData} /> */}
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
