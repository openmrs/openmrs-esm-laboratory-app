import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  EmptyState,
  EncounterList,
  EncounterListColumn,
  getObsFromEncounter,
} from "@ohri/openmrs-esm-ohri-commons-lib";
import styles from "./laboratory-order.scss";
import { age, usePagination, useSession } from "@openmrs/esm-framework";
import { usePatientQueuesList } from "../queue-list/laboratory-patient-list.resource";
import {
  DataTable,
  DataTableHeader,
  DataTableSkeleton,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableExpandHeader,
  TableExpandRow,
  TableHead,
  TableHeader,
  TableRow,
  TabPanel,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Layer,
  Tag,
  TableExpandedRow,
} from "@carbon/react";
import LabTests from "../queue-list/lab-tests/lab-tests.component";
import {
  formatWaitTime,
  getTagColor,
  trimVisitNumber,
} from "../utils/functions";
import ViewLaboratoryItemActionMenu from "./laboratory-item/view-laboratory-item.component";

interface LaboratoryOrderOverviewProps {
  patientUuid: string;
}

const LaboratoryOrder: React.FC<LaboratoryOrderOverviewProps> = ({
  patientUuid,
}) => {
  const { t } = useTranslation();

  const session = useSession();

  // const { patientQueueEntries, isLoading } = usePatientQueuesList(
  //   session?.sessionLocation?.uuid,
  //   status
  // );

  const pageSizes = [10, 20, 30, 40, 50];
  const [page, setPage] = useState(1);
  const [currentPageSize, setPageSize] = useState(10);
  const [nextOffSet, setNextOffSet] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // const {
  //   goTo,
  //   results: paginatedQueueEntries,
  //   currentPage,
  // } = usePagination(patientQueueEntries, currentPageSize);

  const items = [
    {
      encounterDate: "2023-04-05",
      orders: ["test", "test", "test", "test", "test", "test", "test", "test"],
      location: session.sessionLocation.display,
      results: "tests returned",
    },
    {
      encounterDate: "2023-04-05",
      orders: ["test", "test", "test", "test", "test", "test", "test", "test"],
      location: session.sessionLocation.display,
      results: "tests returned",
    },
  ];

  let columns = [
    {
      id: 0,
      header: t("encounterDate", "Encouter Date"),
      key: "encounterDate",
    },
    { id: 1, header: t("orders", "Order"), key: "orders" },
    { id: 2, header: t("location", "Location"), key: "location" },
    { id: 3, header: t("status", "Status"), key: "status" },
    { id: 4, header: t("actions", "Action"), key: "actions" },
  ];

  const tableRows = useMemo(() => {
    return items?.map((entry) => ({
      ...entry,
      encounterDate: {
        content: <span>{entry.encounterDate}</span>,
      },
      orders: {
        content: (
          <>
            {entry.orders.map((order) => {
              return <Tag role="tooltip">{order}</Tag>;
            })}
          </>
        ),
      },
      location: {
        content: <span>{entry.location}</span>,
      },
      status: {
        content: <span>{entry.results}</span>,
      },
      actions: {
        content: (
          <>
            <ViewLaboratoryItemActionMenu closeModal={() => true} />
          </>
        ),
      },
    }));
  }, [items]);

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />;
  }

  if (items?.length) {
    return (
      <div>
        <div className={styles.headerBtnContainer}></div>
        <DataTable rows={tableRows} headers={columns} isSortable useZebraStyles>
          {({
            rows,
            headers,
            getHeaderProps,
            getTableProps,
            getRowProps,
            onInputChange,
          }) => (
            <TableContainer className={styles.tableContainer}>
              <TableToolbar
                style={{
                  position: "static",
                  height: "3rem",
                  overflow: "visible",
                  backgroundColor: "color",
                }}
              >
                <TableToolbarContent>
                  <Layer>
                    <TableToolbarSearch
                      onChange={onInputChange}
                      placeholder={t("searchThisList", "Search this list")}
                      size="sm"
                    />
                  </Layer>
                </TableToolbarContent>
              </TableToolbar>
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
                        <TableExpandRow {...getRowProps({ row })} key={row.id}>
                          {row.cells.map((cell) => (
                            <TableCell key={cell.id}>
                              {cell.value?.content ?? cell.value}
                            </TableCell>
                          ))}
                        </TableExpandRow>
                        {row.isExpanded ? (
                          <TableExpandedRow
                            className={styles.expandedLabQueueVisitRow}
                            colSpan={headers.length + 2}
                          >
                            <>
                              <LabTests />
                            </>
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
    );
  }

  return (
    <div>
      <div className={styles.headerBtnContainer}></div>
      <EmptyState displayText={"Tests Ordered"} headerTitle={"Tests Ordered"} />
    </div>
  );
};

export default LaboratoryOrder;
