import React from "react";
import styles from "./print-results-summary.scss";
import { ErrorState } from "@openmrs/esm-framework";
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
              <td>{element?.display}</td>
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
            <th>Tests Requested</th>
            <th>Results</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(groupedResults).map((test) => (
            <tr key={test}>
              <td>{test}</td>
              <table>
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
