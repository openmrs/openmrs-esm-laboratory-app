import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
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
import styles from "./results-summary.scss";
import DeleteTestResultActionMenu from "./test-results-delete-action-menu.component";
import { Ob } from "../laboratory-item/view-laboratory-item.resource";
import TestResultsChildren from "./test-children-results.component";
import { formatDate, parseDate } from "@openmrs/esm-framework";

interface TestOrdersProps {
  obs: Ob[];
}

const TestsResults: React.FC<TestOrdersProps> = ({ obs }) => {
  const { t } = useTranslation();

  let columns = [
    { id: 1, header: t("order", "Order"), key: "order" },
    {
      id: 2,
      header: t("date", "Date"),
      key: "date",
    },
    {
      id: 3,
      header: t("result", "Results"),
      key: "result",
    },

    { id: 4, header: t("actions", "Actions"), key: "actions" },
  ];

  const obsList = obs.filter((ob) => ob?.order?.type === "testorder");

  const obsRows = useMemo(() => {
    return obsList.map((ob) => ({
      id: ob.uuid,
      order: {
        content: <span>{ob?.concept?.display}</span>,
      },
      date: {
        content: (
          <span>
            {formatDate(parseDate(ob?.obsDatetime), {
              time: false,
            })}
          </span>
        ),
      },
      result: {
        content: <span>{ob?.display}</span>,
      },

      actions: {
        content: (
          <>
            <DeleteTestResultActionMenu closeModal={() => true} />
          </>
        ),
      },
    }));
  }, [obsList]);

  if (obsRows?.length >= 0) {
    return (
      <div>
        <DataTable rows={obsRows} headers={columns} useZebraStyles>
          {({ rows, headers, getHeaderProps, getTableProps, getRowProps }) => (
            <TableContainer className={styles.tableContainer}>
              <Table
                {...getTableProps()}
                className={styles.activePatientsTable}
              >
                <TableHead>
                  <TableRow>
                    <TableExpandHeader />
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
                        <TableExpandRow {...getRowProps({ row })}>
                          {row.cells.map((cell) => (
                            <TableCell key={cell.id}>
                              {cell.value?.content ?? cell.value}
                            </TableCell>
                          ))}
                        </TableExpandRow>
                        {row.isExpanded ? (
                          <TableExpandedRow
                            className={styles.expandedActiveVisitRow}
                            colSpan={headers.length + 2}
                          >
                            <TestResultsChildren
                              members={obsList[index].groupMembers}
                            />
                          </TableExpandedRow>
                        ) : (
                          <TableExpandedRow
                            className={styles.hiddenRow}
                            colSpan={headers.length + 2}
                          />
                        )}
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
                          "noTestOrdersToDisplay",
                          "No test orders to display"
                        )}
                      </p>
                      <p className={styles.helper}>
                        {t("checkFilters", "Check the filters above")}
                      </p>
                    </div>
                    <p className={styles.separator}>{t("or", "or")}</p>
                  </Tile>
                </div>
              ) : null}
            </TableContainer>
          )}
        </DataTable>
      </div>
    );
  }
};

export default TestsResults;
