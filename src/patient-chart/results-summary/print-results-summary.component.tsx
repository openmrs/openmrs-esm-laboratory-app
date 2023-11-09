import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./print-results-summary.scss";
import TestsPrintResults from "./test-print-results-table.component";
import { EncounterResponse } from "../laboratory-item/view-laboratory-item.resource";
import {
  formatDate,
  interpolateUrl,
  parseDate,
  useConfig,
} from "@openmrs/esm-framework";
import {
  DataTable,
  DataTableSkeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  Tile,
  TableExpandHeader,
  TableExpandRow,
  TableExpandedRow,
} from "@carbon/react";
import logoImg from "../../../assets/logo/logo.png";
import { PatientResource, useGetPatientByUuid } from "../../utils/functions";
import { useTranslation } from "react-i18next";
import TestResultsChildren from "./test-children-results.component";
import PrintResultsTable from "./print-results-table.component";

interface PrintResultsSummaryProps {
  encounterResponse: EncounterResponse;
  patient: PatientResource;
}

const PrintResultsSummary: React.FC<PrintResultsSummaryProps> = ({
  encounterResponse,
  patient,
}) => {
  const { t } = useTranslation();

  const filteredItems = encounterResponse.obs.filter(
    (ob) => ob?.order?.type === "testorder"
  );

  const results = useMemo(() => {
    let groupedResults = [];

    filteredItems.forEach((element) => {
      groupedResults[element.order.display] = element;
    });
    return groupedResults;
  }, [filteredItems]);
  return (
    <div className={styles.printPage}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          margin: "5px",
        }}
      >
        <img src={logoImg} alt={"logo"} width={150} height={150} />
        <span style={{ fontSize: "20px", fontWeight: "bold" }}>
          {encounterResponse.visit.location.display}
        </span>
      </div>

      <section className={styles.section}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ margin: "5px", fontSize: "10px" }}>
              Name : {patient?.person?.display}
            </span>
            <span style={{ margin: "5px", fontSize: "10px" }}>
              Gender :
              {patient?.person?.gender === "M"
                ? " Male"
                : patient?.person?.gender === "F"
                ? "Female"
                : "Unknown"}
            </span>
            <span style={{ margin: "5px", fontSize: "10px" }}>
              Age : {patient?.person?.age} years
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ margin: "5px", fontSize: "10px" }}>
              Clinician : {encounterResponse?.auditInfo?.creator?.display}
            </span>
            <span style={{ margin: "5px", fontSize: "10px" }}>
              Prepared By : {encounterResponse?.auditInfo?.creator?.display}
            </span>
            <span style={{ margin: "5px", fontSize: "10px" }}>
              Date :
              {formatDate(parseDate(encounterResponse.encounterDatetime), {
                time: false,
              })}
            </span>
          </div>
        </div>
      </section>
      <section className={styles.section}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div>
            <span style={{ fontSize: "16px", fontWeight: "bold" }}>
              Test Results
            </span>
          </div>
          <div></div>
        </div>
      </section>
      <section className={styles.section}>
        {Object.keys(results).length > 0 && (
          <PrintResultsTable groupedResults={results} />
        )}
      </section>
    </div>
  );
};

export default PrintResultsSummary;
