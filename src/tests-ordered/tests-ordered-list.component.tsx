import React, { useMemo, useState } from "react";
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
  TableToolbar,
  TableToolbarContent,
  Layer,
  Tile,
  TableToolbarSearch,
} from "@carbon/react";
import { OverflowMenuVertical } from "@carbon/react/icons";

import { useTranslation } from "react-i18next";
import {
  ExtensionSlot,
  formatDate,
  parseDate,
  usePagination,
} from "@openmrs/esm-framework";
import styles from "./laboratory-queue.scss";
import { useGetOrdersWorklist } from "../work-list/work-list.resource";
import OrderCustomOverflowMenuComponent from "../ui-components/overflow-menu.component";

interface LaboratoryPatientListProps {}

const TestsOrderedList: React.FC<LaboratoryPatientListProps> = () => {
  const { t } = useTranslation();

  const { data: pickedOrderList, isLoading } = useGetOrdersWorklist("");

  const data = pickedOrderList.filter(
    (item) =>
      item?.action === "NEW" &&
      item?.dateStopped === null &&
      item?.fulfillerStatus === null
  );

  const pageSizes = [10, 20, 30, 40, 50];
  const [currentPageSize, setPageSize] = useState(10);

  const {
    goTo,
    results: paginatedPickedOrderQueueEntries,
    currentPage,
  } = usePagination(data, currentPageSize);
  // get picked orders
  let columns = [
    { id: 0, header: t("date", "Date"), key: "date" },

    { id: 1, header: t("orderNumber", "Order Number"), key: "orderNumber" },
    { id: 2, header: t("patient", "Patient"), key: "patient" },
    { id: 3, header: t("test", "Test"), key: "test" },
    { id: 4, header: t("orderer", "Ordered By"), key: "orderer" },
    { id: 5, header: t("urgency", "Urgency"), key: "urgency" },
    { id: 6, header: t("actions", "Actions"), key: "actions" },
  ];

  const tableRows = useMemo(() => {
    return paginatedPickedOrderQueueEntries.map((entry, index) => ({
      ...entry,
      id: entry?.uuid,
      date: (
        <span className={styles["single-line-display"]}>
          {formatDate(parseDate(entry?.dateActivated))}
        </span>
      ),
      patient: entry?.patient?.display.split("-")[1],
      orderNumber: entry?.orderNumber,
      accessionNumber: entry?.accessionNumber,
      test: entry?.concept?.display,
      action: entry?.action,
      orderer: entry?.orderer?.display,
      urgency: entry?.urgency,
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
            state={{ order: paginatedPickedOrderQueueEntries[index] }}
            name="order-actions-slot"
          />
        </OrderCustomOverflowMenuComponent>
      ),
    }));
  }, [paginatedPickedOrderQueueEntries]);

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />;
  }

  if (paginatedPickedOrderQueueEntries?.length >= 0) {
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
                {rows.map((row) => {
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
              totalItems={data?.length}
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
