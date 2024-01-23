import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import styles from "./laboratory-active-test-order-results.scss";
import {
  formatDate,
  parseDate,
  ErrorState,
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
  Tile,
  Pagination,
  TableExpandHeader,
  TableExpandRow,
  TableExpandedRow,
  Button,
  IconButton,
  InlineLoading,
} from "@carbon/react";

import { Printer, MailAll, Add } from "@carbon/react/icons";

import TestsResults from "../results-summary/test-results-table.component";
import { useReactToPrint } from "react-to-print";
import PrintResultsSummary from "../results-summary/print-results-summary.component";
import { EncounterResponse } from "../laboratory-item/view-laboratory-item.resource";
import { useGetPatientByUuid } from "../../utils/functions";
import {
  ResourceRepresentation,
  getOrderColor,
} from "../patient-laboratory-order-results.resource";
import { useLaboratoryOrderResultsPages } from "../patient-laboratory-order-results-table.resource";
import { CardHeader } from "@openmrs/esm-patient-common-lib";

interface LaboratoryActiveTestOrderResultsProps {
  patientUuid: string;
}

interface PrintProps {
  encounter: EncounterResponse;
}

const LaboratoryActiveTestOrderResults: React.FC<
  LaboratoryActiveTestOrderResultsProps
> = ({ patientUuid }) => {
  const { t } = useTranslation();

  const displayText = t(
    "activelLaboratoryTestsDisplayTextTitle",
    "Active Laboratory Tests"
  );

  const {
    items,
    tableHeaders,
    currentPage,
    pageSizes,
    totalItems,
    goTo,
    currentPageSize,
    setPageSize,
    isLoading,
    isError,
  } = useLaboratoryOrderResultsPages({
    v: ResourceRepresentation.Full,
    totalCount: true,
    patientUuid: patientUuid,
  });

  const sortedLabRequests = useMemo(() => {
    return [...items].sort((a, b) => {
      const dateA = new Date(a.encounterDatetime);
      const dateB = new Date(b.encounterDatetime);
      return dateB.getTime() - dateA.getTime();
    });
  }, [items]);

  const [searchTerm, setSearchTerm] = useState("");
  const [laboratoryOrders, setLaboratoryOrders] = useState(sortedLabRequests);
  const [initialTests, setInitialTests] = useState(sortedLabRequests);

  const handleChange = useCallback((event) => {
    const searchText = event?.target?.value?.trim().toLowerCase();
    setSearchTerm(searchText);
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setLaboratoryOrders(initialTests);
    } else {
      const filteredItems = initialTests.filter((item) =>
        item?.orders?.some((order) =>
          order?.concept?.display.toLowerCase().includes(searchTerm)
        )
      );
      setLaboratoryOrders(filteredItems);
    }
  }, [searchTerm, initialTests]);

  useEffect(() => {
    setInitialTests(sortedLabRequests);
  }, [sortedLabRequests]);

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

  const LaunchLabRequestForm: React.FC = () => {
    return (
      <IconButton label="Add">
        <Add />
      </IconButton>
    );
  };
  const PrintButtonAction: React.FC<PrintProps> = ({ encounter }) => {
    const { patient } = useGetPatientByUuid(encounter.patient.uuid);

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
          <PrintResultsSummary
            encounterResponse={encounter}
            patient={patient}
          />
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

  const currentDateTime = new Date().getTime();
  const twentyFourHoursAgo = currentDateTime - 24 * 60 * 60 * 1000;

  const tableRows = useMemo(() => {
    return laboratoryOrders
      ?.filter((entry) => {
        const entryDate = new Date(entry.encounterDatetime).getTime();
        return entryDate <= twentyFourHoursAgo;
      })
      ?.map((entry, index) => ({
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
            <div>
              <PrintButtonAction encounter={entry} />
              {/* <EmailButtonAction /> */}
            </div>
          ),
        },
      }));
  }, [laboratoryOrders, twentyFourHoursAgo]);

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />;
  }

  if (isError) {
    return <ErrorState error={isError} headerTitle={"Error"} />;
  }

  if (items?.length >= 0) {
    return (
      <div className={styles.widgetCard}>
        <CardHeader title={displayText}>
          {isLoading ? (
            <span>
              <InlineLoading />
            </span>
          ) : null}
          <div className={styles.buttons}>
            <Button
              kind="ghost"
              renderIcon={(props) => <Add size={16} {...props} />}
              iconDescription="Launch lab Request"
            >
              {t("add", "Add")}
            </Button>
          </div>
        </CardHeader>

        <DataTable rows={tableRows} headers={tableHeaders} useZebraStyles>
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
                        background: "#6F6F6F",
                        color: "white",
                      }}
                      title="Result Requested"
                    >
                      {"Requested"}
                    </Tag>
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
                  </div>
                  <Layer>
                    <TableToolbarSearch
                      expanded={true}
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
                            <TestsResults obs={sortedLabRequests[index].obs} />
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
                      <p className={styles.separator}>{t("or", "or")}</p>
                      <LaunchLabRequestForm />
                    </div>
                  </Tile>
                </div>
              ) : null}
              <Pagination
                page={currentPage}
                pageSize={currentPageSize}
                pageSizes={pageSizes}
                totalItems={totalItems}
                onChange={({ pageSize, page }) => {
                  if (pageSize !== currentPageSize) {
                    setPageSize(pageSize);
                  }
                  if (page !== currentPage) {
                    goTo(page);
                  }
                }}
                className={styles.paginationOverride}
              />
            </TableContainer>
          )}
        </DataTable>
      </div>
    );
  }
};

export default LaboratoryActiveTestOrderResults;
