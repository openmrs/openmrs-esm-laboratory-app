import React, { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanels, TabPanel, Search } from "@carbon/react";
import { useTranslation } from "react-i18next";
import styles from "./laboratory-queue.scss";
import LaboratoryPatientList from "./laboratory-patient-list.component";
import { EmptyState } from "@openmrs/esm-patient-common-lib";
import WorkList from "../work-list/work-list.component";

enum TabTypes {
  STARRED,
  SYSTEM,
  USER,
  ALL,
}

const LaboratoryQueueTabs: React.FC = () => {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState(0);
  return (
    <main className={`omrs-main-content`}>
      <section className={styles.orderTabsContainer}>
        <Tabs
          selectedIndex={selectedTab}
          onChange={({ selectedIndex }) => setSelectedTab(selectedIndex)}
          className={styles.tabs}
        >
          <TabList
            style={{ paddingLeft: "1rem" }}
            aria-label="Laboratory tabs"
            contained
          >
            <Tab>{t("testedOrders", "Tests ordered")}</Tab>
            <Tab>{t("worklist", "Worklist")}</Tab>
            <Tab>{t("referredTests", "Referred tests")}</Tab>
            <Tab>{t("completedTests", "Completed tests")}</Tab>
            <Tab>{t("reviewList", "Review List")}</Tab>
            <Tab>{t("approveList", "Approval List")}</Tab>
          </TabList>
          <TabPanels>
            <TabPanel style={{ padding: 0 }}>
              <LaboratoryPatientList />
            </TabPanel>
            <TabPanel style={{ padding: 0 }}>
              <WorkList
                careSetting={"6f0c9a92-6f24-11e3-af88-005056821db0"}
                activatedOnOrAfterDate={"2023-11-04 00:00:00"}
                fulfillerStatus={"IN_PROGRESS"}
              />
            </TabPanel>
            <TabPanel style={{ padding: 0 }}>
              <div>
                <div className={styles.headerBtnContainer}></div>
                <EmptyState
                  displayText={"referred tests"}
                  headerTitle={"Referred tests"}
                />
              </div>
            </TabPanel>
            <TabPanel style={{ padding: 0 }}>
              <div>
                <div className={styles.headerBtnContainer}></div>
                <EmptyState
                  displayText={"completed test"}
                  headerTitle={"Completed tests"}
                />
              </div>
            </TabPanel>
            <TabPanel style={{ padding: 0 }}>
              <div>
                <div className={styles.headerBtnContainer}></div>
                <EmptyState
                  displayText={"reviewList"}
                  headerTitle={"Review List"}
                />
              </div>
            </TabPanel>
            <TabPanel style={{ padding: 0 }}>
              <div>
                <div className={styles.headerBtnContainer}></div>
                <EmptyState
                  displayText={"approve list"}
                  headerTitle={"Approval List"}
                />
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </section>
    </main>
  );
};

export default LaboratoryQueueTabs;
