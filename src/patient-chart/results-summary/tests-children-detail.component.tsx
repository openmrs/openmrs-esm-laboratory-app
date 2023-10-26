import React from "react";
import { useTranslation } from "react-i18next";
import { useGetConceptById } from "./results-summary.resource";
import { DataTableSkeleton } from "@carbon/react";

interface TestsChildrenDetailProps {
  conceptUuid: string;
}

const TestsChildrenDetail: React.FC<TestsChildrenDetailProps> = ({
  conceptUuid,
}) => {
  const { t } = useTranslation();

  const {
    concept: concept,
    isLoading,
    isError,
  } = useGetConceptById(conceptUuid);

  if (isLoading || isError) {
    return <DataTableSkeleton />;
  }

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontSize: "16px" }}>{concept.display}</span>
        <span>Unit : {concept.units}</span>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "block" }}>
          <span>Ranges</span>
          <div>
            <div>
              <span> High : {concept.hiNormal} </span>
            </div>
            <div>
              <span> Low : {concept?.lowNormal} </span>
            </div>
          </div>
        </div>
        {/* <div style={{ display: "block" }}>
          <span>Names</span>
          {concept.names.map((name) => {
            return (
              <div>
                <span>{name.display}</span>
              </div>
            );
          })}
        </div> */}
      </div>
    </>
  );
};
export default TestsChildrenDetail;
