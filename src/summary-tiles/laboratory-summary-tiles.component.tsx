import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./laboratory-summary-tiles.scss";
import {
  AssignedExtension,
  ExtensionSlot,
  useConnectedExtensions,
  useSession,
  attach,
  detachAll,
} from "@openmrs/esm-framework";

const LaboratorySummaryTiles: React.FC = () => {
  const { t } = useTranslation();

  const session = useSession();

  const labTileSlot = "lab-tiles-slot";

  const tilesExtensions = useConnectedExtensions(
    labTileSlot
  ) as AssignedExtension[];

  const [derivedSlots, setDerivedSlots] = useState<
    { slot: string; extension: string }[]
  >([]);

  const extraTiles = useMemo(() => {
    const filteredExtensions = tilesExtensions.filter(
      (extension) => Object.keys(extension.meta).length > 0
    );
    const derivedSlotsBuffer = [];
    return filteredExtensions.map((extension, index) => {
      const slotName = `${labTileSlot}-${index}`;
      derivedSlotsBuffer.push({
        slot: slotName,
        extension: extension.name,
      });
      if (filteredExtensions.length === index + 1) {
        setDerivedSlots(derivedSlotsBuffer);
      }

      return <ExtensionSlot name={slotName} />;
    });
  }, [tilesExtensions]);

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

  return <div className={styles.cardContainer}>{extraTiles}</div>;
};

export default LaboratorySummaryTiles;
