import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  DataTable,
  DataTableSkeleton,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  Tile,
  Dropdown,
  TableToolbar,
  TableToolbarContent,
  Layer,
  TableToolbarSearch,
} from "@carbon/react";
import { OverflowMenuVertical } from "@carbon/react/icons";
import {
  ConfigurableLink,
  CustomOverflowMenu,
  ExtensionSlot,
  formatDate,
  parseDate,
  useConfig,
  usePagination,
} from "@openmrs/esm-framework";
import styles from "./tests-ordered-table.component.scss";
import { getStatusColor } from "../../utils";
import { FulfillerStatus } from "../../types";
import { useLabOrders } from "../../laboratory-resource";

const TestsOrderedTable: React.FC<{}> = () => {
  const { t } = useTranslation();
  const { targetPatientDashboard } = useConfig();
  const [filter, setFilter] = useState<FulfillerStatus>(null);
  const { labOrders, isLoading } = useLabOrders(filter);
  const orderStatuses = [
    {
      value: null,
      display: t("all", "All"),
    },
    {
      value: "RECEIVED",
      display: t("receivedStatus", "RECEIVED"),
    },
    {
      value: "IN_PROGRESS",
      display: t("inProgressStatus", "IN_PROGRESS"),
    },
    {
      value: "COMPLETED",
      display: t("completedStatus", "COMPLETED"),
    },
    {
      value: "EXCEPTION",
      display: t("exceptionStatus", "EXCEPTION"),
    },
    {
      value: "ON_HOLD",
      display: t("onHoldStatus", "ON_HOLD"),
    },
    {
      value: "DECLINED",
      display: t("declinedStatus", "DECLINED"),
    },
  ];
  const pageSizes = [10, 20, 30, 40, 50];
  const [currentPageSize, setPageSize] = useState(10);
  const {
    goTo,
    results: paginatedLabOrders,
    currentPage,
  } = usePagination(labOrders, currentPageSize);

  const columns = [
    { id: "date", header: t("date", "Date"), key: "date" },
    {
      id: "order-number",
      header: t("orderNumber", "Order Number"),
      key: "orderNumber",
    },
    { id: "patient-name", header: t("patient", "Patient"), key: "patient" },
    { id: "test", header: t("test", "Test"), key: "test" },
    { id: "action", header: t("action", "Action"), key: "action" },
    { id: "status", header: t("status", "Status"), key: "status" },
    { id: "orderer", header: t("orderedBy", "Ordered By"), key: "orderedBy" },
    { id: "urgency", header: t("urgency", "Urgency"), key: "urgency" },
    { id: "actions", header: t("actions", "Actions"), key: "actions" },
  ];

  const handleOrderStatusChange = ({ selectedItem }) =>
    setFilter(selectedItem.value);

  const tableRows = useMemo(() => {
    return paginatedLabOrders.map((order, index) => ({
      id: order.uuid,
      date: (
        <span className={styles.singleLineDisplay}>
          {formatDate(parseDate(order.dateActivated))}
        </span>
      ),
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
      orderedBy: order.orderer.display,
      urgency: order.urgency,
      actions: (
        <CustomOverflowMenu
          menuTitle={
            <OverflowMenuVertical size={16} style={{ marginLeft: "0.3rem" }} />
          }
        >
          <ExtensionSlot
            className={styles.menuLink}
            state={{ order: paginatedLabOrders[index] }}
            name="tests-ordered-actions-slot"
          />
        </CustomOverflowMenu>
      ),
    }));
  }, [paginatedLabOrders, targetPatientDashboard]);

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />;
  }
  return (
    <DataTable
      rows={tableRows}
      headers={columns}
      useZebraStyles
      overflowMenuOnHover={true}
    >
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
                <Dropdown
                  id="orderStatus"
                  initialSelectedItem={
                    filter
                      ? orderStatuses.find((status) => status.value === filter)
                      : orderStatuses[0]
                  }
                  titleText={
                    t("filterOrdersByStatus", "Filter orders by status") + ":"
                  }
                  type="inline"
                  items={orderStatuses}
                  onChange={handleOrderStatusChange}
                  itemToString={(item) => item?.display}
                />
              </Layer>
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
                    {t(
                      "noLabRequestsFoundCheckFilters",
                      "No lab requests found. Please check your filters and try again."
                    )}
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

export default TestsOrderedTable;
