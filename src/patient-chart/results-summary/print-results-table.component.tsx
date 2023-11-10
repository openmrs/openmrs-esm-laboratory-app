import React from "react";
import styles from "./print-results-summary.scss";
import { GroupMember } from "../laboratory-order.resource";

interface PrintResultsTableProps {
  groupedResults: any[];
}

interface ResultsRowProps {
  groupMembers: GroupMember[];
}

const PrintResultsTable: React.FC<PrintResultsTableProps> = ({
  groupedResults,
}) => {
  const RowTest: React.FC<ResultsRowProps> = ({ groupMembers }) => {
    return (
      <>
        {groupMembers?.map((element, index) => {
          return (
            <tr key={index}>
              {typeof element.value === "number" ? (
                <>
                  <td>{element?.concept.display}</td>

                  <td>{element?.value}</td>

                  <td>--</td>

                  <td>--</td>
                </>
              ) : typeof element.value === "object" ? (
                <>
                  <td>{element?.concept.display}</td>

                  <td>{element?.value.display}</td>

                  <td>--</td>

                  <td>--</td>
                </>
              ) : (
                <td>{element?.display}</td>
              )}
            </tr>
          );
        })}
      </>
    );
  };
  return (
    <section className={styles.section}>
      <table>
        <thead>
          <tr>
            <th>Tests</th>
            <th>Result</th>
            <th>Reference Range</th>
            <th>Units</th>
          </tr>
        </thead>
      </table>
      <table>
        <tbody>
          {Object.keys(groupedResults).map((test) => (
            <tr key={test} style={{ margin: "10px" }}>
              <span
                style={{ margin: "10px", fontSize: "8px", fontWeight: "bold" }}
              >
                {test}
              </span>
              <table style={{ margin: "10px" }}>
                <RowTest groupMembers={groupedResults[test].groupMembers} />
              </table>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default PrintResultsTable;
