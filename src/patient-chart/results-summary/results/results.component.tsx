import React from "react";
import { useGetLabEncounterTests } from "./results.resource";
import { DataTableSkeleton } from "@carbon/react";
import { ErrorState } from "@openmrs/esm-framework";

interface ResultsProps {
  encounterUuid: string;
}

const Results: React.FC<ResultsProps> = ({ encounterUuid }) => {
  const { labResults, isLoading, isError } =
    useGetLabEncounterTests(encounterUuid);

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />;
  }

  if (isError) {
    return <ErrorState error={isError} headerTitle={"Results Error"} />;
  }

  return <span>{JSON.stringify(labResults)}</span>;
};

export default Results;
