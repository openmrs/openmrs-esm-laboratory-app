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
import logoImg from "../../../assets/logo/moh_logo_without_word.png";
import {
  Identifier,
  IdentifierType,
  PatientResource,
  useGetPatientByUuid,
} from "../../utils/functions";
import { useTranslation } from "react-i18next";
import TestResultsChildren from "./test-children-results.component";
import PrintResultsTable from "./print-results-table.component";
import { GetPatientByUuid } from "./results-summary.resource";

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
          justifyContent: "space-around",
          flexDirection: "row",
          alignItems: "center",
          margin: " 10px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img src={logoImg} alt={"logo"} width={50} height={50} />
              <span
                style={{ fontSize: "10px", fontWeight: "bold", margin: "5px" }}
              >
                {encounterResponse.visit.location.display}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <span
                style={{ fontSize: "10px", fontWeight: "bold", margin: "2px" }}
              >
                Code :
              </span>
              <span
                style={{ fontSize: "10px", fontWeight: "bold", margin: "2px" }}
              >
                District :
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ margin: "5px", fontSize: "10px" }}>
            <span style={{ fontSize: "10px", fontWeight: "bold" }}>
              {patient?.person?.display}
            </span>
            ,
            {patient?.person?.gender === "M"
              ? " Male"
              : patient?.person?.gender === "F"
              ? " Female"
              : " Unknown"}
            ,
            <span>
              {" "}
              {formatDate(parseDate(patient?.person?.birthdate), {
                mode: "standard",
                time: false,
              })}{" "}
            </span>
          </span>
          <span style={{ margin: "5px", fontSize: "10px" }}>
            HIV Clinic No. :
            {patient?.identifiers.length
              ? patient?.identifiers.find((identifier: Identifier) => {
                  return (
                    identifier.identifierType.uuid ===
                    "e1731641-30ab-102d-86b0-7a5022ba4115"
                  );
                })?.identifier
              : "--"}
          </span>
          <span style={{ margin: "5px", fontSize: "10px" }}>
            Patient Unique Code (UIC). :
            {patient?.identifiers.length > 0
              ? patient?.identifiers.find((identifier: Identifier) => {
                  return (
                    identifier.identifierType.uuid ===
                    "877169c4-92c6-4cc9-bf45-1ab95faea242"
                  );
                })?.identifier
              : "--"}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ margin: "5px", fontSize: "10px" }}>
            Prepared By : {encounterResponse?.auditInfo?.creator?.display}
          </span>
          <span style={{ margin: "5px", fontSize: "10px" }}>
            Date Requested :
            {formatDate(parseDate(encounterResponse.encounterDatetime), {
              time: false,
            })}
          </span>
        </div>
      </div>

      <section className={styles.section}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        ></div>
      </section>
      {/* <section className={styles.section}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "10px",
          }}
        >
          <div>
            <span style={{ fontSize: "16px", fontWeight: "bold" }}>
              Test Results
            </span>
          </div>
        </div>
      </section> */}
      <section className={styles.section}>
        {Object.keys(results).length > 0 && (
          <PrintResultsTable groupedResults={results} />
        )}
      </section>

      <section className={styles.section}>
        <div
          style={{
            margin: "10px",
            display: "flex",
            width: "500px",
            flexDirection: "row",
          }}
        >
          <span style={{ fontSize: "14px" }}>
            Results Reviewed / Authorized by :
            <span style={{ marginLeft: "50px" }}>
              {encounterResponse?.auditInfo?.creator?.display}
            </span>
          </span>
          <span> </span>
        </div>
        <div
          style={{
            margin: "10px",
            display: "flex",
            width: "500px",
            flexDirection: "row",
          }}
        >
          <span style={{ fontSize: "14px" }}>
            Sign : ............................
          </span>
          <span style={{ fontSize: "14px", marginLeft: "50px" }}>
            Date : ............................
          </span>
        </div>
      </section>
    </div>
  );
};

export default PrintResultsSummary;
