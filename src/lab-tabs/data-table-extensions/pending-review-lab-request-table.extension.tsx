import React from 'react';
import OrdersDataTable from '../../components/orders-table/orders-data-table.component';

const PendingReviewLabRequestsTable: React.FC = () => {
  return (
    <OrdersDataTable
      excludeColumns={[]}
      fulfillerStatus="ON_HOLD"
      useFilter={false}
      excludeCanceledAndDiscontinuedOrders={false}
      actions={[]}
    />
  );
};

export default PendingReviewLabRequestsTable;
