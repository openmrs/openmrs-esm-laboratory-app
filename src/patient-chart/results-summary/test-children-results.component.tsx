import React, { AnchorHTMLAttributes, useMemo } from "react";
import { GroupMember } from "../laboratory-order.resource";
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
  Tile,
  InlineLoading,
} from "@carbon/react";
import styles from "./results-summary.scss";
import { assessValue, useGetConceptById } from "./results-summary.resource";
import { ObsMetaInfo } from "../../types";

interface TestsResultsChildrenProps {
  members: GroupMember[];
}

interface ReferenceRangeProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  conceptUuid: string;
}

interface ColorRangeIndicatorProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  value: number;
  conceptUuid: string;
}

const StyledTableCell = ({
  interpretation,
  children,
}: {
  interpretation: string;
  children: React.ReactNode;
}) => {
  switch (interpretation) {
    case "critically_high":
      return (
        <TableCell className={styles.criticallyHigh}>{children}</TableCell>
      );
    case "critically_low":
      return <TableCell className={styles.criticallyLow}>{children}</TableCell>;
    case "high":
      return <TableCell className={styles.high}>{children}</TableCell>;
    case "low":
      return <TableCell className={styles.low}>{children}</TableCell>;
    default:
      return <TableCell>{children}</TableCell>;
  }
};

const TestResultsChildren: React.FC<TestsResultsChildrenProps> = ({
  members,
}) => {
  const { t } = useTranslation();

  let columns = [
    { id: 1, header: t("test", "Test"), key: "test" },

    {
      id: 2,
      header: t("results", "Results"),
      key: "value",
    },
    {
      id: 3,
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
      value: {
        content: <span>{member?.value.toString()}</span>,
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

  const ColorRangeIndicator: React.FC<ColorRangeIndicatorProps> = ({
    value,
    conceptUuid,
  }) => {
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

    const resultedValue = assessValue(value,range);
    return <span></span>;
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
                              ) : cell.info.header === "value" ? (
                                <ColorRangeIndicator
                                  conceptUuid={members[index].concept.uuid}
                                  value={members[index].value}
                                >
                                  {cell.value?.content}
                                </ColorRangeIndicator>
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
