import React from 'react';
import OrdersDataTable from '../../components/orders-table/orders-data-table.component';

const CompletedLabRequestsTable: React.FC = () => {
  return (
    <OrdersDataTable
      fulfillerStatus="COMPLETED"
      excludeCanceledAndDiscontinuedOrders={false}
      actionsSlotName="transition-patient-to-latest-queue-button-slot"
    />
  );
};

export default CompletedLabRequestsTable;
