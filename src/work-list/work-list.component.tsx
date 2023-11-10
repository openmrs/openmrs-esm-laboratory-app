import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { EmptyState, ErrorState } from "@openmrs/esm-patient-common-lib";
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
import { useGetOrdersWorklist } from "./work-list.resource";
import styles from "./work-list.scss";
import { usePagination } from "@openmrs/esm-framework";

interface WorklistProps {
  careSetting: string;
  activatedOnOrAfterDate: string;
  fulfillerStatus: string;
}

const WorkList: React.FC<WorklistProps> = ({
  careSetting,
  activatedOnOrAfterDate,
  fulfillerStatus,
}) => {
  const { t } = useTranslation();

  const { workListEntries, isLoading, isError } = useGetOrdersWorklist(
    careSetting,
    activatedOnOrAfterDate,
    fulfillerStatus
  );

  const pageSizes = [10, 20, 30, 40, 50];
  const [page, setPage] = useState(1);
  const [currentPageSize, setPageSize] = useState(10);
  const [nextOffSet, setNextOffSet] = useState(0);

  const {
    goTo,
    results: paginatedWorkListEntries,
    currentPage,
  } = usePagination(workListEntries, currentPageSize);

  // get picked orders
  let columns = [
    { id: 0, header: t("orderNumber", "Order Number"), key: "orderNumber" },
    {
      id: 1,
      header: t("accessionNumber", "Accession Number"),
      key: "accessionNumber",
    },
    { id: 2, header: t("test", "Test"), key: "test" },
    { id: 3, header: t("action", "Action"), key: "action" },
    { id: 4, header: t("orderer", "Orderer"), key: "orderer" },
    { id: 5, header: t("orderType", "Order Type"), key: "orderType" },
    { id: 6, header: t("urgency", "Urgency"), key: "urgency" },
    { id: 7, header: t("actions", "Actions"), key: "actions" },
  ];

  const tableRows = useMemo(() => {
    return paginatedWorkListEntries?.map((entry) => ({
      ...entry,
      id: entry.uuid,
      orderNumber: { content: <span>{entry.orderNumber}</span> },
      accessionNumber: { content: <span>{entry.accessionNumber}</span> },
      test: { content: <span>{entry.concept.display}</span> },
      action: { content: <span>{entry.action}</span> },
      orderer: { content: <span>{entry.orderer.display}</span> },
      orderType: { content: <span>{entry.orderType.display}</span> },
      urgency: { content: <span>{entry.urgency}</span> },
    }));
  }, [paginatedWorkListEntries]);

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />;
  }
  if (isError) {
    return (
      <ErrorState
        error={`Error returning worklist` + isError.message}
        headerTitle={"Worklist Error"}
      />
    );
  }

  if (paginatedWorkListEntries?.length) {
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
                        <TableRow {...getRowProps({ row })} key={row.id}>
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
              <Pagination
                forwardText="Next page"
                backwardText="Previous page"
                page={currentPage}
                pageSize={currentPageSize}
                pageSizes={pageSizes}
                totalItems={paginatedWorkListEntries?.length}
                className={styles.pagination}
                onChange={({ pageSize, page }) => {
                  if (pageSize !== currentPageSize) {
                    setPageSize(pageSize);
                  }
                  if (page !== currentPage) {
                    goTo(page);
                  }
                }}
              />
            </TableContainer>
          )}
        </DataTable>
      </div>
    );
  }
};

export default WorkList;
