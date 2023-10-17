import React, { useCallback, useMemo, useState } from "react";
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
} from "@carbon/react";
import ViewLaboratoryItemActionMenu from "./laboratory-item/view-laboratory-item.component";
import { getOrderColor, useLabOrders } from "./laboratory-order.resource";

interface LaboratoryOrderOverviewProps {
  patientUuid: string;
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
      header: t("encounterDate", "Encouter Date"),
      key: "encounterDate",
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
      encounterDate: {
        content: (
          <span>
            {formatDate(parseDate(entry.encounterDatetime), {
              time: true,
            })}
          </span>
        ),
      },
      orders: {
        content: (
          <>
            {entry.orders.map((order) => {
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
            <ViewLaboratoryItemActionMenu
              closeModal={() => true}
              encounterUuid={entry.uuid}
            />
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
