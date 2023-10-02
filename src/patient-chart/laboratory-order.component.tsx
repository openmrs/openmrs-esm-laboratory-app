import React, { useMemo, useState } from "react";
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

  if (items?.length) {
    return (
      <div>
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

  return (
    <div>
      <div className={styles.headerBtnContainer}></div>
      <EmptyState displayText={"Tests Ordered"} headerTitle={"Tests Ordered"} />
    </div>
  );
};

export default LaboratoryOrder;
