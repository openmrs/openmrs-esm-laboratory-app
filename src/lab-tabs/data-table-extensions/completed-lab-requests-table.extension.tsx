import React from "react";
import OrdersDataTable from "../../components/orders-table/orders-data-table.component";

const CompletedLabRequestsTable: React.FC = () => {
  return (
    <OrdersDataTable
      fulfillerStatus="COMPLETED"
      excludeCanceledAndDiscontinuedOrders={false}
      actionsSlotName="send-back-patient-toqueue-actions-slot"
    />
  );
};

export default CompletedLabRequestsTable;
