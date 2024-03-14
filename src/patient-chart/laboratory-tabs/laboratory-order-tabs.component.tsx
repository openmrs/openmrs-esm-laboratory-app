import React, { useState } from "react";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@carbon/react";
import styles from "./laboratory-order-tabs.scss";
import { useTranslation } from "react-i18next";
import PatientLaboratoryReferalResults from "../laboratory-order-referals/laboratory-order-referals.component";
import LaboratoryPastTestOrderResults from "../laboratory-past-test/laboratory-past-test-order-results.component";
import LaboratoryActiveTestOrderResults from "../laboratory-active-test-order/laboratory-active-test-order-results.component";

interface LaboratoryResultsTabsProps {
  patientUuid: string;
}

const LaboratoryResultsTabs: React.FC<LaboratoryResultsTabsProps> = ({
  patientUuid,
}) => {
  const { t } = useTranslation();

  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <>
      <div className={styles.container}>
        <Tabs
          selectedIndex={selectedTab}
          onChange={({ selectedIndex }) => setSelectedTab(selectedIndex)}
          className={styles.tabs}
        >
          <TabList
            className={styles.tabList}
            aria-label="laboratory results tabs"
            contained
          >
            <Tab className={styles.tabWidth}>
              {t("pending", "Active Tests")}
            </Tab>
            <Tab className={styles.tabWidth}>{t("pending", "Past Tests")}</Tab>
            <Tab className={styles.tabWidth}>
              {t("referals", "Referred Tests")}
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <div className={styles.panelContainer}>
                <LaboratoryActiveTestOrderResults patientUuid={patientUuid} />
              </div>
            </TabPanel>
            <TabPanel>
              <div className={styles.panelContainer}>
                <LaboratoryPastTestOrderResults patientUuid={patientUuid} />
              </div>
            </TabPanel>
            <TabPanel>
              <div className={styles.panelContainer}>
                <PatientLaboratoryReferalResults patientUuid={patientUuid} />
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </>
  );
};

export default LaboratoryResultsTabs;
