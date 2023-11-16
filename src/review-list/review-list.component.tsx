import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetOrdersWorklist } from "../work-list/work-list.resource";
import { ErrorState, usePagination } from "@openmrs/esm-framework";
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
} from "@carbon/react";

import styles from "./review-list.scss";

interface ReviewlistProps {
  fulfillerStatus: string;
}

const ReviewList: React.FC<ReviewlistProps> = ({ fulfillerStatus }) => {
  const { t } = useTranslation();

  const [careSetting, setCareSetting] = useState();

  const [activatedOnOrAfterDate, setActivatedOnOrAfterDate] = useState();

  const [selectedCareSetting, setSelectedCareSetting] = useState();

  const { workListEntries, isLoading, isError } = useGetOrdersWorklist(
    careSetting,
    activatedOnOrAfterDate,
    fulfillerStatus
  );

  const careSettings = ["INPATIENT", "OUTPATIENT"];

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
    { id: 0, header: t("orderNumber", "Order Number"), key: "orderNumber" },
    {
      id: 1,
      header: t("accessionNumber", "Accession Number"),
      key: "accessionNumber",
    },
    { id: 2, header: t("test", "Test"), key: "test" },
    { id: 3, header: t("action", "Action"), key: "action" },
    { id: 4, header: t("orderer", "Orderer"), key: "orderer" },
    { id: 5, header: t("orderType", "Order Type"), key: "orderType" },
    { id: 6, header: t("urgency", "Urgency"), key: "urgency" },
  ];

  const tableRows = useMemo(() => {
    return paginatedWorkListEntries?.map((entry, index) => ({
      ...entry,
      id: entry.uuid,
      orderNumber: { content: <span>{entry.orderNumber}</span> },
      accessionNumber: { content: <span>{entry.accessionNumber}</span> },
      test: { content: <span>{entry.concept.display}</span> },
      action: { content: <span>{entry.action}</span> },
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
                  <Layer>
                    <Select
                      labelText={t("selectCareSetting", "Select CareSetting")}
                      id="care-setting"
                      invalidText="Required"
                      value={careSetting}
                      onChange={(event) => setCareSetting(event.target.value)}
                    >
                      {!selectedCareSetting ? (
                        <SelectItem
                          text={t("selectCareSetting", "Select CareSetting")}
                          value=""
                        />
                      ) : null}
                      {careSettings?.length > 0 &&
                        careSettings.map((careSetting) => (
                          <SelectItem
                            key={careSetting}
                            text={careSetting}
                            value={careSetting}
                          >
                            {careSetting}
                          </SelectItem>
                        ))}
                    </Select>
                  </Layer>
                  <Layer>
                    <DatePicker datePickerType="single">
                      <DatePickerInput
                        id="activatedOnOrAfterDate"
                        placeholder="mm/dd/yyyy"
                        labelText={t("dateActivated", "Date Activated")}
                        onChange={(event) =>
                          setActivatedOnOrAfterDate(event.target.value)
                        }
                        type="date"
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