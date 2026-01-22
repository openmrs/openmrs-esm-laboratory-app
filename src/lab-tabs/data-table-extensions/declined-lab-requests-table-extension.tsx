import React from 'react';
import OrdersDataTable from '../../components/orders-table/orders-data-table.component';

const DeclinedLabRequestsTable: React.FC = () => {
  return <OrdersDataTable fulfillerStatus="DECLINED" excludeCanceledAndDiscontinuedOrders={false} />;
};

export default DeclinedLabRequestsTable;
