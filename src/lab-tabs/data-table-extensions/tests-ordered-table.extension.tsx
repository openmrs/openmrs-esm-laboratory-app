import React from 'react';
import OrdersDataTable from '../../components/orders-table/orders-data-table.component';

const TestsOrderedTable: React.FC = () => {
  return <OrdersDataTable actionsSlotName="tests-ordered-actions-slot" newOrdersOnly={true} />;
};

export default TestsOrderedTable;
