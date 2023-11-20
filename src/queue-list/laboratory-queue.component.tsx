import React, { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanels, Search } from "@carbon/react";
import { useTranslation } from "react-i18next";
import styles from "./laboratory-queue.scss";
import LaboratoryPatientList from "./laboratory-patient-list.component";

enum TabTypes {
  STARRED,
  SYSTEM,
  USER,
  ALL,
}

const LaboratoryQueueList: React.FC = () => {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState(TabTypes.STARRED);
  const [searchTermUserInput, setSearchTermUserInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");

  const tabs = [
    {
      key: "testedOrders",
      header: t("testedOrders", "Tests ordered"),
    },
    {
      key: "worklist",
      header: t("worklist", "Worklist"),
    },
    {
      key: "referredTests",
      header: t("referredTests", "Referred tests"),
    },
    {
      key: "completedTests",
      header: t("completedTests", "Completed tests"),
    },
    {
      key: "reviewList",
      header: t("reviewList", "Review List"),
    },
    {
      key: "approveList",
      header: t("approveList", "Approval List"),
    },
  ];

  useEffect(() => {
    const debounceFn = setTimeout(() => {
      setSearchTerm(searchTermUserInput);
    }, 500);

    return () => clearTimeout(debounceFn);
  }, [searchTermUserInput]);

  return (
    <main className={`omrs-main-content`}>
      <section className={styles.orderTabsContainer}>
        <Tabs
          className={styles.orderTabs}
          type="container"
          tabContentClassName={styles.hiddenTabsContent}
          onSelectionChange={setSelectedTab}
        >
          <TabList
            aria-label={t("tabList", "Tab List")}
            contained
            className={styles.tabsContainer}
          >
            {tabs.map((tab, index) => {
              return (
                <Tab
                  title={t(tab.key)}
                  key={index}
                  id={"tab-" + index}
                  className={styles.tab}
                >
                  {t(tab.header)}
                </Tab>
              );
            })}
          </TabList>
          <div className={styles.searchContainer}>
            <Search
              closeButtonLabelText={t("clearSearchInput", "Clear search input")}
              defaultValue={searchTermUserInput}
              placeholder={t(
                "searchByPatientIdOrName",
                "Search by patient ID or name"
              )}
              labelText={t(
                "searchByPatientIdOrName",
                "Search by patient ID or name"
              )}
              onChange={(e) => {
                e.preventDefault();
                setSearchTermUserInput(e.target.value);
              }}
              size="md"
              className={styles.patientSearch}
            />
          </div>
          {/* <TabPanels>
            {tabs.map((tab, index) => {
              return (
                <LaboratoryPatientList
                  location={location}
                  searchTerm={searchTerm}
                  status={tab.status}
                />
              );
            })}
          </TabPanels> */}
        </Tabs>
      </section>
    </main>
  );
};

export default LaboratoryQueueList;
