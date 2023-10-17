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
} from "@carbon/react";
import styles from "./results-summary.scss";
import RescendTestResultActionMenu from "./test-results-rescend-action-menu.component";
import { Order } from "../laboratory-order.resource";
import DeleteTestResultActionMenu from "./test-results-delete-action-menu.component";

interface TestOrdersProps {
  orders: Order[];
}

const TestsPrintResults: React.FC<TestOrdersProps> = ({ orders }) => {
  const { t } = useTranslation();

  let columns = [
    {
      id: 0,
      header: t("orderNo", "OrderNo"),
      key: "orderNo",
    },
    { id: 1, header: t("order", "Order"), key: "order" },
    {
      id: 2,
      header: t("expectedResult", "Expected Results"),
      key: "expectedResults",
    },
    {
      id: 3,
      header: t("results", " Results"),
      key: "results",
    },
  ];
  const [items, setItems] = useState(orders);

  const tableRows = useMemo(() => {
    return items?.map((entry) => ({
      ...entry,
      id: entry.uuid,
      orderNo: {
        content: <span>{entry.orderNumber}</span>,
      },
      order: {
        content: <span>{entry.display}</span>,
      },
      expectedResults: {
        content: <span>--</span>,
      },
      results: {
        content: <span>--</span>,
      },
    }));
  }, [items]);

  if (items?.length >= 0) {
    return (
      <div>
        <DataTable rows={tableRows} headers={columns} useZebraStyles>
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

export default TestsPrintResults;
