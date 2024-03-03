import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetOrdersWorklist } from "../work-list/work-list.resource";
import {
  formatDate,
  parseDate,
  usePagination,
  ConfigurableLink,
} from "@openmrs/esm-framework";
import { DataTableSkeleton, Tag } from "@carbon/react";
import styles from "./completed-list.scss";
import { getStatusColor } from "../utils/functions";
import OrdersDataTable from "../utils/orders-table/orders-data-table.component";

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
        id: entry?.uuid,
        date: <span>{formatDate(parseDate(entry?.dateActivated))}</span>,

        patient: {
          content: (
            <ConfigurableLink
              to={`\${openmrsSpaBase}/patient/${entry?.patient?.uuid}/chart/laboratory-orders`}
            >
              {entry?.patient?.display.split("-")[1]}
            </ConfigurableLink>
          ),
        },
        orderNumber: <span>{entry?.orderNumber}</span>,
        accessionNumber: <span>{entry?.accessionNumber}</span>,
        test: <span>{entry?.concept?.display}</span>,
        action: <span>{entry?.action}</span>,
        status: {
          content: (
            <>
              <Tag>
                <span
                  className={styles.statusContainer}
                  style={{ color: `${getStatusColor(entry?.fulfillerStatus)}` }}
                >
                  <span>{entry?.fulfillerStatus}</span>
                </span>
              </Tag>
            </>
          ),
        },
        orderer: <span>{entry?.orderer?.display}</span>,
        orderType: <span>{entry?.orderType.display}</span>,
        urgency: <span>{entry?.urgency}</span>,
      }));
  }, [fulfillerStatus, paginatedWorkListEntries]);

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />;
  }

  if (paginatedWorkListEntries?.length >= 0) {
    return (
      <OrdersDataTable
        tabTitle={"Completed"}
        orders={paginatedWorkListEntries}
        rows={tableRows}
        columns={tableColumns}
        currentPage={currentPage}
        currentPageSize={currentPageSize}
        pageSizes={pageSizes}
        totalItems={paginatedWorkListEntries?.length}
        setPageSize={setPageSize}
        goTo={goTo}
      />
    );
  }
};

export default CompletedList;
