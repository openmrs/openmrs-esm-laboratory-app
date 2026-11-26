import React, { type PropsWithChildren } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { SWRConfig } from 'swr';
import { openmrsFetch, useAppContext, useConfig, type FetchResponse, type Order } from '@openmrs/esm-framework';
import { type DateFilterContext } from './types';
import { useInvalidateLabOrders, useLabOrders } from './laboratory.resource';

// The framework mock's useOpenmrsFetchAll runs the real hook, which imports openmrsFetch from
// @openmrs/esm-api rather than from @openmrs/esm-framework. Without this, the responses stubbed on
// mockOpenmrsFetch never reach the hook, because it calls the real openmrsFetch instead.
vi.mock('@openmrs/esm-api', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  openmrsFetch: (...args: Parameters<typeof openmrsFetch>) => mockOpenmrsFetch(...args),
}));

const mockOpenmrsFetch = vi.mocked(openmrsFetch);
const mockUseAppContext = vi.mocked(useAppContext<DateFilterContext>);
const mockUseConfig = vi.mocked(useConfig);
const dateActivated = '2026-10-12T12:00:00.000Z';

function wrapper({ children }: PropsWithChildren) {
  return <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>{children}</SWRConfig>;
}

function respondWithOrders(orders: Array<Partial<Order>>) {
  mockOpenmrsFetch.mockResolvedValue({ data: { results: orders } } as FetchResponse<{ results: Array<Order> }>);
}

function makePage(orderNumbers: Array<string>, nextUri?: string) {
  return {
    data: {
      results: orderNumbers.map((orderNumber) => ({ uuid: orderNumber, orderNumber, dateActivated } as Order)),
      links: nextUri ? [{ rel: 'next', uri: nextUri }] : [],
    },
  } as unknown as FetchResponse;
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
      { uuid: 'new', action: 'NEW', fulfillerStatus: null, dateActivated },
      { uuid: 'revised', action: 'REVISE', fulfillerStatus: null, dateActivated },
      { uuid: 'discontinued', action: 'DISCONTINUE', fulfillerStatus: null, dateActivated },
      { uuid: 'renewed', action: 'RENEW', fulfillerStatus: null, dateActivated },
      { uuid: 'received', action: 'REVISE', fulfillerStatus: 'RECEIVED', dateActivated },
      { uuid: 'in-progress', action: 'REVISE', fulfillerStatus: 'IN_PROGRESS', dateActivated },
      { uuid: 'completed', action: 'REVISE', fulfillerStatus: 'COMPLETED', dateActivated },
      { uuid: 'declined', action: 'REVISE', fulfillerStatus: 'DECLINED', dateActivated },
    ]);

    const { result } = renderHook(() => useLabOrders({ unpickedOrdersOnly: true }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.labOrders.map(({ uuid }) => uuid)).toEqual(['new', 'revised']);
    expect(mockOpenmrsFetch).toHaveBeenCalledWith(
      expect.stringContaining('&excludeCanceledAndExpired=true&excludeDiscontinueOrders=true'),
    );
  });

  it('keeps the defaults when callers explicitly pass undefined options', async () => {
    const orders: Array<Partial<Order>> = [
      { uuid: 'completed', action: 'REVISE', fulfillerStatus: 'COMPLETED', dateActivated },
    ];
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
    const orders: Array<Partial<Order>> = [
      { uuid: 'completed', action: 'REVISE', fulfillerStatus: 'COMPLETED', dateActivated },
    ];
    respondWithOrders(orders);

    const { result } = renderHook(() => useLabOrders({ status: 'COMPLETED', excludeCanceled: false }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.labOrders).toEqual(orders);
    const url = mockOpenmrsFetch.mock.calls[0][0] as string;
    expect(url).toContain('&fulfillerStatus=COMPLETED');
    expect(url).not.toContain('&excludeCanceledAndExpired=');
    expect(url).not.toContain('&excludeDiscontinueOrders=');
  });

  it.each([
    {
      scenario: 'ahead of UTC',
      timeZone: 'Africa/Nairobi',
      startDay: '2026-11-24',
      endDay: '2026-11-24',
      from: '2026-11-23T21:00:00.000Z',
      until: '2026-11-24T21:00:00.000Z',
    },
    {
      scenario: 'behind UTC',
      timeZone: 'America/Los_Angeles',
      startDay: '2026-11-24',
      endDay: '2026-11-24',
      from: '2026-11-24T08:00:00.000Z',
      until: '2026-11-25T08:00:00.000Z',
    },
    {
      scenario: 'in UTC',
      timeZone: 'UTC',
      startDay: '2026-11-24',
      endDay: '2026-11-24',
      from: '2026-11-24T00:00:00.000Z',
      until: '2026-11-25T00:00:00.000Z',
    },
    {
      scenario: 'across multiple days',
      timeZone: 'Africa/Nairobi',
      startDay: '2026-11-23',
      endDay: '2026-11-25',
      from: '2026-11-22T21:00:00.000Z',
      until: '2026-11-25T21:00:00.000Z',
    },
    {
      scenario: 'on a 23-hour day',
      timeZone: 'America/New_York',
      startDay: '2026-03-08',
      endDay: '2026-03-08',
      from: '2026-03-08T05:00:00.000Z',
      until: '2026-03-09T04:00:00.000Z',
    },
    {
      scenario: 'on a 25-hour day',
      timeZone: 'America/New_York',
      startDay: '2026-11-01',
      endDay: '2026-11-01',
      from: '2026-11-01T04:00:00.000Z',
      until: '2026-11-02T05:00:00.000Z',
    },
    {
      scenario: 'when clocks go back at midnight',
      timeZone: 'America/Santiago',
      startDay: '2026-04-04',
      endDay: '2026-04-04',
      from: '2026-04-04T03:00:00.000Z',
      until: '2026-04-05T04:00:00.000Z',
    },
  ])(
    'returns only orders within the selected local days $scenario',
    async ({ timeZone, startDay, endDay, from, until }) => {
      const originalTimeZone = process.env.TZ;
      process.env.TZ = timeZone;
      try {
        mockUseAppContext.mockReturnValue({
          dateRange: [new Date(`${startDay}T12:00:00`), new Date(`${endDay}T12:00:00`)],
          setDateRange: vi.fn(),
        });
        const start = Date.parse(from);
        const end = Date.parse(until);
        const orders = [
          { uuid: 'before-start', dateActivated: new Date(start - 1).toISOString() },
          { uuid: 'at-start', dateActivated: from },
          { uuid: 'early', dateActivated: new Date(start + 90 * 60 * 1000).toISOString() },
          { uuid: 'late', dateActivated: new Date(end - 30 * 60 * 1000).toISOString() },
          { uuid: 'last-millisecond', dateActivated: new Date(end - 1).toISOString() },
          { uuid: 'next-day', dateActivated: until },
        ];

        mockOpenmrsFetch.mockImplementation(async (url) => {
          const request = new URL(url as string, 'http://localhost');
          // Match the backend's widening of both query bounds to whole days on a UTC server.
          const after = new Date(request.searchParams.get('activatedOnOrAfterDate'));
          const before = new Date(request.searchParams.get('activatedOnOrBeforeDate'));
          after.setUTCHours(0, 0, 0, 0);
          before.setUTCHours(23, 59, 59, 999);
          const matches = orders.filter(({ dateActivated }) => {
            const activated = Date.parse(dateActivated);
            return activated >= after.getTime() && activated <= before.getTime();
          });
          const startIndex = Number(request.searchParams.get('startIndex') ?? 0);
          request.searchParams.set('startIndex', String(startIndex + 2));
          return {
            data: {
              results: matches.slice(startIndex, startIndex + 2),
              links: startIndex + 2 < matches.length ? [{ rel: 'next', uri: request.toString() }] : [],
            },
          } as FetchResponse;
        });

        const { result, unmount } = renderHook(() => useLabOrders(), { wrapper });

        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(result.current.labOrders.map(({ uuid }) => uuid)).toEqual([
          'at-start',
          'early',
          'late',
          'last-millisecond',
        ]);
        expect(mockOpenmrsFetch.mock.calls.length).toBeGreaterThan(1);
        const params = new URL(mockOpenmrsFetch.mock.calls[0][0] as string, 'http://localhost').searchParams;
        expect(params.get('activatedOnOrAfterDate')).toBe(from);
        expect(params.get('activatedOnOrBeforeDate')).toBe(new Date(end - 1).toISOString());
        unmount();
      } finally {
        if (originalTimeZone === undefined) {
          delete process.env.TZ;
        } else {
          process.env.TZ = originalTimeZone;
        }
      }
    },
  );

  it('does not filter by activation date when no range is selected', async () => {
    mockUseAppContext.mockReturnValue({ dateRange: null, setDateRange: vi.fn() });
    const orders = [
      { uuid: 'older', dateActivated: '2025-01-01T00:00:00.000Z' },
      { uuid: 'newer', dateActivated: '2026-11-24T23:00:00.000Z' },
    ];
    respondWithOrders(orders);

    const { result } = renderHook(() => useLabOrders(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.labOrders).toEqual(orders);
    expect(mockOpenmrsFetch.mock.calls[0][0]).not.toContain('activatedOnOr');
  });

  it('returns orders from every page when the results span more than one server page', async () => {
    mockOpenmrsFetch
      .mockReset()
      .mockResolvedValueOnce(
        makePage(
          ['ORD-1', 'ORD-2'],
          'http://localhost/openmrs/ws/rest/v1/order?orderTypes=lab-order-type&startIndex=2',
        ),
      )
      .mockResolvedValueOnce(makePage(['ORD-3']));

    const { result } = renderHook(() => useLabOrders(), { wrapper });

    await waitFor(() => expect(result.current.labOrders).toHaveLength(3));
    expect(result.current.labOrders.map(({ orderNumber }) => orderNumber)).toEqual(['ORD-1', 'ORD-2', 'ORD-3']);
    expect(mockOpenmrsFetch).toHaveBeenCalledTimes(2);
  });

  it('refreshes orders on later pages when the lab orders are invalidated', async () => {
    const secondPageUri = 'http://localhost/openmrs/ws/rest/v1/order?orderTypes=lab-order-type&startIndex=2';
    const updatedLastPage = makePage(['ORD-3']);
    updatedLastPage.data.results[0].fulfillerStatus = 'IN_PROGRESS';
    mockOpenmrsFetch
      .mockReset()
      .mockResolvedValueOnce(makePage(['ORD-1', 'ORD-2'], secondPageUri))
      .mockResolvedValueOnce(makePage(['ORD-3']))
      .mockResolvedValueOnce(makePage(['ORD-1', 'ORD-2'], secondPageUri))
      .mockResolvedValueOnce(updatedLastPage);

    const { result } = renderHook(
      () => ({ labOrders: useLabOrders().labOrders, invalidateLabOrders: useInvalidateLabOrders() }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.labOrders).toHaveLength(3));
    expect(result.current.labOrders[2].fulfillerStatus).toBeUndefined();

    act(() => result.current.invalidateLabOrders());

    await waitFor(() => expect(result.current.labOrders[2].fulfillerStatus).toBe('IN_PROGRESS'));
    expect(result.current.labOrders.map(({ orderNumber }) => orderNumber)).toEqual(['ORD-1', 'ORD-2', 'ORD-3']);
    expect(mockOpenmrsFetch).toHaveBeenCalledTimes(4);
  });
});
