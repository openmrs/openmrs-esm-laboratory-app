import { DatePicker, DatePickerInput } from '@carbon/react';
import { useAppContext } from '@openmrs/esm-framework';
import dayjs from 'dayjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DateFilterContext } from '../../types';
import styles from './orders-date-range-picker.scss';

export const OrdersDateRangePicker = () => {
  const currentDate = new Date();
  const { dateRange, setDateRange } = useAppContext<DateFilterContext>('laboratory-date-filter') ?? {
    dateRange: [dayjs().startOf('day').toDate(), new Date()],
    setDateRange: () => {},
  };

  const { t } = useTranslation();

  const handleOrdersDateRangeChange = (dates: Array<Date>) => {
    setDateRange(dates);
  };

  return (
    <div className={styles.datePickerWrapper}>
      <p>{t('dateRange', 'Date range')}:</p>
      <DatePicker
        datePickerType="range"
        className={styles.dateRangePicker}
        onClose={handleOrdersDateRangeChange}
        maxDate={currentDate.toISOString()}
        value={dateRange}
      >
        <DatePickerInput id="date-picker-input-id-start" placeholder="mm/dd/yyyy" size="md" />
        <DatePickerInput id="date-picker-input-id-finish" placeholder="mm/dd/yyyy" size="md" />
      </DatePicker>
    </div>
  );
};
