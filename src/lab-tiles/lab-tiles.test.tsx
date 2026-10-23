import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { type Order } from '@openmrs/esm-framework';
import { useLabOrders } from '../laboratory.resource';
import AllLabRequestsTile from './all-lab-requests-tile.component';
import CompletedLabRequestsTile from './completed-lab-requests-tile.component';
import InProgressLabRequestsTile from './in-progress-lab-requests-tile.component';
import PendingReviewLabRequestsTile from './pending-review-lab-results-tile.component';

vi.mock('../laboratory.resource', () => ({
  useLabOrders: vi.fn(),
}));

const mockUseLabOrders = vi.mocked(useLabOrders);

function mockLabOrdersResponse({ labOrders = [], isError }: { labOrders?: Array<Order>; isError?: Error }) {
  mockUseLabOrders.mockReturnValue({
    labOrders,
    isLoading: false,
    isError,
    mutate: vi.fn(),
    isValidating: false,
  });
}

const tiles = [
  { name: 'AllLabRequestsTile', Tile: AllLabRequestsTile, label: 'Orders' },
  { name: 'InProgressLabRequestsTile', Tile: InProgressLabRequestsTile, label: 'In progress' },
  { name: 'CompletedLabRequestsTile', Tile: CompletedLabRequestsTile, label: 'Completed' },
  { name: 'PendingReviewLabRequestsTile', Tile: PendingReviewLabRequestsTile, label: 'Pending Review' },
];

describe.each(tiles)('$name', ({ Tile, label }) => {
  beforeEach(() => {
    mockUseLabOrders.mockReset();
  });

  it('shows "--" when lab orders fail to load', () => {
    mockLabOrdersResponse({ isError: new Error('Service Unavailable') });

    render(<Tile />);

    expect(screen.getByText(label)).toBeInTheDocument();
    expect(screen.getByText('--')).toBeInTheDocument();
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('shows 0 when lab orders load successfully with no results', () => {
    mockLabOrdersResponse({});

    render(<Tile />);

    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.queryByText('--')).not.toBeInTheDocument();
  });

  it('keeps showing the last loaded count when a background refresh fails', () => {
    mockLabOrdersResponse({
      labOrders: [{ uuid: 'order-1' }, { uuid: 'order-2' }, { uuid: 'order-3' }] as Array<Order>,
      isError: new Error('Service Unavailable'),
    });

    render(<Tile />);

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.queryByText('--')).not.toBeInTheDocument();
  });

  it('shows the order count after recovering from a failed request', () => {
    mockLabOrdersResponse({ isError: new Error('Service Unavailable') });

    const { rerender } = render(<Tile />);
    expect(screen.getByText('--')).toBeInTheDocument();

    mockLabOrdersResponse({ labOrders: [{ uuid: 'order-1' }, { uuid: 'order-2' }] as Array<Order> });
    rerender(<Tile />);

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.queryByText('--')).not.toBeInTheDocument();
  });
});
