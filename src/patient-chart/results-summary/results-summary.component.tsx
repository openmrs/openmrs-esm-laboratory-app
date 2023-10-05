import React, { Children } from "react";
import {
  Button,
  DataTable,
  DataTableHeader,
  DataTableSkeleton,
  DefinitionTooltip,
  Layer,
  Pagination,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableExpandedRow,
  TableExpandHeader,
  TableExpandRow,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  Tile,
} from "@carbon/react";
import { Printer, MailAll, Edit } from "@carbon/react/icons";
import styles from "./results-summary.scss";
import TestsResults from "./test-results-table.component";
import { LaboratoryResponse } from "../laboratory-order.resource";

interface ResultsSummaryProps {
  labRequest: LaboratoryResponse;
}

const ResultsSummary: React.FC<ResultsSummaryProps> = () => {
  const PrintButtonAction: React.FC = () => {
    const handleButtonClick = (event: MouseEvent) => {
      event.preventDefault();
    };
    return (
      <Button
        kind="ghost"
        size="sm"
        onClick={(e) => handleButtonClick(e)}
        renderIcon={(props) => <Printer size={16} {...props} />}
      >
        {/* {children} */}
      </Button>
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
      >
        {/* {children} */}
      </Button>
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
      >
        {/* {children} */}
      </Button>
    );
  };
  return (
    <>
      <section className={styles.section}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div></div>
          <div>
            <PrintButtonAction />
            <EmailButtonAction />
          </div>
        </div>
      </section>
      <section className={styles.section}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ margin: "5px" }}>Date : </span>
          <span style={{ margin: "5px" }}> Ordered By :</span>
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
        <TestsResults />
      </section>
    </>
  );
};

export default ResultsSummary;
