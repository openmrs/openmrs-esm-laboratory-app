import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import {
  DataTable,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@carbon/react";
import { ErrorState } from "@openmrs/esm-framework";
import { Encounter } from "../../types/patient-queues";
import styles from "../laboratory-queue.scss";
import PickLabRequestActionMenu from "../pick-lab-request-menu.component";

interface LabTestsProps {
  encounter: Encounter;
  queueId: string;
}

const LabTests: React.FC<LabTestsProps> = ({ encounter, queueId }) => {
  const { t } = useTranslation();
  let columns = [
    { id: 1, header: t("order", "Order"), key: "order", align: "left" },
    {
      id: 2,
      header: t("orderType", "OrderType"),
      key: "orderType",
      align: "center",
    },
    { id: 3, header: t("actions", "Actions"), key: "actions", align: "center" },
  ];

  const tableRows = useMemo(() => {
    return encounter?.orders?.map((item) => ({
      ...item,
      id: item?.uuid,
      order: item?.display,
      orderType: item?.type,
      actions: (
        <PickLabRequestActionMenu closeModal={() => true} order={item} />
      ),
    }));
  }, [encounter]);

  if (!encounter) {
    return (
      <ErrorState
        error={"Error Loading encounter"}
        headerTitle={"Tests Error"}
      />
    );
  }

  return (
    <DataTable rows={tableRows} headers={columns} isSortable useZebraStyles>
      {({ rows, headers, getHeaderProps, getTableProps, getRowProps }) => (
        <TableContainer className={styles.tableContainer}>
          <Table {...getTableProps()} className={styles.activePatientsTable}>
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
        </TableContainer>
      )}
    </DataTable>
  );
};

export default LabTests;
