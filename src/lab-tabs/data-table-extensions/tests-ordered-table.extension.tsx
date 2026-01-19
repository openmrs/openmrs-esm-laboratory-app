import React from 'react';
import OrdersDataTable from '../../components/orders-table/orders-data-table.component';

const TestsOrderedTable: React.FC = () => {
  return <OrdersDataTable newOrdersOnly={true} />;
};

export default TestsOrderedTable;
