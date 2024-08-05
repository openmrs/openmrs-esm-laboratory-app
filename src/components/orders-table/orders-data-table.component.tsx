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
  DatePicker,
  DatePickerInput,
} from "@carbon/react";
import { OverflowMenuVertical } from "@carbon/react/icons";
import {
  ConfigurableLink,
  CustomOverflowMenu,
  ExtensionSlot,
  formatDate,
  parseDate,
  useConfig,
  useDebounce,
  usePagination,
} from "@openmrs/esm-framework";
import styles from "./orders-data-table.scss";
import { getStatusColor } from "../../utils";
import { FulfillerStatus } from "../../types";
import { useLabOrders } from "../../laboratory-resource";
import dayjs from "dayjs";
import { isoDateTimeString } from "../../constants";
import useSearchResults from "./orders-data-table.resource";
interface OrdersDataTableProps {
  useFilter?: boolean;
  actionsSlotName?: string;
  excludeColumns?: string[];
  fulfillerStatus?: FulfillerStatus;
  excludeCanceledAndDiscontinuedOrders?: boolean;
  useActivatedOnOrAfterDateFilter?: boolean;
}

const OrdersDataTable: React.FC<OrdersDataTableProps> = ({
  useFilter = false,
  actionsSlotName,
  excludeColumns = [],
  fulfillerStatus,
  excludeCanceledAndDiscontinuedOrders = true,
  useActivatedOnOrAfterDateFilter = true,
}) => {
  const { t } = useTranslation();
  const {
    targetPatientDashboard: { redirectToResultsViewer, redirectToOrders },
  } = useConfig();

  const [filter, setFilter] = useState<FulfillerStatus>(null);
  const [activatedOnOrAfterDate, setActivatedOnOrAfterDate] = useState<string>(
    dayjs().startOf("day").format(isoDateTimeString)
  );
  const [searchString, setSearchString] = useState<string>("");

  const { labOrders, isLoading } = useLabOrders(
    useFilter ? filter : fulfillerStatus,
    excludeCanceledAndDiscontinuedOrders,
    activatedOnOrAfterDate
  );

  const flattenedLabOrders = useMemo(() => {
    return labOrders.map((eachObject) => {
      return {
        ...eachObject,
        dateActivated: formatDate(parseDate(eachObject.dateActivated)),
        patient: eachObject.patient?.display.split("-")[1],
        patientUuid: eachObject.patient?.uuid,
        status: eachObject.fulfillerStatus ?? "--",
        orderer: eachObject.orderer?.display.split("-")[1],
      };
    });
  }, [labOrders]);

  const debouncedSearchString = useDebounce(searchString);

  const searchResults = useSearchResults(
    flattenedLabOrders,
    debouncedSearchString
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
  } = usePagination(searchResults, currentPageSize);

  const handleOrderStatusChange = ({ selectedItem }) =>
    setFilter(selectedItem.value);

  const handleActivateOnOrAfterDateChange = (date: string) =>
    setActivatedOnOrAfterDate(
      dayjs(date).startOf("day").format(isoDateTimeString)
    );

  const tableRows = useMemo(() => {
    return paginatedLabOrders.map((order, index) => ({
      id: order.uuid,
      date: (
        <span className={styles.singleLineDisplay}>{order.dateActivated}</span>
      ),
      patient: (
        <ConfigurableLink
          to={`\${openmrsSpaBase}/patient/${order?.patientUuid}/chart/${
            fulfillerStatus == "COMPLETED"
              ? redirectToResultsViewer
              : redirectToOrders
          }`}
        >
          {order.patient}
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
      orderedBy: order.orderer,
      urgency: order.urgency,
      actions: (
        <>
          <ExtensionSlot
            className={styles.menuLink}
            state={{
              order: paginatedLabOrders[index],
              patientUuid: order.patientUuid,
            }}
            name={actionsSlotName}
          />
        </>
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
      {({ rows, headers, getHeaderProps, getTableProps, getRowProps }) => (
        <TableContainer className={styles.tableContainer}>
          <TableToolbar>
            <TableToolbarContent>
              {
                <Layer className={styles.toolbarItem}>
                  {useFilter && (
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
                        t("filterOrdersByStatus", "Filter orders by status") +
                        ":"
                      }
                      type="inline"
                      items={orderStatuses}
                      onChange={handleOrderStatusChange}
                      itemToString={(item) => item?.display}
                    />
                  )}
                  {useActivatedOnOrAfterDateFilter && (
                    <>
                      <p>
                        {t(
                          "onOrAfterDateFilter",
                          "Filter orders on or after : "
                        )}
                      </p>
                      <DatePicker
                        onChange={([date]) =>
                          handleActivateOnOrAfterDateChange(date)
                        }
                        maxDate={new Date()}
                        datePickerType="single"
                        value={new Date(activatedOnOrAfterDate).toISOString()}
                      >
                        <DatePickerInput
                          placeholder="mm/dd/yyyy"
                          labelText=""
                          id="date-picker-single"
                          size="md"
                        />
                      </DatePicker>
                    </>
                  )}
                </Layer>
              }
              <Layer className={styles.toolbarItem}>
                <TableToolbarSearch
                  expanded
                  onChange={(e) => setSearchString(e.target.value)}
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
