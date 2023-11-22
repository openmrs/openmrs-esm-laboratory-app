import React from "react";
import styles from "./print-results-summary.scss";
import { GroupMember } from "../laboratory-order.resource";
import { useGetConceptById } from "./results-summary.resource";
import {
  Button,
  Form,
  ModalBody,
  ModalFooter,
  ModalHeader,
  InlineLoading,
  Checkbox,
} from "@carbon/react";

interface PrintResultsTableProps {
  groupedResults: any[];
}

interface ResultsRowProps {
  groupMembers: GroupMember[];
}

interface ValueUnitsProps {
  conceptUuid: string;
}

const PrintResultsTable: React.FC<PrintResultsTableProps> = ({
  groupedResults,
}) => {
  const RowTest: React.FC<ResultsRowProps> = ({ groupMembers }) => {
    // get Units
    const ValueUnits: React.FC<ValueUnitsProps> = ({ conceptUuid }) => {
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
      return <span style={{ marginLeft: "10px" }}>{concept?.units}</span>;
    };

    // get Reference Range
    const ReferenceRange: React.FC<ValueUnitsProps> = ({ conceptUuid }) => {
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
        <>
          {concept?.hiNormal === undefined ||
          concept?.lowNormal === undefined ? (
            "N/A"
          ) : (
            <div>
              <span>{concept?.lowNormal ? concept?.lowNormal : "--"}</span> :{" "}
              <span>{concept?.hiNormal ? concept?.hiNormal : "--"}</span>
            </div>
          )}
        </>
      );
    };
    return (
      <>
        {groupMembers?.map((element, index) => {
          return (
            <tr key={index}>
              {typeof element.value === "number" ? (
                <>
                  <td>{element?.concept.display}</td>

                  <td>{element?.value}</td>

                  <td>
                    {
                      <ReferenceRange
                        conceptUuid={groupMembers[index].concept.uuid}
                      />
                    }
                  </td>

                  <td>
                    {
                      <ValueUnits
                        conceptUuid={groupMembers[index].concept.uuid}
                      />
                    }
                  </td>
                </>
              ) : typeof element.value === "object" ? (
                <>
                  <td>{element?.concept.display}</td>

                  <td>{element?.value.display}</td>
                  <td>
                    {
                      <ReferenceRange
                        conceptUuid={groupMembers[index].concept.uuid}
                      />
                    }
                  </td>

                  <td>
                    {
                      <ValueUnits
                        conceptUuid={groupMembers[index].concept.uuid}
                      />
                    }
                  </td>
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
