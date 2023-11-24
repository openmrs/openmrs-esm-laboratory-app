import React, {
  useState,
  useMemo,
  AnchorHTMLAttributes,
  useCallback,
} from "react";
import { useTranslation } from "react-i18next";
import { EmptyState, ErrorState } from "@openmrs/esm-patient-common-lib";
import { Microscope, TrashCan } from "@carbon/react/icons";

import {
  DataTable,
  DataTableHeader,
  DataTableSkeleton,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableExpandHeader,
  TableExpandRow,
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
  Button,
  Tile,
  DatePicker,
  DatePickerInput,
  Select,
  SelectItem,
} from "@carbon/react";
import { Result, useGetOrdersWorklist } from "./work-list.resource";
import styles from "./work-list.scss";
import {
  formatDate,
  parseDate,
  showModal,
  usePagination,
} from "@openmrs/esm-framework";
import { launchOverlay } from "../components/overlay/hook";
import ResultForm from "../results/result-form.component";
import { getStatusColor } from "../utils/functions";

interface WorklistProps {
  fulfillerStatus: string;
}

interface ResultsOrderProps {
  order: Result;
  patientUuid: string;
}

interface RejectOrderProps {
  order: string;
}

const WorkList: React.FC<WorklistProps> = ({ fulfillerStatus }) => {
  const { t } = useTranslation();

  const [activatedOnOrAfterDate, setActivatedOnOrAfterDate] = useState("");

  const { workListEntries, isLoading } = useGetOrdersWorklist(
    activatedOnOrAfterDate,
    fulfillerStatus
  );

  const pageSizes = [10, 20, 30, 40, 50];
  const [page, setPage] = useState(1);
  const [currentPageSize, setPageSize] = useState(10);
  const [nextOffSet, setNextOffSet] = useState(0);

  const {
    goTo,
    results: paginatedWorkListEntries,
    currentPage,
  } = usePagination(workListEntries, currentPageSize);

  const RejectOrder: React.FC<RejectOrderProps> = ({ order }) => {
    const launchRejectOrderModal = useCallback(() => {
      const dispose = showModal("reject-order-dialog", {
        closeModal: () => dispose(),
        order,
      });
    }, [order]);
    return (
      <Button
        kind="ghost"
        onClick={launchRejectOrderModal}
        renderIcon={(props) => <TrashCan size={16} {...props} />}
      />
    );
  };

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
    { id: 7, header: t("orderType", "Order Type"), key: "orderType" },
    { id: 8, header: t("urgency", "Urgency"), key: "urgency" },
    { id: 9, header: t("actions", "Actions"), key: "actions" },
  ];

  const ResultsOrder: React.FC<ResultsOrderProps> = ({
    order,
    patientUuid,
  }) => {
    return (
      <Button
        kind="ghost"
        onClick={() => {
          launchOverlay(
            t("resultForm", "Result  Tests"),
            <ResultForm patientUuid={patientUuid} order={order} />
          );
        }}
        renderIcon={(props) => <Microscope size={16} {...props} />}
      />
    );
  };

  const tableRows = useMemo(() => {
    return paginatedWorkListEntries?.map((entry, index) => ({
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
      orderType: { content: <span>{entry.orderType.display}</span> },
      urgency: { content: <span>{entry.urgency}</span> },
      actions: {
        content: (
          <>
            <ResultsOrder
              patientUuid={entry.patient.uuid}
              order={paginatedWorkListEntries[index]}
            />
            <RejectOrder order={paginatedWorkListEntries[index].uuid} />
          </>
        ),
      },
    }));
  }, [ResultsOrder, paginatedWorkListEntries]);

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />;
  }

  if (paginatedWorkListEntries?.length >= 0) {
    return (
      <div>
        <div className={styles.headerBtnContainer}></div>
        <DataTable rows={tableRows} headers={columns} isSortable useZebraStyles>
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
                        {header.header}
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
                totalItems={paginatedWorkListEntries?.length}
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

export default WorkList;
