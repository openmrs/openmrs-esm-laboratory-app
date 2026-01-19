import React from 'react';
import OrdersDataTable from '../../components/orders-table/orders-data-table.component';

const InProgressLabRequestsTable: React.FC = () => {
  return <OrdersDataTable actionsSlotName="inprogress-tests-actions-slot" fulfillerStatus="IN_PROGRESS" />;
};

export default InProgressLabRequestsTable;
