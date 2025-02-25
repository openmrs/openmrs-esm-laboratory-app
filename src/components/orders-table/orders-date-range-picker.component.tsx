import React from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { DatePicker, DatePickerInput } from '@carbon/react';
import { useAppContext } from '@openmrs/esm-framework';
import { type DateFilterContext } from '../../types';
import styles from './orders-date-range-picker.scss';

export const OrdersDateRangePicker = () => {
  const { t } = useTranslation();
  const currentDate = new Date();

  const { dateRange, setDateRange } = useAppContext<DateFilterContext>('laboratory-date-filter') ?? {
    dateRange: [dayjs().startOf('day').toDate(), new Date()],
    setDateRange: () => {},
  };

  const handleOrdersDateRangeChange = (dates: Array<Date>) => {
    setDateRange(dates);
  };

  return (
    <div className={styles.datePickerWrapper}>
      <p>{t('dateRange', 'Date range')}:</p>
      <DatePicker
        className={styles.dateRangePicker}
        dateFormat="d/m/Y"
        datePickerType="range"
        onChange={handleOrdersDateRangeChange}
        maxDate={currentDate.toISOString()}
        value={dateRange}
      >
        <DatePickerInput id="date-picker-input-id-start" placeholder="dd/mm/yyyy" size="md" />
        <DatePickerInput id="date-picker-input-id-finish" placeholder="dd/mm/yyyy" size="md" />
      </DatePicker>
    </div>
  );
};
