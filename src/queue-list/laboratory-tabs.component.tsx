import React, { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanels, TabPanel, Search } from "@carbon/react";
import { useTranslation } from "react-i18next";
import styles from "./laboratory-queue.scss";
import LaboratoryPatientList from "./laboratory-patient-list.component";
import { EmptyState } from "@openmrs/esm-patient-common-lib";
import WorkList from "../work-list/work-list.component";
import ReviewList from "../review-list/review-list.component";
import CompletedList from "../completed-list/completed-list.component";

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
            <Tab>{t("reviewList", "Review")}</Tab>
            <Tab>{t("approveList", "Approved")}</Tab>
          </TabList>
          <TabPanels>
            <TabPanel style={{ padding: 0 }}>
              <div>
                <div className={styles.headerBtnContainer}></div>
                <LaboratoryPatientList />
              </div>
            </TabPanel>
            <TabPanel style={{ padding: 0 }}>
              <div>
                <div className={styles.headerBtnContainer}></div>
                <WorkList fulfillerStatus={"IN_PROGRESS"} />
              </div>
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
                <ReviewList fulfillerStatus={"IN_PROGRESS"} />
              </div>
            </TabPanel>
            <TabPanel style={{ padding: 0 }}>
              <div>
                <div className={styles.headerBtnContainer}></div>
                <CompletedList fulfillerStatus={"COMPLETED"} />
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </section>
    </main>
  );
};

export default LaboratoryQueueTabs;
