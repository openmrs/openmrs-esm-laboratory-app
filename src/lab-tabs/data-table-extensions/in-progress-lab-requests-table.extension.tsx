import React from "react";
import OrdersDataTable from "../../components/orders-table/orders-data-table.component";

const InProgressLabRequestsTable: React.FC = () => {
  return (
    <OrdersDataTable
      excludeColumns={[]}
      actionsSlotName="inprogress-tests-actions-slot"
      useActivatedOnOrAfterDateFilter={true}
      fulfillerStatus="IN_PROGRESS"
      actions={[
        { actionName: "labResultsForm", order: 0 },
        { actionName: "rejectLabRequest", order: 1 },
      ]}
    />
  );
};

export default InProgressLabRequestsTable;
