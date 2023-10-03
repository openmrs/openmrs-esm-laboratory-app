import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { EmptyState } from "@ohri/openmrs-esm-ohri-commons-lib";
import styles from "./laboratory-order.scss";
import { useSession } from "@openmrs/esm-framework";
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
import ViewLaboratoryItemActionMenu from "./laboratory-item/view-laboratory-item.component";

interface LaboratoryOrderOverviewProps {
  patientUuid: string;
}

const LaboratoryOrder: React.FC<LaboratoryOrderOverviewProps> = ({
  patientUuid,
}) => {
  const { t } = useTranslation();

  const session = useSession();

  // const { patientQueueEntries, isLoading } = usePatientQueuesList(
  //   session?.sessionLocation?.uuid,
  //   status
  // );

  const pageSizes = [10, 20, 30, 40, 50];
  const [page, setPage] = useState(1);
  const [currentPageSize, setPageSize] = useState(10);
  const [nextOffSet, setNextOffSet] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // const {
  //   goTo,
  //   results: paginatedQueueEntries,
  //   currentPage,
  // } = usePagination(patientQueueEntries, currentPageSize);

  const initialItems = useMemo(() => {
    const items = [
      {
        id: 1,
        encounterDate: "2023-04-01",
        orders: ["Crag", "CBC", "MalariaRDT", "CD4", "RFT", "Unalysis"],
        location: session.sessionLocation.display,
        results: "tests returned",
      },
      {
        id: 2,
        encounterDate: "2023-04-05",
        orders: ["Crag", "CBC", "CD4", "RFT", "Unalysis", "LFTs"],
        location: session.sessionLocation.display,
        results: "tests returned",
      },
    ];
    return items;
  }, [session.sessionLocation.display]);

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
  const [items, setItems] = useState(initialItems);

  const handleChange = useCallback(
    (val) => {
      setSearchTerm(val?.target?.value);
      if (searchTerm == null && val?.target?.value) {
        setItems(initialItems);
      }
      // const filteredItems = items.filter((item) => item.orders.length === 100);
      let filteredItems = [];
      items.map((item) => {
        const newArray = item?.orders.filter(
          (order) => order.toLowerCase().startsWith(val?.target?.value) == true
        );
        if (newArray.length >= 1) {
          filteredItems.push(item);
        }
      });

      console.info(filteredItems);
      setItems(filteredItems);
    },
    [initialItems, items, searchTerm]
  );

  const tableRows = useMemo(() => {
    return items?.map((entry) => ({
      ...entry,
      encounterDate: {
        content: <span>{entry.encounterDate}</span>,
      },
      orders: {
        content: (
          <>
            {entry.orders.map((order) => {
              return (
                <Tag
                  style={{
                    background: "rgb(111 111 111 / 97%)",
                    color: "white",
                  }}
                  role="tooltip"
                >
                  {order}
                </Tag>
              );
            })}
          </>
        ),
      },
      location: {
        content: <span>{entry.location}</span>,
      },
      status: {
        content: <span>{entry.results}</span>,
      },
      actions: {
        content: (
          <>
            <ViewLaboratoryItemActionMenu closeModal={() => true} />
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

  // return (
  //   <div>
  //     {/* <div className={styles.headerBtnContainer}></div> */}
  //     <EmptyState displayText={"Tests Ordered"} headerTitle={"Tests Ordered"} />
  //   </div>
  // );
};

export default LaboratoryOrder;
