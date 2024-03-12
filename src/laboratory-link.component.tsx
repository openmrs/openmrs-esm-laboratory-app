import React from "react";
import { ConfigurableLink } from "@openmrs/esm-framework";
import { useTranslation } from "react-i18next";

export default function LaboratoryLink() {
  const { t } = useTranslation();
  return (
    <ConfigurableLink to={`${window.spaBase}/home/laboratory`}>
      {t("laboratory", "Laboratory")}
    </ConfigurableLink>
  );
}
