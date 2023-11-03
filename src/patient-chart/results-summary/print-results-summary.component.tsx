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

interface PrintResultsSummaryProps {
  encounterResponse: EncounterResponse;
  patient: PatientResource;
}

const PrintResultsSummary: React.FC<PrintResultsSummaryProps> = ({
  encounterResponse,
  patient,
}) => {
  const { t } = useTranslation();

  let columns = [
    { id: 1, header: t("order", "Order"), key: "order" },
    { id: 2, header: t("results", "Results"), key: "result" },
  ];

  const filteredItems = encounterResponse.obs.filter(
    (ob) => ob?.order?.type === "testorder"
  );

  const tableRows = useMemo(() => {
    return filteredItems?.map((entry) => ({
      ...entry,
      id: entry.uuid,
      order: {
        content: <span>{entry.display}</span>,
      },
      result: {
        content: <span>--</span>,
      },
    }));
  }, [filteredItems]);
  return (
    <div className={styles.printPage}>
      <section className={styles.section}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img src={logoImg} alt={"logo"} width={150} height={150} />
        </div>
      </section>

      <section className={styles.section}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ margin: "5px" }}>
            Patient Name : {patient?.person?.display}
          </span>{" "}
          <span style={{ margin: "5px" }}>
            Patient Gender : {patient?.person?.gender}
          </span>{" "}
          <span style={{ margin: "5px" }}>
            Patient Age : {patient?.person?.age}
          </span>{" "}
          <span style={{ margin: "5px" }}>
            Date :
            {formatDate(parseDate(encounterResponse.encounterDatetime), {
              time: false,
            })}
          </span>
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
            <span style={{ fontSize: "18px", fontWeight: "bold" }}>
              {" "}
              Test Result
            </span>
          </div>
          <div></div>
        </div>
      </section>
      <section className={styles.section}>
        {/* <TestsPrintResults obs={encounterResponse?.obs} /> */}
        <div>
          <DataTable
            rows={tableRows}
            headers={columns}
            useZebraStyles
            experimentalAutoAlign={true}
          >
            {({
              rows,
              headers,
              getHeaderProps,
              getTableProps,
              getRowProps,
            }) => (
              <TableContainer className={styles.tableContainer}>
                <Table
                  {...getTableProps()}
                  className={styles.activePatientsTable}
                >
                  <TableHead>
                    <TableRow>
                      {headers.map((header) => (
                        <TableHeader {...getHeaderProps({ header })}>
                          {header.header}
                        </TableHeader>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row, index) => {
                      return (
                        <React.Fragment key={row.id}>
                          <TableRow {...getRowProps({ row })}>
                            {row.cells.map((cell) => (
                              <TableCell key={cell.id}>
                                {cell.value?.content ?? cell.value}
                              </TableCell>
                            ))}
                          </TableRow>
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
                {rows.length === 0 ? (
                  <div className={styles.tileContainer}>
                    <Tile className={styles.tile}>
                      <div className={styles.tileContent}>
                        <p className={styles.content}>
                          {t(
                            "noTestResultsToDisplay",
                            "No test results to display"
                          )}
                        </p>
                      </div>
                    </Tile>
                  </div>
                ) : null}
                {/* <Pagination
                forwardText="Next page"
                backwardText="Previous page"
                page={currentPage}
                pageSize={currentPageSize}
                pageSizes={pageSizes}
                totalItems={patientQueueEntries?.length}
                className={styles.pagination}
                onChange={({ pageSize, page }) => {
                  if (pageSize !== currentPageSize) {
                    setPageSize(pageSize);
                  }
                  if (page !== currentPage) {
                    goTo(page);
                  }
                }}
              /> */}
              </TableContainer>
            )}
          </DataTable>
        </div>
      </section>
    </div>
  );
};

export default PrintResultsSummary;
