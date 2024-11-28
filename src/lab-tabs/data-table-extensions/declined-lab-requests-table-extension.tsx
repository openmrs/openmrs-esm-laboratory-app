import React from 'react';
import OrdersDataTable from '../../components/orders-table/orders-data-table.component';

const DeclinedLabRequestsTable: React.FC = () => {
  return (
    <OrdersDataTable
      fulfillerStatus="DECLINED"
      excludeColumns={[]}
      excludeCanceledAndDiscontinuedOrders={false}
      actions={[]}
    />
  );
};

export default DeclinedLabRequestsTable;
