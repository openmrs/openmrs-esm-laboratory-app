import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@carbon/react';
import { Extension, useAssignedExtensions, useConfig } from '@openmrs/esm-framework';
// ComponentContext is not part of the public API but is needed here to render extensions
// inside Carbon Tabs structure (TabList + TabPanels must be separate siblings).
// eslint-disable-next-line no-restricted-imports
import { ComponentContext } from '@openmrs/esm-framework/src/internal';
import { type Config } from '../config-schema';
import styles from './laboratory-tabs.scss';

const labPanelSlot = 'lab-panels-slot';

const LaboratoryOrdersTabs: React.FC = () => {
  const { t } = useTranslation();
  const { enableReviewingLabResultsBeforeApproval } = useConfig<Config>();
  const [selectedTab, setSelectedTab] = useState(0);
  const tabExtensions = useAssignedExtensions(labPanelSlot);

  const filteredExtensions = tabExtensions.filter((extension) => {
    const meta = extension.meta ?? {};
    if (Object.keys(meta).length === 0) {
      return false;
    }
    if (meta.name === 'pendingReviewPanel') {
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
              {filteredExtensions.map((extension) => {
                const { name, title } = extension.meta ?? {};

                if (name && title) {
                  return (
                    <Tab key={extension.id} className={styles.tab} id={`${extension.id}-tab`}>
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
              {filteredExtensions.map((extension) => (
                <TabPanel key={extension.id}>
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
              ))}
            </TabPanels>
          </Tabs>
        </div>
      </section>
    </main>
  );
};

export default LaboratoryOrdersTabs;
