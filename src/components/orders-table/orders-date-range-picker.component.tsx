import React, { useState } from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { OpenmrsDateRangePicker, useAppContext } from '@openmrs/esm-framework';
import { type DateFilterContext } from '../../types';
import styles from './orders-date-range-picker.scss';

const minDate = new Date(1793, 0, 1);

export const OrdersDateRangePicker = () => {
  const { t } = useTranslation();
  const currentDate = new Date();

  const { dateRange, setDateRange } = useAppContext<DateFilterContext>('laboratory-date-filter') ?? {
    dateRange: [dayjs().startOf('day').toDate(), new Date()],
    setDateRange: () => {},
  };
  // A draft only applies to the shared range it was edited from, so a range set in another tab replaces it
  const [draft, setDraft] = useState<{
    range: [Date | null | undefined, Date | null | undefined];
    appliedRange: typeof dateRange;
  } | null>(null);
  const draftRange = draft?.appliedRange === dateRange ? draft.range : null;

  return (
    <div className={styles.datePickerWrapper}>
      <p>{t('dateRange', 'Date range')}:</p>
      <OpenmrsDateRangePicker
        className={styles.dateRangePicker}
        data-testid="ordersDateRangePicker"
        endName="end"
        id="ordersDateRangePicker"
        labelText=""
        maxDate={currentDate}
        minDate={minDate}
        onChange={([start, end]) => {
          // Show partly edited or cleared ranges in the picker, but keep the last valid range as the orders filter
          const isValidRange =
            start &&
            end &&
            !dayjs(start).isBefore(minDate, 'day') &&
            !dayjs(start).isAfter(end, 'day') &&
            !dayjs(end).isAfter(currentDate, 'day');

          if (isValidRange) {
            setDraft(null);
            setDateRange([start, end]);
          } else {
            setDraft({ range: [start, end], appliedRange: dateRange });
          }
        }}
        startName="start"
        value={draftRange ?? dateRange}
        size="lg"
      />
    </div>
  );
};
