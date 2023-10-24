import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
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
  Tile,
  TableExpandHeader,
  TableExpandRow,
  TableExpandedRow,
} from "@carbon/react";
import styles from "./results-summary.scss";
import RescendTestResultActionMenu from "./test-results-rescend-action-menu.component";
import { Order } from "../laboratory-order.resource";
import DeleteTestResultActionMenu from "./test-results-delete-action-menu.component";
import { Result, useGetLabEncounterTests } from "./results/results.resource";

interface TestOrdersProps {
  encounterUuid: string;
  orders: Order[];
}

const TestsResults: React.FC<TestOrdersProps> = ({ encounterUuid, orders }) => {
  const { t } = useTranslation();

  const [ordersList, setOrdersList] = useState(orders);

  const [results, setResults] = useState({});

  const orderNos = useMemo(() => {
    return ordersList?.map((entry) => ({
      orderNo: entry.orderNumber,
    }));
  }, [ordersList]);

  // get encounter results
  const {
    labResults,
    isLoading: loading,
    isError: error,
  } = useGetLabEncounterTests(encounterUuid);

  let list = [];
  orderNos.map((orderNo) => {
    const results = labResults.filter(
      (result) => result?.order === orderNo.orderNo
    );
    list.push(results);
  });
  // setResults(list);

  let columns = [
    {
      id: 0,
      header: t("orderNo", "OrderNo"),
      key: "orderNo",
    },
    { id: 1, header: t("order", "Order"), key: "order" },
    {
      id: 2,
      header: t("range", "Range"),
      key: "range",
    },
    {
      id: 2,
      header: t("result", "Results"),
      key: "result",
    },
    { id: 3, header: t("actions", "Actions"), key: "actions" },
  ];

  const resultRows = useMemo(() => {
    return list[0]?.map((result: Result) => ({
      id: result.order,
      orderNo: {
        content: <span>{result.order}</span>,
      },
      order: {
        content: <span>{result.result[0].investigation}</span>,
      },
      range: {
        content: <span>--</span>,
      },
      result: {
        content: <span>{result.result[0].value}</span>,
      },
      actions: {
        content: (
          <>
            {/* <RescendTestResultActionMenu closeModal={() => true} /> */}
            <DeleteTestResultActionMenu closeModal={() => true} />
          </>
        ),
      },
    }));
  }, [list]);

  if (resultRows?.length >= 0) {
    return (
      <div>
        <DataTable rows={resultRows} headers={columns} useZebraStyles>
          {({ rows, headers, getHeaderProps, getTableProps, getRowProps }) => (
            <TableContainer className={styles.tableContainer}>
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
                        <TableRow {...getRowProps({ row })}>
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
              {/* <Pagination
                forwardText="Next page"
                backwardText="Previous page"
                page={currentPage}
                pageSize={currentPageSize}
                pageSizes={pageSizes}
                totalItems={patientQueueEntries?.length}
                className={styles.pagination}
                onChange={({ pageSize, page }) => {
                  if (pageSize !== currentPageSize) {
                    setPageSize(pageSize);
                  }
                  if (page !== currentPage) {
                    goTo(page);
                  }
                }}
              /> */}
            </TableContainer>
          )}
        </DataTable>
      </div>
    );
  }
};

export default TestsResults;
