import React from 'react';
import { Tile } from '@carbon/react';
import styles from './lab-summary-tile.scss';

interface LabSummaryTileProps {
  label: string;
  value: number;
  headerLabel: string;
  children?: React.ReactNode;
}

const LabSummaryTile: React.FC<LabSummaryTileProps> = ({ label, value, headerLabel, children }) => {
  return (
    <Tile className={styles.tileContainer} light>
      <div className={styles.tileHeader}>
        <div className={styles.headerLabelContainer}>
          <label className={styles.headerLabel}>{headerLabel}</label>
          {children}
        </div>
        {/* <div className={styles.link}>
          <ConfigurableLink className={styles.link} to="">
            {t("view", "View")}
          </ConfigurableLink>
          <ArrowRight size={16} />
        </div> */}
      </div>
      <div>
        <label className={styles.totalsLabel}>{label}</label>
        <p className={styles.totalsValue}>{value}</p>
      </div>
    </Tile>
  );
};

export default LabSummaryTile;
