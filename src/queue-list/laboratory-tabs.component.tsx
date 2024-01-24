import React, { useEffect, useMemo, useState } from "react";
import {
  type AssignedExtension,
  Extension,
  ExtensionSlot,
  useConnectedExtensions,
  attach,
  detachAll,
} from "@openmrs/esm-framework";
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

const labPanelSlot = "lab-panels-slot";

const LaboratoryQueueTabs: React.FC = () => {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState(0);
  const tabExtensions = useConnectedExtensions(
    labPanelSlot
  ) as AssignedExtension[];

  const [derivedSlots, setDerivedSlots] = useState<
    { slot: string; extension: string }[]
  >([]);

  const extraPanels = useMemo(() => {
    const filteredExtensions = tabExtensions.filter(
      (extension) => Object.keys(extension.meta).length > 0
    );
    const derivedSlotsBuffer = [];
    return filteredExtensions.map((extension, index) => {
      const slotName = `${labPanelSlot}-${index}`;
      derivedSlotsBuffer.push({
        slot: slotName,
        extension: extension.name,
      });
      if (filteredExtensions.length === index + 1) {
        setDerivedSlots(derivedSlotsBuffer);
      }

      return (
        <TabPanel key={extension.meta.name} style={{ padding: 0 }}>
          <div>
            <div className={styles.headerBtnContainer}></div>
            <ExtensionSlot name={slotName} />
          </div>
        </TabPanel>
      );
    });
  }, [tabExtensions]);

  useEffect(() => {
    derivedSlots.forEach(({ slot, extension }) => {
      attach(slot, extension);
    });

    return () => {
      derivedSlots.forEach(({ slot }) => {
        detachAll(slot);
      });
    };
  }, [derivedSlots]);

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
            {tabExtensions
              .filter((extension) => Object.keys(extension.meta).length > 0)
              .map((extension, index) => {
                const { name, title } = extension.meta;

                if (name && title) {
                  return (
                    <Tab
                      key={index}
                      className={styles.tab}
                      id={`${title || index}-tab`}
                    >
                      {t(title, {
                        ns: extension.moduleName,
                        defaultValue: title,
                      })}
                    </Tab>
                  );
                } else {
                  return null;
                }
              })}
          </TabList>
          <TabPanels>
            <TabPanel style={{ padding: 0 }}>
              <div>
                <div className={styles.headerBtnContainer}></div>
                <LaboratoryPatientList />
              </div>
            </TabPanel>
            {extraPanels}
          </TabPanels>
        </Tabs>
      </section>
    </main>
  );
};

export default LaboratoryQueueTabs;
