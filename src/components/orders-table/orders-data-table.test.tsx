import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useConfig, getDefaultsFromConfigSchema, type Order, type Patient } from '@openmrs/esm-framework';
import { configSchema, type Config } from '../../config-schema';
import { useLabOrders } from '../../laboratory-resource';
import OrdersDataTable from './orders-data-table.component';

jest.mock('../../laboratory-resource', () => ({
  useLabOrders: jest.fn(),
}));

const mockUseConfig = jest.mocked(useConfig<Config>);
const mockUseLabOrders = jest.mocked(useLabOrders);

function mockUseLabOrdersImplementation(props: Parameters<typeof useLabOrders>[0]) {
  const mockPatient1: Partial<Patient> = {
    uuid: 'patient-uuid-1',
    display: 'PAT-001 - Pete Seeger',
    identifiers: props.includePatientId
      ? [
          {
            uuid: 'identifier-uuid-1',
            identifier: 'PAT-001',
            preferred: true,
            voided: false,
            identifierType: {
              uuid: 'identifier-type-uuid-1',
            },
          },
          {
            uuid: 'identifier-uuid-2',
            identifier: 'BAD-ID-NOT-PREFERRED',
            preferred: false,
            voided: false,
            identifierType: {
              uuid: 'identifier-type-uuid-1',
            },
          },
        ]
      : undefined,
    person: {
      uuid: 'person-uuid-1',
      display: 'Pete Seeger',
      age: 70,
      gender: 'M',
    },
  };
  const mockPatient2: Partial<Patient> = {
    uuid: 'patient-uuid-2',
    display: 'PAT-002 - Bob Dylan',
    identifiers: props.includePatientId
      ? [
          {
            uuid: 'identifier-uuid-3',
            identifier: 'BAD-ID-WRONG-TYPE',
            preferred: true,
            voided: false,
            identifierType: {
              uuid: '05a29f94-c0ed-11e2-94be-8c13b969e334',
            },
          },
          {
            uuid: 'identifier-uuid-4',
            identifier: 'PAT-002',
            preferred: true,
            voided: false,
            identifierType: {
              uuid: 'identifier-type-uuid-1',
            },
          },
        ]
      : undefined,
    person: {
      uuid: 'person-uuid-2',
      display: 'Bob Dylan',
      age: 60,
      gender: 'M',
    },
  };

  const mockOrderer = {
    uuid: 'orderer-uuid-1',
    display: 'Dr. John Doe',
    person: {
      display: 'Dr. John Doe',
    },
  };

  const labOrders = [
    {
      uuid: 'order-uuid-1',
      orderNumber: 'ORD-001',
      patient: mockPatient1 as Patient,
      dateActivated: '2021-01-01',
      fulfillerStatus: 'RECEIVED',
      urgency: 'ROUTINE',
      orderer: mockOrderer,
      instructions: 'Inspect banjo & check tuning',
      fulfillerComment: null,
      display: 'Banjo Inspection',
    },
    {
      uuid: 'order-uuid-2',
      orderNumber: 'ORD-002',
      patient: mockPatient1 as Patient,
      dateActivated: '2021-01-01',
      fulfillerStatus: 'RECEIVED',
      urgency: 'ROUTINE',
      orderer: mockOrderer,
      instructions: 'Give it a strum',
      fulfillerComment: null,
      display: 'Guitar Inspection',
    },
    {
      uuid: 'order-uuid-3',
      orderNumber: 'ORD-003',
      patient: mockPatient2 as Patient,
      dateActivated: '2021-01-01',
      fulfillerStatus: 'RECEIVED',
      urgency: 'EMERGENCY',
      orderer: mockOrderer,
      instructions: 'Make some noise',
      fulfillerComment: null,
      display: 'Sound Check',
    },
  ]
    .filter((order) => !props.status || order.fulfillerStatus === props.status)
    .filter((order) => !props.excludeCanceled || order.fulfillerStatus !== 'CANCELLED') as Array<Order>;
  return {
    labOrders,
    isLoading: false,
    isError: false,
    mutate: jest.fn(),
    isValidating: false,
  };
}

describe('OrdersDataTable', () => {
  beforeEach(() => {
    mockUseLabOrders.mockImplementation(mockUseLabOrdersImplementation);
  });

  it('should render one row per patient and show lab details', async () => {
    mockUseConfig.mockReturnValue({
      ...getDefaultsFromConfigSchema(configSchema),
    });

    render(<OrdersDataTable />);
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(5);
    const dataRows = rows.slice(1).filter((row) => !row.classList.contains('hiddenRow'));
    expect(dataRows).toHaveLength(2);
    const headerRow = rows[0];
    expect(headerRow).toHaveTextContent('Patient');
    expect(headerRow).toHaveTextContent('Age');
    expect(headerRow).toHaveTextContent('Sex');
    expect(headerRow).toHaveTextContent('Total Orders');
    const row1 = dataRows[0];
    expect(row1).toHaveTextContent('Pete Seeger');
    expect(row1).toHaveTextContent('70');
    expect(row1).toHaveTextContent('M');
    expect(row1).toHaveTextContent('2');
    const row2 = dataRows[1];
    expect(row2).toHaveTextContent('Bob Dylan');
    expect(row2).toHaveTextContent('60');
    expect(row2).toHaveTextContent('M');
    expect(row2).toHaveTextContent('1');

    const user = userEvent.setup();
    await user.click(within(row1).getByLabelText('Expand current row'));

    const orderDetailsTables = within(table).getAllByRole('table');
    expect(orderDetailsTables).toHaveLength(2);
    const orderDetailsTable1 = orderDetailsTables[0];
    const orderDetailsTable2 = orderDetailsTables[1];
    expect(orderDetailsTable1).toHaveTextContent('Banjo Inspection');
    expect(orderDetailsTable1).toHaveTextContent('Inspect banjo & check tuning');
    expect(orderDetailsTable1).toHaveTextContent('Dr. John Doe');
    expect(orderDetailsTable1).toHaveTextContent('01-Jan-2021');
    expect(orderDetailsTable1).toHaveTextContent('Received');
    expect(orderDetailsTable1).toHaveTextContent('Routine');
    expect(orderDetailsTable2).toHaveTextContent('Guitar Inspection');
    expect(orderDetailsTable2).toHaveTextContent('Give it a strum');
    expect(orderDetailsTable2).toHaveTextContent('Dr. John Doe');
    expect(orderDetailsTable2).toHaveTextContent('01-Jan-2021');
    expect(orderDetailsTable2).toHaveTextContent('Received');
    expect(orderDetailsTable2).toHaveTextContent('Routine');
  });

  it('should show patient identifier if it is configured', () => {
    mockUseConfig.mockReturnValue({
      ...getDefaultsFromConfigSchema(configSchema),
      labTableColumns: ['patientId', 'age', 'totalOrders'],
      patientIdIdentifierTypeUuid: 'identifier-type-uuid-1',
    });
    render(<OrdersDataTable />);
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(5);
    const dataRows = rows.slice(1).filter((row) => !row.classList.contains('hiddenRow'));
    expect(dataRows).toHaveLength(2);
    const row1 = dataRows[0];
    expect(row1).toHaveTextContent('PAT-001');
    expect(row1).toHaveTextContent('70');
    expect(row1).toHaveTextContent('2');
    const row2 = dataRows[1];
    expect(row2).toHaveTextContent('PAT-002');
    expect(row2).toHaveTextContent('60');
    expect(row2).toHaveTextContent('1');
    expect(screen.queryByText(/BAD-ID/)).not.toBeInTheDocument();
  });
});
