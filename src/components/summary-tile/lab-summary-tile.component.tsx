import React from "react";
import { useTranslation } from "react-i18next";
import { Tile, Button } from "@carbon/react";
import { ArrowRight } from "@carbon/react/icons";
import styles from "./lab-summary-tile.scss";
import { ConfigurableLink } from "@openmrs/esm-framework";

interface LabSummaryTileProps {
  label: string;
  value: number;
  headerLabel: string;
  children?: React.ReactNode;
}

const LabSummaryTile: React.FC<LabSummaryTileProps> = ({
  label,
  value,
  headerLabel,
  children,
}) => {
  const { t } = useTranslation();

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
