import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  DataTable,
  DataTableSkeleton,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableExpandHeader,
  TableExpandRow,
  OverflowMenuItem,
  OverflowMenu,
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
  Tile,
  Button,
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
  showModal,
  usePagination,
  useSession,
} from "@openmrs/esm-framework";
import styles from "./laboratory-queue.scss";
import { getStatusColor } from "../utils/functions";
import { Result, useGetOrdersWorklist } from "../work-list/work-list.resource";
import OrderCustomOverflowMenuComponent from "../ui-components/overflow-menu.component";

interface LaboratoryPatientListProps {}

interface RejectOrderProps {
  order: Result;
}

const LaboratoryPatientList: React.FC<LaboratoryPatientListProps> = () => {
  const { t } = useTranslation();

  const [activatedOnOrAfterDate, setActivatedOnOrAfterDate] = useState("");

  const { workListEntries, isLoading } = useGetOrdersWorklist(
    activatedOnOrAfterDate,
    ""
  );

  const pageSizes = [10, 20, 30, 40, 50];
  const [currentPageSize, setPageSize] = useState(10);

  const {
    goTo,
    results: paginatedWorklistQueueEntries,
    currentPage,
  } = usePagination(workListEntries, currentPageSize);
  // get picked orders
  let columns = [
    { id: 0, header: t("date", "Date"), key: "date" },

    { id: 1, header: t("orderNumber", "Order Number"), key: "orderNumber" },
    {
      id: 2,
      header: t("accessionNumber", "Accession Number"),
      key: "accessionNumber",
    },
    { id: 3, header: t("test", "Test"), key: "test" },
    { id: 4, header: t("action", "Action"), key: "action" },
    { id: 5, header: t("status", "Status"), key: "status" },
    { id: 6, header: t("orderer", "Orderer"), key: "orderer" },
    { id: 8, header: t("urgency", "Urgency"), key: "urgency" },
    { id: 9, header: t("actions", "Actions"), key: "actions" },
  ];

  const tableRows = useMemo(() => {
    return paginatedWorklistQueueEntries
      ?.filter((item) => item.action === "NEW")
      .map((entry, index) => ({
        ...entry,
        id: entry.uuid,
        date: {
          content: (
            <>
              <span>{formatDate(parseDate(entry.dateActivated))}</span>
            </>
          ),
        },
        orderNumber: { content: <span>{entry.orderNumber}</span> },
        accessionNumber: { content: <span>{entry.accessionNumber}</span> },
        test: { content: <span>{entry.concept.display}</span> },
        action: { content: <span>{entry.action}</span> },
        status: {
          content: (
            <>
              <Tag>
                <span
                  className={styles.statusContainer}
                  style={{ color: `${getStatusColor(entry.fulfillerStatus)}` }}
                >
                  <span>{entry.fulfillerStatus}</span>
                </span>
              </Tag>
            </>
          ),
        },
        orderer: { content: <span>{entry.orderer.display}</span> },
        urgency: { content: <span>{entry.urgency}</span> },
        actions: {
          content: (
            <>
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
            </>
          ),
        },
      }));
  }, [paginatedWorklistQueueEntries]);

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />;
  }

  if (paginatedWorklistQueueEntries?.length >= 0) {
    return (
      <div>
        <div className={styles.headerBtnContainer}></div>
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
                  height: "3rem",
                  overflow: "visible",
                  backgroundColor: "color",
                }}
              >
                <TableToolbarContent>
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
                          "No workists orders to display"
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
      </div>
    );
  }
};

export default LaboratoryPatientList;
