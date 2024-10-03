import React from 'react';
import { useTranslation } from 'react-i18next';
import { AssignedExtension, useConnectedExtensions, Extension } from '@openmrs/esm-framework';
import { ComponentContext } from '@openmrs/esm-framework/src/internal';
import styles from './laboratory-summary-tiles.scss';

const LaboratorySummaryTiles: React.FC = () => {
  const { t } = useTranslation();
  const labTileSlot = 'lab-tiles-slot';
  const tilesExtensions = useConnectedExtensions(labTileSlot) as AssignedExtension[];

  return (
    <div className={styles.cardContainer}>
      {tilesExtensions
        .filter((extension) => Object.keys(extension.meta).length > 0)
        .map((extension, index) => {
          return (
            <ComponentContext.Provider
              key={extension.id}
              value={{
                moduleName: extension.moduleName,
                featureName: 'laboratory',
                extension: {
                  extensionId: extension.id,
                  extensionSlotName: labTileSlot,
                  extensionSlotModuleName: extension.moduleName,
                },
              }}
            >
              <Extension />
            </ComponentContext.Provider>
          );
        })}
    </div>
  );
};

export default LaboratorySummaryTiles;
