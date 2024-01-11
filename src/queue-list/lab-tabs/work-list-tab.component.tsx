import React, { useEffect, useState } from "react";
import {
  type AssignedExtension,
  Extension,
  ExtensionSlot,
  useConnectedExtensions,
} from "@openmrs/esm-framework";
import { Tab, Tabs, TabList, TabPanels, TabPanel, Search } from "@carbon/react";
import { useTranslation } from "react-i18next";
import styles from "./lab-tabs.scss";
import WorkList from "../../work-list/work-list.component";

interface KyComponentProps {
  name: string;
}
// Define the functional component using TypeScript
const KyComponent: React.FC<KyComponentProps> = () => {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    // <main className={`omrs-main-content`}>
    // <section>
    //   <Tabs
    //     selectedIndex={selectedTab}
    //     onChange={({ selectedIndex }) => setSelectedTab(selectedIndex)}
    //     // className={styles.tabs}
    //   >
    //     <TabList
    //       style={{ paddingLeft: "1rem" }}
    //       aria-label="Laboratory tabs"
    //       contained
    //     >
    //       <Tab>{t("worklist", "Worklist")}</Tab>
    //     </TabList>
    // <TabPanels>
    //   <TabPanel style={{ padding: 0 }}>
    <div>
      <div className={styles.headerBtnContainer}></div>
      <WorkList fulfillerStatus={"IN_PROGRESS"} />
    </div>
    //   </TabPanel>
    // </TabPanels>
    //   </Tabs>
    // </section>
    // </main>
  );
};

export default KyComponent;
