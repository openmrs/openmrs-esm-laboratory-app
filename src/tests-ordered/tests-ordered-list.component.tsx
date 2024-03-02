import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  Dropdown,
  TableToolbar,
  TableToolbarContent,
  Layer,
  Tag,
  Tile,
  DatePicker,
  DatePickerInput,
} from "@carbon/react";
import { TrashCan, OverflowMenuVertical } from "@carbon/react/icons";

import { useTranslation } from "react-i18next";
import {
  ExtensionSlot,
  age,
  formatDate,
  formatDatetime,
  parseDate,
  usePagination,
} from "@openmrs/esm-framework";
import styles from "./laboratory-queue.scss";
import { getStatusColor } from "../utils/functions";
import { Result, useGetOrdersWorklist } from "../work-list/work-list.resource";
import OrderCustomOverflowMenuComponent from "../ui-components/overflow-menu.component";

interface LaboratoryPatientListProps {}

interface RejectOrderProps {
  order: Result;
}

const TestsOrderedList: React.FC<LaboratoryPatientListProps> = () => {
  const { t } = useTranslation();

  const OrderStatuses = [
    "All",
    "RECEIVED",
    "IN_PROGRESS",
    "COMPLETED",
    "EXCEPTION",
    "ON_HOLD",
    "DECLINED",
  ];

  const [activatedOnOrAfterDate, setActivatedOnOrAfterDate] = useState("");

  const [filter, setFilter] = useState<
    | "All"
    | "EXCEPTION"
    | "RECEIVED"
    | "COMPLETED"
    | "IN_PROGRESS"
    | "ON_HOLD"
    | "DECLINED"
  >("All");

  const { workListEntries, isLoading } = useGetOrdersWorklist(
    activatedOnOrAfterDate,
    ""
  );

  const filteredStatus = useMemo(() => {
    if (!filter || filter == "All") {
      return workListEntries;
    }

    if (filter) {
      return workListEntries?.filter(
        (order) => order.fulfillerStatus === filter
      );
    }

    return workListEntries;
  }, [filter, workListEntries]);

  const pageSizes = [10, 20, 30, 40, 50];
  const [currentPageSize, setPageSize] = useState(10);

  const {
    goTo,
    results: paginatedWorklistQueueEntries,
    currentPage,
  } = usePagination(filteredStatus, currentPageSize);
  // get picked orders
  let columns = [
    { id: 0, header: t("date", "Date"), key: "date" },

    { id: 1, header: t("orderNumber", "Order Number"), key: "orderNumber" },
    { id: 2, header: t("patient", "Patient"), key: "patient" },

    {
      id: 3,
      header: t("accessionNumber", "Accession Number"),
      key: "accessionNumber",
    },
    { id: 4, header: t("test", "Test"), key: "test" },
    { id: 5, header: t("action", "Action"), key: "action" },
    { id: 6, header: t("status", "Status"), key: "status" },
    { id: 8, header: t("orderer", "Orderer"), key: "orderer" },
    { id: 9, header: t("urgency", "Urgency"), key: "urgency" },
    { id: 10, header: t("actions", "Actions"), key: "actions" },
  ];

  const handleOrderStatusChange = ({ selectedItem }) => setFilter(selectedItem);

  const tableRows = useMemo(() => {
    return paginatedWorklistQueueEntries
      ?.filter(
        (item) => item.action === "NEW" && item?.fulfillerStatus === null
      )
      .map((entry, index) => ({
        ...entry,
        id: entry?.uuid,
        date: (
          <span className={styles["single-line-display"]}>
            {formatDate(parseDate(entry?.dateActivated))}
          </span>
        ),
        patient: <span>{entry?.patient?.display.split("-")[1]}</span>,
        orderNumber: <span>{entry?.orderNumber}</span>,
        accessionNumber: <span>{entry?.accessionNumber}</span>,
        test: <span>{entry?.concept?.display}</span>,
        action: <span>{entry?.action}</span>,
        status: (
          <Tag>
            <span
              className={styles.statusContainer}
              style={{ color: `${getStatusColor(entry?.fulfillerStatus)}` }}
            >
              <span>{entry?.fulfillerStatus}</span>
            </span>
          </Tag>
        ),
        orderer: <span>{entry?.orderer?.display}</span>,
        urgency: <span>{entry?.urgency}</span>,
        actions: (
          <OrderCustomOverflowMenuComponent
            menuTitle={
              <>
                <OverflowMenuVertical
                  size={16}
                  style={{ marginLeft: "0.3rem" }}
                />
              </>
            }
          >
            <ExtensionSlot
              className={styles.menuLink}
              state={{ order: paginatedWorklistQueueEntries[index] }}
              name="order-actions-slot"
            />
          </OrderCustomOverflowMenuComponent>
        ),
      }));
  }, [paginatedWorklistQueueEntries]);

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />;
  }

  if (paginatedWorklistQueueEntries?.length >= 0) {
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
                    initialSelectedItem={"All"}
                    label=""
                    titleText={
                      t("filterOrdersByStatus", "Filter Orders by status") + ":"
                    }
                    type="inline"
                    items={OrderStatuses}
                    onChange={handleOrderStatusChange}
                  />
                </Layer>

                <Layer style={{ margin: "5px" }}>
                  <DatePicker dateFormat="Y-m-d" datePickerType="single">
                    <DatePickerInput
                      labelText={""}
                      id="activatedOnOrAfterDate"
                      placeholder="YYYY-MM-DD"
                      onChange={(event) => {
                        setActivatedOnOrAfterDate(event.target.value);
                      }}
                      type="date"
                      value={activatedOnOrAfterDate}
                    />
                  </DatePicker>
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
                        "noWorklistsToDisplay",
                        "No worklists orders to display"
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
              totalItems={workListEntries?.length}
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
  }
};

export default TestsOrderedList;
