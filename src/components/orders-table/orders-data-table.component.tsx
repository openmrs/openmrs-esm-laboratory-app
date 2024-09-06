import React, { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import {
  DataTable,
  DataTableSkeleton,
  DatePicker,
  DatePickerInput,
  Dropdown,
  Layer,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableExpandedRow,
  TableExpandHeader,
  TableExpandRow,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Tile,
} from '@carbon/react';
import { formatDate, parseDate, useConfig, usePagination } from '@openmrs/esm-framework';
import { FulfillerStatus, OrdersDataTableProps } from '../../types';
import { useLabOrders, useSearchGroupedResults } from '../../laboratory-resource';
import { isoDateTimeString } from '../../constants';
import ListOrderDetails from './list-order-details.component';
import styles from './orders-data-table.scss';
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

  const flattenedLabOrders: Order[] = useMemo(() => {
    return labOrders.map((order) => {
      return {
        ...order,
        dateActivated: formatDate(parseDate(order.dateActivated)),
        patientName: order.patient?.display.split('-')[1],
        patientUuid: order.patient?.uuid,
        status: order.fulfillerStatus ?? '--',
        orderer: order.orderer,
      };
    });
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

      // Convert the result to an array of objects with patientId and orders
      return Object.keys(groupedOrders).map((patientId) => ({
        patientId: patientId,
        orders: groupedOrders[patientId],
      }));
    } else {
      return [];
    }
  }
  const groupedOrdersByPatient = groupOrdersById(flattenedLabOrders);

  const searchResults = useSearchGroupedResults(groupedOrdersByPatient, searchString);

  const orderStatuses = [
    {
      value: null,
      display: t('all', 'All'),
    },
    {
      value: 'NEW',
      display: t('newStatus', 'NEW'),
    },
    {
      value: 'RECEIVED',
      display: t('receivedStatus', 'RECEIVED'),
    },
    {
      value: 'IN_PROGRESS',
      display: t('inProgressStatus', 'IN_PROGRESS'),
    },
    {
      value: 'COMPLETED',
      display: t('completedStatus', 'COMPLETED'),
    },
    {
      value: 'EXCEPTION',
      display: t('exceptionStatus', 'EXCEPTION'),
    },
    {
      value: 'ON_HOLD',
      display: t('onHoldStatus', 'ON_HOLD'),
    },
    {
      value: 'DECLINED',
      display: t('declinedStatus', 'DECLINED'),
    },
  ];

  const columns = useMemo(() => {
    return [
      { id: 0, header: t('patient', 'Patient'), key: 'patientName' },
      { id: 1, header: t('totalOrders', 'Total Orders'), key: 'totalOrders' },
    ];
  }, [t]);

  const pageSizes = [10, 20, 30, 40, 50];
  const [currentPageSize, setPageSize] = useState(10);
  const { goTo, results: paginatedLabOrders, currentPage } = usePagination(searchResults, currentPageSize);

  const handleOrderStatusChange = ({ selectedItem }) => setFilter(selectedItem.value);

  const handleOrdersDateRangeChange = (dates: Date[]) => {
    setDateRange(dates);
  };

  const tableRows = useMemo(() => {
    return paginatedLabOrders.map((patient) => ({
      id: patient.patientId,
      patientName: patient.orders[0].patient?.display?.split('-')[1],
      orders: patient.orders,
      totalOrders: patient.orders?.length,
    }));
  }, [paginatedLabOrders]);

  if (isLoading) {
    return <DataTableSkeleton className={styles.loader} role="progressbar" showHeader={false} showToolbar={false} />;
  }
  return (
    <DataTable rows={tableRows} headers={columns} useZebraStyles>
      {({ getExpandHeaderProps, getHeaderProps, getRowProps, getTableProps, headers, rows }) => (
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
                <TableExpandHeader enableToggle={rows.length > 0} {...getExpandHeaderProps()} />
                {headers.map((header) => (
                  <TableHeader {...getHeaderProps({ header })}>{header.header?.content ?? header.header}</TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                return (
                  <React.Fragment key={row.id}>
                    <TableExpandRow {...getRowProps({ row })} key={row.id}>
                      {row.cells.map((cell) => (
                        <TableCell key={cell.id}>{cell.value?.content ?? cell.value}</TableCell>
                      ))}
                    </TableExpandRow>
                    {row.isExpanded ? (
                      <TableExpandedRow colSpan={headers.length + 1}>
                        <ListOrderDetails
                          actions={props.actions}
                          groupedOrders={groupedOrdersByPatient.find((item) => item.patientId === row.id)}
                        />
                      </TableExpandedRow>
                    ) : (
                      <TableExpandedRow className={styles.hiddenRow} colSpan={headers.length + 2} />
                    )}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
          {rows.length === 0 ? (
            <div className={styles.tileContainer}>
              <Tile className={styles.tile}>
                <div className={styles.tileContent}>
                  <p className={styles.content}>{t('noLabRequestsFoundC', 'No lab requests found')}</p>
                  <p className={styles.emptyStateHelperText}>
                    {t('checkFilters', 'Please check the filters above and try again')}
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
