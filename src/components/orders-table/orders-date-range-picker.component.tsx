import React from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { OpenmrsDateRangePicker , useAppContext } from '@openmrs/esm-framework';
import styles from './orders-date-range-picker.scss';

// Update the DateFilterContext type to enforce a tuple for dateRange
interface DateFilterContext {
  dateRange: [Date, Date] | null;
  setDateRange: (dates: [Date, Date] | null) => void;
}

export const OrdersDateRangePicker = () => {
  const { t } = useTranslation();
  const currentDate = new Date();

  const { dateRange, setDateRange } = useAppContext<DateFilterContext>('laboratory-date-filter') ?? {
    dateRange: [dayjs().startOf('day').toDate(), new Date()] as [Date, Date],
    setDateRange: () => {},
  };

  return (
    <div className={styles.datePickerWrapper}>
      <p>{t('dateRange', 'Date range')}:</p>
      <OpenmrsDateRangePicker
        value={dateRange}
        onChange={(dates) => setDateRange(dates)}
        id="ordersDateRangePicker"
        data-testid="ordersDateRangePicker"
        labelText=""
        maxDate={currentDate}
        startName="start"
        endName="end"
      />
    </div>
  );
};
