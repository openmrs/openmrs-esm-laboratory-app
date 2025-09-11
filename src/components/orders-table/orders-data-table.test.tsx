import React from 'react';
import { render, screen } from '@testing-library/react';
import OrdersDataTable from './orders-data-table.component';
import { useConfig, getDefaultsFromConfigSchema, Patient, Person } from '@openmrs/esm-framework';
import { configSchema, type Config } from '../../config-schema';
import { useLabOrders, UseLabOrdersParams } from '../../laboratory-resource';
import { Order } from '@openmrs/esm-patient-common-lib';

jest.mock('../../laboratory-resource', () => ({
    useLabOrders: jest.fn(),
}));

const mockUseConfig = jest.mocked(useConfig<Config>);
const mockUseLabOrders = jest.mocked(useLabOrders);

function mockUseLabOrdersImplementation(props: Partial<UseLabOrdersParams>) {
    const mockPatient1: Partial<Patient> = {
        uuid: 'patient-uuid-1',
        display: 'PAT-001 - Pete Seeger',
        identifiers: props.includePatientId ? [
            {
                uuid: 'identifier-uuid-1',
                identifier: 'PAT-001',
                identifierType: {
                    uuid: 'identifier-type-uuid-1',
                },
            },
        ] : undefined,
        person: {
            uuid: 'person-uuid-1',
            display: 'Pete Seeger',
            age: 70,
            gender: 'M',
        }
    };
    const mockPatient2: Partial<Patient> = {
        uuid: 'patient-uuid-2',
        display: 'PAT-002 - Bob Dylan',
        identifiers: props.includePatientId ? [
            {
                uuid: 'identifier-uuid-2',
                identifier: 'PAT-002',
                identifierType: {
                    uuid: 'identifier-type-uuid-2',
                },
            },
        ] : undefined,
        person: {
            uuid: 'person-uuid-2',
            display: 'Bob Dylan',
            age: 60,
            gender: 'M',
        }
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
        }
    ].filter(order => !props.status || order.fulfillerStatus === props.status)
    .filter(order => !props.excludeCanceled || order.fulfillerStatus !== 'CANCELLED') as Array<Order>;
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
        mockUseConfig.mockReturnValue({
            ...getDefaultsFromConfigSchema(configSchema),
          });

          mockUseLabOrders.mockImplementation(mockUseLabOrdersImplementation);
    });
    
    it('should render', () => {
        render(<OrdersDataTable />);
        const table = screen.getByRole('table');
        expect(table).toBeInTheDocument();
        const rows = screen.getAllByRole('row');
        expect(rows).toHaveLength(7);
        screen.debug(rows);
        const dataRows = rows.slice(1).filter(row => !row.classList.contains('hiddenRow'));
        expect(dataRows).toHaveLength(2);
        const headerRow = rows[0];
        expect(headerRow).toHaveTextContent('Patient');
        expect(headerRow).toHaveTextContent('Age');
        expect(headerRow).toHaveTextContent('Gender');
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
    });
}); 