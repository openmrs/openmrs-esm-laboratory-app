import React from 'react';
import OrdersDataTable from '../../components/orders-table/orders-data-table.component';

const PendingReviewLabRequestsTable: React.FC = () => {
  return (
    <OrdersDataTable
      excludeColumns={[]}
      fulfillerStatus="DRAFT"
      useFilter={false}
      excludeCanceledAndDiscontinuedOrders={false}
      actions={[]}
    />
  );
};

export default PendingReviewLabRequestsTable;
