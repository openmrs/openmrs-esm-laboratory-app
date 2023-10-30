import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { EmptyState } from "@ohri/openmrs-esm-ohri-commons-lib";
import styles from "./laboratory-order.scss";
import {
  usePagination,
  useSession,
  formatDate,
  openmrsFetch,
  parseDate,
  ErrorState,
  useLayoutType,
  showModal,
} from "@openmrs/esm-framework";

import {
  DataTable,
  DataTableSkeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Layer,
  Tag,
  DataTableHeader,
  Tile,
  Pagination,
  TableExpandHeader,
  TableExpandRow,
  TableExpandedRow,
  Button,
} from "@carbon/react";
import { Printer, MailAll, Edit } from "@carbon/react/icons";

import ViewLaboratoryItemActionMenu from "./laboratory-item/view-laboratory-item.component";
import { getOrderColor, useLabOrders } from "./laboratory-order.resource";
import TestsResults from "./results-summary/test-results-table.component";
import { useReactToPrint } from "react-to-print";
import SendEmailDialog from "./results-summary/send-email-dialog.component";
import PrintResultsSummary from "./results-summary/print-results-summary.component";
import { EncounterResponse } from "./laboratory-item/view-laboratory-item.resource";

interface LaboratoryOrderOverviewProps {
  patientUuid: string;
}

interface PrintProps {
  encounter: EncounterResponse;
}

type FilterProps = {
  rowIds: Array<string>;
  headers: any;
  cellsById: any;
  inputValue: string;
  getCellId: (row, key) => string;
};

const LaboratoryOrder: React.FC<LaboratoryOrderOverviewProps> = ({
  patientUuid,
}) => {
  const { t } = useTranslation();

  const isTablet = useLayoutType() === "tablet";

  const {
    labRequests,
    isLoading: loading,
    isError,
  } = useLabOrders(patientUuid);

  const pageSizes = [10, 20, 30, 40, 50];
  const [page, setPage] = useState(1);
  const [currentPageSize, setPageSize] = useState(10);
  const [nextOffSet, setNextOffSet] = useState(0);

  const {
    goTo,
    results: paginatedLabEntries,
    currentPage,
  } = usePagination(labRequests, currentPageSize);

  let columns = [
    {
      id: 0,
      header: t("orderDate", "Order Date"),
      key: "orderDate",
    },
    { id: 1, header: t("orders", "Order"), key: "orders" },
    { id: 2, header: t("location", "Location"), key: "location" },
    { id: 3, header: t("status", "Status"), key: "status" },
    { id: 4, header: t("actions", "Action"), key: "actions" },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState(paginatedLabEntries);
  const [initialTests] = useState(paginatedLabEntries);

  const handleChange = useCallback(
    (val) => {
      const searchText = val?.target?.value;
      setSearchTerm(searchText);
      if (searchText?.trim() == "") {
        setItems(initialTests);
      } else {
        let filteredItems = [];
        items.map((item) => {
          const newArray = item?.orders?.filter(
            (order) =>
              order?.concept?.display
                .toLowerCase()
                .startsWith(searchText?.toLowerCase()) == true
          );
          if (newArray.length >= 1) {
            filteredItems.push(item);
          }
        });

        setItems(filteredItems);
      }
    },
    [items, initialTests]
  );

  const EmailButtonAction: React.FC = () => {
    const launchSendEmailModal = useCallback(() => {
      const dispose = showModal("send-email-dialog", {
        closeModal: () => dispose(),
      });
    }, []);

    return (
      <Button
        kind="ghost"
        size="sm"
        onClick={(e) => launchSendEmailModal()}
        renderIcon={(props) => <MailAll size={16} {...props} />}
      />
    );
  };

  const PrintButtonAction: React.FC<PrintProps> = ({ encounter }) => {
    const [isPrinting, setIsPrinting] = useState(false);

    const contentToPrintRef = useRef(null);

    const onBeforeGetContentResolve = useRef(null);

    useEffect(() => {
      if (onBeforeGetContentResolve.current) {
        onBeforeGetContentResolve.current();
      }
    }, [isPrinting]);

    const handlePrint = useReactToPrint({
      content: () => contentToPrintRef.current,
      onBeforeGetContent: () =>
        new Promise((resolve) => {
          onBeforeGetContentResolve.current = resolve;
          setIsPrinting(true);
        }),
      onAfterPrint: () => {
        onBeforeGetContentResolve.current = null;
        setIsPrinting(false);
      },
    });

    return (
      <div>
        <div ref={contentToPrintRef}>
          <PrintResultsSummary encounterResponse={encounter} />
        </div>
        <Button
          kind="ghost"
          size="sm"
          onClick={handlePrint}
          renderIcon={(props) => <Printer size={16} {...props} />}
        />
      </div>
    );
  };
  const handleFilter = ({
    rowIds,
    headers,
    cellsById,
    inputValue,
    getCellId,
  }: FilterProps): Array<string> => {
    return rowIds.filter((rowId) =>
      headers.some(({ key }) => {
        const cellId = getCellId(rowId, key);
        const filterableValue = cellsById[cellId].value;
        const filterTerm = inputValue.toLowerCase();

        if (typeof filterableValue === "boolean") {
          return false;
        }

        return ("" + filterableValue).toLowerCase().includes(filterTerm);
      })
    );
  };

  const tableRows = useMemo(() => {
    return paginatedLabEntries?.map((entry) => ({
      ...entry,
      id: entry.uuid,
      orderDate: {
        content: (
          <span>
            {formatDate(parseDate(entry.encounterDatetime), {
              time: false,
            })}
          </span>
        ),
      },
      orders: {
        content: (
          <>
            {entry.orders.map((order) => {
              if (order?.type === "testorder") {
                return (
                  <Tag
                    style={{
                      background: `${getOrderColor(
                        order.dateActivated,
                        order.dateStopped
                      )}`,
                      color: "white",
                    }}
                    role="tooltip"
                  >
                    {order?.concept?.display}
                  </Tag>
                );
              }
            })}
          </>
        ),
      },
      location: {
        content: <span>{entry.location.display}</span>,
      },
      status: {
        content: <span>--</span>,
      },
      actions: {
        content: (
          <>
            <PrintButtonAction encounter={entry} />
            <EmailButtonAction />
          </>
        ),
      },
    }));
  }, [paginatedLabEntries]);

  if (loading) {
    return <DataTableSkeleton role="progressbar" />;
  }

  if (isError) {
    return <ErrorState error={isError} headerTitle={"Error"} />;
  }

  if (items?.length >= 0) {
    return (
      <div>
        <DataTable
          rows={tableRows}
          headers={columns}
          useZebraStyles
          filterRows={handleFilter}
          size={isTablet ? "lg" : "sm"}
        >
          {({ rows, headers, getHeaderProps, getTableProps, getRowProps }) => (
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
                  <div
                    style={{
                      fontSize: "10px",
                      margin: "5px",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    Key:
                    <Tag
                      size="sm"
                      style={{
                        background: "green",
                        color: "white",
                      }}
                      title="Result Complete"
                    >
                      {"Completed"}
                    </Tag>
                    <Tag
                      size="sm"
                      style={{
                        background: "red",
                        color: "white",
                      }}
                      title="Result Rejected"
                    >
                      {"Rejected"}
                    </Tag>
                    <Tag
                      size="sm"
                      style={{
                        background: "#6F6F6F",
                        color: "white",
                      }}
                      title="Result Requested"
                    >
                      {"Requested"}
                    </Tag>
                  </div>
                  <Layer>
                    <TableToolbarSearch
                      value={searchTerm}
                      onChange={handleChange}
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
                        <TableExpandRow {...getRowProps({ row })}>
                          {row.cells.map((cell) => (
                            <TableCell key={cell.id}>
                              {cell.value?.content ?? cell.value}
                            </TableCell>
                          ))}
                        </TableExpandRow>
                        {row.isExpanded ? (
                          <TableExpandedRow
                            className={styles.expandedActiveVisitRow}
                            colSpan={headers.length + 2}
                          >
                            <TestsResults
                              obs={paginatedLabEntries[index].obs}
                            />
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
              {rows.length === 0 ? (
                <div className={styles.tileContainer}>
                  <Tile className={styles.tile}>
                    <div className={styles.tileContent}>
                      <p className={styles.content}>
                        {t(
                          "noTestOrdersToDisplay",
                          "No test orders to display"
                        )}
                      </p>
                      <p className={styles.helper}>
                        {t("checkFilters", "Check the filters above")}
                      </p>
                    </div>
                    <p className={styles.separator}>{t("or", "or")}</p>
                  </Tile>
                </div>
              ) : null}
              <Pagination
                forwardText="Next page"
                backwardText="Previous page"
                page={currentPage}
                pageSize={currentPageSize}
                pageSizes={pageSizes}
                totalItems={paginatedLabEntries?.length}
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

  // return (
  //   <div>
  //     {/* <div className={styles.headerBtnContainer}></div> */}
  //     <EmptyState displayText={"Tests Ordered"} headerTitle={"Tests Ordered"} />
  //   </div>
  // );
};

export default LaboratoryOrder;
