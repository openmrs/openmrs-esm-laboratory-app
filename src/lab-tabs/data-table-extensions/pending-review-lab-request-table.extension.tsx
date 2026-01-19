import React from 'react';
import OrdersDataTable from '../../components/orders-table/orders-data-table.component';

const PendingReviewLabRequestsTable: React.FC = () => {
  return <OrdersDataTable fulfillerStatus="DRAFT" useFilter={false} excludeCanceledAndDiscontinuedOrders={false} />;
};

export default PendingReviewLabRequestsTable;
