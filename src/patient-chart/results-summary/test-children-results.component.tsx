import React, { AnchorHTMLAttributes, useMemo } from "react";
import { GroupMember } from "../laboratory-order.resource";
import { ErrorState } from "@openmrs/esm-framework";
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
  InlineLoading,
} from "@carbon/react";
import styles from "./results-summary.scss";
import TestsChildrenDetail from "./tests-children-detail.component";
import { useGetConceptById } from "./results-summary.resource";

interface TestsResultsChildrenProps {
  members: GroupMember[];
}

interface ReferenceRangeProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  conceptUuid: string;
}

const TestResultsChildren: React.FC<TestsResultsChildrenProps> = ({
  members,
}) => {
  const { t } = useTranslation();

  let columns = [
    { id: 1, header: t("test", "Test"), key: "test" },
    {
      id: 2,
      header: t("date", "Date"),
      key: "date",
    },
    {
      id: 3,
      header: t("results", "Results"),
      key: "value",
    },
    {
      id: 4,
      header: t("range", "Reference Range"),
      key: "range",
    },
  ];

  const results = useMemo(() => {
    return members?.map((member) => ({
      id: member.uuid,
      test: {
        content: <span>{member?.concept?.display}</span>,
      },
      date: {
        content: <span>{member.obsDatetime}</span>,
      },
      value: {
        content: <span>{member?.value}</span>,
      },
    }));
  }, [members]);

  if (members === undefined) {
    return <span>No Data</span>;
  }

  const ReferenceRange: React.FC<ReferenceRangeProps> = ({ conceptUuid }) => {
    const {
      concept: concept,
      isLoading,
      isError,
    } = useGetConceptById(conceptUuid);

    if (isLoading) {
      return <InlineLoading status="active" />;
    }
    if (isError) {
      return <span>Error</span>;
    }
    return (
      <div>
        <span>{concept?.hiNormal}</span> : <span>{concept?.lowNormal}</span>
        <span>{concept?.units}</span>
      </div>
    );
  };

  if (results?.length >= 0) {
    return (
      <div>
        <DataTable rows={results} headers={columns} useZebraStyles>
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
                              {cell.info.header === "range" ? (
                                <ReferenceRange
                                  conceptUuid={members[index].concept.uuid}
                                >
                                  {cell.value?.content}
                                </ReferenceRange>
                              ) : (
                                cell.value?.content
                              )}
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
            </TableContainer>
          )}
        </DataTable>
      </div>
    );
  }
};

export default TestResultsChildren;
