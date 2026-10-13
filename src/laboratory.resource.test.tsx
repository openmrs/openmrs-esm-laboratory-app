import React, { type PropsWithChildren } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { SWRConfig } from 'swr';
import { openmrsFetch, useAppContext, useConfig, type FetchResponse, type Order } from '@openmrs/esm-framework';
import { type DateFilterContext } from './types';
import { useLabOrders } from './laboratory.resource';

const mockOpenmrsFetch = vi.mocked(openmrsFetch);
const mockUseAppContext = vi.mocked(useAppContext<DateFilterContext>);
const mockUseConfig = vi.mocked(useConfig);

function wrapper({ children }: PropsWithChildren) {
  return <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>{children}</SWRConfig>;
}

function respondWithOrders(orders: Array<Partial<Order>>) {
  mockOpenmrsFetch.mockResolvedValue({ data: { results: orders } } as FetchResponse<{ results: Array<Order> }>);
}

beforeEach(() => {
  mockUseConfig.mockReturnValue({ laboratoryOrderTypeUuid: 'lab-order-type' });
  mockUseAppContext.mockReturnValue({
    dateRange: [new Date('2026-10-12T00:00:00Z'), new Date('2026-10-12T12:00:00Z')],
    setDateRange: vi.fn(),
  });
});

describe('useLabOrders', () => {
  it('includes unpicked revisions alongside new orders in Tests ordered', async () => {
    respondWithOrders([
      { uuid: 'new', action: 'NEW', fulfillerStatus: null },
      { uuid: 'revised', action: 'REVISE', fulfillerStatus: null },
      { uuid: 'discontinued', action: 'DISCONTINUE', fulfillerStatus: null },
      { uuid: 'renewed', action: 'RENEW', fulfillerStatus: null },
      { uuid: 'received', action: 'REVISE', fulfillerStatus: 'RECEIVED' },
      { uuid: 'in-progress', action: 'REVISE', fulfillerStatus: 'IN_PROGRESS' },
      { uuid: 'completed', action: 'REVISE', fulfillerStatus: 'COMPLETED' },
      { uuid: 'declined', action: 'REVISE', fulfillerStatus: 'DECLINED' },
    ]);

    const { result } = renderHook(() => useLabOrders({ unpickedOrdersOnly: true }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.labOrders.map(({ uuid }) => uuid)).toEqual(['new', 'revised']);
    expect(mockOpenmrsFetch).toHaveBeenCalledWith(
      expect.stringContaining('&excludeCanceledAndExpired=true&excludeDiscontinueOrders=true'),
    );
  });

  it('keeps the defaults when callers explicitly pass undefined options', async () => {
    const orders: Array<Partial<Order>> = [{ uuid: 'completed', action: 'REVISE', fulfillerStatus: 'COMPLETED' }];
    respondWithOrders(orders);

    const { result } = renderHook(
      () => useLabOrders({ status: undefined, unpickedOrdersOnly: undefined, excludeCanceled: undefined }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.labOrders).toEqual(orders);
    const url = mockOpenmrsFetch.mock.calls[0][0] as string;
    expect(url).toContain('&excludeCanceledAndExpired=true&excludeDiscontinueOrders=true');
    expect(url).not.toContain('&fulfillerStatus=');
  });

  it('honors the status and cancellation options for the Completed tab', async () => {
    const orders: Array<Partial<Order>> = [{ uuid: 'completed', action: 'REVISE', fulfillerStatus: 'COMPLETED' }];
    respondWithOrders(orders);

    const { result } = renderHook(() => useLabOrders({ status: 'COMPLETED', excludeCanceled: false }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.labOrders).toEqual(orders);
    const url = mockOpenmrsFetch.mock.calls[0][0] as string;
    expect(url).toContain('&fulfillerStatus=COMPLETED');
    expect(url).not.toContain('&excludeCanceledAndExpired=');
    expect(url).not.toContain('&excludeDiscontinueOrders=');
  });
});
