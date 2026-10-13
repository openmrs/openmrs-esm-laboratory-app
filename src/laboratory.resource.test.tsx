import React, { type PropsWithChildren } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { SWRConfig } from 'swr';
import { openmrsFetch, useAppContext, useConfig, type FetchResponse, type Order } from '@openmrs/esm-framework';
import { type DateFilterContext } from './types';
import { fetchAllOrders, useInvalidateLabOrders, useLabOrders } from './laboratory.resource';

const mockOpenmrsFetch = vi.mocked(openmrsFetch);
const mockUseAppContext = vi.mocked(useAppContext<DateFilterContext>);
const mockUseConfig = vi.mocked(useConfig);

function wrapper({ children }: PropsWithChildren) {
  return <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>{children}</SWRConfig>;
}

function respondWithOrders(orders: Array<Partial<Order>>) {
  mockOpenmrsFetch.mockResolvedValue({ data: { results: orders } } as FetchResponse<{ results: Array<Order> }>);
}

function makePage(orderNumbers: Array<string>, nextUri?: string) {
  return {
    data: {
      results: orderNumbers.map((orderNumber) => ({ uuid: orderNumber, orderNumber } as Order)),
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

describe('fetchAllOrders', () => {
  beforeEach(() => {
    mockOpenmrsFetch.mockReset();
  });

  it('returns the results of a single page when there is no next link', async () => {
    mockOpenmrsFetch.mockResolvedValueOnce(makePage(['ORD-1', 'ORD-2']));

    const orders = await fetchAllOrders('/ws/rest/v1/order?orderTypes=lab');

    expect(orders.map((order) => order.orderNumber)).toEqual(['ORD-1', 'ORD-2']);
    expect(mockOpenmrsFetch).toHaveBeenCalledTimes(1);
  });

  it('follows next links until all pages have been fetched', async () => {
    const filters = 'orderTypes=lab&excludeCanceledAndExpired=true&activatedOnOrAfterDate=2025-01-01T00:00:00.000Z';
    const firstPageUrl = `/ws/rest/v1/order?${filters}`;
    mockOpenmrsFetch
      .mockResolvedValueOnce(
        makePage(['ORD-1', 'ORD-2'], `http://backend:8080/openmrs/ws/rest/v1/order?${filters}&startIndex=2`),
      )
      .mockResolvedValueOnce(
        makePage(['ORD-3', 'ORD-4'], `http://backend:8080/openmrs/ws/rest/v1/order?${filters}&startIndex=4`),
      )
      .mockResolvedValueOnce(makePage(['ORD-5']));

    const orders = await fetchAllOrders(firstPageUrl);

    expect(orders.map((order) => order.orderNumber)).toEqual(['ORD-1', 'ORD-2', 'ORD-3', 'ORD-4', 'ORD-5']);
    expect(mockOpenmrsFetch).toHaveBeenCalledTimes(3);
    expect(mockOpenmrsFetch.mock.calls[0][0]).toBe(firstPageUrl);

    const requestedPages = mockOpenmrsFetch.mock.calls.slice(1).map(([url]) => new URL(url as string).searchParams);
    expect(requestedPages.map((params) => params.get('startIndex'))).toEqual(['2', '4']);
    requestedPages.forEach((params) => {
      expect(params.get('orderTypes')).toBe('lab');
      expect(params.get('excludeCanceledAndExpired')).toBe('true');
      expect(params.get('activatedOnOrAfterDate')).toBe('2025-01-01T00:00:00.000Z');
    });
  });

  it('requests next pages from the current origin so frontend proxies keep working', async () => {
    mockOpenmrsFetch
      .mockResolvedValueOnce(
        makePage(['ORD-1'], 'http://backend:8080/openmrs/ws/rest/v1/order?orderTypes=lab&startIndex=1'),
      )
      .mockResolvedValueOnce(makePage(['ORD-2']));

    await fetchAllOrders('/ws/rest/v1/order?orderTypes=lab');

    const nextUrl = new URL(mockOpenmrsFetch.mock.calls[1][0] as string);
    expect(nextUrl.host).toBe(window.location.host);
    expect(nextUrl.protocol).toBe(window.location.protocol);
    expect(nextUrl.pathname).toBe('/openmrs/ws/rest/v1/order');
    expect(nextUrl.searchParams.get('startIndex')).toBe('1');
  });
});
