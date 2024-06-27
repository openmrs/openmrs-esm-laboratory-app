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
import styles from "./orders-data-table.scss";
import { getStatusColor } from "../../utils";
import { FulfillerStatus } from "../../types";
import { useLabOrders } from "../../laboratory-resource";

interface OrdersDataTableProps {
  useFilter?: boolean;
  actionsSlotName?: string;
  excludeColumns?: string[];
  fulfillerStatus?: FulfillerStatus;
  excludeCanceledAndDiscontinuedOrders?: boolean;
}

const OrdersDataTable: React.FC<OrdersDataTableProps> = ({
  useFilter = false,
  actionsSlotName,
  excludeColumns = [],
  fulfillerStatus,
  excludeCanceledAndDiscontinuedOrders = true,
}) => {
  const { t } = useTranslation();
  const {
    targetPatientDashboard: { redirectToResultsViewer, redirectToOrders },
  } = useConfig();
  const [filter, setFilter] = useState<FulfillerStatus>(null);
  const { labOrders, isLoading } = useLabOrders(
    useFilter ? filter : fulfillerStatus,
    excludeCanceledAndDiscontinuedOrders
  );
  const orderStatuses = [
    {
      value: null,
      display: t("all", "All"),
    },
    {
      value: "NEW",
      display: t("newStatus", "NEW"),
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

  const columns = useMemo(() => {
    return [
      { key: "date", header: t("date", "Date") },
      {
        key: "orderNumber",
        header: t("orderNumber", "Order Number"),
      },
      { key: "patient", header: t("patient", "Patient") },
      { key: "test", header: t("test", "Test") },
      { key: "status", header: t("status", "Status") },
      { key: "orderedBy", header: t("orderedBy", "Ordered By") },
      { key: "urgency", header: t("urgency", "Urgency") },
      { key: "actions", header: t("actions", "Actions") },
    ].filter((column) => !excludeColumns.includes(column.key));
  }, [excludeColumns, t]);

  const pageSizes = [10, 20, 30, 40, 50];
  const [currentPageSize, setPageSize] = useState(10);
  const {
    goTo,
    results: paginatedLabOrders,
    currentPage,
  } = usePagination(labOrders, currentPageSize);

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
          to={`\${openmrsSpaBase}/patient/${order.patient?.uuid}/chart/${
            fulfillerStatus == "COMPLETED"
              ? redirectToResultsViewer
              : redirectToOrders
          }`}
        >
          {order.patient?.display.split("-")[1]}
        </ConfigurableLink>
      ),
      orderNumber: order.orderNumber,
      test: order.concept?.display,
      status: (
        <span
          className={styles.statusContainer}
          style={{ color: `${getStatusColor(order.fulfillerStatus)}` }}
        >
          {order.fulfillerStatus}
        </span>
      ),
      orderedBy: order.orderer.display.split("-")[1],
      urgency: order.urgency,
      actions: (
        <CustomOverflowMenu menuTitle={<OverflowMenuVertical />}>
          <ExtensionSlot
            className={styles.menuLink}
            state={{ order: paginatedLabOrders[index] }}
            name={actionsSlotName}
          />
        </CustomOverflowMenu>
      ),
    }));
  }, [
    paginatedLabOrders,
    redirectToResultsViewer,
    redirectToOrders,
    actionsSlotName,
  ]);

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
          <TableToolbar>
            <TableToolbarContent>
              {useFilter && (
                <Layer className={styles.toolbarItem}>
                  <Dropdown
                    id="orderStatusFilter"
                    initialSelectedItem={
                      filter
                        ? orderStatuses.find(
                            (status) => status.value === filter
                          )
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
              )}
              <Layer className={styles.toolbarItem}>
                <TableToolbarSearch
                  expanded
                  onChange={onInputChange}
                  placeholder={t("searchThisList", "Search this list")}
                  size="sm"
                />
              </Layer>
            </TableToolbarContent>
          </TableToolbar>
          <Table {...getTableProps()} className={styles.tableWrapper}>
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
            forwardText={t("nextPage", "Next page")}
            backwardText={t("previousPage", "Previous page")}
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

export default OrdersDataTable;
