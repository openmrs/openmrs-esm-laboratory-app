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
  TableExpandHeader,
  TableExpandRow,
  TableExpandedRow,
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
import {
  formatDate,
  parseDate,
  useConfig,
  usePagination,
} from "@openmrs/esm-framework";
import styles from "./orders-data-table.scss";
import { FulfillerStatus, OrdersDataTableProps } from "../../types";
import {
  useLabOrders,
  useSearchGroupedResults,
} from "../../laboratory-resource";
import dayjs from "dayjs";
import { isoDateTimeString } from "../../constants";
import ListOrderDetails from "./listOrderDetails.component";

const OrdersDataTable: React.FC<OrdersDataTableProps> = (props) => {
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
    props.useFilter ? filter : props.fulfillerStatus,
    props.excludeCanceledAndDiscontinuedOrders,
    activatedOnOrAfterDate
  );

  const flattenedLabOrders = useMemo(() => {
    return labOrders.map((eachObject) => {
      return {
        ...eachObject,
        dateActivated: formatDate(parseDate(eachObject.dateActivated)),
        patientName: eachObject.patient?.display.split("-")[1],
        patientUuid: eachObject.patient?.uuid,
        status: eachObject.fulfillerStatus ?? "--",
        orderer: eachObject.orderer?.display.split("-")[1],
      };
    });
  }, [labOrders]);

  function groupOrdersById(orders) {
    if (orders && orders.length > 0) {
      const groupedOrders = orders.reduce((acc, item) => {
        if (!acc[item.patientUuid]) {
          acc[item.patientUuid] = [];
        }
        acc[item.patientUuid].push(item);
        return acc;
      }, {});

      // Convert the result to an array of objects with patientId and orders
      return Object.keys(groupedOrders).map((patientId) => ({
        patientId: patientId,
        orders: groupedOrders[patientId],
      }));
    } else {
      return [];
    }
  }
  const groupedOrdersByPatient = groupOrdersById(flattenedLabOrders);
  const searchResults = useSearchGroupedResults(
    groupedOrdersByPatient,
    searchString
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
      { id: 0, header: t("patient", "Patient"), key: "patientName" },
      { id: 1, header: t("totalorders", "Total Orders"), key: "totalOrders" },
    ];
  }, [props.excludeColumns, t]);

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
    return paginatedLabOrders.map((patient, index) => ({
      id: patient.patientId,
      patientName: patient.orders[0].patient?.display?.split("-")[1],
      orders: patient.orders,
      totalOrders: patient.orders?.length,
    }));
  }, [
    paginatedLabOrders,
    redirectToResultsViewer,
    redirectToOrders,
    props.actionsSlotName,
  ]);

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />;
  }
  return (
    <DataTable rows={tableRows} headers={columns} useZebraStyles>
      {({ rows, headers, getHeaderProps, getTableProps, getRowProps }) => (
        <TableContainer className={styles.tableContainer}>
          <TableToolbar>
            <TableToolbarContent>
              {
                <Layer className={styles.toolbarItem}>
                  {props.useFilter && (
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
                  {props.useActivatedOnOrAfterDateFilter && (
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
                <TableExpandHeader />
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
                    <TableExpandRow {...getRowProps({ row })} key={row.id}>
                      {row.cells.map((cell) => (
                        <TableCell key={cell.id}>
                          {cell.value?.content ?? cell.value}
                        </TableCell>
                      ))}
                    </TableExpandRow>
                    <TableExpandedRow colSpan={headers.length + 1}>
                      <ListOrderDetails
                        actions={props.actions}
                        groupedOrders={groupedOrdersByPatient.find(
                          (item) => item.patientId === row.id
                        )}
                      />
                    </TableExpandedRow>
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
            totalItems={groupedOrdersByPatient?.length}
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
