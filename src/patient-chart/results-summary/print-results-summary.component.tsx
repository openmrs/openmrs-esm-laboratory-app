import React, { useEffect, useRef, useState } from "react";
import styles from "./print-results-summary.scss";
import TestsPrintResults from "./test-print-results-table.component";
import { EncounterResponse } from "../laboratory-item/view-laboratory-item.resource";

interface PrintResultsSummaryProps {
  encounterResponse: EncounterResponse;
}

const PrintResultsSummary: React.FC<PrintResultsSummaryProps> = ({
  encounterResponse,
}) => {
  return (
    <div className={styles.printPage}>
      <section className={styles.section}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ margin: "5px" }}>
            Date : {encounterResponse?.encounterDatetime}
          </span>
          <span style={{ margin: "5px" }}>
            Ordered By : {encounterResponse?.auditInfo?.creator?.display}
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
          <div></div>
        </div>
      </section>
      <section className={styles.section}>
        <TestsPrintResults orders={encounterResponse?.orders} />
      </section>
    </div>
  );
};

export default PrintResultsSummary;
