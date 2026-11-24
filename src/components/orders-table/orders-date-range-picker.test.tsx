import React from 'react';
import dayjs from 'dayjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render } from '@testing-library/react';
import { OpenmrsDateRangePicker, useAppContext } from '@openmrs/esm-framework';
import { type DateFilterContext } from '../../types';
import { OrdersDateRangePicker } from './orders-date-range-picker.component';

const mockUseAppContext = vi.mocked(useAppContext<DateFilterContext>);
const mockOpenmrsDateRangePicker = vi.mocked(OpenmrsDateRangePicker);

const changeRange = (range: [Date | null | undefined, Date | null | undefined]) =>
  act(() => mockOpenmrsDateRangePicker.mock.lastCall[0].onChange(range));

describe('OrdersDateRangePicker', () => {
  const setDateRange = vi.fn();

  beforeEach(() => {
    mockUseAppContext.mockReturnValue({
      dateRange: [new Date(2026, 10, 1), new Date(2026, 10, 22)],
      setDateRange,
    });
  });

  it('updates the shared date range when both dates are set', () => {
    render(<OrdersDateRangePicker />);

    changeRange([new Date(2026, 10, 5), new Date(2026, 10, 10)]);

    expect(setDateRange).toHaveBeenCalledWith([new Date(2026, 10, 5), new Date(2026, 10, 10)]);
  });

  it('keeps the last complete date range when a date is cleared', () => {
    render(<OrdersDateRangePicker />);

    changeRange([undefined, undefined]);

    expect(setDateRange).not.toHaveBeenCalled();
  });

  it.each([
    ['ends before it starts', [new Date(2026, 10, 20), new Date(2026, 10, 6)]],
    ['ends after today', [new Date(2026, 10, 1), dayjs().add(1, 'year').toDate()]],
    ['starts before the minimum date', [new Date(202, 10, 1), new Date(2026, 10, 22)]],
  ])('keeps the last valid date range when the new range %s', (_, range: [Date, Date]) => {
    render(<OrdersDateRangePicker />);

    changeRange(range);

    expect(setDateRange).not.toHaveBeenCalled();
  });

  it('lets the user move the range forward through an invalid range', () => {
    render(<OrdersDateRangePicker />);

    changeRange([new Date(2026, 10, 10), new Date(2026, 10, 6)]);

    expect(mockOpenmrsDateRangePicker.mock.lastCall[0].value).toEqual([new Date(2026, 10, 10), new Date(2026, 10, 6)]);
    expect(setDateRange).not.toHaveBeenCalled();

    changeRange([new Date(2026, 10, 10), new Date(2026, 10, 12)]);

    expect(setDateRange).toHaveBeenCalledWith([new Date(2026, 10, 10), new Date(2026, 10, 12)]);
    expect(mockOpenmrsDateRangePicker.mock.lastCall[0].value).toEqual([new Date(2026, 10, 1), new Date(2026, 10, 22)]);
  });

  it('shows a date range set from another tab instead of an abandoned invalid range', () => {
    const { rerender } = render(<OrdersDateRangePicker />);

    changeRange([new Date(2026, 10, 10), new Date(2026, 10, 6)]);

    mockUseAppContext.mockReturnValue({
      dateRange: [new Date(2026, 10, 15), new Date(2026, 10, 22)],
      setDateRange,
    });
    rerender(<OrdersDateRangePicker />);

    expect(mockOpenmrsDateRangePicker.mock.lastCall[0].value).toEqual([new Date(2026, 10, 15), new Date(2026, 10, 22)]);
  });
});
