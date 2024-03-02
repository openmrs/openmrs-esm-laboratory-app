import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetOrdersWorklist } from "../work-list/work-list.resource";
import {
  formatDate,
  parseDate,
  usePagination,
  ConfigurableLink,
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
  TabPanel,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Layer,
  Tag,
  Button,
  Tile,
  DatePicker,
  DatePickerInput,
} from "@carbon/react";
import styles from "./completed-list.scss";
import { getStatusColor } from "../utils/functions";

interface CompletedListProps {
  fulfillerStatus: string;
}

const CompletedList: React.FC<CompletedListProps> = ({ fulfillerStatus }) => {
  const { t } = useTranslation();

  const [activatedOnOrAfterDate, setActivatedOnOrAfterDate] = useState("");

  const { workListEntries, isLoading } = useGetOrdersWorklist(
    activatedOnOrAfterDate,
    fulfillerStatus
  );

  const pageSizes = [10, 20, 30, 40, 50];
  const [currentPageSize, setPageSize] = useState(10);

  const {
    goTo,
    results: paginatedWorkListEntries,
    currentPage,
  } = usePagination(workListEntries, currentPageSize);

  const tableColumns = [
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
    { id: 7, header: t("orderer", "Orderer"), key: "orderer" },
    { id: 8, header: t("urgency", "Urgency"), key: "urgency" },
  ];

  const tableRows = useMemo(() => {
    return paginatedWorkListEntries
      ?.filter((item) => item.fulfillerStatus === fulfillerStatus)
      .map((entry) => ({
        ...entry,
        id: entry.uuid,
        date: <span>{formatDate(parseDate(entry.dateActivated))}</span>,

        patient: {
          content: (
            <ConfigurableLink
              to={`\${openmrsSpaBase}/patient/${entry.patient.uuid}/chart/laboratory-orders`}
            >
              {entry.patient.display.split("-")[1]}
            </ConfigurableLink>
          ),
        },
        orderNumber: <span>{entry.orderNumber}</span>,
        accessionNumber: <span>{entry.accessionNumber}</span>,
        test: <span>{entry.concept.display}</span>,
        action: <span>{entry.action}</span>,
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
        orderer: <span>{entry.orderer.display}</span>,
        orderType: <span>{entry.orderType.display}</span>,
        urgency: <span>{entry.urgency}</span>,
      }));
  }, [fulfillerStatus, paginatedWorkListEntries]);

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />;
  }

  if (paginatedWorkListEntries?.length >= 0) {
    return (
      <DataTable rows={tableRows} headers={tableColumns} useZebraStyles>
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
                      {t("noCompletedList", "No Completed orders to display")}
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

export default CompletedList;
