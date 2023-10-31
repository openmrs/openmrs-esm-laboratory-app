import React from "react";
import { useTranslation } from "react-i18next";
import { useGetLabOrders } from "./lab-tests.resource";

import { DataTableSkeleton } from "@carbon/react";
import { ErrorState } from "@openmrs/esm-framework";

const LabTests = () => {
  const { t } = useTranslation();

  // get lab orders
  const { data: labOrders, isLoading, isError } = useGetLabOrders("");

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />;
  }

  if (isError) {
    return <ErrorState error={isError} headerTitle={"Results Error"} />;
  }

  // const filteredItems = labOrders.orders.filter(
  //   (ob) => ob?.order?.type === "testorder"
  // );

  let columns = [
    {
      id: 1,
      header: t("date", "Date"),
      key: "date",
    },
    { id: 2, header: t("orderNumber", "Order Number"), key: "orderNumber" },
    { id: 3, header: t("order", "Order"), key: "order" },

    { id: 5, header: t("actions", "Actions"), key: "actions" },
  ];
};

export default LabTests;
