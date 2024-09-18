import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DataTable,
  DataTableSkeleton,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableExpandHeader,
  TableExpandRow,
  TableExpandedRow,
  TableRow,
  Tile,
  Dropdown,
  TableToolbar,
  TableToolbarContent,
  Layer,
  TableToolbarSearch,
  DatePicker,
  DatePickerInput,
} from '@carbon/react';
import { formatDate, parseDate, useConfig, usePagination } from '@openmrs/esm-framework';
import styles from './orders-data-table.scss';
import { FulfillerStatus, OrdersDataTableProps } from '../../types';
import { useLabOrders, useSearchGroupedResults } from '../../laboratory-resource';
import dayjs from 'dayjs';
import { isoDateTimeString } from '../../constants';
import ListOrderDetails from './list-order-details.component';
import TransitionLatestQueueEntryButton from '../../lab-tabs/actions/transition-latest-queue-entry-button.component';
import { Order } from '@openmrs/esm-patient-common-lib';
import { OrdersDateRangePicker } from './orders-date-range-picker';

const OrdersDataTable: React.FC<OrdersDataTableProps> = (props) => {
  const { t } = useTranslation();
  const {
    targetPatientDashboard: { redirectToResultsViewer, redirectToOrders },
  } = useConfig();

  const [filter, setFilter] = useState<FulfillerStatus>(null);
  const [dateRange, setDateRange] = useState<Date[]>([dayjs().startOf('day').toDate(), new Date()]);
  const [searchString, setSearchString] = useState<string>('');

  const { labOrders, isLoading } = useLabOrders(
    props.useFilter ? filter : props.fulfillerStatus,
    props.excludeCanceledAndDiscontinuedOrders,
    dateRange,
  );

  const flattenedLabOrders = useMemo(() => {
    return labOrders.map((eachObject) => ({
      ...eachObject,
      dateActivated: formatDate(parseDate(eachObject.dateActivated)),
      patientName: eachObject.patient?.display.split('-')[1],
      patientUuid: eachObject.patient?.uuid,
      status: eachObject.fulfillerStatus ?? '--',
      orderer: eachObject.orderer?.display.split('-')[1],
    }));
  }, [labOrders]);

  function groupOrdersById(orders) {
    if (orders && orders.length > 0) {
      const groupedOrders = orders.reduce((acc, item) => {
        if (!acc[item.patientUuid]) {
          acc[item.patientUuid] = [];
        }
        acc[item.patientUuid].push(item);
        return acc;
      }, {});

      return Object.keys(groupedOrders).map((patientId) => ({
        patientId,
        orders: groupedOrders[patientId],
      }));
    } else {
      return [];
    }
  }

  const groupedOrdersByPatient = groupOrdersById(flattenedLabOrders);
  const searchResults = useSearchGroupedResults(groupedOrdersByPatient, searchString);

  const orderStatuses = [
    { value: null, display: t('all', 'All') },
    { value: 'NEW', display: t('newStatus', 'NEW') },
    { value: 'RECEIVED', display: t('receivedStatus', 'RECEIVED') },
    { value: 'IN_PROGRESS', display: t('inProgressStatus', 'IN_PROGRESS') },
    { value: 'COMPLETED', display: t('completedStatus', 'COMPLETED') },
    { value: 'EXCEPTION', display: t('exceptionStatus', 'EXCEPTION') },
    { value: 'ON_HOLD', display: t('onHoldStatus', 'ON_HOLD') },
    { value: 'DECLINED', display: t('declinedStatus', 'DECLINED') },
  ];

  const columns = useMemo(() => {
    const defaultColumns = [
      { id: 0, header: t('patient', 'Patient'), key: 'patientName' },
      { id: 1, header: t('totalorders', 'Total Orders'), key: 'totalOrders' },
    ];
    if (props.fulfillerStatus === 'COMPLETED') {
      defaultColumns.push({ id: 2, header: t('actionButton', 'Action'), key: 'action' });
    }
    return defaultColumns;
  }, [t, props.fulfillerStatus]);

  const pageSizes = [10, 20, 30, 40, 50];
  const [currentPageSize, setPageSize] = useState(10);
  const { goTo, results: paginatedLabOrders, currentPage } = usePagination(searchResults, currentPageSize);

  const handleOrderStatusChange = ({ selectedItem }) => setFilter(selectedItem.value);
  const handleOrdersDateRangeChange = (dates: Date[]) => setDateRange(dates);

  const tableRows = useMemo(() => {
    return paginatedLabOrders.map((patient) => ({
      id: patient.patientId,
      patientName: patient.orders[0].patient?.display?.split('-')[1],
      orders: patient.orders,
      totalOrders: patient.orders?.length,
      action:
        props.fulfillerStatus === 'COMPLETED' ? (
          <TransitionLatestQueueEntryButton patientUuid={patient.patientId} />
        ) : null,
    }));
  }, [paginatedLabOrders, props.fulfillerStatus]);

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" showHeader={false} showToolbar={false} />;
  }

  return (
    <DataTable rows={tableRows} headers={columns} useZebraStyles>
      {({ rows, headers, getHeaderProps, getTableProps, getRowProps }) => (
        <TableContainer className={styles.tableContainer}>
          <TableToolbar>
            <TableToolbarContent className={styles.tableToolBar}>
              <Layer className={styles.toolbarItem}>
                {props.useFilter && (
                  <Dropdown
                    id="orderStatusFilter"
                    initialSelectedItem={
                      filter ? orderStatuses.find((status) => status.value === filter) : orderStatuses[0]
                    }
                    items={orderStatuses}
                    itemToString={(item) => item?.display}
                    onChange={handleOrderStatusChange}
                    titleText={t('filterOrdersByStatus', 'Filter orders by status') + ':'}
                    type="inline"
                  />
                )}
                <OrdersDateRangePicker onChange={handleOrdersDateRangeChange} currentValues={dateRange} />
              </Layer>
              <Layer className={styles.toolbarItem}>
                <TableToolbarSearch
                  expanded
                  onChange={(e) => setSearchString(e.target.value)}
                  placeholder={t('searchThisList', 'Search this list')}
                  size="sm"
                />
              </Layer>
            </TableToolbarContent>
          </TableToolbar>
          <Table {...getTableProps()} className={styles.tableWrapper}>
            <TableHead>
              <TableRow>
                <TableExpandHeader enableToggle={rows.length > 0} />
                {headers.map((header) => (
                  <TableHeader {...getHeaderProps({ header })}>{header.header?.content ?? header.header}</TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableExpandRow {...getRowProps({ row })}>
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>{cell.value?.content ?? cell.value}</TableCell>
                    ))}
                  </TableExpandRow>
                  <TableExpandedRow colSpan={headers.length + 1}>
                    <ListOrderDetails
                      actions={props.actions}
                      groupedOrders={groupedOrdersByPatient.find((item) => item.patientId === row.id)}
                    />
                  </TableExpandedRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
          {rows.length === 0 ? (
            <div className={styles.tileContainer}>
              <Tile className={styles.tile}>
                <div className={styles.tileContent}>
                  <p className={styles.content}>
                    {t(
                      'noLabRequestsFoundCheckFilters',
                      'No lab requests found. Please check your filters and try again.',
                    )}
                  </p>
                </div>
              </Tile>
            </div>
          ) : null}
          {rows.length > 0 && (
            <Pagination
              forwardText={t('nextPage', 'Next page')}
              backwardText={t('previousPage', 'Previous page')}
              page={currentPage}
              pageSize={currentPageSize}
              pageSizes={pageSizes}
              totalItems={groupedOrdersByPatient?.length}
              className={styles.pagination}
              onChange={({ pageSize, page }) => {
                if (pageSize !== currentPageSize) {
                  setPageSize(pageSize);
                }
                if (page !== currentPage) {
                  goTo(page);
                }
              }}
            />
          )}
        </TableContainer>
      )}
    </DataTable>
  );
};

export default OrdersDataTable;
