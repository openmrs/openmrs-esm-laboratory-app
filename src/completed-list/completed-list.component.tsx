import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetOrdersWorklist } from "../work-list/work-list.resource";
import {
  ErrorState,
  formatDate,
  parseDate,
  usePagination,
  isDesktop,
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
  Tag,
  Dropdown,
} from "@carbon/react";
import styles from "./completed-list.scss";
import { getStatusColor } from "../utils/functions";

interface CompletedListProps {
  fulfillerStatus: string;
}

interface TableRowProps {
  entry: {
    uuid: string;
    orderNumber: string;
    accessionNumber: string;
    concept: { display: string };
    action: string;
    fulfillerStatus: string;
    orderer: { display: string };
    urgency: string;
    dateActivated: string;
    patient: { display: string };
  };
}

const StatusTag: React.FC<{ fulfillerStatus: string }> = ({
  fulfillerStatus,
}) => {
  return (
    <Tag>
      <span
        className={styles.statusContainer}
        style={{ color: `${getStatusColor(fulfillerStatus)}` }}
      >
        <span>{fulfillerStatus}</span>
      </span>
    </Tag>
  );
};

const CustomTableRow: React.FC<TableRowProps> = ({ entry }) => {
  const {
    uuid,
    orderNumber,
    accessionNumber,
    concept,
    action,
    fulfillerStatus,
    orderer,
    urgency,
    dateActivated,
    patient,
  } = entry;

  return (
    <TableRow key={uuid}>
      <TableCell>
        <span>{formatDate(parseDate(dateActivated))}</span>
      </TableCell>
      <TableCell>
        <span>{orderNumber}</span>
      </TableCell>
      <TableCell>
        <span>{patient.display.split("-")[1]}</span>
      </TableCell>
      <TableCell>
        <span>{accessionNumber}</span>
      </TableCell>
      <TableCell>
        <span>{concept.display}</span>
      </TableCell>
      <TableCell>
        <span className="single-line-content">{action}</span>
      </TableCell>
      <TableCell>
        <StatusTag fulfillerStatus={fulfillerStatus} />
      </TableCell>
      <TableCell>
        <span>{orderer.display}</span>
      </TableCell>
      <TableCell>
        <span>{urgency}</span>
      </TableCell>
    </TableRow>
  );
};

const CompletedList: React.FC<CompletedListProps> = ({ fulfillerStatus }) => {
  const { t } = useTranslation();

  const [activatedOnOrAfterDate, setActivatedOnOrAfterDate] = useState("");

  const { workListEntries, isLoading } = useGetOrdersWorklist(
    activatedOnOrAfterDate,
    fulfillerStatus
  );

  const pageSizes = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
  const [page, setPage] = useState(1);
  const [currentPageSize, setPageSize] = useState(5);
  const [nextOffSet, setNextOffSet] = useState(0);

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

  const tableRows = [];
  // const tableRows = useMemo(() => {
  //   return paginatedWorkListEntries?.map((entry, index) => (
  //     <CustomTableRow key={index} entry={entry} />
  //   ));
  // }, [paginatedWorkListEntries]);

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />;
  }

  if (paginatedWorkListEntries?.length > 0) {
    return (
      <div>
        <div className={styles.headerBtnContainer}></div>
        <DataTable rows={tableRows} headers={tableColumns} useZebraStyles />
      </div>
    );
  } else {
    return (
      <div className={styles.tileContainer}>
        <Tile className={styles.tile}>
          <div className={styles.tileContent}>
            <p className={styles.content}>
              {t("noCompletedListToDisplay", "No Completed List to display")}
            </p>
          </div>
        </Tile>
      </div>
    );
  }
};

export default CompletedList;
