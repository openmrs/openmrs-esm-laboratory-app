import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetOrdersWorklist } from "../work-list/work-list.resource";
import {
  ErrorState,
  formatDate,
  parseDate,
  showModal,
  usePagination,
} from "@openmrs/esm-framework";
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
  TableToolbarSearch,
  Layer,
  Tile,
  DatePicker,
  DatePickerInput,
  Select,
  SelectItem,
  Button,
  Tag,
} from "@carbon/react";

import styles from "./review-list.scss";
import { Add } from "@carbon/react/icons";
import { Ob } from "../patient-chart/laboratory-order.resource";
import { Encounter } from "../types";
import { getStatusColor } from "../utils/functions";

interface ReviewlistProps {
  fulfillerStatus: string;
}
interface ApproveResultMenuProps {
  encounterUuid: string;
}

const ApproveTestMenu: React.FC<ApproveResultMenuProps> = ({
  encounterUuid,
}) => {
  const { t } = useTranslation();
  const launchReviewItemModal = useCallback(() => {
    const dispose = showModal("review-item-dialog", {
      encounterUuid,
      closeModal: () => dispose(),
    });
  }, [encounterUuid]);

  return (
    <Button
      kind="ghost"
      onClick={launchReviewItemModal}
      iconDescription={t("approveTest", "Approve Results")}
      renderIcon={(props) => <Add size={16} {...props} />}
    >
      {t("approveTest", "Approve Results")}
    </Button>
  );
};

const ReviewList: React.FC<ReviewlistProps> = ({ fulfillerStatus }) => {
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
  ];

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
    }));
  }, [paginatedWorkListEntries]);

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
                          <TableCell className="cds--table-column-menu">
                            <ApproveTestMenu
                              encounterUuid={
                                paginatedWorkListEntries[index].encounter.uuid
                              }
                            />
                          </TableCell>
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
                          "noReviewListToDisplay",
                          "No review list to display"
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

export default ReviewList;
