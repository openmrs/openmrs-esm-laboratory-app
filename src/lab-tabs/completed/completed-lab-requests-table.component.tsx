import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  formatDate,
  parseDate,
  usePagination,
  ConfigurableLink,
  useConfig,
} from "@openmrs/esm-framework";
import {
  DataTable,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  TableToolbarContent,
  Tile,
  Layer,
  TableToolbarSearch,
  DataTableSkeleton,
} from "@carbon/react";
import styles from "./completed-lab-requests-table.scss";
import { getStatusColor } from "../../utils";
import { useLabOrders } from "../../laboratory-resource";

const CompletedLabRequestsTable: React.FC = () => {
  const { t } = useTranslation();
  const { targetPatientDashboard } = useConfig();
  const { labOrders, isLoading } = useLabOrders("COMPLETED");
  const pageSizes = [10, 20, 30, 40, 50];
  const [currentPageSize, setPageSize] = useState(10);
  const {
    goTo,
    results: paginatedOrders,
    currentPage,
  } = usePagination(labOrders, currentPageSize);

  const tableColumns = [
    { id: 0, header: t("date", "Date"), key: "date" },
    { id: 1, header: t("orderNumber", "Order Number"), key: "orderNumber" },
    { id: 2, header: t("patient", "Patient"), key: "patient" },
    { id: 4, header: t("test", "Test"), key: "test" },
    { id: 5, header: t("action", "Action"), key: "action" },
    { id: 6, header: t("status", "Status"), key: "status" },
    { id: 7, header: t("orderer", "Orderer"), key: "orderer" },
    { id: 8, header: t("urgency", "Urgency"), key: "urgency" },
  ];

  const tableRows = useMemo(() => {
    return paginatedOrders.map((order) => ({
      id: order.uuid,
      date: formatDate(parseDate(order.dateActivated)),

      patient: (
        <ConfigurableLink
          to={`\${openmrsSpaBase}/patient/${order.patient?.uuid}/chart/${targetPatientDashboard}`}
        >
          {order.patient?.display.split("-")[1]}
        </ConfigurableLink>
      ),
      orderNumber: order.orderNumber,
      test: order.concept?.display,
      action: order.action,
      status: (
        <span
          className={styles.statusContainer}
          style={{ color: `${getStatusColor(order.fulfillerStatus)}` }}
        >
          {order.fulfillerStatus}
        </span>
      ),
      orderer: order.orderer?.display,
      orderType: order.orderType.display,
      urgency: order.urgency,
    }));
  }, [paginatedOrders, targetPatientDashboard]);

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />;
  }

  return (
    <DataTable rows={tableRows} headers={tableColumns} useZebraStyles>
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
            }}
          >
            <TableToolbarContent>
              <Layer style={{ margin: "5px" }}>
                <TableToolbarSearch
                  expanded
                  onChange={onInputChange}
                  placeholder={t("searchThisList", "Search this list")}
                  size="sm"
                />
              </Layer>
            </TableToolbarContent>
          </TableToolbar>
          <Table {...getTableProps()} className={styles.activePatientsTable}>
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableHeader {...getHeaderProps({ header })}>
                    {header.header?.content ?? header.header}
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
          {rows.length === 0 ? (
            <div className={styles.tileContainer}>
              <Tile className={styles.tile}>
                <div className={styles.tileContent}>
                  <p className={styles.content}>
                    {t("noLabRequestsFound", "No lab requests found.")}
                  </p>
                </div>
              </Tile>
            </div>
          ) : null}
          <Pagination
            forwardText="Next page"
            backwardText="Previous page"
            page={currentPage}
            pageSize={currentPageSize}
            pageSizes={pageSizes}
            totalItems={labOrders?.length}
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
  );
};

export default CompletedLabRequestsTable;
