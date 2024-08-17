import React from "react";
import OrdersDataTable from "../../components/orders-table/orders-data-table.component";

const CompletedLabRequestsTable: React.FC = () => {
  return (
    <OrdersDataTable
      fulfillerStatus="COMPLETED"
      excludeColumns={[]}
      useActivatedOnOrAfterDateFilter
      excludeCanceledAndDiscontinuedOrders={false}
      actions={[]}
    />
  );
};

export default CompletedLabRequestsTable;
