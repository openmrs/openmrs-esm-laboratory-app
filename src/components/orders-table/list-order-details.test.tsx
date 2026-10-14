import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { Order } from '@openmrs/esm-framework';
import { type GroupedOrders } from '../../types';
import ListOrderDetails from './list-order-details.component';

const baseOrder = {
  uuid: 'order-uuid-1',
  orderNumber: 'ORD-001',
  display: 'Blood Test',
  dateActivated: '2021-06-01',
  fulfillerStatus: 'RECEIVED',
  urgency: null,
  orderer: { uuid: 'orderer-uuid-1', display: 'Dr. Test', person: { display: 'Dr. Test' } },
  instructions: null,
  fulfillerComment: null,
};

const makeGroupedOrders = (orderPatch: object = {}): GroupedOrders => ({
  patientUuid: 'patient-uuid-1',
  totalOrders: 1,
  urgencyCounts: {},
  orders: [],
  originalOrders: [{ ...baseOrder, ...orderPatch } as unknown as Order],
});

describe('ListOrderDetails — order reason', () => {
  it('shows the coded order reason display when orderReason is set', () => {
    render(
      <ListOrderDetails
        groupedOrders={makeGroupedOrders({ orderReason: { uuid: 'concept-uuid-1', display: 'Fever screening' } })}
      />,
    );

    expect(screen.getByText('Order reason:')).toBeInTheDocument();
    expect(screen.getByText('Fever screening')).toBeInTheDocument();
  });

  it('shows the non-coded order reason when only orderReasonNonCoded is set', () => {
    render(
      <ListOrderDetails
        groupedOrders={makeGroupedOrders({ orderReasonNonCoded: 'Patient requested routine check' })}
      />,
    );

    expect(screen.getByText('Patient requested routine check')).toBeInTheDocument();
  });

  it('shows "--" when neither orderReason nor orderReasonNonCoded is set', () => {
    render(<ListOrderDetails groupedOrders={makeGroupedOrders()} />);

    expect(screen.getByText('Order reason:')).toBeInTheDocument();
    expect(screen.getByText('--')).toBeInTheDocument();
  });

  it('prefers the coded orderReason over orderReasonNonCoded when both are set', () => {
    render(
      <ListOrderDetails
        groupedOrders={makeGroupedOrders({
          orderReason: { uuid: 'concept-uuid-2', display: 'Malaria screening' },
          orderReasonNonCoded: 'Should not appear',
        })}
      />,
    );

    expect(screen.getByText('Malaria screening')).toBeInTheDocument();
    expect(screen.queryByText('Should not appear')).not.toBeInTheDocument();
  });
});
