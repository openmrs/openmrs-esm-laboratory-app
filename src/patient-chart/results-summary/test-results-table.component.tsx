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
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Layer,
  Tag,
  DataTableHeader,
  Tile,
} from "@carbon/react";
import styles from "./results-summary.scss";
import RescentTestResultActionMenu from "./test-results-action-menu.component";

const TestsResults: React.FC = () => {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);

  const initialItems = useMemo(() => {
    const items = [
      {
        id: 0,
        order: "CD4",
        result: "30-56",
      },
      {
        id: 1,
        order: "LFTs",
        result: "34-90",
      },
      {
        id: 2,
        order: "Malaria",
        result: "Positive ( + )",
      },
    ];
    return items;
  }, []);

  let columns = [
    {
      id: 0,
      header: t("order", "Order"),
      key: "order",
    },
    { id: 1, header: t("result", "Result"), key: "result" },
    { id: 2, header: t("actions", "Actions"), key: "actions" },
  ];

  const [items, setItems] = useState(initialItems);

  const tableRows = useMemo(() => {
    return items?.map((entry) => ({
      ...entry,
      order: {
        content: <span>{entry.order}</span>,
      },
      result: {
        content: <span>{entry.order}</span>,
      },

      actions: {
        content: (
          <>
            <RescentTestResultActionMenu closeModal={() => true} />
          </>
        ),
      },
    }));
  }, [items]);

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />;
  }

  if (items?.length >= 0) {
    return (
      <div>
        <DataTable rows={tableRows} headers={columns} useZebraStyles>
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
                  <Layer>
                    <TableToolbarSearch
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
