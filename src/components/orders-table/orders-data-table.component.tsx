import React, { useMemo, useState } from 'react';
import {
  DataTable,
  DataTableSkeleton,
  Dropdown,
  Layer,
  OverflowMenu,
  OverflowMenuItem,
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
import {
  ExtensionSlot,
  formatDate,
  parseDate,
  type Patient,
  showModal,
  useConfig,
  usePagination,
} from '@openmrs/esm-framework';
import { useTranslation } from 'react-i18next';
import { type FulfillerStatus, type FlattenedOrder, type OrderAction, type Order } from '../../types';
import { useLabOrders } from '../../laboratory-resource';
import { OrdersDateRangePicker } from './orders-date-range-picker.component';
import ListOrderDetails from './list-order-details.component';
import styles from './orders-data-table.scss';
import { type Config } from '../../config-schema';

const labTableColumnSpec = {
  name: {
    // t('patient', 'Patient')
    headerLabelKey: 'patient',
    headerLabelDefault: 'Patient',
    key: 'patientName',
  },
  age: {
    // t('age', 'Age')
    headerLabelKey: 'age',
    headerLabelDefault: 'Age',
    key: 'patientAge',
  },
  dob: {
    // t('dateOfBirth', 'Date of Birth')
    headerLabelKey: 'dob',
    headerLabelDefault: 'Date of Birth',
    key: 'patientDob',
  },
  sex: {
    // t('sex', 'Sex')
    headerLabelKey: 'sex',
    headerLabelDefault: 'Sex',
    key: 'patientSex',
  },
  totalOrders: {
    // t('totalOrders', 'Total Orders')
    headerLabelKey: 'totalOrders',
    headerLabelDefault: 'Total Orders',
    key: 'totalOrders',
  },
  action: {
    // t('action', 'Action')
    headerLabelKey: 'action',
    headerLabelDefault: 'Action',
    key: 'action',
  },
  patientId: {
    // t('patientId', 'Patient ID')
    headerLabelKey: 'patientId',
    headerLabelDefault: 'Patient ID',
    key: 'patientId',
  },
};

export interface OrdersDataTableProps {
  /* Whether the data table should include a status filter dropdown */
  useFilter?: boolean;
  actionsSlotName?: string;
  excludeColumns?: Array<string>;
  fulfillerStatus?: FulfillerStatus;
  newOrdersOnly?: boolean;
  excludeCanceledAndDiscontinuedOrders?: boolean;
  actions?: Array<OrderAction>;
}

const OrdersDataTable: React.FC<OrdersDataTableProps> = (props) => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<FulfillerStatus>(null);
  const [searchString, setSearchString] = useState('');
  const { labTableColumns, patientIdIdentifierTypeUuid } = useConfig<Config>();

  const { labOrders, isLoading } = useLabOrders({
    status: props.useFilter ? filter : props.fulfillerStatus,
    newOrdersOnly: props.newOrdersOnly,
    excludeCanceled: props.excludeCanceledAndDiscontinuedOrders,
    includePatientId: labTableColumns.includes('patientId'),
  });

  const flattenedLabOrders: Array<FlattenedOrder> = useMemo(() => {
    return (
      labOrders?.map((order) => {
        return {
          id: order.uuid,
          patientUuid: order.patient.uuid,
          orderNumber: order.orderNumber,
          dateActivated: formatDate(parseDate(order.dateActivated)),
          fulfillerStatus: order.fulfillerStatus,
          urgency: order.urgency,
          orderer: order.orderer?.display,
          instructions: order.instructions,
          fulfillerComment: order.fulfillerComment,
          display: order.display,
        };
      }) ?? []
    );
  }, [labOrders]);

  const groupedOrdersByPatient = useMemo(() => {
    if (labOrders && labOrders.length > 0) {
      const patientUuids = [...new Set(labOrders.map((order) => order.patient.uuid))];

      return patientUuids.map((patientUuid) => {
        const labOrdersForPatient = labOrders.filter((order) => order.patient.uuid === patientUuid);
        const patient: Patient = labOrdersForPatient[0]?.patient;
        const flattenedLabOrdersForPatient = flattenedLabOrders.filter((order) => order.patientUuid === patientUuid);
        return {
          patientId: patient.identifiers?.find(
            (identifier) =>
              identifier.preferred &&
              !identifier.voided &&
              identifier.identifierType.uuid === patientIdIdentifierTypeUuid,
          )?.identifier,
          patientUuid: patientUuid,
          patientName: patient.person.display,
          patientAge: patient.person.age,
          patientDob: formatDate(parseDate(patient.person.birthdate)),
          patientSex: patient.person.gender,
          totalOrders: flattenedLabOrdersForPatient.length,
          orders: flattenedLabOrdersForPatient,
          originalOrders: labOrdersForPatient,
        };
      });
    } else {
      return [];
    }
  }, [flattenedLabOrders, labOrders, patientIdIdentifierTypeUuid]);

  const searchResults = useMemo(() => {
    if (searchString && searchString.trim() !== '') {
      // Normalize the search string to lowercase
      const lowerSearchString = searchString.toLowerCase();
      return groupedOrdersByPatient.filter(
        (orderGroup) =>
          (labTableColumns.includes('name') && orderGroup.patientName.toLowerCase().includes(lowerSearchString)) ||
          (labTableColumns.includes('patientId') && orderGroup.patientId.toLowerCase().includes(lowerSearchString)) ||
          orderGroup.orders.some((order) => order.orderNumber.toLowerCase().includes(lowerSearchString)),
      );
    }

    return groupedOrdersByPatient;
  }, [searchString, groupedOrdersByPatient, labTableColumns]);

  const orderStatuses = [
    { value: null, display: t('all', 'All') },
    { value: 'RECEIVED', display: t('receivedStatus', 'RECEIVED') },
    { value: 'IN_PROGRESS', display: t('inProgressStatus', 'IN_PROGRESS') },
    { value: 'COMPLETED', display: t('completedStatus', 'COMPLETED') },
    { value: 'EXCEPTION', display: t('exceptionStatus', 'EXCEPTION') },
    { value: 'ON_HOLD', display: t('onHoldStatus', 'ON_HOLD') },
    { value: 'DECLINED', display: t('declinedStatus', 'DECLINED') },
  ];

  const columns = useMemo(() => {
    return labTableColumns
      .map((column) => {
        const spec = labTableColumnSpec[column];
        if (!spec) {
          throw new Error(`Lab table has been configured with an invalid column: ${column}`);
        }
        if (spec.key === 'action') {
          const showActionColumn = flattenedLabOrders.some((order) => order.fulfillerStatus === 'COMPLETED');
          if (!showActionColumn) {
            return null;
          }
        }
        return { header: t(spec.headerLabelKey, spec.headerLabelDefault), key: spec.key };
      })
      .filter(Boolean)
      .map((column, index) => ({ ...column, id: index }));
  }, [t, flattenedLabOrders, labTableColumns]);

  const pageSizes = [10, 20, 30, 40, 50];
  const [currentPageSize, setPageSize] = useState(10);
  const { goTo, results: paginatedLabOrders, currentPage } = usePagination(searchResults, currentPageSize);

  const handleOrderStatusChange = ({ selectedItem }) => setFilter(selectedItem.value);

  const handlePrintModal = (orders: Array<Order>) => {
    const completedOrders = orders.filter((order) => order.fulfillerStatus === 'COMPLETED');
    const dispose = showModal('print-lab-results-modal', {
      closeModal: () => dispose(),
      orders: completedOrders,
    });
  };

  const handleLaunchModal = (orders: Array<Order>) => {
    const completedOrders = orders.filter((order) => order.fulfillerStatus === 'COMPLETED');
    const dispose = showModal('edit-lab-results-modal', {
      closeModal: () => dispose(),
      orders: completedOrders,
    });
  };

  const tableRows = useMemo(() => {
    return paginatedLabOrders.map((groupedOrder) => ({
      ...groupedOrder,
      id: groupedOrder.patientUuid,
      action: groupedOrder.orders.some((o) => o.fulfillerStatus === 'COMPLETED') ? (
        <div className={styles.actionCell}>
          <OverflowMenu aria-label="Actions" flipped iconDescription="Actions">
            <ExtensionSlot
              className={styles.transitionOverflowMenuItemSlot}
              name="transition-overflow-menu-item-slot"
              state={{ patientUuid: groupedOrder.patientUuid }}
              // Without tabIndex={0} here, the overflow menu incorrectly sets initial focus to the second item instead of the first.
              tabIndex={0}
            />
            <OverflowMenuItem
              className={styles.menuitem}
              itemText={t('editResults', 'Edit results')}
              onClick={() => handleLaunchModal(groupedOrder.originalOrders)}
            />
            <OverflowMenuItem
              className={styles.menuitem}
              itemText={t('printTestResults', 'Print test results')}
              onClick={() => handlePrintModal(groupedOrder.originalOrders)}
            />
          </OverflowMenu>
        </div>
      ) : null,
    }));
  }, [paginatedLabOrders, t]);

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" showHeader={false} showToolbar={false} />;
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
                    label=""
                    onChange={handleOrderStatusChange}
                    titleText={t('filterOrdersByStatus', 'Filter orders by status') + ':'}
                    type="inline"
                  />
                )}
                <OrdersDateRangePicker />
              </Layer>
              <Layer className={styles.toolbarItem}>
                <TableToolbarSearch
                  expanded
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchString(e.target.value)}
                  placeholder={t('searchThisList', 'Search this list')}
                  size="sm"
                />
              </Layer>
            </TableToolbarContent>
          </TableToolbar>
          <Table className={styles.tableWrapper} {...getTableProps()}>
            <TableHead>
              <TableRow>
                <TableExpandHeader enableToggle {...getExpandHeaderProps()} />
                {headers.map((header) => (
                  <TableHeader {...getHeaderProps({ header })}>{header.header}</TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableExpandRow {...getRowProps({ row })} key={row.id}>
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>{cell.value?.content ?? cell.value}</TableCell>
                    ))}
                  </TableExpandRow>
                  {row.isExpanded ? (
                    <TableExpandedRow colSpan={headers.length + 2}>
                      <ListOrderDetails
                        actions={props.actions}
                        groupedOrders={groupedOrdersByPatient.find((item) => item.patientUuid === row.id)}
                      />
                    </TableExpandedRow>
                  ) : (
                    <TableExpandedRow className={styles.hiddenRow} colSpan={headers.length + 2} />
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
          {rows.length === 0 ? (
            <div className={styles.tileContainer}>
              <Tile className={styles.tile}>
                <div className={styles.tileContent}>
                  <p className={styles.content}>{t('noLabRequestsFound', 'No lab requests found')}</p>
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
                if (pageSize !== currentPageSize) setPageSize(pageSize);
                if (page !== currentPage) goTo(page);
              }}
            />
          )}
        </TableContainer>
      )}
    </DataTable>
  );
};

export default OrdersDataTable;
