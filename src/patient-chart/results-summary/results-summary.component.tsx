import React, { useEffect, useRef, useState } from "react";
import { Button, DataTableSkeleton } from "@carbon/react";
import { Printer, MailAll, Edit } from "@carbon/react/icons";
import styles from "./results-summary.scss";
import TestsResults from "./test-results-table.component";
import { useReactToPrint } from "react-to-print";
import { useGetEncounterById } from "../laboratory-item/view-laboratory-item.resource";
import { ErrorState } from "@openmrs/esm-patient-common-lib";
import PrintResultsSummary from "./print-results-summary.component";

interface ResultsSummaryProps {
  encounterUuid: string;
}

const ResultsSummary: React.FC<ResultsSummaryProps> = ({ encounterUuid }) => {
  // get encouter details
  const { encounter, isLoading, isError } = useGetEncounterById(encounterUuid);

  const PrintButtonAction: React.FC = () => {
    const [isPrinting, setIsPrinting] = useState(false);

    const contentToPrintRef = useRef(null);

    const onBeforeGetContentResolve = useRef(null);

    useEffect(() => {
      if (onBeforeGetContentResolve.current) {
        onBeforeGetContentResolve.current();
      }
    }, [isPrinting]);

    const handlePrint = useReactToPrint({
      content: () => contentToPrintRef.current,
      onBeforeGetContent: () =>
        new Promise((resolve) => {
          onBeforeGetContentResolve.current = resolve;
          setIsPrinting(true);
        }),
      onAfterPrint: () => {
        onBeforeGetContentResolve.current = null;
        setIsPrinting(false);
      },
    });

    return (
      <div>
        <div ref={contentToPrintRef}>
          <PrintResultsSummary encounterResponse={encounter} />
        </div>
        <Button
          kind="ghost"
          size="sm"
          onClick={handlePrint}
          renderIcon={(props) => <Printer size={16} {...props} />}
        />
      </div>
    );
  };

  const EmailButtonAction: React.FC = () => {
    const handleButtonClick = (event: MouseEvent) => {
      event.preventDefault();
    };
    return (
      <Button
        kind="ghost"
        size="sm"
        onClick={(e) => handleButtonClick(e)}
        renderIcon={(props) => <MailAll size={16} {...props} />}
      />
    );
  };

  const EditButtonAction: React.FC = () => {
    const handleButtonClick = (event: MouseEvent) => {
      event.preventDefault();
    };
    return (
      <Button
        kind="ghost"
        size="sm"
        onClick={(e) => handleButtonClick(e)}
        renderIcon={(props) => <Edit size={16} {...props} />}
      />
    );
  };
  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />;
  }
  if (isError) {
    return <ErrorState error={isError} headerTitle={"Error"} />;
  }

  if (encounter) {
    return (
      <div>
        <section className={styles.section}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div></div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <PrintButtonAction />
              <EmailButtonAction />
            </div>
          </div>
        </section>
        <section className={styles.section}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ margin: "5px" }}>
              Date : {encounter?.encounterDatetime}
            </span>
            <span style={{ margin: "5px" }}>
              Ordered By : {encounter?.auditInfo?.creator?.display}
            </span>
          </div>
        </section>
        <section className={styles.section}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <span> Results Ordered</span>
            </div>
            <div>
              <EditButtonAction />
            </div>
          </div>
        </section>
        <section className={styles.section}>
          <TestsResults orders={encounter?.orders} />
        </section>
      </div>
    );
  }
};

export default ResultsSummary;
