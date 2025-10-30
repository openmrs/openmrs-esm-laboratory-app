import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@carbon/react';
import { type AssignedExtension, Extension, useAssignedExtensions, useConfig } from '@openmrs/esm-framework';
import { ComponentContext } from '@openmrs/esm-framework/src/internal';
import styles from './laboratory-tabs.scss';
import { type Config } from '../config-schema';

const labPanelSlot = 'lab-panels-slot';

const LaboratoryOrdersTabs: React.FC = () => {
  const { t } = useTranslation();
  const { enableReviewingLabResultsBeforeApproval } = useConfig<Config>();
  const [selectedTab, setSelectedTab] = useState(0);
  const tabExtensions = useAssignedExtensions(labPanelSlot) as AssignedExtension[];

  const filteredExtensions = tabExtensions
    .filter((extension) => Object.keys(extension.meta).length > 0)
    .filter((extension) => {
      if (extension.meta.name === 'pendingReviewPanel') {
        return enableReviewingLabResultsBeforeApproval === true;
      }
      return true;
    });

  return (
    <main>
      <section>
        <div className={styles.tabs}>
          <Tabs selectedIndex={selectedTab} onChange={({ selectedIndex }) => setSelectedTab(selectedIndex)}>
            <TabList style={{ paddingLeft: '1rem' }} aria-label="Laboratory tabs" contained>
              {filteredExtensions.map((extension, index) => {
                const { name, title } = extension.meta;

                if (name && title) {
                  return (
                    <Tab key={index} className={styles.tab} id={`${title || index}-tab`}>
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
              {filteredExtensions.map((extension, index) => {
                return (
                  <TabPanel key={`${extension.meta.title}-tab-${index}`}>
                    <ComponentContext.Provider
                      key={extension.id}
                      value={{
                        moduleName: extension.moduleName,
                        featureName: 'laboratory',
                        extension: {
                          extensionId: extension.id,
                          extensionSlotName: labPanelSlot,
                          extensionSlotModuleName: extension.moduleName,
                        },
                      }}
                    >
                      <Extension />
                    </ComponentContext.Provider>
                  </TabPanel>
                );
              })}
            </TabPanels>
          </Tabs>
        </div>
      </section>
    </main>
  );
};

export default LaboratoryOrdersTabs;
