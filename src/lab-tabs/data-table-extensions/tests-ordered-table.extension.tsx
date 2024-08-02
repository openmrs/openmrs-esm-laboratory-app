import React from "react";
import OrdersDataTable from "../../components/orders-table/orders-data-table.component";

const TestsOrderedTable: React.FC = () => {
  return (
    <OrdersDataTable
      excludeColumns={[]}
      actionsSlotName="tests-ordered-actions-slot"
      useFilter
      actions={[
        { actionName: "pickupLabRequest", order: 0 },
        { actionName: "rejectLabRequest", order: 1 },
      ]}
    />
  );
};

export default TestsOrderedTable;
